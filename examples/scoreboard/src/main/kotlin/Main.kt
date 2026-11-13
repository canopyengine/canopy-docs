import io.canopy.adapters.logback.LogbackLogging
import io.canopy.engine.app.AppHandle
import io.canopy.engine.app.initialScreen
import io.canopy.engine.core.nodes.Node
import io.canopy.engine.logging.logger
import io.canopy.engine.ui.UiRoot
import io.canopy.platforms.terminal.app.terminalApp

class Scoreboard(private val appHandle: AppHandle, private val smoke: Boolean) : Node<Scoreboard>("Scoreboard") {
    var score by signal(0)
    private var frames = 0

    override fun nodeInit() {
        UiRoot {
            Column {
                Text("My scoreboard")
                Text("Score: $score")
                Button("Earn a point") { score++ }
                Button("Reset") { score = 0 }
                if (score >= 3) {
                    Text("Three points! Well done.")
                }
                Button("Quit") { appHandle.requestExit() }
            }
        }
    }

    override fun onReady() {
        logger("example.game").info("event" to "game.start") { "Game scene ready" }
    }

    override fun onUpdate(delta: Float) {
        if (!smoke) return
        frames++
        if (frames == 1) {
            repeat(3) { score++ }
            check(score == 3) { "Earning points did not update the score" }
        }
        if (frames == 2) {
            score = 0
            check(score == 0) { "Reset did not clear the score" }
        }
        if (frames >= 3) appHandle.requestExit()
    }
}

fun main(args: Array<String>) {
    val smoke = "--smoke" in args
    terminalApp {
        if ("--diagnostics" in args) {
            logging(LogbackLogging(LogbackLogging.Config(mode = LogbackLogging.Mode.DIAGNOSTIC)))
        }
        initialScreen<Scoreboard> { Scoreboard(handle, smoke) }
    }.launch()
}
