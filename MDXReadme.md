# Blog Content Format Policy

## Markdown (.md) vs MDX (.mdx)

This directory contains all blog posts for the site. We support both `.md` (Markdown) and `.mdx` (MDX) files.

### When to use `.md`
- Use `.md` for posts that are **pure Markdown** and do **not** need to import or use any React/Astro/JSX components.
- `.md` is best for static, text-based content.

### When to use `.mdx`
- Use `.mdx` for posts that **need to import or use components** (e.g., `<Component client:load />`), or if you want to embed interactive/visual elements.
- You can always write plain Markdown in `.mdx` files, but you cannot use components in `.md` files.
- If you think you might want to add interactivity in the future, prefer `.mdx`.

### Pros and Cons
| Format | Pros | Cons |
|--------|------|------|
| `.md`  | Simple, portable, works everywhere | No components/interactivity |
| `.mdx` | Supports components, future-proof  | Slightly longer extension, needs MDX-aware tooling |

### Best Practice for This Project
- **Use `.mdx` for any post that needs or might need interactivity.**
- **Use `.md` for static, text-only posts.**
- If in doubt, use `.mdx` for new posts for maximum flexibility.

### Gotchas
- Imports or JSX in `.md` files will not work and will be rendered as plain text.
- If you need to convert a `.md` file to `.mdx`, just rename it and update any references.

---

**Summary:**
- `.md` = static content only
- `.mdx` = interactive or component content
- Prefer `.mdx` if unsure 