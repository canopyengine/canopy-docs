plugins {
    kotlin("jvm") version "2.4.10"
    application
}

repositories {
    mavenLocal()
    mavenCentral()
}

dependencies {
    implementation("io.github.canopyengine:engine:0.1.0-alpha.1")
}

kotlin {
    jvmToolchain(25)
}

application {
    mainClass.set("InputBindingsKt")
}
