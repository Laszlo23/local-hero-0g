# Build in Public changelog

The page **`/build-in-public`** reads from a single markdown file in the repo:

- **`src/content/build-in-public.md`**

Edit that file to publish what shipped today, what’s next, and timeline notes. Commit and deploy as usual — no code changes needed for daily updates.

## Format

### Optional frontmatter

```yaml
---
updated: YYYY-MM-DD
hero_title: Optional plain-text headline (replaces default hero)
---
```

### Body

1. **Intro** — Any paragraphs *before* the first `##` heading (shown under the hero).
2. **`## Today shipped`** — Bullet list (`- item`).
3. **`## Next up`** — Bullet list, or plain lines (numbered lines are stripped of `1.` / `1)` prefixes).
4. **`## Timeline`** — Repeat blocks:

```markdown
### Short title
icon: wrench
Paragraph body. Can be multiple lines.

### Another title
icon: rocket
More detail.
```

**Icons:** `wrench`, `rocket`, or `sparkles` (optional; defaults to sparkles).

## Tests

Parser unit tests live in **`src/lib/buildInPublic.test.ts`**.
