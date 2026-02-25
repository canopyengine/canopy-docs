---
title: Saving Data
parent: Handling Data
nav_order: 1
permalink: /manuals/data/saving/
---

<p style="display: flex; align-items: center; gap: 10px;">
  <a href="{{ '/' | relative_url }}">
    <img src="{{ '/assets/canopy-icon.png' | relative_url }}" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Saving

## What’s the saving system

The saving system is responsible for handling saving and loading of player data. It’s a globally available manager and can be used to modularly save and load data based on its registered **modules**.

### What’s a save module?

The player save data is a .json file, comprised of many things, like: run info, player stats, inventory, etc. Instead of manually assigning these fields to the save manager, and it requesting data for each field, we use a modular design, based on **save modules.**

Each save module is comprised:

- Id - the field on the save file
- Serializer - used for serializing the data into that field
- OnSave - callback that returns data to be saved
- OnLoad - callback that gives access to loaded data

Now each component that needs to save and load data, registers a save module, like so:

```kotlin
init {
  registerSaveModule<ExampleData>(
    SaveModule(
      id = "bestiary",
      serializer = JsonParser.serializer(),
      onSave = { runtimeData },
      onLoad = { loadedData -> runtimeData = loadedData }
    )
  )
}
```

This automatically registers the module into the save manager.

### Saving data

On save, it will check each registered module, and fill the final JSON with each module info, in this case if this was the only registered module, the .json would look like this:

```json5
{
  /*<moduleId>: <moduleData>*/
  "bestiary": "<return value of 'onSave'>"
}
```

The data that will be filled on each module is the result of its onSave() method.

### Loading data

On load, the save manager loads the save file and fills it’s internal registry. It then calls each module’s **onLoad** method, passing the corresponding module data into it. Each component that registers a module must map this callback to its internal load method.

For example, the bestiary maps it like this:

```kotlin
init {
  registerSaveModule<ExampleData>(
    SaveModule(
      id = "bestiary",
      serializer = JsonParser.serializer(),
      onSave = { this.asData() }, // Custom extension method that maps runtime data to save data
      onLoad = ::loadData
    )
  )
}

fun loadData(data : ExampleData) {
  entries = registry.mapIds(data.entriesIds) // Custom method that maps save data to runtime data
}
```

The above example used an ID registry, you can check more about it [here](./id-registry.md).

> [!CAUTION]
> CRITICAL NOTE: Each module must have its unique ID, or there can be overwriting of data.

### Saving by slots

The system is designed both for custom saving locations, mostly for testing, and for slot-based saving. This means that:

- On manager setup, and for custom save location, you need to pass a **fileLocationFactory**, which receives a int corresponding to the save slot, and returns a FileHandle from where to save the data.
- The save and load methods on the manager also receive a slot as parameter.
