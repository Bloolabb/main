# Developer Guide: Lesson Content System

Technical documentation for developers working with the lesson content rendering system.

## Architecture Overview

### Component Structure
```
components/learn/lesson-content.tsx
├── LessonContent (Main Component)
│   ├── State Management
│   ├── Content Parsing Logic
│   ├── Step Management
│   └── Navigation
└── YouTubeVideo (Video Embed Component)
    ├── YouTube URL Parsing
    └── Generic Iframe Support
```

### Data Flow
```
Database (lessons.description)
    ↓
Parse Content (parseDescriptionContent)
    ↓
Split into { description, content }
    ↓
Render with ReactMarkdown
    ↓
Display in UI
```

## Content Parsing Logic

### Function: `parseDescriptionContent`

```typescript
const parseDescriptionContent = (rawText: string) => {
  if (!rawText) return { description: "", content: "" }
  
  const cntRegex = /\\n\s*cnt:\s*([\s\S]*)/i
  const cntMatch = rawText.match(cntRegex)
  
  if (cntMatch) {
    const contentStartIndex = rawText.search(cntRegex)
    const description = rawText.substring(0, contentStartIndex).trim()
    const content = cntMatch[1].trim()
    return { description, content }
  }
  
  return { description: rawText.trim(), content: "" }
}
```

**Logic:**
1. Check if `\n cnt:` delimiter exists
2. If yes: Split at delimiter
   - Everything before = description
   - Everything after = content
3. If no: Entire text = description (backward compatible)

**Regex Breakdown:**
- `\\n` - Literal backslash-n string
- `\s*` - Optional whitespace
- `cnt:` - Content marker (case-insensitive)
- `\s*` - Optional whitespace after colon
- `([\s\S]*)` - Capture everything (including newlines)

### Edge Cases Handled
- Empty/null description → Returns empty strings
- No delimiter → Full backward compatibility
- Multiple `\n cnt:` → Takes first occurrence
- Whitespace variations → Normalized with trim()

## Video Embed System

### Function: `YouTubeVideo`

```typescript
function YouTubeVideo({ url }: { url: string }) {
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  
  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('embed')) return url;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    const videoId = match ? match[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const embedUrl = isYouTube ? getYouTubeEmbedUrl(url) : url;

  return (
    <div className="mb-6">
      <div className="relative w-full pb-[56.25%] h-0 rounded-lg overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
        />
      </div>
    </div>
  )
}
```

**Supported Platforms:**
- YouTube (auto-converts to embed URL)
- Vimeo (use embed URL)
- Loom (use embed URL)
- Any iframe-compatible video service

**Responsive Design:**
- Uses padding-bottom technique for 16:9 aspect ratio
- `pb-[56.25%]` = 9/16 × 100%
- Absolute positioned iframe fills container

## Markdown Rendering

### Dependencies
```json
{
  "react-markdown": "^9.0.1",
  "remark-gfm": "^4.0.0"
}
```

### Configuration

```tsx
<ReactMarkdown 
  remarkPlugins={[remarkGfm]}
  components={{
    h1: ({node, ...props}) => <h1 className="text-2xl sm:text-3xl font-bold mt-6 mb-4" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-xl sm:text-2xl font-bold mt-5 mb-3" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-2" {...props} />,
    // ... more custom components
  }}
>
  {content}
</ReactMarkdown>
```

**Custom Components:**
- Headings: Responsive sizing with Tailwind breakpoints
- Links: Security attributes (target="_blank", rel="noopener noreferrer")
- Code: Syntax highlighting preparation (inline vs block)
- Lists: Proper indentation and spacing
- Blockquotes: Blue accent border styling

### Prose Classes
```tsx
className="prose prose-sm sm:prose-base lg:prose-lg max-w-none"
```

**Breakdown:**
- `prose` - Base typography styles
- `prose-sm/base/lg` - Responsive sizing
- `max-w-none` - Override max-width constraint
- Additional prose modifiers for colors/styling

## State Management

### Component State
```typescript
const [currentStep, setCurrentStep] = useState(0)
const [isLoading, setIsLoading] = useState(false)
const [lessonData, setLessonData] = useState(lesson)
const [isFetchingContent, setIsFetchingContent] = useState(!lesson.description)
```

**States:**
- `currentStep` - Current lesson step (0-2)
- `isLoading` - Navigation loading state
- `lessonData` - Cached lesson data
- `isFetchingContent` - Content fetch loading state

### Lesson Steps
```typescript
const lessonSteps = [
  { type: "intro", title: "Getting Started", content: description },
  { type: "content", title: lessonData.title, content: content, videoUrl: lessonData.youtube_url },
  { type: "summary", title: "Ready to Practice", content: "..." }
]
```

**Flow:**
1. Intro → Shows description
2. Content → Shows full content with video
3. Summary → Transition to exercises

## Database Schema

