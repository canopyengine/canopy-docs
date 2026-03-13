<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

# Engine Details

The **Engine Details** section documents the **internal architecture of Canopy**.

While the **Manuals** focus on **how to use the engine**, this section explains **how the engine itself is implemented**.

These pages are primarily intended for:

* contributors to the Canopy engine
* developers exploring the internal architecture
* users debugging advanced engine behavior
* anyone interested in the engine's design

If your goal is to **build a game with Canopy**, you typically do **not** need to read this section.

Instead, start with the **Manuals**.

---

# What This Section Contains

Engine Details documents the internal systems that power the engine.

Topics may include:

* internal engine subsystems
* architectural design decisions
* runtime infrastructure
* diagnostics and logging
* contributor guidelines

Example topics:

```text id="av8q4u"
Logging System
Engine Diagnostics
Runtime Infrastructure
```

These pages describe **how internal systems are structured and why they were designed that way**.

---

# Relationship with the Manuals

The documentation is split into two main perspectives.

| Section            | Focus                          |
| ------------------ | ------------------------------ |
| **Manuals**        | how to build games with Canopy |
| **Engine Details** | how the engine is implemented  |

```text id="v5h4dp"
Manuals
   │
   ▼
Using the Engine

Engine Details
   │
   ▼
Building the Engine
```

Most users only need the **Manuals**.

---

# Design Philosophy

Canopy’s internal architecture follows several guiding principles.

### Modularity

Engine subsystems should remain **well separated** so that they can evolve independently.

---

### Predictability

Engine behavior should be **deterministic and understandable**, avoiding hidden or implicit behavior whenever possible.

---

### Clear Boundaries

Engine internals should remain **well isolated from user applications**.

Public APIs should expose clear and stable abstractions without leaking implementation details.

---

### Developer Control

Applications built with Canopy should always retain **full control over their runtime behavior**.

The engine should support developers without restricting architectural choices.

---

# Contributing to Canopy

If you plan to contribute to the engine, please follow these guidelines.

---

## Code Quality

Engine code should be:

* readable
* well structured
* documented where necessary
* consistent with the existing codebase

Avoid introducing unnecessary complexity or implicit behavior.

---

## Logging and Diagnostics

All internal subsystems should use the **structured logging system**.

Relevant pages:

```text id="6m3d7g"
Logging System
Logging Best Practices
```

Guidelines include:

* use appropriate log levels
* avoid excessive log output
* keep engine logs separate from user logs

---

## Stability and Developer Experience

Changes to the engine should prioritize:

* predictable behavior
* clear error messages
* minimal surprises for developers

When introducing new systems:

* document the feature
* ensure it integrates with existing architecture
* avoid exposing internal implementation details unnecessarily

---

# Suggested Reading Order

For developers exploring the engine internals, the recommended starting point is:

```text id="3v81rd"
Logging System
   ↓
Logging Best Practices
   ↓
Other Engine Subsystems
```

These pages explain how core infrastructure within the engine is organized.

---

# Development Status

> [!WARNING]
> Canopy is currently under active development.
> Internal systems may change between releases.

Because this section documents **engine internals**, its contents may evolve faster than the rest of the documentation.

---

# Summary

The **Engine Details** section documents the internal systems that power Canopy.

These pages are intended for developers who want to:

* contribute to the engine
* understand its architecture
* explore advanced implementation details

For normal game development, refer to the **Manuals** instead.
