import { describe, it, expect } from "vitest";
import { parseBuildInPublicMarkdown } from "./buildInPublic";

describe("parseBuildInPublicMarkdown", () => {
  it("parses frontmatter, bullets, and timeline icons", () => {
    const md = `---
updated: 2026-01-01
hero_title: Custom hero
---

Intro line one.

## Today shipped

- Alpha
- Beta

## Next up

- One
- Two

## Timeline

### First
icon: wrench
Detail one.

### Second
icon: rocket
Detail two.
`;
    const p = parseBuildInPublicMarkdown(md);
    expect(p.updated).toBe("2026-01-01");
    expect(p.heroTitle).toBe("Custom hero");
    expect(p.intro).toContain("Intro line one.");
    expect(p.todayShipped).toEqual(["Alpha", "Beta"]);
    expect(p.nextUp).toEqual(["One", "Two"]);
    expect(p.timeline).toHaveLength(2);
    expect(p.timeline[0]).toMatchObject({
      title: "First",
      detail: "Detail one.",
      icon: "wrench",
    });
    expect(p.timeline[1]).toMatchObject({
      title: "Second",
      detail: "Detail two.",
      icon: "rocket",
    });
  });

  it("falls back when sections missing", () => {
    const p = parseBuildInPublicMarkdown("Just intro.\n\n## Today shipped\n\n");
    expect(p.todayShipped).toEqual([]);
    expect(p.timeline).toEqual([]);
  });
});
