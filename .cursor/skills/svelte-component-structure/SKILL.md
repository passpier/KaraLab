---
name: svelte-component-structure
description: Build Svelte 5 components using runes ($state, $derived, $effect, $props) with reactive state management and clean architecture
keywords: [svelte, component, runes, reactivity, state]
---

## When to Use
Apply when creating `.svelte` components or refactoring existing components to Svelte 5 syntax.

## Core Principles
- Use Svelte 5 runes for reactivity: `$state`, `$derived`, `$effect`, `$props`
- Keep components under 200 lines; extract logic to separate files
- Follow single responsibility principle
- Use TypeScript with `lang="ts"` attribute

## Reactive State Patterns

**Local State**: Use `$state` for component-level reactive variables
```typescript
let count = $state(0);
```

**Derived Values**: Use `$derived` for computed values

```typescript
let doubled = $derived(count * 2);
```

**Side Effects**: Use `$effect` for lifecycle and side effects

```typescript
$effect(() => {
  console.log(`Count: ${count}`);
});
```

**Props**: Use `$props()` with TypeScript typing

```typescript
let { title, count = 0 }: { title: string; count?: number } = $props();
```


## Component Structure

1. Script section first with `lang="ts"`
2. Declare props with `$props()`
3. Define local state with `$state`
4. Add derived values with `$derived`
5. Implement effects with `$effect`
6. Markup with semantic HTML
7. Scoped styles last

## When to Split Components

- Component exceeds 200 lines
- Logic can be reused elsewhere
- Component handles multiple responsibilities
- Complex state management needs extraction
