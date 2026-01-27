---
title: Strategic Suspense Boundaries
impact: HIGH
impactDescription: faster initial paint
tags: async, suspense, layout-shift, tanstack-query
---

## Strategic Suspense Boundaries

Use Suspense boundaries with TanStack Query to show the wrapper UI faster while data loads.

**Incorrect (loading state blocks entire component):**

```tsx
function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData
  })

  if (isLoading) return <Skeleton /> // Blocks entire layout

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <DataDisplay data={data} />
      </div>
      <div>Footer</div>
    </div>
  )
}
```

The entire layout waits for data even though only the middle section needs it.

**Correct (wrapper shows immediately, data streams in):**

```tsx
import { useSuspenseQuery } from '@tanstack/react-query'

function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <Suspense fallback={<Skeleton />}>
          <DataDisplay />
        </Suspense>
      </div>
      <div>Footer</div>
    </div>
  )
}

function DataDisplay() {
  const { data } = useSuspenseQuery({
    queryKey: ['data'],
    queryFn: fetchData
  })
  return <div>{data.content}</div>
}
```

Sidebar, Header, and Footer render immediately. Only DataDisplay waits for data.

**Alternative (multiple components sharing same query):**

```tsx
function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <Suspense fallback={<Skeleton />}>
        <DataDisplay />
        <DataSummary />
      </Suspense>
      <div>Footer</div>
    </div>
  )
}

function DataDisplay() {
  const { data } = useSuspenseQuery({
    queryKey: ['data'],
    queryFn: fetchData
  })
  return <div>{data.content}</div>
}

function DataSummary() {
  // Same queryKey = automatic deduplication, shares cached data
  const { data } = useSuspenseQuery({
    queryKey: ['data'],
    queryFn: fetchData
  })
  return <div>{data.summary}</div>
}
```

TanStack Query automatically deduplicates requests with the same queryKey. Both components share the same cached data, so only one fetch occurs.

**When NOT to use this pattern:**

- Critical data needed for layout decisions (affects positioning)
- Small, fast queries where suspense overhead isn't worth it
- When you want to avoid layout shift (loading → content jump)

**Trade-off:** Faster initial paint vs potential layout shift. Choose based on your UX priorities.
