<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Contributing to Canopy

Canopy is an open-source project, and contributions are welcome.

Whether you are fixing bugs, improving documentation, or adding new features, this guide explains how to contribute to the engine in a way that keeps the codebase consistent and maintainable.

---

# Types of Contributions

You can contribute to Canopy in many ways.

Examples include:

- fixing bugs
- improving documentation
- adding tests
- implementing new engine features
- improving performance
- reporting issues

Documentation improvements are just as valuable as code contributions.

---

# Repository Structure

The repository is organized into several modules.

Example structure:

```text
canopy/
│
├─ engine/
│   ├─ core/
│   ├─ logging/
│   └─ utils/
│
├─ app/
│   ├─ app-desktop/
│   └─ app-terminal/
│
├─ demos/
│
└─ docs/
````

### Folder overview

| Folder    | Purpose                                    |
| --------- | ------------------------------------------ |
| `engine/` | core engine systems                        |
| `app/`    | runtime launchers and application backends |
| `demos/`  | example projects                           |
| `docs/`   | documentation                              |

---

# Development Environment

To contribute to the engine you will need:

* **JDK 21**
* **Gradle**
* **Kotlin**

Clone the repository:

```bash
git clone https://github.com/canopyengine/canopy
```

Build the project:

```bash
./gradlew build
```

Run tests:

```bash
./gradlew test
```

---

# Coding Guidelines

The engine codebase follows several conventions.

### Keep code readable

Prefer clear and simple implementations.

Avoid overly complex abstractions unless they are necessary.

---

### Follow existing patterns

Before implementing a new system:

* explore existing modules
* follow established patterns
* avoid introducing inconsistent design choices

Consistency across the engine is more important than clever implementations.

---

### Document public APIs

Public engine APIs should be documented clearly.

Example:

```kotlin
/**
 * Replaces the current scene with the given root node.
 */
fun asSceneRoot()
```

This ensures the documentation remains accurate.

---

# Logging Rules

All engine subsystems must use the **Canopy logging system**.

See:

* Logging System
* Logging Best Practices

Key rules:

* use the correct log level
* avoid logging in hot loops
* never use `println`
* keep logs under the `canopy.*` namespace

---

# Testing

Whenever possible, new features should include tests.

Tests help ensure:

* engine stability
* regression prevention
* consistent behavior

Run the test suite before submitting a pull request.

```bash
./gradlew test
```

---

# Submitting Changes

Before opening a pull request:

1. Ensure the project builds successfully.
2. Run the full test suite.
3. Verify your changes follow the coding guidelines.
4. Update documentation if necessary.

Then open a **Pull Request** describing:

* what the change does
* why it is needed
* any potential side effects

Clear explanations make reviews much easier.

---

# Reporting Issues

If you encounter a bug, please open an issue on GitHub.

Include:

* engine version
* operating system
* steps to reproduce the issue
* relevant logs (if available)

Providing detailed information makes it easier to diagnose problems.

---

# Design Philosophy

When contributing to Canopy, keep these principles in mind:

* prioritize **clarity over cleverness**
* prefer **simple, predictable systems**
* keep engine code **modular**
* avoid leaking internal implementation details into public APIs

The goal is to keep Canopy easy to reason about for both engine developers and users.

---

# Thank You

Every contribution helps improve the engine.

Whether you fix a typo, report a bug, or implement a new feature, your work helps make Canopy better for everyone.