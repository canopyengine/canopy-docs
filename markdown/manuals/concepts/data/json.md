<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

# JSON

Canopy provides built-in support for working with **JSON data** through the `Json` helper.

JSON is widely used for:

* structured datasets
* item and enemy databases
* level metadata
* network communication
* external service integrations

The `Json` helper allows converting between **JSON data and Kotlin objects** using **kotlinx.serialization**.

---

# Quick Example

Example JSON file:

```json
{
  "id": 1,
  "name": "Goblin"
}
```

Kotlin data class:

```kotlin
@Serializable
data class EnemyData(
    val id: Int,
    val name: String
)
```

Parsing the file:

```kotlin
val file = assetsManager.loadFile("enemy/goblin.json", FileSource.Internal)

val enemy: EnemyData = Json.fromFile(file)
```

---

📌 **Diagram — JSON Parsing Flow**

<!-- DIAGRAM: json-parsing-flow -->

```
JSON File
   │
   ▼
AssetsManager loads file
   │
   ▼
Json parser converts data
   │
   ▼
Kotlin Object
```

---

# Parsing JSON

JSON data can be parsed either from **files** or **strings**.

### Parsing a file

```kotlin
val file = assetsManager.loadFile("enemy/goblin.json", FileSource.Internal)

val enemy = Json.fromFile<EnemyData>(file)
```

### Parsing a string

```kotlin
val json = """{"id":1,"name":"Goblin"}"""

val enemy = Json.fromString<EnemyData>(json)
```

This can be useful when handling:

* network responses
* dynamically generated JSON
* external data sources

---

# Serializing JSON

Objects can also be converted back into JSON.

### Serialize to string

```kotlin
val json = Json.toString(enemy)
```

Result:

```json
{
  "id": 1,
  "name": "Goblin"
}
```

### Serialize to file

```kotlin
Json.toFile(enemy, file)
```

This replaces the file contents with the serialized JSON.

---

# Raw JSON Access

Sometimes it is useful to inspect JSON without immediately converting it into a typed object.

The `rawParseFile` helper returns a **JsonObject**.

```kotlin
val jsonObject = Json.rawParseFile(file)
```

This allows:

* inspecting fields
* transforming data
* extracting partial information

Example:

```kotlin
val name = jsonObject["name"]?.jsonPrimitive?.content
```

---

# Working with JsonElement

When JSON data is already parsed, individual elements can be converted into Kotlin objects.

Example:

```kotlin
val element: JsonElement = ...
val data = Json.decodeJsonElement<EnemyData>(element)
```

Objects can also be converted back into JSON elements:

```kotlin
val element = Json.encodeJsonElement(enemy)
```

This is useful when working with **partial JSON trees**.

---

# Polymorphic JSON

JSON can represent multiple possible types using a **type discriminator**.

Example:

```
Item
 ├ Weapon
 └ Armor
```

JSON example:

```json
{
  "type": "Weapon",
  "damage": 10
}
```

During parsing, the `"type"` field determines which Kotlin subclass should be created.

Example serializers module:

```kotlin
val module = SerializersModule {
    polymorphic(Item::class) {
        subclass(Weapon::class)
        subclass(Armor::class)
    }
}
```

Parsing with the module:

```kotlin
val item = Json.fromString<Item>(jsonString, module)
```

---

# Default Configuration

The `Json` helper provides a default configuration designed for common engine workflows.

| Option                        | Behavior                 |
| ----------------------------- | ------------------------ |
| `classDiscriminator = "type"` | polymorphic type field   |
| `ignoreUnknownKeys = true`    | extra fields are ignored |
| `prettyPrint = true`          | formatted JSON output    |

These defaults can be overridden when creating the parser.

---

# When to Use JSON

JSON is well suited for **large structured datasets**.

Common uses include:

* enemy databases
* item definitions
* quest systems
* network messages
* external data integration

JSON is widely supported and easy to process with external tools.

---

# Summary

The `Json` helper allows converting between **JSON data and Kotlin objects**.

```text
JSON Data ↔ Json Helper ↔ Kotlin Object
```

This enables systems such as:

* content databases
* configuration loading
* network communication
* save data serialization

---

# Related Topics

* **Parsing and Serialization** — overview of data conversion
* **TOML** — working with TOML configuration files
* **Assets and Resources** — loading files with the AssetsManager
* **Saving and Loading** — implementing save systems
