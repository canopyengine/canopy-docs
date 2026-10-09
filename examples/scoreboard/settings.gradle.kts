pluginManagement {
    repositories {
        providers.gradleProperty("canopyRepository").orNull?.let { repository ->
            maven { url = uri(repository) }
        }
        gradlePluginPortal()
        mavenCentral()
    }
}
rootProject.name = "canopy-scoreboard"
