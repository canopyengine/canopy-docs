<p align="center">
  <a href="https://github.com/canopyengine/canopy">
    <img src="markdown/assets/canopy-logo-no-bg.png" width="350" alt="Canopy Engine logo">
  </a>
</p>

# GitHub guidelines
The following section provides guidelines regarding GitHub, such as issues and branches.

## Correctly Scope Your Issues

As discussed in the [Contributor Guidelines](https://github.com/canopyengine/canopy/blob/main/CONTRIBUTING.md), issues, 
branches, and pull requests should remain **focused and scoped to a single problem**.

Keeping changes small and focused improves review quality, reduces merge conflicts, and makes project history easier to 
understand.

**Issues**

Each issue should address **one clearly defined topic**.

Guidelines:

* Do not combine unrelated problems in one issue.
* If multiple problems exist, create separate issues.
* Use the issue description to provide context, examples, and expected behavior.

Good examples:

```
Bug: Crash when configuration file is missing
Feat: Add configuration validation
Docs: Clarify installation instructions
```

Avoid:

```
Bug: Multiple problems with configuration and CLI behavior
```

**Branches**

Each branch should correspond to **a single issue or task**.

Guidelines:

* A branch should aim to resolve one issue.
* Avoid implementing multiple unrelated changes in the same branch.
* If additional work appears during development, open a new issue and branch.

Good examples:

```
feat/add-config-validation
bug/fix-null-config-crash
```

Avoid:

```
feat/config-validation-and-cli-refactor
```

## Pull Requests

Each pull request should solve **one problem**.

Guidelines:

* Keep pull requests focused and reasonably small.
* Ensure the PR description clearly explains the change.
* Link the related issue when applicable.
* Avoid bundling unrelated fixes or features into a single PR.

Good examples:

```
Add configuration validation
```

Avoid:

```
Add validation + Refactor CLI + Update documentation
```

Small, focused pull requests are easier to review and merge.

> [!NOTE]
> A single pull request can solve multiple issues, if all of them refer to a single overarching problem.

---

## Branch Workflow

Contributors should create a dedicated branch for each issue or task.

### Guidelines

* Branch from the latest `main`
* Use one branch per issue
* Keep branches focused on a single change
* Open a new branch for unrelated work
* Keep your branch up to date with `main` before opening or updating a pull request

### Recommended flow

```text
main
 └─ feat/add-config-validation
 └─ bug/fix-null-config-crash
 └─ docs/update-installation-guide
```

Typical workflow:

```text
issue → branch → commit → pull request → review → merge
```

Example:

```text
Feat: Add configuration validation
      │
      ▼
feat/add-configuration-validation
      │
      ▼
Add configuration validation <-- PR (don't add issue types to the PR name)
```

### Notes

* Do not develop directly on `main`
* Do not reuse the same branch for multiple unrelated changes
* If the scope grows, split the work into separate issues and branches

---

## Code Review Expectations

Code review helps maintain correctness, consistency, and long-term maintainability.

### For pull request authors

* Keep pull requests small and focused
* Clearly describe the purpose of the change
* Link the related issue when applicable
* Add or update tests when behavior changes
* Respond to review feedback constructively
* Update the pull request if requested changes are needed

### For reviewers

* Review for correctness, readability, maintainability, and scope
* Keep feedback clear, respectful, and actionable
* Prefer specific suggestions over broad comments
* Distinguish required changes from optional suggestions
* Approve only when the change is ready to merge

### Review principles

* Focus on the code, not the person
* Prefer small pull requests that are easy to review
* Unrelated changes may be asked to move into a separate pull request
* Discussion is encouraged, but decisions should converge toward a clear outcome

### Goal

The goal of review is not only to catch problems, but also to keep the codebase understandable and consistent over time.

---

## Naming conventions
In order to keep coherence across the codebase, some rules are imposed regarding naming conventions.

### Issue naming
When naming issues you should use prefixes separated by the issue description, following the format:
``<Type>: <Short description>``.

| Type         | Purpose                                       | Example                                           |
|--------------| --------------------------------------------- |---------------------------------------------------|
| **Bug**      | Report incorrect behavior or defects          | `Bug: Crash when config file is missing`          |
| **Feat**     | Request or track new functionality            | `Feat: Add dark mode support`                     |
| **Proposal** | Suggest a design change requiring discussion  | `Proposal: Introduce plugin architecture`         |
| **Docs**     | Documentation improvements or additions       | `Docs: Add installation instructions for Windows` |
| **Refactor** | Code restructuring without changing behavior  | `Refactor: Simplify configuration loader`         |
| **Test**     | Adding or improving tests                     | `Test: Add coverage for configuration parser`     |
| **Chore**    | Maintenance tasks (CI, dependencies, tooling) | `Chore: Update Kotlin version`                    |

**Audit fields**
When submitting an issue, you should fill the audit fields, which include:

* Labels
    * ``enhancement`` for approved features
    * ``bug`` for bugs
    * ``pull requests`` for PRs
    * ``proposal`` for feature proposals

> [!NOTE]
> You should also label your issues according to their respective module, using ``topic:<module>`` tags

* Project - always assign the issue to the respective project
* Milestone - always associate issues to milestones(proposals not included)
* Branches - always associate your issue to the respective branch

### Branch names
Similar to issues, branches should be named in accordance with their type

| Type         | Purpose                                        | Example                           |
| ------------ | ---------------------------------------------- | --------------------------------- |
| **bug**      | Fix a defect or incorrect behavior             | `bug/fix-null-config-crash`       |
| **feat**     | Implement a new feature                        | `feat/add-json-export`            |
| **proposal** | Work on a design proposal or experimental idea | `proposal/plugin-system-design`   |
| **docs**     | Documentation changes                          | `docs/update-installation-guide`  |
| **refactor** | Code restructuring without behavior changes    | `refactor/simplify-config-loader` |
| **test**     | Add or improve tests                           | `test/add-config-parser-tests`    |
| **chore**    | Maintenance tasks (dependencies, CI, tooling)  | `chore/update-kotlin-version`     |

## Pull Request names
When naming pull requests, don't use issue type prefixes and start them with uppercase.

When it resolves a single issue, simply remove the issue type tag

````text
Feat: Solve unsolvable problem --> Solve unsolvable problem
````

When it solves multiple issues, give it a descriptive name.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>