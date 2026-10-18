# ValidateClassic

Re-checks that a classic JSON, PNG and manifest still agree on the same input, dimensions, hashes and DOM audit results.

```bash
bun Tools/ValidateClassic.ts \
  --input <classic.json> \
  --png <classic.png> \
  --manifest <classic.manifest.json>
```

All three flags are required. On success it prints JSON with `status: "valid"` to stdout; it exits non-zero when the base text, tokens, coverage, dimensions, hashes, top-image presence/visibility, or the visibility of any required section disagree. Run `bun Tools/ValidateClassic.ts --help` for the current flags.
