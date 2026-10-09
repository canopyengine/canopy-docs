plugins {
    kotlin("jvm") version "2.4.10"
    id("io.github.canopyengine.compiler") version "0.1.0-alpha.1"
    application
}
repositories {
    mavenCentral()
}
dependencies {
    implementation("io.github.canopyengine:engine:0.1.0-alpha.1")
    implementation("io.github.canopyengine:platforms-terminal:0.1.0-alpha.1")
}
kotlin { jvmToolchain(25) }
application {
    mainClass.set("MainKt")
    applicationDefaultJvmArgs = listOf("--enable-native-access=ALL-UNNAMED")
}
tasks.named<JavaExec>("run") {
    standardInput = System.`in`
}
