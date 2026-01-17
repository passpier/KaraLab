---
name: svelte-ux-accessibility
description: Implement user-first UX with validation, accessibility (ARIA), loading states, and proper meta tags for Svelte apps
keywords: [ux, accessibility, aria, validation, meta-tags]
---

## When to Use
Apply when building user-facing components, forms, or interactive elements.

## Critical UX Principles
- Implement loading states for all async operations
- Add ARIA attributes to interactive elements
- Test keyboard navigation and screen reader compatibility
- Validate user inputs on client and server
- Default to SSR or prerendering for performance and SEO

## Accessibility Checklist
```svelte
<!-- Proper ARIA labels -->
<button aria-label="Close modal" on:click={closeModal}>
  <CloseIcon />
</button>

<!-- Semantic HTML -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<!-- Form accessibility -->
<label for="email">Email</label>
<input 
  id="email" 
  type="email" 
  aria-required="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">{emailError}</span>
```


## Loading States Pattern

```svelte
<script lang="ts">
  let loading = $state(false);
  let data = $state(null);

  async function loadData() {
    loading = true;
    try {
      data = await fetch('/api/data').then(r => r.json());
    } finally {
      loading = false;
    }
  }
</script>

{#if loading}
<div aria-live="polite" aria-busy="true">Loading...</div>
{:else if data}
<DataDisplay {data} />
{/if}
```


## Form Validation Pattern

```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

let errors = $state<Record<string, string>>({});

function validateForm(data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    errors = result.error.flatten().fieldErrors;
    return false;
  }
  errors = {};
  return true;
}
```


## SEO \& Meta Tags

```svelte
<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:image" content={ogImage} />
</svelte:head>
```


## Keyboard Navigation

- Ensure all interactive elements are focusable
- Test tab order
- Implement keyboard shortcuts where appropriate
- Trap focus in modals
