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
