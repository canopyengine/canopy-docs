<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Install Canopy

The easiest way to try Canopy is to run the example project. It already contains
the settings needed to download the engine and build your game.

Canopy **0.1.0-alpha.1** is an early release. You can build terminal applications
with it today; some APIs may change before stable 0.1.0.

> [!NOTE]
> The examples in this update target the upcoming **0.1.0-alpha.2** logging fix.
> It is not yet published. The download-and-run steps work after publication;
> for testing beforehand, follow the source steps in the
> [build setup reference](build-setup.md#testing-the-file-only-logging-fix).
> Alpha.1 remains published, but does not contain this runtime fix.

## 1. Install Java

Install **JDK 25**, for example from [Eclipse Temurin](https://adoptium.net/).
The JDK is the set of tools that builds and runs Kotlin applications.

Open a terminal (PowerShell on Windows) and check:

```sh
java -version
```

Look for version **25**. If the command is missing or shows an older version,
check your Java installation before continuing. If you have several versions,
set `JAVA_HOME` to the folder containing your JDK 25 installation. On Windows,
the Temurin installer can set this for you: enable its **Set JAVA_HOME variable**
option, then reopen PowerShell. See the
[Temurin installation instructions](https://adoptium.net/installation/) for your system.

## 2. Download the example

[Download the documentation repository](https://github.com/canopyengine/canopy-docs/archive/refs/heads/main.zip)
and extract it. Open a terminal in the extracted
`examples/terminal-starter` folder.

If you already use Git, you can clone it instead:

```sh
git clone https://github.com/canopyengine/canopy-docs.git
cd canopy-docs/examples/terminal-starter
```

## 3. Run it

On Windows, in PowerShell:

```powershell
.\gradlew.bat installDist
.\build\install\canopy-terminal-starter\bin\canopy-terminal-starter.bat
```

On Linux or macOS:

```sh
bash ./gradlew installDist
./build/install/canopy-terminal-starter/bin/canopy-terminal-starter
```

Gradle is the tool that builds the project. The example includes a launcher for
it, so you do not need to install Gradle separately. The first run downloads
Gradle, Kotlin and Canopy, so it needs an internet connection and takes longer
than later runs.

`installDist` builds the app and creates a launcher. The next command runs that
launcher directly, so it can read the terminal's keyboard controls. `gradlew run`
can forward input through a pipe, especially on Windows, which prevents raw
arrow-key input.

You should see **Canopy terminal starter**, a population count and buttons.
Continue with [your first project](first-project.md) to use the controls and
make a small change.

## If something goes wrong

| What you see | What to check |
| --- | --- |
| Java is missing or has the wrong version | Install JDK 25 and check `java -version` again. |
| Gradle cannot download a file | Check your internet connection and the download address in the error. |
| A Canopy library or plugin cannot be found | Keep all Canopy versions aligned; these examples require `0.1.0-alpha.2` and use the starter's repository settings. |
| Arrow keys do not work | Use a regular terminal window rather than an IDE output panel. See the first-project guide for command input. |

## Using your own project

Once the example runs, you can copy it as a starting point. Change your game code
in `src/main/kotlin/Main.kt`; keep the build files until you need to change them.

To add Canopy to an existing Kotlin project, see the
[build setup reference](build-setup.md). That page also covers upgrading old
projects and building Canopy from source. You do not need a Sonatype account or
signing key to use the engine; those are for publishing engine releases.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
