---
name: ljg-blind
description: Blind-spot scan - reads all of yesterday's conversations with AI, surfaces the thinking blind spot they expose (not missing knowledge, but a habit of thought that keeps a whole class of truth invisible), then picks one chapter from WeRead to patch it precisely, and writes the whole thing up as an analysis note. Use when user says 'scan my blind spots', 'blind spot', 'show me what I keep missing', 'what did I fail to see yesterday', 'blind spot', 'ljg-blind', '/ljg-blind', or wants yesterday's AI conversations analyzed for cognitive blind spots plus a targeted WeRead chapter to fill them. Optional argument: pass a date (YYYY-MM-DD) to scan that day instead of yesterday. NOT FOR drilling vertically into one idea (use ljg-think), reducing a field to its generators (use ljg-rank), reading a text alongside the user (use ljg-read), or finding a field's constraints (use ljg-constraint).
user_invocable: true
---

# Blind-spot scan

Read all of yesterday's conversations with AI, surface the blind spot you cannot see yourself, and light up the one chapter in WeRead that patches it.

## What a blind spot is

A blind spot is not a knowledge gap. Not "I have not read that book" or "I did not know that fact" — those close with a lookup.

A blind spot is a structural habit of thought that makes one class of truth **systematically invisible** to you. It is not that you could not think of it; the habit means you never looked that way at all. It lives in *how* you think, not in *what* you think about.

So the evidence is not "what he got wrong". It is: where he did not look, where he went around, what he assumed and never checked.

## Five blind-spot signals

Look for these five in yesterday's conversations. Every one must land on specific lines — never on a feeling.

1. **The swerve** — a hard question he opened and shut again fast. Evidence: the question is raised, the topic turns, or a "let us leave that for now" slides past it.
2. **Spinning frameworks** — the same question cut from different angles, none of them landing. Evidence: one question gets three or four frames, each tried shallowly, and no conclusion at the end.
3. **A single viewfinder** — a whole day running on one or two lenses (everything becomes "constraints", "evolution", "games"), with no other mirror tried. This is his best-hidden blind spot: the handier the lens, the more it hides what other lenses would show. (His way of seeing the world is f(x), and his default lenses are few; being the default is exactly why you should check whether today was yet another day inside one of them.)
4. **The unchecked premise** — one default assumption runs through everything, used as a hard constraint, never questioned as a possible fake wall. Evidence: an "of course it works this way" that recurs and is never challenged by him.
5. **The adjacent gap** — reasoning back from what he asked, the corner he should have asked about and did not. Not a guess out of nowhere: his own thread points there.

## Which one to pick

Pick **one** signal as today's blind spot. Better one said fully than five mentioned — blind spots have lower density than precision. Three criteria:

- **Leverage** — patching it opens the most possibilities for the next step.
- **Genuinely blind** — something he cannot see, not something he knows and is putting off.
- **Matches the mission** — fits M0 (find a new viewfinder) or M1 (get to the essence). If the blind spot sits right across his main line, prioritize it. Read `${LIFEOS_DIR:-$HOME/.codex/LIFEOS}/USER/TELOS/PRINCIPAL_TELOS.md` to confirm the main line.

---

## Steps

### Step 1 - Fix the date

```bash
# default: yesterday; if the user passed YYYY-MM-DD, use that day (macOS BSD date)
target=${1:-$(date -v-1d +%Y-%m-%d)}
```

### Step 2 - Pull that day's conversations

Session files live in `$HOME/.codex/sessions/YYYY/MM/DD/*.jsonl`. The directory date records the session's start day in local time while the in-line `timestamp` is UTC, so scan both the target day's and the previous day's directories and filter messages by local date. Read only top-level task `response_item / message / user / input_text`, excluding subagent sessions (those with `session_meta.payload.source.subagent`), harness wrappers, and this invocation itself:

