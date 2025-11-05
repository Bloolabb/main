# Quick Reference: Lesson Content Format

## TL;DR

**Simple (Backward Compatible):**
```
Just write your lesson description normally
```

**With Rich Content (Optional):**
```
Short description here
\n cnt: # Full markdown content
```

## Quick Examples

**Basic Lesson (Works as-is):**
```
Learn JavaScript variables in this beginner-friendly lesson.
```

**Extended Lesson:**
```
Learn JavaScript variables in this beginner-friendly lesson.
\n cnt: # JavaScript Variables

## What are Variables?

Variables store data...

```javascript
let name = "John";
```

Try it yourself!
```

## Database Update Query

**Simple:**
```sql
UPDATE lessons 
SET description = 'Your lesson description here'
WHERE id = 'lesson-id';
```

**With Extended Content:**
```sql
UPDATE lessons 
SET description = 'Short intro
\n cnt: # Your Content Title

Your markdown content here...'
WHERE id = 'lesson-id';
```

## Markdown Cheat Sheet

| Element | Syntax | Example |
|---------|--------|---------|
| Heading 1 | `# Title` | # Title |
| Heading 2 | `## Title` | ## Title |
| Bold | `**text**` | **text** |
| Italic | `*text*` | *text* |
| Link | `[text](url)` | [Google](https://google.com) |
| Code | `` `code` `` | `code` |
| Code Block | ```` ```lang\ncode\n``` ```` | ```js\nlet x = 1;\n``` |
| List | `- item` | - item |
| Numbered | `1. item` | 1. item |
| Quote | `> text` | > text |

## Test Checklist

- [ ] Content displays correctly
- [ ] Markdown renders properly
- [ ] Video displays (if URL provided)
- [ ] Mobile responsive
- [ ] Links work and open in new tab
- [ ] Code blocks are readable

## Backward Compatibility

✅ **Existing lessons work without changes!**

If your lesson description is:
```
"Learn about business revenue and profit margins"
```

It will work perfectly as-is. No updates needed!

To add rich content later, just update it to:
```
"Learn about business revenue and profit margins
\n cnt: # Full Content Here..."
```

## Common Mistakes

❌ **Wrong:**
```
des: Description without cnt
Content mixed in randomly
```

✅ **Correct (Simple):**
```
Just write your description
```

✅ **Correct (Extended):**
```
Description here
\n cnt: Content here
```

❌ **Wrong:** `\n` (actual newline)
✅ **Correct:** `\\n` (literal backslash-n in database)

## Video Support

**YouTube:**
```sql
youtube_url = 'https://www.youtube.com/watch?v=VIDEO_ID'
```

**Vimeo:**
```sql
youtube_url = 'https://player.vimeo.com/video/VIDEO_ID'
```

**Loom:**
```sql
youtube_url = 'https://www.loom.com/embed/VIDEO_ID'
```

**Any iframe-compatible video:**
```sql
youtube_url = 'https://example.com/embed/video'
```

## File Locations

- **Component:** `components/learn/lesson-content.tsx`
- **Format Guide:** `docs/LESSON_CONTENT_FORMAT.md`
- **Creator Guide:** `docs/LESSON_CREATOR_GUIDE.md` ⭐
- **Developer Guide:** `docs/DEVELOPER_GUIDE.md`
- **Examples:** `docs/LESSON_CONTENT_EXAMPLES.md`
- **Quick Ref:** `docs/QUICK_REFERENCE.md` (this file)

**For lesson creators:** Start with `LESSON_CREATOR_GUIDE.md`
**For developers:** See `DEVELOPER_GUIDE.md`

## Support

If content doesn't display:
1. Check `des:` prefix exists
2. Verify `\\n cnt:` delimiter (literal backslash-n)
3. Test markdown syntax separately
4. Check browser console for errors

## Dependencies

```bash
npm install react-markdown remark-gfm
```

## Component Import

```typescript
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
```

---

**For detailed information, see `docs/LESSON_CONTENT_FORMAT.md`**
