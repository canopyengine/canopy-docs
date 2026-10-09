"""Check an installed terminal example without sending diagnostics to its UI."""
import json
import pathlib
import subprocess
import sys
import tempfile

launcher = pathlib.Path(sys.argv[1]).resolve()
with tempfile.TemporaryDirectory(prefix="canopy-terminal-check-") as directory:
    result = subprocess.run(
        [str(launcher), "--smoke"],
        cwd=directory,
        capture_output=True,
        text=True,
        timeout=30,
    )
    if result.returncode:
        raise SystemExit(result.stdout + result.stderr)
    output = result.stdout + result.stderr
    if "io.canopy.engine." in output:
        raise SystemExit("Engine diagnostics leaked onto the terminal")
    runs = list((pathlib.Path(directory) / ".canopy" / "logs").iterdir())
    if len(runs) != 1:
        raise SystemExit("Expected exactly one managed logging session")
    run = runs[0]
    for name in ("engine.log", "engine.jsonl", "app.log", "app.jsonl"):
        if not (run / name).is_file():
            raise SystemExit(f"Managed logging file missing: {name}")
    events = [json.loads(line) for line in (run / "engine.jsonl").read_text().splitlines()]
    messages = [event.get("message", "") for event in events]
    if not any("session.start" in message for message in messages):
        raise SystemExit("Managed files did not capture session start")
    if not any("session.end" in message and "reason=normal" in message for message in messages):
        raise SystemExit("Managed files did not capture normal shutdown")
print("Installed terminal example passed: clean console and managed session files.")
