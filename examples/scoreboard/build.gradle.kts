plugins {
    kotlin("jvm") version "2.4.10"
    id("io.github.canopyengine.compiler") version "0.1.0-alpha.2"
    application
}
repositories {
    providers.gradleProperty("canopyRepository").orNull?.let { repository ->
        maven { url = uri(repository) }
    }
    mavenCentral()
}
dependencies {
    implementation("io.github.canopyengine:engine:0.1.0-alpha.2")
    implementation("io.github.canopyengine:platforms-terminal:0.1.0-alpha.2")
}
kotlin { jvmToolchain(25) }
application {
    mainClass.set("MainKt")
    applicationDefaultJvmArgs = listOf("--enable-native-access=ALL-UNNAMED")
}
tasks.named<JavaExec>("run") {
    standardInput = System.`in`
}
