# Manager overview

Managers are global services outside the node tree. See the
[manager and injection reference](managers/managers.md) for current APIs,
lookup behavior and lifecycle rules.

App registers SceneManager, ScreenManager and InjectionManager. TerminalApp
also supplies input and assets managers. SaveManager is application-configured;
it is not installed automatically. HeadlessApp does not supply the terminal
filesystem asset or keyboard manager.
