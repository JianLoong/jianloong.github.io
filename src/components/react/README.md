# React Components for Astro Islands

This directory contains React components that are used as Astro islands for interactive functionality.

## Components

### AfinnSentimentIsland
- **Purpose**: Real-time sentiment analysis using AFINN lexicon
- **Features**: Fetches Reddit data, analyzes sentiment, displays results
- **Usage**: `client:load` directive in MDX

### VaderSentimentIsland  
- **Purpose**: VADER sentiment analysis for social media text
- **Features**: Interactive text input, real-time sentiment scoring
- **Usage**: `client:load` directive in MDX

### InteractiveDemo
- **Purpose**: Generic interactive demo component
- **Features**: Configurable demo with different types
- **Usage**: `client:load` directive in MDX

## Import Examples

```tsx
// Individual imports
import AfinnSentimentIsland from '../../../components/react/AfinnSentimentIsland.tsx';

// Or using the index file
import { AfinnSentimentIsland } from '../../../components/react';
```

## Usage in MDX

```mdx
---
import AfinnSentimentIsland from '../../../components/react/AfinnSentimentIsland.tsx';
---

<AfinnSentimentIsland client:load />
```

## Development Notes

- All components use TypeScript
- Components are designed to work with Astro's island architecture
- Use `client:load` directive for immediate hydration
- Components are self-contained with their own state management 