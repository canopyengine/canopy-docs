<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# JVM headless host evaluation

This experiment evaluates a JVM host for terminal-only 0.1.0. It does not replace the public HeadlessApp or change
TerminalApp. The existing headless platform still uses LibGDX/Ktx. The prototype is unpublished test code, so its
constructor, clock and sleeper hooks are experimental test helpers rather than supported engine APIs.

## Why evaluate it

EngineLoop already owns fixed physics, pause transitions and serialized lifecycle dispatch. A headless host can drive
that loop with a monotonic JVM clock and a frame limiter without creating LibGDX global services. The terminal assets
manager and asset entry already use Java I/O; reusing their compiled classes lets the experiment test filesystem and
classpath behavior without copying their implementation or depending on Mordant.

A production host would need an agreed home for those shared asset classes and compatibility wrappers for terminal
APIs. This experiment deliberately tests that extraction boundary before changing published modules.

## Reproduce the experiment

From the engine checkout, with the pinned Java toolchain:

```bash
./gradlew :platforms:terminal:jvmHeadlessSmoke :platforms:terminal:jvmHeadlessDependencyReport
```

The task builds the selected prototype and asset classes, then launches a separate JVM with the actual engine/utils
runtime. It excludes the remaining terminal classes, LibGDX, Ktx, Mordant and native artifacts. The subprocess checks
that backend classes are absent and drives finite application lifecycle and asset probes. Its dependency report
compares the existing headless and terminal runtime graphs with the exact smoke classpath in `platforms/terminal/build/jvm-headless/runtime-graphs.tsv`.

Core logging remains on the baseline runtime classpath. Removing a rendering backend does not itself remove Logback
or the encoder/Jackson stack; [host-owned logging](https://github.com/canopyengine/canopy/pull/190) is separate work.
No startup-time, CPU or memory improvement is claimed.

## Observed dependency boundary

At engine main `51d982b9b6a0041fd7fe84ee8fd92876c5ce1ac8`, the report resolves 23 headless dependency artifacts,
25 terminal dependency artifacts and 17 experiment artifacts including its selected executable JAR. Existing platform
configurations omit their own main output; these counts describe the reported sets, not complete package sizes.

The experiment excludes seven headless artifacts: the LibGDX adapter, gdx, the headless backend, its loader and
natives-desktop JAR, ktx-app and ktx-assets. It excludes nine terminal artifacts: the Mordant adapter, colormath,
JNA and six Mordant artifacts. Both comparisons add the unpublished experiment JAR. Published dependency edges
remain unchanged.

## Lifecycle and migration boundaries

The prototype runs lifecycle callbacks serially on the calling thread. launchAsync uses App's existing launch thread;
it does not create a second hidden host thread. Stop controls are installed before entry. A pre-interrupted caller
enters and immediately exits with zero frames, preserving the interrupt flag and completing lifecycle teardown.
Interrupted waits preserve that flag and exit through cleanup. Late stop calls after the host finishes have no effect
on its former caller thread; stop controls are deactivated before teardown callbacks. EngineLoop retains fixed-step
physics, pause and resize behavior. Tests use an injected
clock and sleeper for deadlines and interruption; the smoke uses the real JVM clock.

Unlike the existing asynchronous LibGDX launch, this prototype's synchronous launch blocks until teardown. It honors
AppConfig.fps; the current HeadlessHost uses the LibGDX default rather than forwarding that setting. These are explicit
production migration choices, not implied compatibility guarantees.

Core App currently completes its stopped handle during exit before a subsequent host frame failure can be reported.
The prototype preserves the thrown frame failure and suppresses later teardown errors, but it cannot fix handle
failure reporting without changing core lifecycle completion. [Issue #193](https://github.com/canopyengine/canopy/issues/193)
tracks that gap. Related [cleanup aggregation](https://github.com/canopyengine/canopy/pull/179) preserves existing failure
policy and does not resolve it. Fix the reporting contract before adopting a production host.

Java asset semantics match the terminal implementation: Internal/External use the working directory, Local uses the
user home, Absolute uses the given path, and Classpath is read-only. Missing classpath resources do not fall back to
the filesystem, and classpath directory enumeration is unsupported. This is not a claim of identical LibGDX source
mapping on every platform.

## Decision

Full checks and smoke/report tasks passed: 296 tests, zero failures/errors/skips and 81.0% coverage. All 12 prototype
regressions passed. Independent review approved the evaluation. Existing publication metadata and runtime graphs are
unchanged; the selected experiment JAR is unpublished. Keep the existing backend while
evaluating a production JVM adapter and launch semantics. Any public migration should specify asset-source behavior,
threading, interruption, lifecycle completion and the compatibility path for existing terminal asset classes.

See [Application runtime](runtime.md), [Engine architecture](engine-architecture.md) and
[Resources and data](resources-and-data.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
