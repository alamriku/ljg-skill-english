#!/bin/bash
# ljg-push: sync updated ljg-* skills to github repo (ljg-skills),
# pushing to master (org-mode style) then md (markdown style).
#
# Usage:
#   bash Push.sh             # detect + push both branches
#   bash Push.sh --dry-run   # show what would happen, don't push
#   bash Push.sh --force     # skip detect, sync all ljg-* skills

set -euo pipefail

# === Configuration (HARDCODED) ===
SKILLS_REPO="$HOME/code/ljg-skills"
SKILLS_LOCAL="$HOME/.agents/skills"
REPO_URL="git@github.com:lijigang/ljg-skills.git"

# === Args ===
DRY_RUN=0
FORCE=0
SKIP_README_CHECK=0
for arg in "$@"; do
  case "$arg" in
    --dry-run)            DRY_RUN=1 ;;
    --force)              FORCE=1 ;;
    --skip-readme-check)  SKIP_README_CHECK=1 ;;
    *) echo "Unknown arg: $arg" >&2; exit 2 ;;
  esac
done

# dry-run implicitly bypasses README hard-gate (so users still see the warning
# but don't have to fix it before the dry-run can complete)
if [ "$DRY_RUN" = "1" ]; then
  SKIP_README_CHECK=1
fi

# === Helpers ===

log()  { printf '\033[36m%s\033[0m\n' "$*"; }
ok()   { printf '\033[32m✓ %s\033[0m\n' "$*"; }
warn() { printf '\033[33m! %s\033[0m\n' "$*"; }
err()  { printf '\033[31m✗ %s\033[0m\n' "$*" >&2; }

# Detection and synchronization share this exact file-tree boundary:
#   - content is compared by checksum, so mtime-only drift is ignored
#   - regular-file permissions are mirrored, while detection only treats the
#     executable bit as Git-material
#   - directory-only changes are ignored by detection
#   - dependency/VCS trees and Finder metadata are out of scope
# Deliberately do not add broad backup patterns here: .bak/.backup files are
# publishable content and must remain visible to both detection and sync.
RSYNC_SCOPE_ARGS=(
  --recursive
  --links
  --checksum
  --perms
  --delete
  --exclude='.git/'
  --exclude='node_modules/'
  --exclude='.DS_Store'
)

rsync_skill_tree() {
  local source_dir="$1"
  local target_dir="$2"
  shift 2
  rsync "${RSYNC_SCOPE_ARGS[@]}" "$@" "$source_dir/" "$target_dir/"
}

