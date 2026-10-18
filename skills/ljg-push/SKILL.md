---
name: ljg-push
description: Syncs every updated skill in ~/.agents/skills/ljg-* to the GitHub repo (ljg-skills) - first the master branch (org-mode output style), then the md branch (markdown output style) after the basic markdown conversion. Use when user says '/ljg-push', 'push skills', 'sync skills', 'sync ljg', or whenever ljg-* skills get updated and need shipping. NOT FOR pushing non-ljg skills or arbitrary git repos.
user_invocable: true
---

# ljg-push: push the ljg-* skills

Sync the changed skills in local `~/.agents/skills/ljg-*` to the GitHub repo in one command, covering both the master and md branches.

## Repository paths (hard-coded)

```
SKILLS_REPO="$HOME/code/ljg-skills"     # local working repo
SKILLS_LOCAL="$HOME/.agents/skills"      # local skill source
REPO_URL="git@github.com:lijigang/ljg-skills.git"
```

If `$SKILLS_REPO` does not exist, the script clones it. If it exists but is not the ljg-skills git repo, the script errors out without touching the existing directory.

## How the two branches differ

| Branch | Output format | Extension | Bold | File header |
|------|---------|---------|------|--------|
| `master` (default) | org-mode | `.org` | `*bold*` | `#+title:` etc. |
| `md` | markdown | `.md` | `**bold**` | YAML frontmatter |

The skills in `~/.agents/skills/` are in *master style* (the source version). The md branch's differences come from the script's automatic conversion plus manual patching where needed.

After pushing `md`, the script switches back to `master`. The local `$HOME/code/ljg-skills` should always sit on the source branch, so it is easy to inspect and install next time.

## Workflow

Follow the steps in `Workflows/Push.md` -> call `Tools/Push.sh`.

## README consistency (hard gate)

Before every push the script forces one thing: *check the README against the local skills*.

- List every skill name in `~/.agents/skills/ljg-*`
- grep `$SKILLS_REPO/README.md` for occurrences of `ljg-xxx`
- Find what exists locally but is missing from the README - *that almost certainly means the README was not updated*
- On a hit -> the push aborts and reports the difference

Every push is an opportunity to review the README. Ask yourself:

1. *Was a skill added?* The README's skill list and install commands need a line
2. *Was a skill removed?* Its README line has to go
3. *Did a skill's description change substantially?* The README summary may need to follow

When you have reviewed the README and it really does not need updating, bypass the gate:

```bash
/ljg-push --skip-readme-check
```

## What is converted automatically

Converted automatically when syncing the md branch (including org files themselves since 2026-06-12):

`#+begin_example` / `#+end_example` blocks in org files become `text` fences, keeping the text inside and not mistaking its asterisks or hashes for headings and comments. The markers are matched case-insensitively.

- *org files themselves*: every `.org` file in a skill (except under assets/) becomes a `.md` of the same name and the original is deleted - org header block -> YAML frontmatter (with `---` fences, `filetags` -> `tags`), `*` headings -> `#` headings (levels preserved), `#+ATTR_*` lines removed, `[[file:x]]` -> `![](x)`, `#+begin_src` -> fenced code. References to the renamed files inside Markdown and runtime text files (`.ts` / `.js` / `.json` / `.sh`) are rewritten to match
- *complete Org examples embedded in Markdown*: ` ```org ` templates, and unlabelled fences whose first line is `#+key:`, both become ` ```markdown `; a run of header lines becomes YAML frontmatter with `---`, and headings, links, emphasis, monospace text and rules convert with the template; a file that uses pure CRLF keeps its line-ending style
- File extension references: `__qa.org` -> `__qa.md`, `__paper.org` -> `__paper.md`, and so on (the denote naming convention)
- Keywords: `org-mode` -> `markdown`, `Org-mode` -> `Markdown`
- Org-style formatting instructions: "bold with `*bold*` (single asterisk) ..." -> "bold with `**bold**` (double asterisks)", "headings start at `*`" -> "start at `#`", "Org file header" -> "Markdown file header", and the eight example header keys at line start (`#+title:` etc.) -> YAML key lines
- Structured emphasis labels: a line starting `- *label*:` -> `- **label**:`; an `org` fence immediately next to such a label is switched to `markdown` as well
- Output contracts and runtime defaults: prompts and expectations in `evals/*.json` that explicitly require saving Org are changed to Markdown; `stdin__*.org` defaults become `.md`, while explicit Org inputs and test fixtures are preserved
- `ljg-is`'s generation contract: the output title, default file extension, path wording, metadata names, tags and the dual-format acceptance sentence all move to Markdown/YAML + Denote, and the Org-only lint blocking language is removed; the pre-commit residue audit rejects any unconverted Org output instruction

Detection and sync share one file boundary: content is compared by checksum, which reliably catches added files, deleted files, content changes and executable-bit changes; timestamps alone, directory metadata and empty directories never trigger a publish on their own, and `.git/`, `node_modules/` and `.DS_Store` at any level stay out of the sync. The ignore list contains only those three kinds of clutter - real backups such as `.bak` and `.backup` still trigger a sync and a publish review.

