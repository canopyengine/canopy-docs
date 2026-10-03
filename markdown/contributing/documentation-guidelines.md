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

This guidance targets 0.1.0-dev2: JDK 25, Kotlin 2.4.10 and the Gradle 9.8.0
wrapper. Desktop is excluded; terminal and headless are enabled. See the
[current architecture](../engine-details/engine-architecture.md) and
[snapshot notes](../misc/releases/0.1.0.md).
