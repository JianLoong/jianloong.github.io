# Reading Time Feature

The blog now supports both automatic and manual reading time calculation.

## How It Works

### Automatic Reading Time (Default)
If no `readingTime` is specified in the frontmatter, the system automatically calculates reading time based on the content:
- **List views**: Uses title + description
- **Individual posts**: Uses title + description
- **Reading speed**: 200 words per minute (configurable)

### Manual Reading Time
You can specify your own reading time in the frontmatter of any blog post:

```yaml
---
title: "Your Post Title"
author: Your Name
pubDatetime: 2025-06-28T20:56:02+11:00
slug: your-post
readingTime: 5  # Reading time in minutes
tags:
  - your tags
description: "Your post description"
---
```

## Examples

### Manual Reading Time
```yaml
readingTime: 8  # Shows "8 min read"
readingTime: 1  # Shows "1 min read"
readingTime: 0.5  # Shows "Less than 1 min read"
```

### Automatic Reading Time
If you don't specify `readingTime`, it will be calculated automatically based on content length.

## Where Reading Time Appears

- **Homepage**: On each post card
- **Posts listing page**: Next to each post
- **Archives page**: With each archived post
- **Individual post pages**: In the post header

## Configuration

You can adjust the default reading speed by modifying the `wordsPerMinute` parameter in `src/utils/readingTime.ts`:

```typescript
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  // ... existing code ...
}
```

## Benefits

- **Flexibility**: Choose between automatic and manual reading time
- **Accuracy**: Manual reading time accounts for complex content, code examples, diagrams
- **Consistency**: Maintains the same display format across all views
- **Performance**: No impact on build times 