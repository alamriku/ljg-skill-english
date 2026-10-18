# WeReadWebUrl

Encodes the raw `bookId` and `chapterUid` returned by the WeRead API into a link the desktop web reader can open.

## Usage

```bash
bun "${HOME}/.agents/skills/ljg-blind/Tools/WeReadWebUrl.ts" <bookId> [chapterUid]
```

- Passing both bookId and chapterUid: prints the web link to that chapter.
- Passing only bookId: prints the web reader entry point for the whole book.
- Passing `--help` or `-h`: prints usage and exits with code 0.
- Empty arguments: exits with code 1 after printing usage.

## Example

```bash
bun "${HOME}/.agents/skills/ljg-blind/Tools/WeReadWebUrl.ts" 573976 13
```

Output:

```text
https://weread.qq.com/web/reader/b2632d7058c218b269e80c0kc51323901dc51ce410c121b
```