```bash
target=<the date from the previous step>
out=/tmp/ljg-blind-${target}.txt
: > "$out"
previous_dir=$(date -j -v-1d -f '%Y-%m-%d' "$target" '+%Y/%m/%d')
target_dir=$(date -j -f '%Y-%m-%d' "$target" '+%Y/%m/%d')

for day_dir in "$previous_dir" "$target_dir"; do
  session_dir="$HOME/.codex/sessions/$day_dir"
  [ -d "$session_dir" ] || continue
  find "$session_dir" -type f -name '*.jsonl' -print0
done | while IFS= read -r -d '' session_file; do
  # Codex puts subagents and top-level tasks in the same date directory; exclude them via session_meta.
  if jq -e 'select(.type=="session_meta") |
      (.payload.source | type == "object" and has("subagent"))' \
      "$session_file" >/dev/null 2>&1; then
    continue
  fi

  jq -r --arg target "$target" '
    def local_epoch:
      sub("\\.[0-9]+Z$"; "Z") | fromdateiso8601;
    select(.type=="response_item"
      and .payload.type=="message"
      and .payload.role=="user")
    | (.timestamp | local_epoch) as $epoch
    | select(($epoch | strflocaltime("%Y-%m-%d")) == $target)
    | ([.payload.content[]?
        | select(.type=="input_text")
        | .text] | join("\n")) as $text
    | select($text | length > 0)
    | select(($text | test("^(<recommended_plugins>|<environment_context>|<task-notification>)")) | not)
    | select(($text | test("(?i)(ljg-blind|blind.?spot scan)")) | not)
    | "[" + ($epoch | strflocaltime("%H:%M")) + "] " + $text
  ' "$session_file" 2>/dev/null >> "$out"
done

wc -m "$out"
```

If the material is over 50KB, read it in conversation-sized chunks, identifying what each chunk is about before going deeper. A few neighbouring assistant replies can help establish context.

**Thin-data fallback**: if that day has under 200 words of real human input, or no conversation at all, write plainly in the output that the day was thin or empty. **Do not manufacture a blind spot.** Better a blank sheet than an invention.

### Step 3 - Read out the blind spot

Go through the five signals above, recording evidence for every hit (which lines, which turn gave it away). Then pick the single most important blind spot using the three criteria above.

### Step 4 - Pick the WeRead chapter

Call the WeRead API (`WEREAD_API_KEY` is in the environment, in the form `wrk-xxxx`; if it is missing, prompt with `export WEREAD_API_KEY=<key>`). Three steps:

1. **Search for a book** — take one or two core words from the blind spot as the keyword:

```bash
curl -s -X POST https://i.weread.qq.com/api/agent/gateway \
  -H "Authorization: Bearer $WEREAD_API_KEY" -H "Content-Type: application/json" \
  -d '{"api_name":"/store/search","keyword":"<core word>","count":8,"skill_version":"1.0.3"}' \
  | jq -r '.results[].books[]?.bookInfo | "\(.bookId)\t\(.title)\t\(.author)\trating \(.newRating)"'
```

From the results pick one book, rating preferably >= 750 (the new rating is x100, i.e. 7.5), that fits the blind spot best, and note its bookId. Rating is not the only criterion — fit beats score: a 7.4 that hits the blind spot beats an 8.5 that grazes it.

2. **Look at the table of contents** — pick the **one** chapter that fits best, not the whole book and not a general preface:

```bash
curl -s -X POST https://i.weread.qq.com/api/agent/gateway \
  -H "Authorization: Bearer $WEREAD_API_KEY" -H "Content-Type: application/json" \
  -d '{"api_name":"/book/chapterinfo","bookId":"<bookId>","skill_version":"1.0.3"}' \
  | jq -r '.chapters[] | select(.level<=2) | "\(.chapterUid)\t[\(.level)] \(.title)\t\(.wordCount) words"'
```

Note the chapterUid, the chapter title, and the wordCount.

3. **Estimate the reading time** — `wordCount / 280` (reading speed for the source language), rounded up to a multiple of 5. With no wordCount, estimate 15-45 minutes from the table of contents; if the title carries a macro word such as "Part One" or "Book I", multiply the estimate by 1.5.

4. **Build the web link** — the WeRead web reader does not accept a bare `bookId` / `chapterUid`; they must be encoded first. Use the tool shipped with this skill:

```bash
bun "${HOME}/.agents/skills/ljg-blind/Tools/WeReadWebUrl.ts" "<bookId>" "<chapterUid>"
```

The tool outputs something of the form:

```text
https://weread.qq.com/web/reader/{encodedBookId}k{encodedChapterUid}
```

Put that complete URL in the note. Do not hand-assemble the encoded values, and do not drop raw IDs into `/web/reader/`.

**Fallback**: if the search comes back empty or no chapter fits, pick a relevant whole book and pass only the bookId to generate the book's web entry point:

