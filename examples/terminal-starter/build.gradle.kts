plugins {
    kotlin("jvm") version "2.4.10"
    id("io.canopy.compiler") version "0.1.0-dev2"
    application
}
repositories {
    mavenLocal()
    mavenCentral()
}
dependencies {
    implementation("io.canopy:engine:0.1.0-dev2")
    implementation("io.canopy:platforms-terminal:0.1.0-dev2")
}
kotlin { jvmToolchain(25) }
application { mainClass.set("MainKt") }
tasks.named<JavaExec>("run") {
    standardInput = System.`in`
    jvmArgs("--enable-native-access=ALL-UNNAMED")
}