# Ignore directory-only and timestamp-only records. For a permission-only file
# record, compare the one mode bit Git tracks: executability.
rsync_has_material_changes() {
  local source_dir="$1"
  local target_dir="$2"
  local change_code relative_path deletion_path source_exec target_exec

  while IFS='|' read -r change_code relative_path; do
    [ -n "$change_code" ] || continue
    if [[ "$change_code" == \*deleting* ]]; then
      deletion_path="$relative_path"
      [ -n "$deletion_path" ] || deletion_path=${change_code#\*deleting }
      [[ "$deletion_path" == */ ]] || return 0
      continue
    fi
    [ "${change_code:1:1}" = "d" ] && continue
    # macOS ships Bash 3.2, where backslashes on an unquoted `=~` RHS are
    # consumed before regex matching. The old regex therefore treated content
    # codes such as `>fcsT....` as timestamp-only. Match rsync's exact
    # nine-character timestamp records instead.
    if [ "$change_code" = ".f..t...." ] || [ "$change_code" = ".f..T...." ]; then
      continue
    fi

    if [ "${change_code:1:1}" = "f" ] \
        && [[ "$change_code" == *p* ]] \
        && [[ "$change_code" != *c* ]] \
        && [[ "$change_code" != *s* ]] \
        && [[ "$change_code" != *+* ]]; then
      source_exec=0
      target_exec=0
      [ -x "$source_dir/$relative_path" ] && source_exec=1
      [ -x "$target_dir/$relative_path" ] && target_exec=1
      [ "$source_exec" != "$target_exec" ] && return 0
      continue
    fi

    return 0
  done
  return 1
}

setup_repo() {
  if [ ! -d "$SKILLS_REPO" ]; then
    log "Cloning $REPO_URL → $SKILLS_REPO"
    mkdir -p "$(dirname "$SKILLS_REPO")"
    git clone "$REPO_URL" "$SKILLS_REPO"
    return
  fi
  # Verify it's the right repo
  local actual
  actual=$(cd "$SKILLS_REPO" && git remote get-url origin 2>/dev/null || echo "")
  if [[ "$actual" != *"lijigang/ljg-skills"* ]]; then
    err "$SKILLS_REPO exists but origin is '$actual', not ljg-skills."
    err "Fix: move/remove $SKILLS_REPO and re-run."
    exit 1
  fi
}

# Detect skills with content differences (local vs repo).
# Echoes one skill name per line.
detect_updates() {
  for local_skill in "$SKILLS_LOCAL"/ljg-*; do
    [ -d "$local_skill" ] || continue
    # A prefixed workspace/eval directory is not a publishable skill unless its
    # root contains the skill entrypoint. This keeps benchmark snapshots such as
    # ljg-book-workspace out of README checks, rsync, commits, and releases.
    [ -f "$local_skill/SKILL.md" ] || continue
    local name
    name=$(basename "$local_skill")
    local repo_skill="$SKILLS_REPO/skills/$name"
    if [ ! -d "$repo_skill" ]; then
      echo "$name"
    else
      local changes
      changes=$(rsync_skill_tree "$local_skill" "$repo_skill" \
        --dry-run --itemize-changes --out-format='%i|%n%L')
      if rsync_has_material_changes "$local_skill" "$repo_skill" <<< "$changes"; then
        echo "$name"
      fi
    fi
  done
}

# List all ljg-* skills in local (force mode).
list_all_local() {
  for local_skill in "$SKILLS_LOCAL"/ljg-*; do
    [ -d "$local_skill" ] || continue
    [ -f "$local_skill/SKILL.md" ] || continue
    local name
    name=$(basename "$local_skill")
    echo "$name"
  done
}

# Bump patch version in plugin.json + marketplace.json. Echoes new version.
bump_version() {
  local plugin=".claude-plugin/plugin.json"
  local marketplace=".claude-plugin/marketplace.json"
  local current major minor patch new
  current=$(grep -m1 '"version"' "$plugin" | sed 's/.*"\([0-9]*\.[0-9]*\.[0-9]*\)".*/\1/')
  major=$(echo "$current" | cut -d. -f1)
  minor=$(echo "$current" | cut -d. -f2)
  patch=$(echo "$current" | cut -d. -f3)
  new="$major.$minor.$((patch + 1))"
  sed -i '' "s/\"version\": \"$current\"/\"version\": \"$new\"/" "$plugin"
  sed -i '' "s/\"version\": \"$current\"/\"version\": \"$new\"/" "$marketplace"
  echo "$new"
}

# Convert one org file to a markdown sibling.
#   - Leading #+key: header block → YAML frontmatter (--- fenced, filetags → tags)
#   - Headings: * → #, ** → ## (level-preserving)
#   - #+ATTR_* lines dropped; #+begin_src/#+end_src → ``` fences
#   - [[file:path]] → ![](path)
orgfile_to_md() {
  local src="$1" dst="$2"
  awk '
    BEGIN { inhdr = -1; inexample = 0 }   # -1 not started, 1 inside header, 0 closed
    tolower($0) ~ /^#\+begin_example([ \t]|$)/ && !inexample {
      if (inhdr == 1) { print "---" }
      inhdr = 0
      inexample = 1
      print "```text"
      next
    }
    tolower($0) ~ /^#\+end_example([ \t]|$)/ && inexample {
      inexample = 0
      print "```"
      next
    }
    inexample { print; next }
    /^#\+[A-Za-z_]+:/ && inhdr != 0 {
      if (inhdr == -1) { print "---"; inhdr = 1 }
      line = $0
      sub(/^#\+/, "", line)
      key = line; sub(/:.*/, "", key); key = tolower(key)
      val = line; sub(/^[A-Za-z_]+:[ \t]*/, "", val)
      if (key == "filetags") {
        gsub(/:/, " ", val); gsub(/^[ \t]+|[ \t]+$/, "", val)
        printf "tags: %s\n", val
      } else {
        printf "%s: %s\n", key, val
      }
      next
    }
    { if (inhdr == 1) { print "---"; inhdr = 0 } }
    /^#\+ATTR/ { next }
    /^# / {
      line = $0
      sub(/^# /, "", line)
      print "<!-- " line " -->"
      next
    }
    /^#\+begin_src/ { sub(/^#\+begin_src[ \t]*/, "```"); print; next }
    /^#\+end_src/ { print "```"; next }
    /^#\+begin_quote/ { next }
    /^#\+end_quote/ { next }
    /^\*+ / {
      n = 0; while (substr($0, n + 1, 1) == "*") n++
      hashes = ""; for (i = 0; i < n; i++) hashes = hashes "#"
      print hashes substr($0, n + 1)
      next
    }
    {
      line = $0
      while (match(line, /\[\[file:[^]]+\]\]/)) {
        path = substr(line, RSTART + 7, RLENGTH - 9)
        line = substr(line, 1, RSTART - 1) "![](" path ")" substr(line, RSTART + RLENGTH)
      }
      print line
    }
  ' "$src" > "$dst"
}

