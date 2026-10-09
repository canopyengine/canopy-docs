# Documentation guidelines

Document public engine classes, methods, properties, and signals using KDoc.
Explain observable behavior, units, ownership, lifecycle, and threading where
relevant. Use `Node.kt` as a reference for section comments and class structure;
small classes do not need empty sections. Explain non-obvious invariants instead
of narrating each statement.

When scripting APIs change, update the relevant reference or manual in
canopy-docs and link the companion change in the engine PR. Examples must use the
current API and enabled platform modules. State verification limits honestly.

Before review, check changed Markdown links and anchors, code examples against
source declarations, and formatting. Documentation-only changes do not require
new unit tests. Preserve existing guidance unless the change explicitly updates it.

## Current engine baseline

This guidance targets 0.1.0-alpha.1: JDK 25, Kotlin 2.4.10 and the Gradle 9.8.0
wrapper. Desktop is excluded; terminal and headless are enabled. See the
[current architecture](../engine-details/engine-architecture.md) and
[snapshot notes](../misc/releases/0.1.0.md).

## Preserve Canopy's documentation style

Update facts and examples in place. Keep the Canopy logos, meaningful badges,
callouts, diagrams, tables, reading paths and explanatory sections that give
these documents their identity. A version refresh should not turn a teaching
manual into a minimal API sheet.

Retain useful conceptual examples and the author's voice. Label proposed or
historical features clearly, and repair stale API details without discarding the
surrounding explanation. Remove material only when it is misleading, obsolete
or redundant; broad condensation needs an explicit request.

## Write for people learning Canopy

The main guides serve readers with basic Kotlin knowledge and readers learning
to code. Experienced game developers should also have a direct path to precise
API and architecture references.

- Begin with what the reader can do and what they should see. Show a small
  useful example before explaining the machinery behind it.
- Introduce one idea at a time. Explain terms such as callback, signal and
  ownership when first used; do not assume engine or compiler experience.
- Give steps in the order a reader can follow them. Include Windows commands
  when they differ, expected results and a practical next step.
- Explain why a choice matters with a game example. Prefer “the label updates
  when the population changes” to “reactive binding invalidation.”
- Keep the beginner path separate from exact contracts, migration notes and
  contributor instructions. Link those details in a clearly named reference;
  preserve their accuracy and make them easy for experienced readers to find.
- Do not replace a difficult explanation with an inaccurate promise. State
  limits plainly, and show where to read the fuller rule.
- Use tables to compare choices and diagrams to explain relationships. Avoid
  repeating generic sections that do not help the reader do something.

Review a guide by asking: can a reader follow it, recognize success and make one
small change without reading the engine source first?
