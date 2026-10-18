# ljg-skills (English Edition)

A personal collection of agent skills, fully translated into English.

This is an English port of [lijigang/ljg-skills](https://github.com/lijigang/ljg-skills).
Every skill prompt, reference doc, workflow, template and tool message has been
translated so the skills can be used with **Claude Code** and **Claude Desktop**.

## Install

### Claude Code (recommended)

```bash
# install every skill for your user account
mkdir -p ~/.claude/skills
cp -r skills/ljg-* ~/.claude/skills/

# or install a single skill
cp -r skills/ljg-card ~/.claude/skills/
```

Restart Claude Code afterwards so the new skills are picked up.
Invoke a skill with `/ljg-card` (or just describe the task in natural language).

### Claude Code as a plugin

The repository ships a plugin manifest (`.claude-plugin/`), so it can also be
added as a plugin marketplace:

```bash
# inside Claude Code
/plugin marketplace add <path-or-github-repo>
/plugin install ljg-skills
```

### Claude Desktop

Claude Desktop loads skills from the skills folder of your Claude settings
(Settings -> Capabilities -> Skills). Either upload a skill folder as a `.zip`,
or copy the folder into the skills directory Claude Desktop shows there.

Each skill directory is self-contained: `SKILL.md` plus whatever
`references/`, `Workflows/`, `Tools/` and `assets/` it needs.

### Codex / skills CLI

The upstream project targets Codex through the
[skills CLI](https://github.com/vercel-labs/skills). The same layout works here:

```bash
# all skills, globally
bunx skills add <your-repo> -g -a codex --skill '*' -y

# a single skill
bunx skills add <your-repo> -g -a codex --skill ljg-card -y

# list what the repository contains
bunx skills add <your-repo> -l
```

**Flags:**

| Flag | Meaning |
|------|---------|
| `-a codex` | install for Codex only |
| `-g` | install globally to `~/.agents/skills/` (recommended); without it, installs to the project-level `.agents/skills/` |
| `--skill <name>` | install one named skill; may be repeated |
| `--skill '*'` | install every skill in the repository |
| `-y` | skip the confirmation prompt |
| `-l` | list available skills without installing |

### Dependencies

Some skills shell out to tools. Install them only if you use those skills:

| Skill | Requirement |
|-------|-------------|
| `ljg-card` | Node.js/Bun + Playwright (Chromium) for screenshots |
| `ljg-classic` | Bun + Playwright (Chromium) |
| `ljg-business-model` | Bun + a real browser screenshot capability |
| `ljg-present` | Bun (single-file offline HTML decks) |

```bash
cd ~/.claude/skills/ljg-card && bun install && bunx playwright install chromium
```

## Skills

| Skill | What it does |
|-------|--------------|
| **ljg-analogy** | Structural analogy — finds a precise analogy or relational metaphor for a scenario, or for the difference between two objects; keeps the key relations, explains what the analogy adds and where it breaks down |
| **ljg-blind** | Blind-spot scan — reads your AI conversations for a given date, finds structural blind spots in your thinking, and patches them with targeted book chapters |
| **ljg-business-model** | Business Model Canvas — turns project material into the classic nine-block canvas as a PNG card, separating sourced facts, inferences and gaps, and keeping editable HTML and JSON |
| **ljg-card** | Content casting — turns text into PNG cards in four modes: long image `-l`, faithful full-text card `-f`, comic `-c`, whiteboard `-w`. `-f` generates no new imagery and only shows images already in the source; the other modes generate visuals under their own image contract |
| **ljg-classic** | Close reading of classical texts — lays out the source text, word-by-word annotation, sentence meaning, a section-intent diagram and a full reading as one continuously readable long PNG |
| **ljg-learn** | Concept dissection — cuts a concept open from eight directions (history, dialectics, phenomena, language, form, existence, aesthetics, meta-reflection) and compresses it into a single line of insight |
| **ljg-paper** | Paper reading — for readers with no background in the field: explains the research question, the authors' contribution, how the results were obtained and where the evidence stops, in terms of concrete actors and actions |
| **ljg-book** | Book breakdown — explains what the whole book says, how its threads connect, and how facts, events and consequences progressively change your understanding; keeps the branching that matters |
| **ljg-qa** | Question machine — extracts the core claims of an article, paper or book into a Q-A chain. Each Q cuts to the crux; each A has four parts (conclusion / formalization / steps / boundary) |
| **ljg-explain** | Plain explanation — explains a concept, formula, mechanism or principle until you can recognize it, derive it and transfer it; delivered in full in the conversation, with transfer examples |
| **ljg-rank** | Rank-reduction engine — given a field, finds the irreducible set of independent generators behind it |
| **ljg-constraint** | Constraint engine — given a field, profession or role, finds the few constraints that box it in (hard / soft / self-imposed), exposes the fake walls treated as hard constraints, and points out which one can be redefined |
| **ljg-is** | Understanding engine — connects the "what it is" of a noun with the "how it works" of a verb, then derives the cognitive correction and an actionable judgment |
| **ljg-map** | Knowledge map — reads a text through a learning-theory lens, extracting concepts, discrimination criteria and links; draws the graph from the content's own structure, each node with a plain-language definition, a short formula and concrete semantics |
| **ljg-mechanism** | Mechanism research — traces the process behind a concrete phenomenon, compares competing explanations, and checks the key causal links and transfer conditions against sources; delivers the mechanism claim the evidence can actually carry, plus its boundary |
| **ljg-think** | Arrow to the root — given a claim or phenomenon, drills vertically down to the irreducible essence |
| **ljg-word** | Word mastery — deep breakdown of an English word's core semantics and the moment it clicks |
| **ljg-writes** | Writing engine — turns an idea into an article that is understandable, transferable and survives counterexamples |
| **ljg-teach** | Experiential teaching — makes the learner choose first, exposes the knowledge gap with a fair surprise, names it, then retests with a transfer situation |
| **ljg-invest** | Investment analysis — judges, at its core, whether a project is an "order-creating machine" |
| **ljg-read** | Reading companion — uses a bottom-up/top-down structure to explain concepts, discrimination criteria and conditional relations from concrete situations; delivered directly in the conversation |
| **ljg-relationship** | Relationship analysis — five-layer structural diagnosis plus psychoanalysis, guiding the user through dialogue to *see* the real structure of a relationship |
| **ljg-roundtable** | Roundtable — one topic, one roundtable: real figures clash round by round, each round closes with an ASCII structure diagram, and the full transcript is archived at the end |
| **ljg-structure** | Motif wind tunnel — finds the recurring motif behind a surface problem, extracts the transferable structure, explains the relations with an ASCII diagram, and designs a minimal reversible experiment |
| **ljg-present** | Unix-style presentation design — faithful typesetting / authorized talk-track extraction; picks one of five layouts by semantics, layers text and Unicode connectors, dark by default, single-file offline HTML with a speaker-notes layer and a pager |
| **ljg-push** | Push engine — syncs local `~/.agents/skills/ljg-*` to a GitHub repo (both `master` and `md` branches) in one command |

## Output formats

The note-taking skills support two output formats with identical behaviour;
pick one by which branch you install:

| Branch | Format | Best for |
|--------|--------|----------|
| `master` (default) | Org-mode (`.org`) | Emacs / Denote users |
| `md` | Markdown (`.md`) | Obsidian / VSCode / Notion users |

`ljg-map` outputs the knowledge map and node explanations directly in the
conversation in both branches; it saves a file only when asked. The diagram
follows the knowledge relations in the text instead of a preset hierarchy.

`ljg-read` explains the text in the conversation in Markdown in both branches;
it saves a file only when explicitly asked. By default it works through the
current scope in one coherent pass; Socratic prompts and self-tests are opt-in.

`ljg-explain` and `ljg-mechanism` both deliver directly in the conversation —
plain explanation and mechanism research respectively — and save a file only
when explicitly asked, in the requested format.

`ljg-analogy` gives the analogy or metaphor directly in the conversation in both
branches; when comparing two objects it preserves the key differences, and it
saves a file only when explicitly asked.

`ljg-business-model` delivers a PNG Business Model Canvas plus the HTML and JSON
in both branches; it needs Bun to run and a working real-browser screenshot
capability to export the image.

## Language

All content in this repository is English. The original Chinese edition lives at
[lijigang/ljg-skills](https://github.com/lijigang/ljg-skills).

## Porting notes

A few things changed structurally in this port, beyond translation:

- **`ljg-is`, `ljg-book`, `ljg-paper`** — their note validators dropped the legacy
  contract branches. Those branches only ever matched field names from the
  original edition's older records, which cannot exist here. `ljg-is` is now
  `ljg-is-v5` only; `ljg-book` is coverage version 3 only; `ljg-paper` keeps its
  version 1/2 compatibility flags but its alias table is now a no-op.
- **Test fixtures and eval cases** were rewritten in English so they still match
  the validators. Lengths and thresholds that counted characters now count words.
- **`ljg-classic`** keeps classical-Chinese source text in its renderer tests on
  purpose: the skill annotates such texts, and those tests verify character-exact
  read-back of the source.
- **`ljg-business-model/Example.png` and `ljg-present/References/*.png`** are
  rendered images from the original edition, so the text inside them is still
  Chinese. Regenerate them from the JSON/HTML if you need English samples; the
  layout they demonstrate is unchanged.