# Apply markdown-ization to a skill directory.
#   1. Every *.org file → converted *.md sibling (orgfile_to_md), .org removed,
#      references to the renamed file rewritten across Markdown and runtime text files.
#   2. String swaps in all *.md files (assets/ excluded):
#      - File-extension refs: __qa.org → __qa.md, etc.
#      - Keywords: org-mode → markdown
#      - Org-style format instructions: *bold* rule, heading-level rule,
#        "Org file header", #+title:-style example lines -> YAML keys
#      - Org emphasized bullet labels: - *label*: -> - **label**:
# Does NOT touch: *bold* markers inside prose (markdown italics ambiguity).
mdize_skill() {
  local skill_dir="$1"

  # 1) org files → md siblings
  local orgfiles=() renames=()
  while IFS= read -r f; do orgfiles+=("$f"); done < <(find "$skill_dir" -name '*.org' -not -path '*/assets/*' 2>/dev/null)
  local org
  for org in ${orgfiles[@]+"${orgfiles[@]}"}; do
    orgfile_to_md "$org" "${org%.org}.md"
    rm "$org"
    renames+=("$(basename "$org")")
  done

  # 2) string swaps across all md files
  local files=()
  while IFS= read -r f; do files+=("$f"); done < <(find "$skill_dir" -name '*.md' -not -path '*/assets/*' 2>/dev/null)
  local file r skill_name preserve_crlf
  skill_name=$(basename "$skill_dir")
  for file in ${files[@]+"${files[@]}"}; do
    # ljg-push documents both source and generated branches. Rewriting its
    # explanatory Org examples would corrupt the publisher's own contract.
    if [ "$skill_name" = "ljg-push" ]; then
      continue
    fi
    preserve_crlf=0
    if perl -0777 -ne 'exit((/\r\n/ && !/(?<!\r)\n/) ? 0 : 1)' "$file"; then
      preserve_crlf=1
    fi
    bun "$SKILLS_LOCAL/ljg-push/Tools/MdizeEmbeddedOrg.ts" "$file"
    sed -i '' \
      -e 's/__qa\.org/__qa.md/g' \
      -e 's/__paper\.org/__paper.md/g' \
      -e 's/__think\.org/__think.md/g' \
      -e 's/__concept\.org/__concept.md/g' \
      -e 's/__rank\.org/__rank.md/g' \
      -e 's/__structure\.org/__structure.md/g' \
      -e 's/__is\.org/__is.md/g' \
      -e 's/__write\.org/__write.md/g' \
      -e 's/__constraint\.org/__constraint.md/g' \
      -e 's/__plain\.org/__plain.md/g' \
      -e 's/__blind\.org/__blind.md/g' \
      -e 's/__book\.org/__book.md/g' \
      -e 's/__reading\.org/__reading.md/g' \
      -e 's/__relationship\.org/__relationship.md/g' \
      -e 's/__roundtable\.org/__roundtable.md/g' \
      -e 's/template\.org/template.md/g' \
      -e 's/org-mode/markdown/g' \
      -e 's/Org-mode/Markdown/g' \
      -e 's/Format: markdown (`\*bold\*`, no markdown syntax)/Format: Markdown (`**bold**`, no Org syntax)/g' \
      -e 's/Bold with `\*bold\*` (markdown), not `\*\*bold\*\*` (markdown)/Bold with `**bold**` (double asterisks)/g' \
      -e 's/Bold with `\*bold\*` (org-mode), not `\*\*bold\*\*` (markdown)/Bold with `**bold**` (double asterisks)/g' \
      -e 's/Output must be pure markdown syntax; no Markdown syntax at all/Output must be pure Markdown syntax; no Org syntax/g' \
      -e 's/markdown format; no Markdown syntax/Markdown format; no Org syntax/g' \
      -e 's/Markdown format; no Markdown syntax/Markdown format; no Org syntax/g' \
      -e 's/markdown format, no markdown syntax/Markdown format, no Org syntax/g' \
      -e 's/Markdown format, no markdown syntax/Markdown format, no Org syntax/g' \
      -e 's/The file must be markdown, no Markdown\./The file must be Markdown, no Org./g' \
      -e 's/Org bold uses a single asterisk; headings start at `\*` and never skip a level\./Markdown bold uses double asterisks; headings start at `#` and never skip a level./g' \
      -e 's/Assemble as markdown with this structure/Assemble as Markdown with this structure/g' \
      -e 's/the org path specified in SKILL\.md/the Markdown path specified in SKILL.md/g' \
      -e 's/under the Org and Denote contract/under the Markdown and Denote contract/g' \
      -e 's/verify that Denote accepts it and that `org-lint` passes/verify that Denote accepts it/g' \
      -e 's/run the Denote acceptance check and `org-lint`/run the Denote acceptance check/g' \
      -e 's/Denote acceptance and `org-lint`/Denote acceptance/g' \
      -e 's/Denote, consult-notes and Org lint/Denote and consult-notes/g' \
      -e 's/Defaults to a saved org note/Defaults to a saved markdown note/g' \
      -e 's/Save a markdown note/Save a Markdown note/g' \
      -e 's/, and actually run `org-lint`//g' \
      -e 's/Report the lint results honestly/Report the check results honestly/g' \
      -e 's/Denote, consult, consult-notes and Org/Denote, consult and consult-notes/g' \
      -e 's/Denote, consult-notes and `org-lint`/Denote and consult-notes/g' \
      -e 's|Denote/consult-notes/Org lint and the deterministic validator|Denote/consult-notes and the deterministic validator|g' \
      -e 's/consult-notes and `org-lint`/consult-notes/g' \
      -e 's/check Denote and org-lint/check Denote/g' \
      -e 's/Org note and paper-map/Markdown note and paper-map/g' \
      -e 's/an Org example diagram/a Markdown fenced diagram/g' \
      -e 's/at most one Org example block/at most one Markdown fenced block/g' \
      -e 's/save an Org named after the paper and a background paper-map/save a Markdown named after the paper and a background paper-map/g' \
      -e 's/save the Org and the paper-map/save the Markdown and the paper-map/g' \
      -e 's/save the same Org and paper-map/save the same Markdown and paper-map/g' \
      -e 's/The Org is saved by default to/The Markdown is saved by default to/g' \
      -e 's/an Org reading/a Markdown reading/g' \
      -e 's/## Org output contract/## Markdown output contract/g' \
      -e 's/<Org file path>/<Markdown file path>/g' \
      -e 's/Org background checks/Markdown background checks/g' \
      -e 's/Defaults to a saved org note/Defaults to a saved markdown note/g' \
      -e 's/Defaults to a saved Org note/Defaults to a saved Markdown note/g' \
      -e 's/Produces natural, content-led Org notes/Produces natural, content-led Markdown notes/g' \
      -e 's/`#+DESCRIPTION`/`description`/g' \
      -e 's/`#+description`/`description`/g' \
      -e 's/`#+source`/`source`/g' \
      -e 's/`#+IDENTIFIER`/`identifier`/g' \
      -e 's/`#+definition`/`definition`/g' \
      -e 's/`#+operation`/`operation`/g' \
      -e 's/`#+recognition`/`recognition`/g' \
      -e 's/`#+guidance`/`guidance`/g' \
      -e 's/`#+basis`/`basis`/g' \
      -e 's/`#+falsifier`/`falsifier`/g' \
      -e 's/\/note\.org/\/note.md/g' \
      -e 's/<note\.org>/<note.md>/g' \
      -e 's/- \*x\*：/- **x**：/g' \
      -e 's/- \*f\*：/- **f**：/g' \
      -e 's/- \*f(x)\*：/- **f(x)**：/g' \
      -e 's/`\* x：/`# x：/g' \
      -e 's/`\* f：/`# f：/g' \
      -e 's/`\* f(x)：/`# f(x)：/g' \
      "$file"
    if [ "$skill_name" = "ljg-is" ]; then
      sed -i '' \
        -e 's/Org note/Markdown note/g' \
        -e 's/Denote\/Org/Denote\/Markdown/g' \
        -e 's/`#+schema: ljg-is-v2`/`schema: ljg-is-v2`/g' \
        -e 's/filetags contain `:is:act:`/tags contain both `is` and `act`/g' \
        "$file"
    fi
    if [ "$skill_name" = "ljg-invest" ]; then
      sed -i '' \
        -e 's/PROJECT_NAME\.org/PROJECT_NAME.md/g' \
        -e 's/example-ai\.org/example-ai.md/g' \
        "$file"
    fi
    if [ "$skill_name" = "ljg-blind" ]; then
      sed -i '' \
        -e 's/## Strict org syntax (no mixed markdown)/## Strict Markdown syntax (no mixed Org)/g' \
        -e 's/- Headings use `\*` \/ `\*\*` \/ `\*\*\*`, not `#`/- Headings use `#` \/ `##` \/ `###`, never asterisks/g' \
        -e 's/- Bold `\*text\*`, italic `\/text\/`, monospace `~code~`/- Bold `**text**`, italic `*text*`, monospace in backticks/g' \
        -e 's/- Lists use `-`, not `\*` (`\*` is a heading in org)/- Lists use `-`; headings use `#`/g' \
        -e 's/- Links `\[\[url\]\[text\]\]`, not `\[text\](url)`/- Links use `[text](url)`/g' \
        -e 's/- Horizontal rule `-----`, not `---`; no markdown `>` quotes/- Horizontal rule `---`; quotes use `>`/g' \
        "$file"
    fi
    if [ "$skill_name" = "ljg-learn" ]; then
      sed -i '' \
        -e 's/- Separate sections with blank lines or org heading levels, not `---` (markdown rule)/- Separate sections with blank lines or Markdown heading levels; use `---` for a rule/g' \
        -e 's/never markdown.s `\* item` (in org, `\*` starts a heading)/headings use `#`/g' \
        -e 's/- Code uses `~code~` or `=code=`, not backticks/- Code is wrapped in backticks/g' \
        -e 's/Assemble as markdown with this structure/Assemble as Markdown with this structure/g' \
        "$file"
    fi
    if [ "$skill_name" = "ljg-qa" ]; then
      sed -i '' \
        -e 's/- Lists use `- item`, not `\* item` (`\*` starts a heading in org)/- Lists use `- item`; headings use `#`/g' \
        -e 's/- Code uses `~code~` or `=code=`, not backticks/- Code is wrapped in backticks/g' \
        "$file"
    fi
    sed -E -i '' \
      -e 's/^#\+(title|subtitle|date|filetags|identifier|source|author|authors|venue):/\1:/' \
      "$file"
    perl -pi -e 's/^#\+(TITLE|SUBTITLE|DATE|FILETAGS|IDENTIFIER|SOURCE|AUTHOR|AUTHORS|VENUE):/\L$1:/;' "$file"
    sed -i '' -e 's/^filetags:/tags:/' "$file"
    # A line-start bullet label followed by a full-width colon is structural,
    # so it is safe to distinguish from ambiguous prose emphasis.
    perl -pi -e 's/^- \*([^*\n]+)\*：/- **$1**：/;' "$file"
    for r in ${renames[@]+"${renames[@]}"}; do
      sed -i '' "s/${r//./\\.}/${r%.org}.md/g" "$file"
    done
    if [ "$preserve_crlf" = "1" ]; then
      perl -0777 -pi -e 's/(?<!\r)\n/\r\n/g' "$file"
    fi
  done

  # 3) Exact references to converted Org files can also live in runtime
  # consumers (for example a TypeScript test loading ../Template.org).
  # Rewrite only actual converted basenames, so fixture strings such as
  # __is.org remain untouched unless that concrete file was converted.
  local reference_files=()
  while IFS= read -r f; do reference_files+=("$f"); done < <(
    find "$skill_dir" -type f -not -path '*/assets/*' \
      \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.mjs' \
         -o -name '*.cjs' -o -name '*.json' -o -name '*.toml' \
         -o -name '*.yaml' -o -name '*.yml' -o -name '*.sh' \) \
      2>/dev/null
  )
  for file in ${reference_files[@]+"${reference_files[@]}"}; do
    # The publisher documents and enforces both sides of the conversion. Its
    # runtime literals are rules, not generated-branch output instructions.
    if [ "$skill_name" = "ljg-push" ]; then
      continue
    fi
    for r in ${renames[@]+"${renames[@]}"}; do
      sed -i '' "s/${r//./\\.}/${r%.org}.md/g" "$file"
    done
    # Eval prompts are executable output contracts. Convert only phrases that
    # require an Org deliverable; mentions of Org as accepted input stay intact.
    if [[ "$file" == */evals/*.json ]]; then
      sed -i '' \
        -e 's/the Org and the coverage/the Markdown and the coverage/g' \
        -e 's/save the Org and the paper-map/save the Markdown and the paper-map/g' \
        -e 's/save the same Org and paper-map/save the same Markdown and paper-map/g' \
        -e 's/does not require generating the Org or the paper-map/does not require generating the Markdown or the paper-map/g' \
        -e 's/an Org note/a Markdown note/g' \
        -e 's/Org and coverage/Markdown and coverage/g' \
        "$file"
    fi
    # Runtime-facing usage and validation messages must describe the generated
    # branch contract while explicit Org compatibility fixtures remain intact.
    sed -i '' \
      -e 's/at most one Org example block/at most one Markdown fenced block/g' \
      -e 's/<note\.org>/<note.md>/g' \
      "$file"
    # A stdin default controls which parser the validator selects. On the md
    # branch it must default to Markdown while explicit Org fixtures remain.
    sed -E -i '' 's/(stdin__[a-z0-9-]+)\.org/\1.md/g' "$file"
  done
}

# Fail the md publish if an output-format instruction survived conversion.
# Mentions of Org as an accepted input remain valid; this targets only phrases
# that would make an md-branch skill emit Org or expose Org markup.
audit_md_skill() {
  local skill_dir="$1"
  local skill_name org_files output_residuals markup_residuals eval_residuals runtime_default_residuals runtime_output_residuals
  skill_name=$(basename "$skill_dir")

  org_files=$(find "$skill_dir" -type f -name '*.org' -not -path '*/assets/*' 2>/dev/null || true)
  # ljg-push is meta-documentation for both branches, so its literal Org
  # examples describe the source side and are not an output-format residual.
  if [ "$skill_name" = "ljg-push" ]; then
    if [ -n "$org_files" ]; then
      err "markdown conversion residuals in $skill_name"
      printf '%s\n' "$org_files" >&2
      return 1
    fi
    return 0
  fi
  output_residuals=$(find "$skill_dir" -type f -name '*.md' -not -path '*/assets/*' -print0 \
    | xargs -0 grep -En \
      'Defaults to a saved Org note|Produces natural, content-led Org notes|[Ss]ave (it )?as an? Org( note| file)?|[Ww]rite (the |an |a )?Org (note|file)|Org file structure|the org path specified|Org-mode format|org-mode format|Strict org syntax|Org output contract|<Org file path>|filetags contain `:[^`]+:`|no markdown syntax|__[a-z0-9_-]+\.org|Org bold uses a single asterisk|Bold with `\*bold\*`|Code uses `~code~`|not backticks|Org lint|org-lint|`#\+(DESCRIPTION|description|source|IDENTIFIER|identifier|schema|definition|operation|recognition|guidance|basis|falsifier)`|Org .`?#\+begin_example|Org example (block|diagram)' \
      2>/dev/null || true)
  markup_residuals=$(find "$skill_dir" -type f -name '*.md' -not -path '*/assets/*' -print0 \
    | xargs -0 grep -En '^[[:space:]]*#\+[A-Za-z_]+:|^[[:space:]]*#\+(begin|end)_(example|src|quote)([[:space:]]|$)|^[[:space:]]*```org[[:space:]]*$|^- \*[^*]+\*：|\[\[[^]]+\]\[[^]]+\]\]' \
      2>/dev/null || true)
  eval_residuals=$(find "$skill_dir" -type f -path '*/evals/*.json' -print0 \
    | xargs -0 grep -En 'the Org and the coverage|save the (same )?Org and (the )?paper-map|an Org note|Org and coverage' \
      2>/dev/null || true)
  runtime_default_residuals=$(find "$skill_dir" -type f -not -path '*/assets/*' \
    \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.mjs' \
       -o -name '*.cjs' -o -name '*.json' -o -name '*.sh' \) -print0 \
    | xargs -0 grep -En 'stdin__[a-z0-9-]+\.org' \
      2>/dev/null || true)
  runtime_output_residuals=$(find "$skill_dir" -type f -not -path '*/assets/*' \
    \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.mjs' \
       -o -name '*.cjs' -o -name '*.json' -o -name '*.sh' \) -print0 \
    | xargs -0 grep -En 'Usage:[^[:cntrl:]]*<note\.org>|at most one Org example block' \
      2>/dev/null || true)

  if [ -n "$org_files$output_residuals$markup_residuals$eval_residuals$runtime_default_residuals$runtime_output_residuals" ]; then
    err "markdown conversion residuals in $(basename "$skill_dir")"
    [ -n "$org_files" ] && printf '%s\n' "$org_files" >&2
    [ -n "$output_residuals" ] && printf '%s\n' "$output_residuals" >&2
    [ -n "$markup_residuals" ] && printf '%s\n' "$markup_residuals" >&2
    [ -n "$eval_residuals" ] && printf '%s\n' "$eval_residuals" >&2
    [ -n "$runtime_default_residuals" ] && printf '%s\n' "$runtime_default_residuals" >&2
    [ -n "$runtime_output_residuals" ] && printf '%s\n' "$runtime_output_residuals" >&2
    return 1
  fi
}

# Sync one skill: rsync local → repo path, optionally apply mdize.
sync_skill() {
  local name="$1"
  local apply_mdize="$2"   # 0|1
  local target="$SKILLS_REPO/skills/$name"
  rsync_skill_tree "$SKILLS_LOCAL/$name" "$target"
  if [ "$apply_mdize" = "1" ]; then
    mdize_skill "$target"
  fi
}

# Push one branch with given commit message prefix.
push_branch() {
  local branch="$1"
  local mdize="$2"   # 0|1
  local prefix="$3"  # "feat" or "feat(md)"

  log "=== Branch: $branch ==="
  cd "$SKILLS_REPO"
  git checkout "$branch" 2>&1 | head -1 || true
  # Verify checkout actually succeeded — `git checkout` exits non-zero when
  # uncommitted changes block the switch, but `| head -1 || true` swallows it.
  # Without this guard, subsequent reset/sync/commit/push run on the WRONG branch
  # (the one we started on), silently corrupting both branches. Found 2026-05-18.
  local current_branch
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  if [ "$current_branch" != "$branch" ]; then
    err "checkout $branch failed (still on $current_branch). Commit or stash uncommitted changes first, then retry."
    exit 1
  fi
  git pull --rebase --quiet || {
    warn "pull --rebase failed on $branch — trying reset --hard origin/$branch"
    git rebase --abort 2>/dev/null || true
    git fetch origin "$branch" --quiet
    git reset --hard "origin/$branch"
  }

  local skills
  if [ "$FORCE" = "1" ]; then
    skills=$(list_all_local)
  else
    skills=$(detect_updates)
  fi

  if [ -z "$skills" ]; then
    log "  no changes for $branch"
    return 0
  fi

  for name in $skills; do
    log "  syncing $name$([ "$mdize" = "1" ] && echo " (mdize)")"
    [ "$DRY_RUN" = "1" ] && continue
    sync_skill "$name" "$mdize"
  done

  if [ "$DRY_RUN" = "1" ]; then
    log "  [dry-run] skipping bump/commit/push"
    return 0
  fi

  if [ "$mdize" = "1" ]; then
    for name in $skills; do
      audit_md_skill "$SKILLS_REPO/skills/$name"
    done
    ok "markdown residual audit passed"
  fi

  if [ -z "$(git status --porcelain)" ]; then
    log "  no actual file changes after rsync — skipping commit"
    return 0
  fi

  # Commit message lists skills that ACTUALLY changed, not the detect list.
  # On the md branch detect_updates() flags every skill (org source always differs
  # from the markdown-ized repo); the real git delta below — read before the version
  # bump, scoped to skills/ — is the truth. Falls back to the detect list only if
  # nothing under skills/ shows a change.
  local skill_list
  skill_list=$(git status --porcelain -- skills/ \
    | cut -c4- \
    | sed -E 's/^.* -> //; s/^"//; s/"$//' \
    | sed -nE 's#^skills/([^/]+)/.*#\1#p' \
    | sort -u | tr '\n' ' ' | sed 's/ *$//')
  [ -z "$skill_list" ] && skill_list=$(echo "$skills" | tr '\n' ' ' | sed 's/ *$//')

  local new_ver
  new_ver=$(bump_version)
  git add skills/ .claude-plugin/
  git commit -m "${prefix}: sync ljg-* skills [$skill_list] (v$new_ver)" --quiet
  git push origin "$branch" --quiet
  ok "$branch @ v$new_ver pushed"
}

# === README consistency check ===
# Hard gate: README must mention all skills before push.
# A skill present locally but missing in README likely means README hasn't been
# updated to reflect the new skill. Default = exit 1; bypass with --skip-readme-check.
check_readme() {
  local readme_master="$SKILLS_REPO/README.md"
  if [ ! -f "$readme_master" ]; then
    warn "README.md not found at $readme_master (skipping check)"
    return 0
  fi

  local local_skills readme_skills missing
  local_skills=$(list_all_local | sort -u)
  # Extract every ljg-xxx mention from README, dedupe
  readme_skills=$(grep -oE 'ljg-[a-z][a-z0-9-]*' "$readme_master" | sort -u)
  # Skills present locally but absent in README
  missing=$(comm -23 <(echo "$local_skills") <(echo "$readme_skills"))

  if [ -z "$missing" ]; then
    ok "README mentions all local ljg-* skills"
    return 0
  fi

  warn "README is missing these skills:"
  echo "$missing" | sed 's/^/    - /'
  echo ""
  warn "Each push is a chance to refresh README. Ask yourself:"
  echo "    - Added a skill? -> the README skill list / install commands need a line"
  echo "    - Removed a skill? -> its README line has to go"
  echo "    - Changed a skill description substantially? -> the README summary may need updating"
  echo ""
  if [ "$SKIP_README_CHECK" = "1" ]; then
    warn "--skip-readme-check passed: ignoring above and continuing."
    return 0
  fi
  err "Aborting push. Update README first, or pass --skip-readme-check."
  exit 1
}

# Keep the working repo on the source branch after every successful push.
return_to_master() {
  cd "$SKILLS_REPO" || return 0
  local current_branch
  current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
  if [ "$current_branch" = "master" ]; then
    return 0
  fi
  if git checkout master >/dev/null 2>&1; then
    ok "repo left on master"
  else
    warn "could not switch back to master; check uncommitted changes in $SKILLS_REPO"
  fi
}

# === Main ===

# Tests source this file to exercise the real conversion functions in an
# isolated tree. Normal CLI execution leaves this unset and follows the release.
if [ "${LJG_PUSH_LIBRARY_ONLY:-0}" = "1" ]; then
  return 0 2>/dev/null || exit 0
fi

setup_repo
cd "$SKILLS_REPO"

# README consistency gate (always runs; --skip-readme-check or --dry-run downgrade to warning)
log "Checking README consistency..."
check_readme

log "Detecting updates..."
UPDATED=$(detect_updates)
if [ "$FORCE" = "1" ]; then
  log "  --force: will sync all local ljg-* skills"
elif [ -z "$UPDATED" ]; then
  log "  No diff vs current branch — md branch may still need attention."
fi

if [ "$DRY_RUN" = "1" ]; then
  log "[dry-run] Would sync these skills:"
  if [ "$FORCE" = "1" ]; then
    list_all_local | sed 's/^/  - /'
  elif [ -n "$UPDATED" ]; then
    echo "$UPDATED" | sed 's/^/  - /'
  else
    log "  (none on current branch)"
  fi
fi

# Always run both branches — each branch does its own detect + early-skip.
# Don't exit early on "no master diff" because md branch may still have changes
# (mdize transformations create per-branch divergence from the org-style local).
push_branch master 0 "feat"
push_branch md     1 "feat(md)"
return_to_master

log ""
log "Done."