*Still not converted automatically* (patch by hand when needed):

- `*bold*` markers in body text: in markdown `*x*` is italic, so a blind replacement would break the document's own formatting; only "line-initial bullet + label + colon" labels convert safely

## Voice Notification

```bash
curl -s -X POST http://localhost:31337/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Running Push in ljg-push"}' \
  > /dev/null 2>&1 &
```

Output text: `Running **Push** in **ljg-push**...`

## Examples

*Example 1: push everything*

```
User: /ljg-push
-> detect which skills in ~/.agents/skills/ljg-* differ from the repo
-> master: rsync + bump version + commit + push
-> md: rsync + mdize + bump version + commit + push
-> switch back to master
-> report: which skills were pushed, the new version, remaining manual differences
```

*Example 2: see what would be pushed without pushing*

```
User: /ljg-push --dry-run
-> list the skills that would be synced
-> list the markdown conversions that would happen
-> perform no rsync / commit / push
```

## Gotchas

- *README drift is the easiest thing to miss* - a new skill gets added and pushed while the README still shows the old list. The script now has a hard gate for exactly this; when it stops you, do not reflexively add `--skip-readme-check` - go and look at the README first
- *The script assumes git credentials are already configured* (ssh key or PAT) - ljg-push does not handle authentication, and errors out if authentication fails
- *master must be pushed first* - the md branch's markdown conversion is derived from master's org version. Pushing in the other order breaks the sequence
- *Untracked clutter (e.g. `assets/measure.js`) gets rsynced into the repo* - if you do not want it pushed, delete it locally first or add it to `.gitignore`
- *The sync ignore list must stay narrow and consistent* - `.git/`, `node_modules/` and `.DS_Store` stay out; timestamps alone, directory metadata and empty directories never trigger a publish on their own and never reach the Git result. Ordinary backup files are not on the ignore list and are still detected, so genuinely public content never gets hidden by accident
- *org files themselves are converted automatically (since 2026-06-12)* - template.org and friends become .md and the original is deleted, regenerated on every push (so an `rsync --delete` wiping them is fine; the process is idempotent). The only manual leftovers are `*bold*` markers in body text. After adding an org reference file with complex constructs, run `--dry-run` or a sandbox pass of mdize first to see what the conversion produces
- *Rename references can hide in runtime code* - for example a test reads a template with `new URL("../Template.org", import.meta.url)`; editing only the Markdown docs would leave the md branch missing a file. The converter rewrites text consumers (`.ts` / `.js` / `.json` / `.sh`) by the basenames actually converted this run, while leaving Org test-fixture strings with no corresponding file untouched
- *Structured labels cannot be matched by enumerating example words* - besides `x` and `f(x)`, real labels such as "subject/boundary" and "substitution" appear too; the converter recognizes the `- *label*:` structure, and after publishing you should still scan the md files for leftover single-asterisk labels
- *Markdown conversion cannot match lowercase `org` only* - skill bodies often write `Org`, inline `#+description`, and an Org template's `# comment` would become a heading in Markdown; the converter handles all these forms uniformly and scans output instructions, Org markers and leftover `.org` files before the md commit
- *A whole-document template cannot be fixed by relabelling the fence* - inside a ` ```org ` or unlabelled fence, `#+title`, asterisk headings and Org links must convert as one semantic unit; the converter emits YAML with `---`, Markdown headings and Markdown links while preserving the file's pure CRLF/LF line endings, so the diff stays meaningful
- *Output-format residue cannot be found by scanning verb phrases alone* - once "when writing the Org file" is converted, "all generated Org files" in the same paragraph can survive and keep the md branch demanding Org output. Both the converter and the pre-commit audit must cover that save-path phrasing; otherwise one successful push carries the old format contract back to the remote
- *Output contracts do not live only in Markdown docs* - the prompt / expected_output in `evals/*.json` directly demand a format from the skill, and `stdin__*.org` in runtime code picks the default parser. mdize and the pre-commit audit must cover both consumers while keeping the explicit-Org-input compatibility tests
- *A mutually exclusive format sentence cannot be fixed by replacing the format name* - when one sentence both requires the source format and forbids the target format, a word-by-word replacement makes the requirement and the prohibition collide. mdize must swap the target and the exclusion as a whole sentence, and the residue audit must reject sentences whose two ends are identical
- *Changing the format name does not change the syntax rules* - after `org-mode` becomes `markdown`, single-asterisk bold, `~code~` and "do not use backticks" still instruct the model to emit Org. The converter must convert that set of mutually exclusive rules into Markdown rules as a unit, and the audit must treat the old rules as blocking
- *The script auto-bumps the patch version in plugin.json and marketplace.json* - to bump minor or major, edit them by hand first; the script only increments the patch
- *If the md branch's remote is ahead of local (pushed from another machine)*, the script tries `pull --rebase` and, if that fails, one `reset --hard origin/md` before reapplying - which discards unpushed local md-branch commits. The script warns before doing it
- *Current paths*: the skill source is fixed at `~/.agents/skills/` and the working repo at `~/code/ljg-skills/`; never read from or push out of an old backup directory
