---
name: svelte-type-safety
description: Enforce TypeScript strict mode, interface-based typing, and type-safe props/stores in Svelte projects
keywords: [typescript, types, interfaces, type-safety]
---

## When to Use
Apply when working with TypeScript in `.svelte` files, type definitions, or data structures.

## Type Safety Rules
- Use TypeScript for all code with `lang="ts"` attribute
- Enable strict mode in `tsconfig.json`
- Prefer interfaces over types for extensibility
- Avoid enums; use const objects instead
- Document complex types with JSDoc

## TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```


## Type Patterns

**Interface vs Type**:

```typescript
// Prefer: Interface (extensible)
interface User {
  id: string;
  name: string;
}

// Avoid: Type alias for objects
type User = { id: string; name: string };
```

**Const Objects Instead of Enums**:

```typescript
// Avoid enums
enum Status { Active, Inactive }

// Use const objects
const Status = {
  Active: 'active',
  Inactive: 'inactive'
} as const;

type StatusType = typeof Status[keyof typeof Status];
```

**Typed Props**:

```typescript
interface Props {
  title: string;
  count?: number;
}

let { title, count = 0 }: Props = $props();
```

**Typed Stores**:

```typescript
import { writable, type Writable } from 'svelte/store';

interface UserStore {
  id: string;
  name: string;
}

export const userStore: Writable<UserStore> = writable({
  id: '',
  name: ''
});
```


## Data Structure Typing

- Create interfaces for all API responses
- Type form data structures
- Use UTC timestamps with proper typing

```typescript
interface TimestampedData {
  createdAt: string; // ISO 8601 UTC
  updatedAt: string;
}
```