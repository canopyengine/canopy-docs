!!!DRAFT!!!

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