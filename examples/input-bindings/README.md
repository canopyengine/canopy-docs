# Runnable input bindings example

This example loads [legacy-input.json](src/main/resources/legacy-input.json),
exports the same saved binding names, and verifies all 103 physical keyboard
bindings against their canonical `Key` identities. It runs without an app or
input backend: `InputMapper` owns the mappings independently of `InputManager`.

The source is [InputBindings.kt](src/main/kotlin/InputBindings.kt). It uses the
existing `InputData` serializers through Canopy's `Json` helper; it declares no
new serializable payload types and needs no serialization compiler plugin.

## Run locally

Requirements: JDK 25, Kotlin 2.4.10 and the engine's Gradle 9.8.0 wrapper.
This example resolves `io.github.canopyengine:engine:0.1.0-alpha.1` from Maven
Central. No local engine publication is required. Reuse the checked-in terminal
starter wrapper to run it from the documentation repository root:

```sh
bash examples/terminal-starter/gradlew -p examples/input-bindings run
```

On Windows:

```powershell
.\examples\terminal-starter\gradlew.bat -p examples/input-bindings run
```

Expected output includes:

```text
Loaded 4 legacy actions without editing saved bindings.
Verified 103 canonical keyboard round-trips and Key.W_KEY == Key.W.
```

The exported JSON follows, with `binds` containing enum-name strings such as
`"A"`, `"NUM_1"`, `"TAB"`, `"DELETE"`, `"SHIFT_LEFT"` and `"LEFT_MOUSE"`.
Formatting can change; the example checks the parsed JSON and action mappings,
not whitespace. A failed compatibility check exits the application with an error.

## Saved data and source migration

Existing `InputData` JSON in this format loads without edits. Bindings are not
objects containing `type` or `code`; Canopy codes and enum ordinals are not the
JSON representation. This example does not migrate unsupported formats or
unknown enum names.

Use `Key.A` through `Key.Z` in Kotlin source. All 26 deprecated `A_KEY` through
`Z_KEY` properties remain source aliases; the example compiles and checks
`Key.W_KEY == Key.W`. They are not enum entries, so `Key.valueOf("W_KEY")`
and persistence of old `Key` names require migration. Recompile clients and do
not persist `Key` ordinals. This source migration leaves saved `InputBind`
enum-name strings unchanged.

See the [input manual](../../markdown/manuals/concepts/input/input.md#keyboard-identity-and-saved-bindings)
for backend limits, mouse conversion and unsided modifiers.
