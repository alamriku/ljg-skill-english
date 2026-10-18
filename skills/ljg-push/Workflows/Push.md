# Push Workflow

Sync the ljg-* skills to the GitHub repo in one command (both the master and md branches).

## Voice Notification

```bash
curl -s -X POST http://localhost:31337/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Running Push in ljg-push"}' \
  > /dev/null 2>&1 &
```

Output text: `Running **Push** in **ljg-push**...`

## Step 0: Pre-push README check (hard gate)

Before every push, ask yourself one question:

> Does the README still match the actual set of skills?

Three specific things:

1. *Was a skill added?* -> the README's skill list and install commands need a line
2. *Was a skill removed?* -> its README line has to go
3. *Did a skill's description change substantially?* -> the README summary may need to follow

The script greps every `ljg-xxx` name in the README and compares it with `~/.agents/skills/ljg-*`. If a skill exists locally but not in the README, *the push aborts*.

Bypass (only when you have reviewed the README and it needs no update):

```bash
bash Push.sh --skip-readme-check
```

## Step 1: Parse the arguments

| What the user says | Flag | Effect |
|--------|------|--------|
| default | (no flag) | README check + change detection + push both branches |
| "dry run", "just show me" | `--dry-run` | list what would happen without pushing (README check skipped) |
| "force" | `--force` | skip detection and rsync every ljg-* |
| "README reviewed" | `--skip-readme-check` | skip the README consistency gate (other checks still run) |

## Step 2: Run the script

```bash
bash ~/.agents/skills/ljg-push/Tools/Push.sh [--dry-run|--force]
```

What the script does:

1. *Setup*: check whether `$HOME/code/ljg-skills` exists; clone it if not
2. *Detect*: compare `~/.agents/skills/ljg-*` with `repo/skills/ljg-*` using exactly the same file boundary as the sync - checksums identify added files, deleted files, content changes and executable-bit changes; timestamps alone, directory metadata and empty directories never trigger a publish on their own, `.git/`, `node_modules/` and `.DS_Store` are ignored, and ordinary backup files are not ignored
3. *Push master*:
   - `git checkout master` + `git pull --rebase`
   - For each differing skill: rsync within that shared boundary (deleting real extra files on the target, preserving permissions, not propagating timestamps/owner/group; directories themselves never reach the Git result)
   - bump the patch version (plugin.json + marketplace.json)
   - `git add` + `git commit` + `git push origin master`
4. *Push md*:
   - `git checkout md` + `git pull --rebase`
   - For each differing skill: rsync + apply the markdown conversion (the `mdize_skill` function - including converting org files themselves: `orgfile_to_md` produces YAML headers and `#` headings then deletes the .org, and real file references in Markdown and runtime code are rewritten globally; complete Org templates embedded in Markdown, and unlabelled fences whose first line is an Org header, are converted by `MdizeEmbeddedOrg.ts` into Markdown templates with YAML frontmatter, preserving the file's line-ending style; structured `- *label*:` becomes `- **label**:`; eval output contracts and stdin default formats move to Markdown; `ljg-is`'s output title, path wording, metadata names, tags and acceptance contract move to Markdown/YAML + Denote)
   - Run the residue audit before committing: reject unconverted output instructions, Org-only lint calls, Org header markers, old syntax rules such as single-asterisk bold and Org monospace, non-assets `.org` files, Org output requirements in eval JSON, and Org defaults in runtime code
   - bump the patch version
   - `git add` + `git commit` + `git push origin md`
5. *Finish*: check out `master` again so the local working repo rests on the source branch
6. *Report*: list the push results plus the differences that still need manual review

## Step 3: Report

Output format:

```
=== ljg-push report =============
Updated skills:
  - ljg-qa
  - ljg-card

master @ v1.17.13 -> pushed
md     @ v1.0.8   -> pushed

Still needs manual review (differences the conversion does not cover):
  - ljg-xxx/SKILL.md  (`*bold*` markers in body text - ambiguous with italics, left alone; structured bullet labels excepted)

=================================
```

## Step 4: Error handling

| Problem | Handling |
|------|------|
| Repo path does not exist | clone it, tell the user |
| Path exists but is not the ljg-skills repo | error out without touching the existing directory |
| `git push` rejected (new commits on the remote) | try `pull --rebase` then push again; on conflict, report and let the user handle it |
| `git pull --rebase` conflict | error out, list the conflicting files, suggest `rebase --abort` or manual resolution |
| No changes in `~/.agents/skills/ljg-*` | print "Nothing to push." and exit |

## Acceptance

- Both branches have a new commit (unless nothing changed)
- Both origin/master and origin/md are updated on the remote
- The local `$HOME/code/ljg-skills` ends on `master`
- The report lists the version numbers and the pushed skills
- Every difference the markdown conversion did not cover appears in the review checklist