### Expected Fields
```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,           -- Contains description and optional content
  youtube_url TEXT,            -- Video URL (YouTube or other)
  module_id UUID REFERENCES modules(id),
  order_index INTEGER,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Description Field Format

**Option 1: Simple (Backward Compatible)**
```sql
description = 'Simple lesson description text'
```

**Option 2: Extended Content**
```sql
description = 'Brief introduction
\n cnt: # Full Content

Markdown content here...'
```

**Important:** The `\n` is a literal backslash-n string in the database, not an actual newline character.

## API Integration

### Fetching Lesson Data
```typescript
const { data, error } = await supabase
  .from("lessons")
  .select(`
    *,
    modules (
      learning_tracks (*)
    )
  `)
  .eq("id", lesson.id)
  .single()
```

**Includes:**
- All lesson fields
- Parent module data
- Learning track information

## Responsive Design

### Breakpoints
```tsx
sm:  // 640px
md:  // 768px
lg:  // 1024px
```

### Mobile-First Approach
```tsx
className="text-sm sm:text-base lg:text-lg"
```
- Base: Mobile styles
- sm: Tablet adjustments
- lg: Desktop enhancements

### Key Responsive Elements
1. **Typography**: Scales from sm to lg
2. **Spacing**: Tighter on mobile (p-3 sm:p-4 md:p-6)
3. **Layout**: Stack on mobile, row on desktop
4. **Video**: Always maintains 16:9 ratio
5. **Code blocks**: Horizontal scroll on mobile

## Performance Considerations

### Parsing Optimization
- Parsing happens once per render
- Result stored in component memory
- No re-parsing on state changes

### Lazy Loading
- Video iframes are lazy-loaded by browser
- Content fetched only when description missing
- Images in markdown are lazy by default

### Bundle Size
- react-markdown: ~50KB gzipped
- remark-gfm: ~10KB gzipped
- Total addition: ~60KB

## Testing

### Unit Tests
```typescript
describe('parseDescriptionContent', () => {
  it('should handle no delimiter', () => {
    const result = parseDescriptionContent('Simple text')
    expect(result).toEqual({ description: 'Simple text', content: '' })
  })
  
  it('should split with delimiter', () => {
    const result = parseDescriptionContent('Desc\\n cnt: Content')
    expect(result).toEqual({ description: 'Desc', content: 'Content' })
  })
})
```

### Integration Tests
1. Test with various markdown formats
2. Test video embeds (YouTube, Vimeo, etc.)
3. Test responsive breakpoints
4. Test navigation between steps
5. Test loading states

## Error Handling

### Video Embed Failures
- Malformed URLs → Uses URL as-is
- Blocked embeds → Browser shows error
- No fallback UI (browser handles)

### Content Parsing Errors
- Empty content → Shows empty description
- Malformed delimiter → Treats as description
- HTML in markdown → Sanitized by react-markdown

### Data Fetching Errors
- Missing description → Triggers fetch
- Fetch failure → Shows cached data
- Network error → Silent failure (uses existing)

## Security

### XSS Prevention
- react-markdown automatically escapes HTML
- Links have rel="noopener noreferrer"
- Iframe sandbox attributes for security

### Content Sanitization
```tsx
// react-markdown handles this automatically
// No dangerouslySetInnerHTML used
```

## Future Enhancements

### Planned Features
- [ ] Syntax highlighting for code blocks
- [ ] Image optimization and lazy loading
- [ ] Table of contents generation
- [ ] Progress checkpoints within content
- [ ] Bookmark/highlight functionality
- [ ] Print-friendly view
- [ ] Dark mode support
- [ ] Offline content caching

### Potential Improvements
- [ ] Code playground integration
- [ ] Interactive diagrams
- [ ] Embedded quizzes in content
- [ ] Time tracking per section
- [ ] Annotations and notes
- [ ] AI-powered summaries

## Debugging

### Common Issues

**Content not rendering:**
```typescript
// Check in browser console:
console.log('Description:', lessonData.description)
console.log('Parsed:', parseDescriptionContent(lessonData.description))
```

**Video not showing:**
```typescript
// Verify URL format:
console.log('Video URL:', lessonData.youtube_url)
console.log('Is YouTube:', url.includes('youtube'))
```

**Markdown not formatting:**
```typescript
// Check content value:
console.log('Content:', content)
console.log('Has content:', content.length > 0)
```

### Dev Tools
- React DevTools - Inspect component state
- Network tab - Check data fetching
- Console - Check for errors/warnings

## Contributing

### Code Style
- Use TypeScript for type safety
- Follow existing naming conventions
- Add comments for complex logic
- Keep functions small and focused

### Pull Request Checklist
- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Responsive design tested
- [ ] Backward compatibility maintained
- [ ] No console errors/warnings

## Resources

- [React Markdown Docs](https://github.com/remarkjs/react-markdown)
- [Remark GFM Plugin](https://github.com/remarkjs/remark-gfm)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

## Support

For technical questions or issues:
1. Check component code: `components/learn/lesson-content.tsx`
2. Review this documentation
3. Check browser console for errors
4. Verify database schema matches expected format
