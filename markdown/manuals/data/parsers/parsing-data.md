<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Parsing Data

Canopy provides a flexible system for **loading structured data from external files** using parsers.

Instead of hardcoding values directly into the game, data can be stored in files such as **JSON** or **TOML**, then parsed into Kotlin objects at runtime.

This approach allows you to:

- separate **data from code**
- configure gameplay systems more easily
- tweak parameters without recompiling
- define structured game content

Parsers are commonly used for:

- game configuration
- item or enemy definitions
- gameplay parameters
- level configuration
- narrative or dialogue data

---

# How Parsing Works

Parsers are part of Canopy's **data loading pipeline**.  
They work together with the **AssetsManager** to convert files into usable Kotlin objects.

📌 **Data Loading Flow**

```text
Game code
   │
   ▼
AssetsManager
   │
   ▼
File Source (Internal, Local, etc.)
   │
   ▼
Parser (JSON / TOML)
   │
   ▼
Kotlin Data Objects
````

Example:

```kotlin
val config = manager<AssetsManager>()
    .load("config/gameplay.toml", TomlParser)
```

The parser reads the file and converts it into structured data that your game can use.

---

# Supported Parsers

Canopy currently includes built-in parsers for the following formats.

| Format   | Best used for                                         |
| -------- | ----------------------------------------------------- |
| **JSON** | structured game data, large data sets, asset metadata |
| **TOML** | configuration files and human-readable settings       |

Each parser converts external data files into objects that your systems can consume.

---

# Choosing a Format

Both formats are useful depending on the type of data you want to store.

## JSON

JSON is widely used for **structured data** and is ideal for large or nested data definitions.

Example:

```json
{
  "enemy": "goblin",
  "health": 30,
  "speed": 2.5
}
```

Common use cases:

* item databases
* enemy definitions
* level metadata
* external APIs

---

## TOML

TOML is designed to be **easy for humans to read and edit**, making it ideal for configuration files.

Example:

```toml
enemy = "goblin"
health = 30
speed = 2.5
```

Common use cases:

* gameplay configuration
* tuning parameters
* project settings

---

# Available Guides

The following guides explain how to use each parser in detail.

* [JSON Parsing](./json/)
* [TOML Parsing](./toml/)

Each guide demonstrates how to:

* load files using the **AssetsManager**
* parse structured data
* map parsed values into Kotlin objects

---

# When to Use Parsers

Use parsers whenever your game needs **data stored outside the codebase**.

Typical examples include:

* enemy stats
* weapon databases
* game balancing values
* environment configuration
* narrative scripts

Keeping data external makes your project easier to maintain and modify as it grows.

---

# Next Steps

Choose the format that best fits your data:

* Continue with **[JSON Parsing](./json/)**
* Continue with **[TOML Parsing](./toml/)**
