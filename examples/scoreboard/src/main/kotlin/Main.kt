import io.canopy.engine.core.flows.events.signal
import io.canopy.engine.core.nodes.types.empty.EmptyNode
import io.canopy.engine.ui.UiRoot
import io.canopy.platforms.terminal.app.terminalApp

fun main(args: Array<String>) {
    val smoke = "--smoke" in args
    terminalApp {
        onEnter {
            val appHandle = handle
            val world = EmptyNode("World")
            val score = signal(owner = world, value = 0)
            world.addChild(UiRoot {
                Column {
                    Text("My scoreboard")
                    Text("Score: ${score()}")
                    Button("Earn a point") { score.update { it + 1 } }
                    Button("Reset") { score.update { 0 } }
                    if (score() >= 3) {
                        Text("Three points! Well done.")
                    }
                    Button("Quit") { appHandle.requestExit() }
                }
            })
            world.asSceneRoot()
            if (smoke) {
                var frames = 0
                onUpdate {
                    frames++
                    if (frames == 1) {
                        repeat(3) { score.update { it + 1 } }
                        check(score() == 3) { "Earning points did not update the score" }
                    }
                    if (frames == 2) {
                        score.update { 0 }
                        check(score() == 0) { "Reset did not clear the score" }
                    }
                    if (frames >= 3) appHandle.requestExit()
                }
            }
        }
    }.launch()
}
