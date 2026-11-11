"""Check standard/diagnostic terminal logging without a project Logback file."""
import json
import pathlib
import subprocess
import sys
import tempfile

launcher = pathlib.Path(sys.argv[1]).resolve()


def launch(directory, diagnostics=False):
    args = [str(launcher), "--smoke"]
    if diagnostics:
        args.append("--diagnostics")
    result = subprocess.run(args, cwd=directory, capture_output=True, text=True, timeout=30)
    if result.returncode:
        raise SystemExit(result.stdout + result.stderr)
    output = result.stdout + result.stderr
    if "io.canopy.engine." in output or "game.start" in output:
        raise SystemExit("Engine or game diagnostics leaked onto the terminal")


def check_text(directory):
    engine = (directory / "engine.log").read_text()
    game = (directory / "app.log").read_text()
    if "session.start" not in engine or "session.end" not in engine or "reason=normal" not in engine:
        raise SystemExit("Engine files did not capture the complete normal session")
    if "game.start" not in game:
        raise SystemExit("Game files did not capture the example startup message")
    if "game.start" in engine or "session.start" in game:
        raise SystemExit("Engine and game categories were mixed")


with tempfile.TemporaryDirectory(prefix="canopy-terminal-check-") as directory:
    root = pathlib.Path(directory) / ".canopy" / "logs"
    launch(directory)
    check_text(root)
    if list(root.rglob("*.jsonl")):
        raise SystemExit("Standard mode unexpectedly created JSON logs")
    first = (root / "engine.log").read_text()
    launch(directory)
    check_text(root)
    archived = list((root / "history").rglob("engine.log"))
    if len(archived) != 1 or archived[0].read_text() != first:
        raise SystemExit("The previous run was not preserved in history")
    launch(directory, diagnostics=True)
    json_logs = list(root.rglob("engine.jsonl"))
    if len(json_logs) != 1:
        raise SystemExit("Expected one diagnostic run containing JSON logs")
    run = json_logs[0].parent
    check_text(run)
    for filename in ("engine.jsonl", "app.jsonl"):
        records = [json.loads(line) for line in (run / filename).read_text().splitlines()]
        if not records or not all("runId" in event for event in records):
            raise SystemExit("Diagnostic JSON logs lack run metadata")
print("Installed example passed: separate current logs, preserved history, optional diagnostic JSON, clean console.")
