# Command prompts

`CommandPrompt` adds a command editor and transcript to an entered terminal scene.
`TerminalApp` supplies its presentation and routes the existing Mordant input to it.
The prompt starts closed. Press Escape to open or close it; in fallback line mode,
submit the exact line `:console` instead.

| Task | Handling terminal events directly | Using `CommandPrompt` |
| --- | --- | --- |
| Edit input | Maintain a buffer in `onInput` and handle Enter/Backspace | The prompt owns the editor |
| Accept arguments | Split strings, convert values, and check bounds | Declare typed argument definitions |
| Display help | Maintain help separately from command behavior | Usage comes from the configured schema |
| Capture typing | Arrange focus and prevent gameplay action dispatch | The terminal host routes focused input |
| Reuse behavior | Share parser and handler code manually | Register a `Command` class and configure its template |

## Add a prompt to a scene

```kotlin
import io.canopy.engine.app.Screen
import io.canopy.engine.app.screens
import io.canopy.engine.commands.CommandPrompt
import io.canopy.engine.commands.PauseCommand
import io.canopy.engine.commands.ResumeCommand
import io.canopy.engine.core.nodes.types.empty.EmptyNode
import io.canopy.platforms.terminal.app.terminalApp

class ConsoleScreen : Screen() {
    override fun onEnter() {
        EmptyNode("World") {
            CommandPrompt("Console") {
                command<PauseCommand>()
                command<ResumeCommand>()
            }
        }.asSceneRoot()
    }
}

fun main() = terminalApp {
    screens { start(ConsoleScreen()) }
}.launch()
```

Open the prompt, then type `help`, `pause`, or `resume` and press Enter.
Pausing keeps the prompt responsive. Opening it does not pause the application.
Only one prompt can be entered per terminal host.

## Read typed arguments

Declare required positional arguments inside a command. Read them by calling the
definition, just as you read a signal:

```kotlin
CommandPrompt("Console") {
    command("spawn") {
        description = "Request animals for the simulation"
        val species = choiceArgument("species", choices = listOf("rabbit", "fox"))
        val count = intArgument("count", range = 1..100)

        execute {
            reply("Spawning ${count()} ${species()}")
        }
    }
}
```

`spawn rabbit 5` supplies a `String` and an `Int` to the handler. Unknown choices,
invalid numbers, out-of-range counts, and missing or extra arguments report an
error before any handler runs. Choices match exactly, including case.

`argumentDefinition()` is the canonical read operation. Definitions have no
public `.value` property, and execution contexts have no `argument(...)` accessor.
Reading a definition outside its handler fails. Values are cleared after success
or failure; a nested submission restores the outer invocation when it returns.
Argument reads do not subscribe to reactive signals.

Kotlin delegation forwards to the same invocation operation:

```kotlin
command("spawn") {
    val species by choiceArgument("species", choices = listOf("rabbit", "fox"))
    val count by intArgument("count", range = 1..100)

    execute {
        reply("Spawning $count $species")
    }
}
```

The factories are `stringArgument`, `intArgument`, `choiceArgument`,
`enumArgument<T>`, and `booleanArgument`. Integer ranges are inclusive. Enum names
match exactly; booleans accept `true` or `false`.

Add typed validation to a definition:

```kotlin
command("greet") {
    val name by stringArgument("name") {
        validate("Name must not be blank") { it.isNotBlank() }
    }
    execute { reply("Hello, $name!") }
}
```

Use single or double quotes for an argument containing whitespace:
`greet "Ada Lovelace"`. A backslash escapes the next character, including inside
quotes; use `\\` for a literal backslash. Unclosed quotes and trailing escapes
report an error before execution.
Command names also match exactly. Duplicate names and the reserved name `help`
are rejected during registration. The built-in help command generates usage from
the configured names, descriptions, and argument definitions.

## Reuse command classes

Implement `Command` for behavior shared by several prompts. Each registration
constructs a fresh instance through its public no-argument constructor. The
context supplies the application, owning prompt, and `reply(text)`.

```kotlin
import io.canopy.engine.commands.Command
import io.canopy.engine.commands.CommandArgument
import io.canopy.engine.commands.CommandContext
import io.canopy.engine.commands.stringArgument

class GreetCommand : Command {
    private val nameArgument = stringArgument("name")
    private val guest by nameArgument

    override val name = "greet"
    override val description = "Greet a guest"
    override val arguments: List<CommandArgument<*>> = listOf(nameArgument)

    override fun execute(context: CommandContext) {
        context.reply("Hello, $guest!")
    }
}
```

Classes explicitly list their definitions in `arguments`. Retaining a definition
separately allows both delegation and that list without adding another read API.
Register it with `command<GreetCommand>()` or `command(GreetCommand::class)`.

## Configure templates and handler chains

Class registrations expose a typed `template` reference in their configuration
builder. Customize names, descriptions, arguments, and execution there.

