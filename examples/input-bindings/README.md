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
Keep the engine and documentation checkouts in sibling `canopy/` and
`canopy-docs/` directories. These instructions use `io.github.canopyengine:engine:0.1.0-dev2`
published locally from the engine checkout, rather than assuming that a remote
artifact with that development version contains the latest APIs.

The canonical API was originally validated in merged engine PR #192 and is
included in #208. The coordinates in this example require namespace-migration
revision `61122d43706ee9e1e4aa78c84764545be2f46ee9`; check out that exact engine revision before publication.
The previous implementation commits publish the old Maven group.

From the `canopy-docs/` repository root on Linux/macOS:

```bash
# Set JAVA_HOME to your JDK 25 installation before running these commands.
# Keep this development build separate from other Maven-local artifacts.
example_repo="$(pwd)/examples/input-bindings/build/local-maven"
bash ../canopy/gradlew -p ../canopy \
  :tooling:utils:publishToMavenLocal :engine:publishToMavenLocal \
  "-Dmaven.repo.local=$example_repo"
bash ../canopy/gradlew -p examples/input-bindings run \
  "-Dmaven.repo.local=$example_repo"
```

On Windows use `..\canopy\gradlew.bat` and pass the same absolute
`-Dmaven.repo.local` directory to both commands. `mavenLocal()` is consulted
before Maven Central. Re-publish after changing the engine checkout; running
`clean` removes this example's `build/local-maven` directory too.

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
