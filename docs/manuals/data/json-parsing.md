<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/README.md">
    <img src="/docs/assets/canopy-icon.png" width=50" alt="Canopy Engine logo">
  </a>
    <span style="text-align: center; font-size: 1.5em; font-weight: bold;"> JSON Parsing </span>
</p>

---
# Json Parsing

**The **JSON parsing system** is a powerful tool for parsing JSON data into Kotlin objects, and it's designed to be simple and easy to use.**

---

## Simple usage

### 1. Define a  **@Serializable class**

```kotlin
@Serializable
data class SimpleData(val id : Int, val name : String)
```

### 2. Parse file

```kotlin
val file = assetsManager.loadFile("data.json", FileSource.Internal)

val data : SimpleData = JsonParser.parseFile(file)
```

### 3. Parse string

```kotlin
val string = """{"id": 0, "name": "abc"}"""

val data : SimpleData = JsonParser.parseString(string)
```

---

# Polymorphic class

Let’s suppose you have an **Item** class:

```kotlin
@Serializable
interface Item
```

And it has many multiple implementations, such as weapon items and armor items. This is called 
[polymorphism](https://en.wikipedia.org/wiki/Polymorphism_(programming)). In order to be able to dynamically parse these 
items, we need to tell the parser about this polymorphism. We do it like this:

### 1. Define the subclasses with a **@SerialName** annotation, so the parser can identify them:

##### Weapon

```kotlin
@Serializable
@SerialName("Weapon") // NEEDED
data class Weapon(val damage : Int) : Item
```

##### Armor

```kotlin
@Serializable
@SerialName("Armor") // NEEDED
data class Armor(val protection : Int) : Item
```

### 2. Let's say in your JSON file you have something like this:

```json
{"items": [
  {"type": "Weapon", "damage": "10"},
  {"type": "Armor", "protection": "5"}
]}
```

### 3. Tell the parser this is a polymorphic parsing

In order to tell the parser that this is a polymorphic parsing, we need to create a **SerializersModule**. This is basically 
a module that tells the parser about the polymorphic classes and their subclasses, like so:

```kotlin
val module = SerializersModule {
    polymorphic(Item::class) {
        subclass(Weapon::class)
        subclass(Armor::class)
    }
}
```

### 4.  Pass module into parsing functions

```kotlin
 val parsedList : List<Item> = JsonParser.parseString(jsonString, module)
```

Now you'll have a list of parsed items, each one as the correct subclass, so you can do things like this:

```kotlin
for (item in parsedList) {
    when (item) {
        is Weapon -> logger.info{"Weapon with damage ${item.damage}"}
        is Armor -> logger.info{"Armor with protection ${item.protection}"}
    }
}
```

---
Canopy 2026