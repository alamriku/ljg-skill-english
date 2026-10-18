# RenderClassic

Renders a classic JSON file into complete HTML, a single PNG and a manifest, and can also produce overlapping slices for visual acceptance.

```bash
bun Tools/RenderClassic.ts \
  --input <classic.json> \
  --output <classic.png> \
  --html <classic.html> \
  --width 1080 \
  --slices-dir <qa-slices>
```

`--input` and `--output` are required. `--width` accepts 720-1600; the default is 1080. If `--html` is omitted, the HTML is written next to the PNG with the same basename. Run `bun Tools/RenderClassic.ts --help` for the current flags.

The input JSON may include a paired `heroImage` and `heroAlt`. `heroImage` accepts only a local PNG/JPEG/WebP given as an absolute path or relative to the JSON; the renderer encodes it into the HTML rather than keeping a hot link to the file.

Before rendering it verifies character-exact read-back of the source, annotation coverage of every non-punctuation token, the tone enum, the top image, and the forbidden words in the chapter reading; after rendering it checks for page overflow, cropping, empty text, image visibility, the required headings, and the real PNG dimensions.
