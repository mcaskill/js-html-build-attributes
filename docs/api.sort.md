# Sort Module

## `createOrderedAttributesComparator()`

> [`@mcaskill/html-build-attributes/lib/sort/sort-ordered-attributes.js`](/src/lib/sort/sort-ordered-attributes.ts)

Creates a comparison function to sort attributes alphabetically
with support for regular expressions and a wildcard.

A standalone `*` represents all unspecified attributes, useful for inserting
these at a specific index among the ordered attributes.

### Syntax

```ts
import {
  createOrderedAttributesComparator
} from '@mcaskill/html-build-attributes/lib/sort/sort-ordered-attributes.js';

createOrderedAttributesComparator(expectedOrder: string[]): function
```

### Example

> View [example of sorting](/examples/compose-attributes-expected-order).
