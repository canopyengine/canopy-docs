<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Manager overview

Managers are **globally accessible services** that live outside the scene tree.
They coordinate shared work such as scene navigation or file access while nodes
and behaviors hold the structure and logic of the active scene.

---

# Mental Model

Managers live at the **application level**, above the scene tree.

```text
Application
   │
   ├─ Managers
   │   ├─ SceneManager
   │   ├─ AssetsManager
   │   └─ SaveManager
   │
   ▼
Scene Tree
   ├─ Nodes
   ├─ Behaviors
   └─ Tree Systems
```

📌 **Diagram — Engine Architecture**

<!-- DIAGRAM: managers-architecture -->

Managers coordinate services used across the engine while the **scene tree handles gameplay structure**.


AssetsManager is platform-provided; SaveManager is registered by the application.
The diagram shows possible services, not services every host installs automatically.

---

# Working with the Current API

Managers are global services outside the node tree. See the
[manager and injection reference](managers/managers.md) for current APIs,
lookup behavior and lifecycle rules.

App registers SceneManager, ScreenManager and InjectionManager. TerminalApp
also supplies input and assets managers. SaveManager is application-configured;
it is not installed automatically. HeadlessApp does not supply the terminal
filesystem asset or keyboard manager.


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
