<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Getting started

Canopy helps you build a game from small pieces. A **node** represents something
in your game, such as a rabbit. You give it rules, keep track of changing values
and decide what the player sees.

The current release runs in a terminal: text, buttons and typed commands.
It can also run without a visible interface, which is useful for simulations
and automated checks. A graphical desktop game is future work.

## Start with something you can see

1. [Install and run the starter](installation.md). You do not need to build the engine yourself.
2. [Try your first project](first-project.md). Press a button, enter a command and change a label.
3. [Understand the pieces](../guides/understanding-canopy.md). Follow a rabbit from creation to removal.

These guides explain Canopy as you use it. You will edit a little Kotlin code;
you do not need to know how compilers or engine internals work first.

## The first three ideas

**Nodes are the things in your game.** A world node can contain rabbits, foxes
and a status panel. Grouping them makes it easier to manage the world together.

**Behaviors are what those things do.** A rabbit might lose energy over time
or move when the player presses a key.

**Signals are values that tell other parts of the game when they change.**
A population signal can keep a label up to date after a rabbit is added.

Learn these through the starter before looking up the other systems. When you
need saving, assets or more detailed update rules, the
[documentation index](/markdown/index.md) will point you to them.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
