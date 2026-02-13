<p align="left">
  <a href="https://github.com/canopyengine/canopy">
    <img src="../../assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>

<img src="https://fontawesome.com/icons/arrow-left?f=classic&s=solid"/>ccz
</p>


Every level, character, object, UI, menu, and even text can be described as a Scene. Think of it as a container for a part
of your game.

Equivalent to:
* **_Unity and Unreal_**: levels/prefabs
* **_Godot_**: scenes

A scene is made of a number of components is a **tree-hierarchy**, so you can have **children-parent** relations between
them. These components are called **Nodes**!

Equivalent to:
* **_Unity_**: GameObjects with Components
* **_Unreal_**: Actors/Components hierarchy
* **_Godot_**: nodes

Each node has its own purpose, so you can have:

* **Animation** nodes - for managing and playing animations 🎞️
* **Physics** nodes - for handling things like collisions, area detections, or even ray-casts 💥
* **Visual** nodes - for displaying things like sprites
* **Much more**!
* Even you can create **custom nodes** if need be!

You can then weave them together to create your game, and even reuse them across different scenes!
