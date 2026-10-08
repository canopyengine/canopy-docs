import io.canopy.engine.data.parsers.Json
import io.canopy.engine.input.InputMapper
import io.canopy.engine.input.binds.InputBind
import io.canopy.engine.input.binds.InputData
import io.canopy.engine.input.binds.Key
import io.canopy.engine.input.binds.toInputBind
import io.canopy.engine.input.binds.toKey

fun main() {
    val legacyJson = checkNotNull(object {}.javaClass.getResource("/legacy-input.json"))
        .readText()
    val mapper = InputMapper()
    mapper.loadData(Json.fromString<InputData>(legacyJson))

    val expected = mapOf(
        "move_left" to listOf(InputBind.A, InputBind.LEFT),
        "select" to listOf(InputBind.NUM_1, InputBind.TAB, InputBind.LEFT_MOUSE),
        "delete" to listOf(InputBind.DELETE),
        "sprint" to listOf(InputBind.SHIFT_LEFT, InputBind.SHIFT_RIGHT),
    )
    check(mapper.actions == expected)

    val exportedJson = Json.toString(mapper.toData())
    val reloaded = InputMapper()
    reloaded.loadData(Json.fromString<InputData>(exportedJson))
    check(reloaded.actions == expected)
    check(Json.fromString<kotlinx.serialization.json.JsonElement>(exportedJson) ==
        Json.fromString<kotlinx.serialization.json.JsonElement>(legacyJson))

    val keyboardBindings = InputBind.entries.filter { it.type == InputBind.Type.Keyboard }
    check(keyboardBindings.size == 103)
    keyboardBindings.forEach { bind ->
        check(bind.toKey().toInputBind() == bind)
        check(bind.toKey().code == bind.code)
    }
    check(InputBind.LEFT_MOUSE.toKey() == Key.UNKNOWN)
    listOf(Key.UNKNOWN, Key.CTRL, Key.ALT, Key.SHIFT).forEach { check(it.toInputBind() == null) }

    // A source compatibility alias is not an additional enum entry or a saved binding name.
    @Suppress("DEPRECATION")
    val oldSourceKey = Key.W_KEY
    check(oldSourceKey == Key.W)
    check(Key.entries.none { it.name.endsWith("_KEY") })

    println("Loaded ${mapper.actions.size} legacy actions without editing saved bindings.")
    println("Verified ${keyboardBindings.size} canonical keyboard round-trips and Key.W_KEY == Key.W.")
    println(exportedJson)
}
