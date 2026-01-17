---
name: sveltekit-routing-data
description: Implement SvelteKit file-based routing, data loading with load functions, and SSR/prerendering optimization
keywords: [sveltekit, routing, load, ssr, prerender]
---

## When to Use
Apply when creating routes (`+page.svelte`), layouts (`+layout.svelte`), or data loaders (`+page.ts`, `+page.server.ts`).

## Routing Structure
- `src/routes/+page.svelte` → `/`
- `src/routes/about/+page.svelte` → `/about`
- `src/routes/blog/[slug]/+page.svelte` → `/blog/:slug`
- `+layout.svelte` → Shared layout for child routes

## Data Loading Patterns

**Server-Side Loading** (`+page.server.ts`):
```typescript
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const response = await fetch(`/api/posts/${params.slug}`);
  const post = await response.json();
  return { post };
};
```

**Universal Loading** (`+page.ts`):

```typescript
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
  // Transform server data or fetch additional client-side data
  return { processedData: transformData(data) };
};
```


## Performance Optimizations

**Enable Prerendering** for static pages:

```typescript
export const prerender = true;
```

**SSR Configuration**:

```typescript
export const ssr = true; // Default
```

**Load Only Essential Data**:

```typescript
// Bad: Loading too much data
export const load = async () => {
  const [posts, users, comments, analytics] = await Promise.all([...]);
  return { posts, users, comments, analytics };
};

// Good: Load minimal data, defer non-critical
export const load = async () => {
  const posts = await fetchPosts();
  return { posts };
};
```


## Error Handling in Load Functions

```typescript
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
  try {
    const data = await fetchData(params.id);
    if (!data) error(404, { message: 'Not found' });
    return { data };
  } catch (err) {
    error(500, { message: 'Server error' });
  }
};
```