<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Engine Details

The **Engine Details** section documents the internal architecture of Canopy.

Unlike the manuals, which focus on **how to use the engine**, this section explains **how the engine itself works**.

These pages are primarily intended for:

- contributors to the Canopy engine
- developers interested in the internal architecture
- users debugging advanced engine behavior
- anyone curious about the engine's design decisions

If you are simply trying to build a game, you usually do **not** need to read this section.

Instead, start with the **Manuals**.

---

# What You Will Find Here

This section covers topics such as:

- internal engine subsystems
- architectural decisions
- implementation details
- internal tooling and infrastructure
- contributor guidelines

Examples include:

- the **logging system**
- engine diagnostics
- internal runtime infrastructure

---

# Philosophy of Engine Internals

Canopy aims to keep engine internals:

- **modular**
- **predictable**
- **backend-agnostic when possible**
- **well isolated from user applications**

Subsystems should be designed so that:

- engine functionality remains deterministic
- users retain full control over their own application behavior
- components can evolve without breaking the public API unnecessarily

---

# Contributing to Canopy

If you plan to contribute to the engine, please follow these guidelines.

### Code Quality

Engine code should be:

- readable
- well structured
- documented where necessary
- consistent with the existing codebase

Avoid introducing unnecessary complexity or hidden behavior.

---

### Logging and Diagnostics

All engine subsystems should use the **structured logging system**.

See:

```

Logging System
Logging Best Practices

````

Guidelines include:

- correct log levels
- avoiding log spam
- keeping engine logs isolated from user logs

---

### Stability and User Experience

Changes to the engine should prioritize:

- predictable behavior
- clear error messages
- minimal surprises for developers using the engine

When adding new systems:

- document them
- ensure they integrate cleanly with existing architecture
- avoid leaking internal implementation details into the public API

---

# Reading Order

If you are exploring the engine internals, the recommended order is:

```text
Logging System
   ↓
Logging Best Practices
   ↓
Other Engine Subsystems
````

These pages explain how core infrastructure inside the engine is structured.

---

# Warning

> [!WARNING]
> The engine is currently under active development.
> Internal systems may change between releases.

Because this section documents **internal implementation details**, it may evolve faster than the rest of the documentation.

---

# Summary

The **Engine Details** section exists to document how Canopy works internally.

These pages are intended for developers who want to:

* contribute to the engine
* understand its internal architecture
* explore advanced implementation details

For normal game development, refer to the **Manuals** instead.