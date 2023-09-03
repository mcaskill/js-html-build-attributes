# Filter Modules

> [`@mcaskill/html-build-attributes/lib/filter/index.js`](/src/lib/filter/index.ts)

The filter modules are a collection of functions and function factories
to approve, reject, and mutate a value.

Filters will throw a `TypeMismatchException` if the value is rejected
or a `BadValueException` if the value is invalid.

See [Error API documentation](/docs/api.error.md) for more information.

> For all API functions listed:
>
> * `AttrName` is a string and represents an attribute name.
> * `AttrValue` is a string or boolean and represents a filtered attribute value.
> * `T` represents any data type.

## `createFilterArray()`

> [`@mcaskill/html-build-attributes/lib/filter/create-filter-array.js`](/src/lib/filter/create-filter-array.ts)

Creates a function that applies a filter to each item of the array and
concatenates the list into a string separated by a customizable delimiter.

### Syntax

```ts
createFilterArray(
  filter: function,
  oneOrManySeparators: string|object<string, string>,
  fallbackSeparator?: string
): function
```

### Examples

```js
import {
  createFilterArray
} from '@mcaskill/html-build-attributes/lib/filter/create-filter-array.js';

const filterTokenList = createFilterArray(filterToken, {
  'coords': ',',
}, ':');

filterTokenList([ 'a', 'b', 'c' ]);
// → a:b:c

filterTokenList([ 'a', 'b', 'c' ], 'coords');
// → a,b,c

const scopedFilterTokenList = createFilterArray(filterToken, {
  'class': ' ',
});

scopedFilterTokenList([ 'a', 'b', 'c' ], 'class');
// → a b c

scopedFilterTokenList([ 'a', 'b', 'c' ]);
// → TypeError<array separator is not defined>

scopedFilterTokenList([ 'a', 'b', 'c' ], 'rel');
// → TypeError<attribute [rel] separator is not defined>
```

## `createFilterChain()`

> [`@mcaskill/html-build-attributes/lib/filter/create-filter-chain.js`](/src/lib/filter/create-filter-chain.ts)

Creates a function that applies a collection of filters to a value.

### Syntax

```ts
createFilterChain(filters: function[]): function
```

### Examples

```js
import {
  createFilterChain
} from '@mcaskill/html-build-attributes/lib/filter/create-filter-chain.js';

const capitalize = (v) => v.replace(/\b\w/g, (w) => w.toUpperCase());
const reverse    = (v) => [ ...v ].reverse().join('');

const capitalizeThenReverse = createFilterChain([
  capitalize,
  reverse,
]);

capitalizeThenReverse('hello world');
// → dlroW olleH

const reverseThenCapitalize = createFilterChain([
  reverse,
  capitalize,
]);

reverseThenCapitalize('hello world');
// → Dlrow Olleh
```

## `createFilterResolver()`

> [`@mcaskill/html-build-attributes/lib/filter/create-filter-resolver.js`](/src/lib/filter/create-filter-resolver.ts)

Creates a function from a collection of filters that returns the filtered
value from the first filter that returns a value.

### Syntax

```ts
createFilterResolver(
  filters: function[],
  useFilterFunction?: boolean
): function
```

### Examples

```js
import {
  createFilterResolver
} from '@mcaskill/html-build-attributes/lib/filter/create-filter-resolver.js';

import {
  TypeMismatchException
} from '@mcaskill/html-build-attributes/lib/error.js';

const filterString = (value, name) => {
  if (typeof value === 'string') {
    return value;
  }

  throw TypeMismatchException.createNotFilterable(value, name);
};

const filterNumber = (value, name) => {
  if (typeof value === 'number') {
    return value;
  }

  throw TypeMismatchException.createNotFilterable(value, name);
};

const filterByType = createFilterResolver([
  filterString,
  filterNumber,
], true);

filterByType('hello');
// → hello

filterByType(42);
// → 42

filterByType(() => (42 * 2));
// → 84

filterByType(true);
// → TypeError<boolean is not filterable>

filterByType(true, 'test');
// → TypeError<attribute [test] is not filterable>
```

Optionally, the resolver can check if the input value is a function and filter
its return value.

## `filterStringable()`

> [`@mcaskill/html-build-attributes/lib/filter/filter-stringable.js`](/src/lib/filter/filter-stringable.ts)

This function converts a value to a string representation or to a JSON string.

### Syntax

```ts
filterStringable(value: T, name?: AttrName): AttrValue
```

### Description

If the value is not _nullish_ (`null` or `undefined`) and:

1. a `Date`, the attribute is rendered and the value is converted
   to [ISO format][Date.toISOString].

1. [stringable][Object.toString], the attribute is rendered and
   the value is converted to its string representation.

1. Otherwise, the attribute is rendered and the value is serialized
   as a [JSON string][JSON.stringify].

### Examples

```js
import {
  filterStringable
} from '@mcaskill/html-build-attributes/lib/filter/filter-stringable.js';

filterStringable(new Date(2006, 0, 2, 15, 4, 5));
// → 2006-01-02T20:04:05.000Z

class Person {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

filterStringable(new Person(1, 'Tim'));
// → {"id":1,"name":"Tim"}

class JsonablePerson extends Person {
  toJSON() {
    return `${this.id}:${this.name}`;
  }
}

filterStringable(new JsonablePerson(1, 'Tim'));
// → "1:Tim"

class StringablePerson extends Person {
  toString() {
    return this.name;
  }
}

filterStringable(new StringablePerson(1, 'Tim'));
// → Tim
```

## `filterToken()`

> [`@mcaskill/html-build-attributes/lib/filter/filter-token.js`](/src/lib/filter/filter-token.ts)

This function filters a value that is a string, number, boolean, or `BigInt`.

This filter is designed to replicate the behaviour of most [token list][DOMTokenList]
attributes such as `accept`, `class`, `coords`, `rel`, `sizes`, and `srcset`.

### Syntax

```ts
filterToken(value: T, name?: AttrName): AttrValue
```

### Description

If the value is:

1. a _string_, the value is concatenated.

   Leading and trailing whitespace is preserved.

   An empty string is rendered.
1. a _boolean_, the value is converted to a string and is concatenated.

1. a _BigInt_, the value is concatenated.

1. a _number_ and finite, the value is concatenated.

   A sign of `-0` is preserved.

## `filterValue()`

> [`@mcaskill/html-build-attributes/lib/filter/filter-value.js`](/src/lib/filter/filter-value.ts)

This function filters a value that is a string, number, boolean, or `BigInt`.

This filter is designed to replicate the behaviour of most attributes including
[boolean attributes][attributes-bool] and [WAI-ARIA attributes][attributes-aria].

### Syntax

```ts
filterValue(value: T, name?: AttrName): AttrValue
```

### Description

If the value is:

1. _nullish_ (`null` or `undefined`), the attribute is discarded.

1. a _boolean_ and

    1. the attribute name starts with `aria-`,
      the boolean is converted to a string.

    1. is `true`, only the attribute name is rendered.

    1. is `false`, the attribute is discarded.

1. a _string_, the attribute is rendered.

   Leading and trailing whitespace is preserved.

   An empty string is rendered.

1. a _BigInt_, the attribute is rendered.

1. a _number_ and finite, the attribute is rendered.

   A sign of `-0` is preserved.

[attributes-aria]:  https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes
[attributes-bool]:  https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#boolean_attributes
[Date.toISOString]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
[DOMTokenList]:     https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList
[JSON.stringify]:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[Object.toString]:  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