```kotlin
import io.canopy.engine.commands.CommandExecutionMode

CommandPrompt("Console") {
    command<PauseCommand> {
        execute(CommandExecutionMode.Append) {
            reply("Type continue to resume")
        }
    }

    command<ResumeCommand> {
        name = "continue"
        execute {
            app.resume()
            reply("Continuing!")
        }
    }
}
```

`execute { ... }` defaults to `Override`: it replaces the current handler chain.
`execute(CommandExecutionMode.Append) { ... }` adds a handler after the existing
ones. Every handler sees the same validated arguments. Failure stops later
handlers; earlier replies and side effects remain.

If you change a template's argument schema, override its execution before adding
handlers. This prevents its original handler from reading definitions that the
new schema no longer supplies.

## Activation, input, and lifecycle

Configure `prompt`, `toggleKey`, `isOpen`, and `transcriptLimit` in the
prompt DSL. Escape is the default shortcut; setting `toggleKey = null` disables
it. Call `open()`, `close()`, or `toggle()` on the lifecycle thread. Repeated open
or close calls preserve the current state. Activation controls editing and input
capture; it is separate from the proposed rendering-only node visibility API.

```kotlin
CommandPrompt("Console") {
    prompt = "ecosystem> "
    transcriptLimit = 200
    isOpen = false
}
```

The open prompt captures editing input and mapped actions. The toggle event
does not reach gameplay or enter the editor. Backspace removes text and Enter
submits. Ctrl+C keeps its existing application-exit behavior.
Toggle shortcuts use canonical Key identity. Prefer `Key.Q`, `Key.NUM_1` or `Key.SEMICOLON`; deprecated letter
aliases such as `Key.Q_KEY` resolve to the same key. The paired printable toggle text is suppressed for letters,
digits and punctuation. Editor text comes from TextInputEvent, preserving Unicode independently of key identity.
See [Keyboard identity](../input/input.md#keyboard-identity-and-saved-bindings) for migration and terminal limitations.

Gameplay polling through `InputManager` is suppressed for captured input too.
Outside prompt routing, calling `event.consume()` in a node input callback stops
the remaining input traversal, including later children and behavior callbacks.

Closing removes presentation and releases focus while retaining the draft and
transcript. In raw terminal mode, it also restores the latest frame submitted to
TerminalApp.renderFrame, including frames submitted while the prompt was open.
Fallback line input suppresses world-frame output so it cannot overwrite the editor.
Tree exit releases focus and presentation too. Re-entry keeps the
configuration and draft without reconstructing command instances. Permanent
destruction releases instances, handlers, and presentation references; retained
facades cannot read or modify destroyed state.

The transcript retains 100 entries by default. Commands execute synchronously on
the lifecycle thread. Ordinary failures appear in the transcript; cancellation
and fatal errors propagate through the engine's existing error behavior.
`transcript` is a read-only snapshot and `draft` exposes the current editor text.
For application-driven submission, `submit("help")` runs the same validated path;
the prompt must be entered in a host, and this does not require it to be open.

The DSL describes the node and commands once. Reactive recomposition, completion,
history navigation, optional arguments, flags, subcommands, and asynchronous
handlers are outside this API.

## Migrate activation names

This pre-0.1 API change renames prompt activation to reserve visibility names for
rendering-only behavior. Update prompt callers and configuration, then recompile
clients; there are no compatibility aliases for the old source or JVM names.

| Previous CommandPrompt API | Current activation API |
| --- | --- |
| show() | open() |
| hide() | close() |
| isVisible | isOpen |

toggle() and toggleKey keep their names and control activation. The platform
CommandPromptPresentation.hide() callback and TerminalCommandPresentation's
internal isVisible flag still describe presentation, so they are unchanged.
This rename does not add Node.show()/hide(), change pause behavior, or implement
overlay rendering. A terminal overlay is the agreed next presentation direction.

## Global service dependencies in commands

Ordinary command objects can use global manager delegates from core.queries, including optional
managerOrNull. They resolve independently of the prompt node. CommandArgument delegates have a
different lifetime: their reads require a currently validated command invocation. See
[dependency lookups](../core/dependencies.md) and [command/input design](../../../engine-details/commands-and-input.md).

## Try the terminal smoke example

From an engine checkout on Windows, run:

```powershell
.\gradlew.bat :platforms:terminal:commandPromptSmoke --console=plain
```

On other systems, use `./gradlew` with the same task. Press Escape to open the
prompt, or submit `:console` if raw input is unavailable. Try `help`,
`echo "hello world"`, `pause`, and `resume`. `quit` requests normal application
shutdown; Ctrl+C retains the terminal host's existing exit behavior.

Related: [Screens](screens.md), [Nodes](../core/nodes/nodes.md), and
[#22: terminal layout](https://github.com/canopyengine/canopy/issues/22).
