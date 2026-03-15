<p align="center">
  <a href="https://github.com/canopyengine/canopy">
    <img src="markdown/assets/canopy-logo-no-bg.png" width="350" alt="Canopy Engine logo">
  </a>
</p>

# Contributing to Canopy

Canopy is an open-source project and contributions are welcome.

Whether you are fixing bugs, improving documentation, or implementing new features, this guide explains how to contribute 
in a way that keeps the codebase **consistent, maintainable, and easy to understand**.

## Table of contents

- [Ways to Contribute](#ways-to-contribute)
- [Repository Structure](#repository-structure)
- [Coding Guidelines](#coding-guidelines)
- [Logging Guidelines](#logging-guidelines)
- [Testing](#testing)

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

The engine repository is organized into several modules. Each module is responsible for a crucial part of the engine, and it's
the current communication of all the modules that make it work. Below are some modules and their responsibilities:

| Module | Responsibility                                                   |
|--------|------------------------------------------------------------------|
| core   | node system, signals and events, managers...                     |
| data   | asset loading, data parsing and serialization, saving and loading | 
| input  | input assignment, handling                                |  


> [!NOTE]
> All engine modules are inside the root ``engine`` folder.

Understanding the repository structure helps contributors navigate the codebase more easily.

---

# Development Environment

To work on the engine locally you will need:

* **JDK 25**
* **Gradle**
* **Kotlin**
* **An IDE** - IntelliJ is recommended, but you can use others such as VSCode.

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

> [!IMPORTANT]
> Always ensure the project builds successfully before submitting changes.

---

# Coding Guidelines

The Canopy codebase follows several general principles. You can check them here:

[Coding Style Guidelines](markdown/contributing/code-style-guidelines.md)

---

# Logging Guidelines

All engine subsystems must use the **Canopy logging system**.

See:

* **Logging System**
* **[Logging Best Practices](logging-guidelines.md)**

Important rules:

* use the correct log level
* avoid logging in hot loops
* never use `println`
* keep logs under the `canopy.engine.*` namespace

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

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>