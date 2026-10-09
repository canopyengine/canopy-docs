import io.canopy.adapters.logback.LogbackLogging
import io.canopy.engine.commands.CommandPrompt
import io.canopy.engine.commands.PauseCommand
import io.canopy.engine.commands.ResumeCommand
import io.canopy.engine.core.flows.events.signal
import io.canopy.engine.core.nodes.types.empty.EmptyNode
import io.canopy.engine.logging.logger
import io.canopy.engine.ui.UiRoot
import io.canopy.platforms.terminal.app.terminalApp

fun main(args: Array<String>) {
    val smoke = "--smoke" in args
    terminalApp {
        if ("--diagnostics" in args) {
            logging(LogbackLogging(LogbackLogging.Config(mode = LogbackLogging.Mode.DIAGNOSTIC)))
        }
        onEnter {
            val world = EmptyNode("World")
            // Explicit ownership: world destruction disposes both signals.
            val population = signal(owner = world, value = 3)
            val details = signal(owner = world, value = true)
            world.addChild(UiRoot {
                Column {
                    Text("Canopy terminal starter")
                    Text("Population: ${population()}")
                    Button("Add rabbit") { population.update { it + 1 } }
                    Button("Toggle details") { details.update { !it } }
                    if (details()) {
                        Text("Signals update text and conditional UI independently.")
                    }
                    Text("Arrows: focus. Enter: activate. Escape: commands.")
                    Text("Commands: help, add, pause, resume, quit. Resize this terminal.")
                }
            })
            val prompt = CommandPrompt("Console") {
                command<PauseCommand>()
                command<ResumeCommand>()
                command("add", "Add one rabbit") {
                    execute {
                        population.update { it + 1 }
                        reply("Population: ${population()}")
                    }
                }
                command("quit", "Exit the application") {
                    execute { app.handle.requestExit() }
                }
            }
            world.addChild(prompt)
            world.asSceneRoot()
            logger("example.game").info("event" to "game.start") { "Game scene ready" }
            if (smoke) {
                var frames = 0
                onUpdate {
                    frames++
                    if (frames == 1) {
                        prompt.submit("add")
                        check(population() == 4) { "Command did not update population" }
                        prompt.submit("pause")
                        check(isPaused) { "Pause command did not pause" }
                        prompt.submit("resume")
                        check(!isPaused) { "Resume command did not resume" }
                    }
                    if (frames >= 3) prompt.submit("quit")
                }
            }
        }
    }.launch()
}