```bash
bun "${HOME}/.agents/skills/ljg-blind/Tools/WeReadWebUrl.ts" "<bookId>"
```

Explain in the note why you could not narrow it to a chapter.

### Step 5 - Write the note

Get the timestamps: `date +%Y%m%dT%H%M%S` and `date "+%Y-%m-%d %a %H:%M"` (use the current time, not the target date).

Write to `~/Context/{timestamp}--blind-{topic}__blind.org`. Org-mode format, no markdown syntax.

Body template:

```org
#+title: Blind-spot scan - {name the blind spot in one line}
#+date: [YYYY-MM-DD Weekday HH:MM]
#+filetags: :blind:weread:topology:

* What you were thinking about yesterday
<1-2 paragraphs. The terrain of the day's thinking - which few things, circling which centre. Give evidence: which lines show it. Not a log; catch the main line.>

* The blind spot it exposes
<The one blind spot you chose. First name which kind it is in one line (swerve / spinning frameworks / single viewfinder / unchecked premise / adjacent gap). Then 2-3 paragraphs: what it looks like concretely, which moments yesterday exposed it, and why you cannot see it yourself. Name the leverage - what patching it opens up.>

* The chapter for you
- Book: {title} - {author}
- Chapter: <chapter title>
- Time: about N minutes
- Link: [[https://weread.qq.com/web/reader/ENCODED_BOOKkENCODED_CHAPTER][read this chapter in the WeRead web reader]]
- Why this one: <3-4 sentences. Match the blind spot to this chapter - what the chapter actually says and how it patches the blind spot. Not "it broadens your horizons": say which thing in this chapter hits which gap.>
```

Report the file path to the user.

---

## Voice rules (hold these while writing the note)

This note is written for someone who has been thinking alongside you for a long time. It is not a report and not for a stranger.

- **Plain, natural English.** Go easy on "however / furthermore / it is worth noting"; avoid nominalizations ("an understanding of X" -> "understanding X", "make a decision" -> "decide"); prefer short sentences. Read it back and ask: would a person actually say this out loud? Where it sticks, rewrite the paragraph rather than swapping a word.
- **No knife-and-metal self-congratulation.** No "another cut", "one layer deeper and harder", "sharp words", "nailing it down", "hard truths" — that whole register of meta-rhetoric praising its own force. The reader can tell whether the blind spot was caught; the author does not need to shout about it.
- **Warm, rough-edged, with judgment.** Have a position rather than faking neutrality — but mark it as judgment, not as objective fact.

## Strict org syntax (no mixed markdown)

- Headings use `*` / `**` / `***`, not `#`
- Bold `*text*`, italic `/text/`, monospace `~code~`
- Lists use `-`, not `*` (`*` is a heading in org)
- Links `[[url][text]]`, not `[text](url)`
- Horizontal rule `-----`, not `---`; no markdown `>` quotes

## Self-check (before finishing)

- Does the blind spot have concrete evidence? Can every point name which lines from yesterday? If not, go back to Step 3.
- Did you pick exactly one blind spot and say it fully, or greedily list three or four?
- Does the chapter link start with `https://weread.qq.com/web/reader/`, generated by the tool from a non-empty bookId and chapterUid?
- Is there any leftover app-only protocol link anywhere in the note?
- Did you check for translation-ese? Nominalizations, "it is ... that" constructions, droppable connectives.
- Did you check for the knife-and-metal register? Not one left.
- Do all three sections have content, with no empty section?

## Gotchas

- **The web reader path uses encoded IDs.** `https://weread.qq.com/web/reader/573976?chapterUid=13` returns 404; you must encode bookId and chapterUid separately with `Tools/WeReadWebUrl.ts` and join them with `k`.
- **Chapter targeting does not go in a query parameter.** The correct form is `/web/reader/{encodedBookId}k{encodedChapterUid}`; omitting the chapter encoding only opens the book's entry page.

## How this differs from the morning letter

Pulse sends an automatic morning letter every day (`thinking-topology.org`), written in one persona, one letter a day, picking one hole. ljg-blind is the **on-demand** analysis version: the same "read yesterday -> find the blind spot -> pick a WeRead chapter" base, but more systematic, aimed only at blind spots, with fuller analysis, and able to scan any day (pass the date argument). Want a letter? Wait for the morning one. Want to check a specific day's blind spot and keep an analysis on file? Use ljg-blind.
