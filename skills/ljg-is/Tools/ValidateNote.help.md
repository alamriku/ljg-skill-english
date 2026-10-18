# ValidateNote

Validates the Org or Markdown note produced by `ljg-is`.

The current generation contract is `ljg-is-v5`: the filename uses `--understanding-<target>__is` and the title is "Understanding: <target>". The artifact joins the noun's "what it is" with the verb's "how it works", and goes on to give the cognitive correction and the judgment for action.

The validator checks the backstage metadata `definition`, `operation`, `recognition`, `guidance`, `basis` and `falsifier`, plus content-style headings, the paragraph count and basic readability. It blocks bullet points, field-style headings, overly dense comma chains, too many semicolons and overlong sentences; it does not require an invented protagonist, a story about the creation turning on its creator, or an ending with a question mark.

These are deterministic proxies only; they cannot prove the prose reads naturally. After validation you must still read the whole piece back: the reader should be able to distinguish the concept, restate the mechanism, say how the old judgment changed, and give one situation that will genuinely change what they do.

This English edition validates `ljg-is-v5` only; the older Chinese-contract schemas were dropped because no note in this edition can use them.

```bash
bun ~/.agents/skills/ljg-is/Tools/ValidateNote.ts \
  ~/Context/20260823T010203--understanding-objective-function__is.org
```

On success it prints `{"status":"ok", ...}` to stdout and exits 0; on failure it prints an array of errors to stderr and exits 1; with no file argument it exits 2.

Run the self-test:

```bash
bun test ~/.agents/skills/ljg-is/Tools/ValidateNote.test.ts
```
