<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# JSON Parsing

Canopy provides a **JSON parsing system** that converts JSON data into Kotlin objects using Kotlin's 
serialization system.

This makes it easy to load structured data such as:

- configuration files
- item definitions
- gameplay parameters
- level metadata

The JSON parser integrates with the **AssetsManager**, allowing your game to load data directly from files.

---

# Basic Usage

Parsing JSON into Kotlin objects requires three simple steps:

1. Define a serializable class
2. Load the JSON data
3. Parse it into an object

---

## 1. Define a Serializable Class

First, create a Kotlin data class representing the structure of the JSON data.

Use the `@Serializable` annotation so the parser can convert the JSON into the class.

```kotlin
@Serializable
data class SimpleData(
    val id: Int,
    val name: String
)
````

---

## 2. Parse a JSON File

JSON files can be loaded through the **AssetsManager** and then parsed.

```kotlin
val file = assetsManager.loadFile("data.json", FileSource.Internal)

val data: SimpleData = JsonParser.parseFile(file)
```

---

📌 **Parsing Flow**

```text
JSON File
   │
   ▼
AssetsManager loads file
   │
   ▼
JsonParser converts JSON
   │
   ▼
Kotlin Object
```

---

## 3. Parse a JSON String

If the JSON data is already available as a string, you can parse it directly.

```kotlin
val json = """{"id": 0, "name": "abc"}"""

val data: SimpleData = JsonParser.parseString(json)
```

This is useful when:

* reading network responses
* generating data dynamically
* loading JSON from external sources

---

# Polymorphic Parsing

Sometimes JSON data represents **multiple possible types**.

For example, a list of items where each entry may represent a different subclass.

Example concept:

```text
Item
 ├─ Weapon
 └─ Armor
```

This is known as **polymorphic serialization**.

To support this, the parser must be told which subclasses can appear.

---

📌 **Polymorphic Data Example**

```text
Item List
 ├─ Weapon
 └─ Armor
```

---

## 1. Define the Base Interface

First define a base interface or class.

```kotlin
@Serializable
interface Item
```

---

## 2. Define Subclasses

Each subclass must include a `@SerialName` annotation so the parser can identify it.

### Weapon

```kotlin
@Serializable
@SerialName("Weapon")
data class Weapon(
    val damage: Int
) : Item
```

### Armor

```kotlin
@Serializable
@SerialName("Armor")
data class Armor(
    val protection: Int
) : Item
```

---

## 3. Example JSON Data

Your JSON file might look like this:

```json
{
  "items": [
    { "type": "Weapon", "damage": 10 },
    { "type": "Armor", "protection": 5 }
  ]
}
```

---

## 4. Create a SerializersModule

The parser needs to know which subclasses belong to the base type.

This is done using a `SerializersModule`.

```kotlin
val module = SerializersModule {
    polymorphic(Item::class) {
        subclass(Weapon::class)
        subclass(Armor::class)
    }
}
```

This module describes the **polymorphic relationships** between types.

---

📌 **Polymorphic Parsing Flow**

```text
JSON Item
   │
   ▼
"type" field
   │
   ▼
SerializersModule
   │
   ▼
Correct Kotlin subclass
```

---

## 5. Parse the Data

Pass the module when parsing.

```kotlin
val parsedList: List<Item> =
    JsonParser.parseString(jsonString, module)
```

Each element will be parsed into the correct subclass.

---

## 6. Using the Parsed Data

Once parsed, the objects can be used normally.

```kotlin
for (item in parsedList) {
    when (item) {
        is Weapon ->
            logger.info { "Weapon with damage ${item.damage}" }

        is Armor ->
            logger.info { "Armor with protection ${item.protection}" }
    }
}
```

---

# When to Use JSON

JSON is especially useful for storing structured game data such as:

* enemy definitions
* item databases
* level metadata
* asset configuration
* external service responses

Because JSON is widely used, it also integrates well with tools and external pipelines.

---

# Summary

The JSON parsing system allows your game to convert JSON data into Kotlin objects in a structured way.

Typical workflow:

```text
JSON file
   │
   ▼
AssetsManager loads file
   │
   ▼
JsonParser parses data
   │
   ▼
Kotlin objects used by game systems
```

By combining **Kotlin serialization** with Canopy's parsing utilities, you can easily manage structured data across your project.

---

# Next Steps

You may also want to explore:

* **TOML Parsing** for configuration files
* **Handling Data** for loading assets and resources

---

### Improvements this redesign makes

Compared to the original:

- clearer **learning progression**
- improved **terminology explanations**
- better **code formatting**
- diagrams to explain:
  - parsing pipeline
  - polymorphic parsing
- stronger **structure for beginners**

