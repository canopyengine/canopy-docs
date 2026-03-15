<p align="center">
  <a href="https://github.com/canopyengine/canopy">
    <img src="/markdown/assets/canopy-logo-no-bg.png" width="350" alt="Canopy Engine logo">
  </a>
</p>

# Contributing to Canopy
Canopy is an open-source project and contributions are welcome.

Whether you are fixing bugs, improving documentation, or implementing new features, this guide explains how to contribute 
in a way that keeps the codebase **consistent, maintainable, and easy to understand**.

<!-- TOC -->
* [Contributing to Canopy](#contributing-to-canopy)
* [Ways to Contribute](#ways-to-contribute)
* [Repository Structure](#repository-structure)
* [Development Environment](#development-environment)
* [Submitting Changes](#submitting-changes)
* [Reporting Issues](#reporting-issues)
* [Design Principles](#design-principles)
* [What's Next?](#whats-next)
* [Thank You](#thank-you)
<!-- TOC -->

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

There are multiple important locations in the engine repository, and you should familiarize yourself with them

* **engine** - where all the modules are located
* **docs** - you can find documents related to the roadmap and release-specific changelogs
* **gradle/libs.version.toml** - libraries and plugin definitions

**Modular organization**

The engine repository is organized into several modules. Each module is responsible for a crucial part of the engine, and it's
the communication between all of them that make the engine work. Below are some modules and their responsibilities:

| Module | Responsibility                                                    |
|--------|-------------------------------------------------------------------|
| core   | node system, signals and events, managers...                      |
| data   | asset loading, data parsing and serialization, saving and loading | 
| input  | input assignment, handling                                        |  

Understanding the repository structure helps contributors navigate the codebase more easily.

> [!NOTE]
> You can check each module description in the [Engine Architecture] page.

---

# Development Environment

To work on the engine locally you will need:

* **JDK 21**
* **Gradle**
* **Kotlin**
* **An IDE** - IntelliJ is recommended, but you can whichever you prefer.

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

> [!CAUTION]
> Always ensure the project builds successfully before submitting changes.

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

> [!IMPORTANT]
> For specifics on bug reporting, feature proposals and contributing to pull requests, check the engine's [Contributor Guidelines](https://github.com/canopyengine/canopy/blob/main/CONTRIBUTING.md) page

---

# Design Principles

When contributing to Canopy, keep the following principles in mind:

* prioritize **clarity over cleverness**
* prefer **simple and predictable systems**
* keep engine code **modular**
* avoid exposing internal implementation details through public APIs

The goal is to keep Canopy easy to reason about for both **engine contributors** and **engine users**.

---

# What's Next?

Now that you have set the development environment up and read some of the guidelines, you can start collaborating on Canopy!

We recommend you check the following pages for more information about specific contribution topics:

| Section            | Description                                     |
|--------------------|-------------------------------------------------|
| Code Style Guidelines | Guidelines on how you should structure your code|
| Logging Guidelines | Guidelines on how you should organize your logs |
| Testing Guidelines | Guidelines on unit testing                      |
| Project Guidelines | General guidelines on other important topics    |

---

# Thank You

Every contribution helps improve the engine.

Whether you fix a typo, report a bug, or implement a new feature, your work helps make Canopy better for everyone.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>