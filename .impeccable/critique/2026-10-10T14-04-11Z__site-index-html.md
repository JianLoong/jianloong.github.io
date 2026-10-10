---
target: homepage (_site/index.html)
total_score: 27
max_score: 36
na_heuristics: 10
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\Jian\\Documents\\GitHub\\jianloong.github.io\\_site\\index.html"
target_fingerprint: "sha256:3fde279de8950cceddf4ad3b2e2f3aee60ab6125e2b2b48f1fa99862c84adf4c"
target_path: "C:\\Users\\Jian\\Documents\\GitHub\\jianloong.github.io\\_site\\index.html"
timestamp: 2026-10-10T14-04-11Z
slug: site-index-html
---
# Design Critique — Homepage (_site/index.html)

Method: dual-agent (A + B as isolated sub-agents). DEGRADED: Assessment B returned blocked — the read-only sandbox denied both the engine binary and browser tools. Detector and pixel evidence re-run in the parent. Assessment A had no browser either, so pixel evidence came from the parent.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | Theme toggle never shows its state |
| 2 | Match System / Real World | 4 | Plain first-person language |
| 3 | User Control and Freedom | 3 | Free navigation, skip link; no traps |
| 4 | Consistency and Standards | 4 | Code matches the recorded system |
| 5 | Error Prevention | 3 | No inputs or destructive actions |
| 6 | Recognition Rather Than Recall | 2 | Cards carry no at-rest affordance |
| 7 | Flexibility and Efficiency | 2 | Skip link and keyboard nav, no accelerators |
| 8 | Aesthetic and Minimalist | 4 | Every element earns its place |
| 9 | Error Recovery | 3 | Purpose-built 404; no homepage error surface |
| 10 | Help and Documentation | n/a | Nothing to document on a personal blog |
| Total | | 27/36 | Good (75%) |

Assessment A returned 23/32 with #7 and #10 n/a. I scored #7 rather than marking it n/a (a skip link is the accelerator that heuristic describes). Same rating band.

## Design Specificity Verdict

LLM (A): the visual language is genuinely this product's; the composition (hero, latest writing, selected work, footer) is the generic dev-blog IA and would survive unchanged on any site.

Deterministic scan (4 findings, exit 2, target _site/index.html):
- low-contrast: hover state 1.0:1 (need 4.5:1) — text #8c3b28 on #8c3b28
- hero-eyebrow-chip: eyebrow chip (tracked-caps) "Software engineer" above h1
- overused-font: Primary font: fraunces
- cream-palette: cream/beige page background rgb(244, 239, 230)

A missed the contrast failure: it checked palette values while the detector checked states. css/style.css:77 declares a:hover { color: var(--accent) } at specificity (0,1,1), beating .skip-link's color: var(--bg) at (0,1,0).

Two findings are false positives by the skill's own rule: overused-font and cream-palette are saturated-pattern warnings, and both are deliberate choices recorded in DESIGN.md.

No visual overlay: impeccable live-server --background hung rather than daemonising; Assessment B had no browser tools. Fallback: detector CLI plus parent-captured desktop (1280x820) and mobile (390x780) screenshots.

## Priority Issues

1. [P1] Skip link becomes invisible on hover — 1.0:1 contrast. Fix: scope the global hover rule or add .skip-link:hover { color: var(--bg) }. Command: /impeccable audit
2. [P1] Four of six projects unreachable from the homepage. Fix: add a /projects/ index or a "See all" link mirroring "All posts". Command: /impeccable shape
3. [P2] Cards have no at-rest affordance; on touch there is no hover at all. Fix: rest-state cue on the title. Command: /impeccable polish
4. [P2] Theme toggle communicates no state (constant glyph, static label, no aria-pressed). Fix: swap icon per mode, set aria-pressed. Command: /impeccable audit
5. [P2] The eyebrow "SOFTWARE ENGINEER" repeats the lede and matches the named AI-SaaS hero pattern. Fix: drop it or fold the role into the headline. Command: /impeccable typeset

## Persona Red Flags

Jordan (first-timer): poetic nameless h1; three social links are the most prominent actions.
Casey (distracted mobile): theme toggle 33.6px, under 44px and outside the thumb zone; nav and social links bare text; nothing on a card looks tappable.
Sam (screen reader / keyboard): theme toggle announces no pressed state; post-card link names become the entire card text.
Priya (project-specific, from PRODUCT.md): arrived from a repo README, finds 2 projects, no index, and cannot verify the "29 original repositories" claim.

## Minor Observations

- Page ends on (c) 2026 Jian with no contact path despite enquiries being success outcome #1.
- <title> is literally "Jian"; meta description is third-person against a first-person brand.
- --shadow is defined in both themes and used nowhere.
- Skip link works; only its hover state is broken.

## Questions to Consider

- If the "Field Manual" idea is the thesis, why is the structure indistinguishable from any dev blog?
- What would a confident version of this page do with the four hidden projects?
- Does the eyebrow add anything the lede's first six words don't?
- Should the footer be doing the enquiry work the About page carries alone?
