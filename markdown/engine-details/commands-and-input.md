<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Commands and input routing design

InputManager bridges concurrent backend producers to serialized gameplay callbacks. Commands remain synchronous engine
objects, while terminal presentation and raw/line input conversion stay in adapters/platforms.

## Input frame boundary

enqueue publishes one event to a private synchronized deque. enqueueBatch publishes related events in
iteration order under the same lock, so other producers cannot interleave them and a successful frame drain cannot stop
between their publication. It copies the iterable before taking the queue lock; if iteration fails,
none of that batch is published. Callers must keep the source stable while it is copied. Other InputManager methods
are engine-thread operations.
processEvents clears the previous raw events, begins a command-host input frame, drains backend events and routes prompt
focus before recording gameplay events. It then recomputes action states from physical binding polling.

Backend handling and command routing run outside the queue lock. Events enqueued from those callbacks can be processed
in the same frame. The drain ends at the first empty poll; later publications wait for the next frame. Batch publication
does not roll back callback side effects: a handler failure removes the failing event, leaves subsequent events queued
and stops action recomputation, as before. After producers stop, an explicit processEvents call can drain pending events;
application shutdown does not add an automatic final input frame.

Backend migration: the protected eventQueue is removed. Replace direct queue writes with enqueue, and replace external
synchronized(eventQueue) blocks containing related enqueue calls with enqueueBatch. Mordant publishes each physical
key and its text together. The terminal line bridge publishes text and Enter as a batch and retains its own lock for
submission acknowledgement, presentation and cancellation.

InputMapper stores action-to-binding lists, copies exported/imported mappings, and supports replace/append/remove.
Actions transition between JustPressed, Pressed, JustReleased and Released. Unknown actions read as Released; opposite
axis inputs cancel; diagonal vectors are not normalized. Replacing mappings clears cached action states.

InputSystem runs in FramePre. Raw events dispatch once per frame before mapped ButtonInputEvents. Node input delivery
obeys process modes and consumed-event state. Command focus suppresses gameplay polling and mapped states as well as
capturing editor events; event consumption elsewhere stops remaining node traversal. Optional CommandPromptHost lookup
uses the direct global nullable manager helper, allowing runtimes without a prompt host.

## Command declarations and invocation

Command provides a name, description, ordered required argument definitions and execute callback. Class registration
constructs one public no-argument instance per definition. Builder templates permit configuration and handler override
or append. Changing inherited argument schema requires overriding inherited execution first. Names and definitions
must be unique within their relevant schema; help is reserved.

CommandArgument parses and validates before execution. Delegation and invoke read the same thread-local binding for
that validated invocation; definitions do not retain previous submitted values. Binding stacks restore an outer
invocation after nested submissions. Reading outside execution fails, even from ordinary objects that support delegation.

Quoted tokenization and escapes precede exact argument-count checks and typed validation. All handler-chain callbacks
share the invocation. A failure stops later handlers without rolling back earlier replies or side effects.
CommandContext is invalidated after execution; retaining it cannot reply into a later command invocation.

## Prompt lifecycle and platform boundary

CommandPrompt is a guarded node storing configuration, draft, bounded transcript and command instances in managed state.
Entered prompts register with CommandPromptHost. Visibility controls focus/presentation; hide/exit releases focus while
preserving reusable configuration and draft. Destruction releases owned instances and closures. submit requires entered
host membership but not visibility. Ordinary command errors become transcript output; cancellation and fatal errors
propagate. Commands do not run in background jobs.

TerminalApp installs host and presentation. Mordant converts physical key events; unavailable raw input falls back to
queued line input. Command routing runs before gameplay mapping; terminal rendering respects active presentation.
Ctrl+C retains platform shutdown behavior. There is no completion, optional argument/flag grammar or async handler API.

## Verification

CommandPromptTests and InputManagerTests cover parsing, invocation lifetime, handler behavior, focus and gameplay
suppression, concurrent batch ordering, producer completion and callback enqueueing. TerminalCommandPromptTests and terminal integration tests cover presentation/routing and fallback.
See [Command prompts](../manuals/concepts/app/command-prompts.md) and [Input guide](../manuals/concepts/input/input.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
