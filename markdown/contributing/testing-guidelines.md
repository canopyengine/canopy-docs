<p align="center">
  <a href="https://github.com/canopyengine/canopy">
    <img src="markdown/assets/canopy-logo-no-bg.png" width="350" alt="Canopy Engine logo">
  </a>
</p>


# Testing Guidelines
Whenever possible, new functionalities should include tests. This can range from: 
* Automatic unit and integrated tests
* Testing with Minimal Reproduction Projects (MRPs)

Tests help ensure:

* engine stability
* regression prevention
* predictable behavior

Run the test suite before submitting a pull request:

```bash id="9k8l2a"
./gradlew test
```

<!-- TOC -->
* [Testing](#testing)
* [Automatic tests](#automatic-tests)
<!-- TOC -->

## When to add tests

Add or update tests when you:

- introduce new functionality
- fix a bug
- change existing behavior
- refactor logic that could affect behavior

Bug fixes should include a regression test demonstrating the issue.

## Test principles

- Test behavior, not implementation details
- Prefer small, focused tests
- Each test should verify one behavior
- Use clear, descriptive test names
- Keep tests deterministic and independent

## Test naming

Use backticks for test method names.

Prefer descriptive names such as:

```kotlin
`returns default name when name is missing`
`throws when email is invalid`
`creates order when input is valid`
````

When helpful, use the Given / When / Then style:

```kotlin
`given null name when displayName is called then default name is returned`
`given invalid email when validating then exception is thrown`
```

Keep names concise and focused on behavior.

## Test structure

Follow the Arrange / Act / Assert pattern.

```kotlin
class UserTest {
    @Test
    fun `returns default name when name is missing`() {
        // Arrange
        val user = User(name = null)

        // Act
        val result = user.displayName()

        // Assert
        assertEquals("Anonymous", result)
    }
}
```

## Grouping tests with `@Nested`

When a class has multiple behaviors or scenarios, group related tests using `@Nested`.

Use nested classes to organize tests by method or feature.

```kotlin
class UserTest {

    @Nested
    inner class DisplayName {

        @Test
        fun `given null name when displayName is called then default name is returned`() {
            val user = User(name = null)

            val result = user.displayName()

            assertEquals("Anonymous", result)
        }

        @Test
        fun `given name when displayName is called then name is returned`() {
            val user = User(name = "Alice")

            val result = user.displayName()

            assertEquals("Alice", result)
        }
    }
}
```

Guidelines:

* Use `@Nested` to group tests by method or behavior
* Keep nested classes small and focused
* Avoid deep nesting

## Assertions

Use assertions that verify observable behavior.

```kotlin
assertEquals(80.0, calculator.applyDiscount(100.0, 20))
```

For exceptions:

```kotlin
assertFailsWith<IllegalArgumentException> {
    calculator.applyDiscount(100.0, 120)
}
```

## Reliability

Tests must be deterministic and independent.

Avoid:

* network calls
* real databases
* filesystem dependencies
* timing hacks such as `sleep`
* randomness without fixed seeds
* dependencies on test execution order

Prefer real objects over unnecessary mocks.

## Contribution requirement

Before submitting a pull request:

* add or update tests for your change
* ensure all tests pass locally
* keep tests readable and maintainable

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>