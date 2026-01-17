---
name: svelte-error-handling
description: Implement comprehensive error handling with boundaries, user feedback, and structured logging for Svelte/SvelteKit apps
keywords: [error, boundary, validation, logging, sveltekit]
---

## When to Use
Apply when implementing error handling in SvelteKit routes, forms, or async operations.

## Critical Requirements
- **NEVER deploy without error boundaries** at route level
- **ALWAYS validate user inputs** on both client and server
- Add loading states for async operations
- Log errors with full context using structured logging

## Server-Side Error Handling

Use `error()` and `fail()` helpers properly:

```typescript
import { error, fail } from '@sveltejs/kit';

export const load = async ({ params }) => {
  const data = await fetchData(params.id);
  if (!data) error(404, 'Resource not found');
  return { data };
};

export const actions = {
  default: async ({ request }) => {
    try {
      const formData = await request.formData();
      // Process data
    } catch (err) {
      return fail(400, { error: 'Invalid submission' });
    }
  }
};
```


## Async Operation Pattern

```typescript
let loading = $state(false);
let error = $state<string | null>(null);

async function fetchData() {
  loading = true;
  error = null;
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Fetch failed');
    return await response.json();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
    console.error('Fetch error:', { timestamp: new Date().toISOString(), err });
  } finally {
    loading = false;
  }
}
```


## Validation Rules

- Use schema validation libraries (Zod, Yup)
- Validate on both client and server
- Sanitize all user inputs before rendering
- Never trust client-side data