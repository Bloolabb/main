# Lesson Content Format Documentation

## Overview
This document explains how to write lesson content in the database that will be properly rendered in the lesson page with markdown formatting.

## Database Field Structure

The lesson content is stored in the `lessons` table, specifically in the `description` field.

### Simple Format (Backward Compatible)
Just write your content normally - it will be treated as the description:
```
Learn about JavaScript variables and how to use them effectively.
```

### Extended Format (With Rich Content)
Use `\n cnt:` to separate a short description from full content:
```
Learn about JavaScript variables and how to use them effectively.
\n cnt: # JavaScript Variables

[Full markdown content here...]
```

### Components

1. **Description Only** (default)
   - Just write your text normally
   - Will be shown in both intro and content steps
   - No changes needed for existing lessons

2. **Description + Content** (optional)
   - Everything before `\n cnt:` = short description (shown in intro)
   - Everything after `\n cnt:` = full content with markdown (shown in main step)
   - Use this when you want rich, detailed content

## Supported Markdown Syntax

### Headings
```markdown
# Heading 1
## Heading 2
### Heading 3
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
***Bold and italic***
```

### Lists

#### Unordered Lists
```markdown
- Item 1
- Item 2
  - Sub-item 2.1
  - Sub-item 2.2
- Item 3
```

#### Ordered Lists
```markdown
1. First item
2. Second item
3. Third item
```

### Links
```markdown
[Link text](https://example.com)
```

### Code

#### Inline Code
```markdown
Use `inline code` for short snippets
```

#### Code Blocks
````markdown
```javascript
function example() {
  console.log("Hello World");
}
```
````

### Blockquotes
```markdown
> This is a blockquote
> It can span multiple lines
```

### Line Breaks
Use `\n` in your markdown content for line breaks:
```markdown
First line\nSecond line\nThird line
```

## Video Support

### YouTube Videos
Just add the YouTube URL to the `youtube_url` field:
```sql
youtube_url = 'https://www.youtube.com/watch?v=VIDEO_ID'
```

The system automatically converts it to an embed.

### Other Video Platforms (Vimeo, Loom, etc.)
Use the embed URL directly:
```sql
-- Vimeo
youtube_url = 'https://player.vimeo.com/video/VIDEO_ID'

-- Loom
youtube_url = 'https://www.loom.com/embed/VIDEO_ID'

-- Any other iframe-compatible video
youtube_url = 'https://example.com/embed/video'
```

## Complete Examples

### Example 1: Simple Lesson (No Update Needed)
```sql
INSERT INTO lessons (title, description, module_id, order_index)
VALUES (
  'Introduction to Variables',
  'Variables are containers for storing data. In this lesson, you will learn how to declare and use variables in JavaScript.',
  'module-uuid',
  1
);
```

### Example 2: Lesson with Extended Content
```sql
INSERT INTO lessons (title, description, module_id, order_index, youtube_url)
VALUES (
  'JavaScript Variables',
  'Learn about JavaScript variables and how to use them effectively.
\n cnt: # JavaScript Variables

## What are Variables?

Variables are containers for storing data values. In JavaScript, we use variables to store information that we want to use and manipulate in our programs.

## Declaring Variables

JavaScript has three ways to declare variables:

1. **var** - The old way (ES5)
2. **let** - Block-scoped variable (ES6+)
3. **const** - Block-scoped constant (ES6+)

### Using let

```javascript
let name = "John";
let age = 25;
console.log(name); // Output: John
```

### Using const

```javascript
const PI = 3.14159;
const API_KEY = "your-api-key";
```

> **Important**: Variables declared with `const` cannot be reassigned!

## Best Practices

- Use **descriptive names** that explain what the variable contains
- Use **camelCase** for variable names: `myVariableName`
- Use **UPPERCASE** for constants: `MAX_VALUE`
- Keep variable names **short but meaningful**

Ready to practice? Let\'s move on to the exercises!',
  'module-uuid',
  1,
  'https://www.youtube.com/watch?v=VIDEO_ID'
);
```
