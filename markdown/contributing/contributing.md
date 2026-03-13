<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

# Contributing to Canopy

Canopy is an open-source project and contributions are welcome.

Whether you are fixing bugs, improving documentation, or implementing new features, this guide explains how to contribute in a way that keeps the codebase **consistent, maintainable, and easy to understand**.

---

# Ways to Contribute

There are many ways to contribute to the project.

Examples include:

* fixing bugs
* improving documentation
* adding tests
* implementing new engine features
* improving performance
* reporting issues

Documentation improvements are just as valuable as code contributions.

---

# Repository Structure

The repository is organized into several modules.

Example layout:

```text id="9d6t1v"
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
```

### Folder overview

| Folder    | Purpose                                    |
| --------- | ------------------------------------------ |
| `engine/` | core engine systems                        |
| `app/`    | runtime launchers and application backends |
| `demos/`  | example projects and demonstrations        |
| `docs/`   | engine documentation                       |

Understanding the repository structure helps contributors navigate the codebase more easily.

---

# Development Environment

To work on the engine locally you will need:

* **JDK 21**
* **Gradle**
* **Kotlin**

Clone the repository:

```bash id="2fxd1y"
git clone https://github.com/canopyengine/canopy
```

Build the project:

```bash id="kt64jv"
./gradlew build
```

Run the test suite:

```bash id="zsbvnh"
./gradlew test
```

Always ensure the project builds successfully before submitting changes.

---

# Coding Guidelines

The Canopy codebase follows several general principles.

### Prefer clarity

Code should be easy to read and reason about.
Avoid unnecessary abstractions or overly complex implementations.

---

### Follow existing patterns

Before introducing a new system:

* explore existing modules
* follow established architectural patterns
* avoid introducing inconsistent design choices

Consistency across the engine is more important than clever solutions.

---

### Document public APIs

Public engine APIs should include documentation comments.

Example:

```kotlin id="ewm6fe"
/**
 * Replaces the current scene with the given root node.
 */
fun asSceneRoot()
```

Clear documentation ensures that engine behavior remains understandable to users and contributors.

---

# Logging Guidelines

All engine subsystems must use the **Canopy logging system**.

See:

* **Logging System**
* **Logging Best Practices**

Important rules:

* use the correct log level
* avoid logging in hot loops
* never use `println`
* keep logs under the `canopy.*` namespace

---

# Testing

Whenever possible, new functionality should include tests.

Tests help ensure:

* engine stability
* regression prevention
* predictable behavior

Run the test suite before submitting a pull request:

```bash id="9k8l2a"
./gradlew test
```

---

# Submitting Changes

Before opening a pull request:

1. Ensure the project builds successfully.
2. Run the full test suite.
3. Verify that your changes follow the coding guidelines.
4. Update documentation if necessary.

When opening a **Pull Request**, clearly explain:

* what the change does
* why it is needed
* any potential side effects

Clear explanations make the review process much easier.

---

# Reporting Issues

If you encounter a bug, please open an issue on GitHub.

Include as much information as possible:

* engine version
* operating system
* steps to reproduce the issue
* relevant logs (if available)

Providing detailed reports helps maintainers diagnose problems more quickly.

---

# Design Principles

When contributing to Canopy, keep the following principles in mind:

* prioritize **clarity over cleverness**
* prefer **simple and predictable systems**
* keep engine code **modular**
* avoid exposing internal implementation details through public APIs

The goal is to keep Canopy easy to reason about for both **engine contributors** and **engine users**.

---

# Thank You

Every contribution helps improve the engine.

Whether you fix a typo, report a bug, or implement a new feature, your work helps make Canopy better for everyone.
