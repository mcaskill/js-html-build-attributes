# Filter Modules

> [`@mcaskill/html-build-attributes/lib/filter/index.js`](/src/lib/filter/index.ts)

The filter modules are a collection of functions and function factories
to approve, reject, and mutate a value.

> For all API functions listed:
>
> * `T` represents any data type.
> * `AttrName` is a string and represents an attribute name.
> * `AttrValue` is a string or boolean and represents a filtered attribute value.
> * `AttrValueFilter` is a function signature representing the filter.

## `AttrValueFilter`

This type represents the signature of a filter function.

### Syntax

```ts
(value: T, name?: AttrName, fallback?: AttrValueFilter | AttrValue) => AttrValue
```

### Example

```js
function filterNumber(value, name, fallback = false) {
  if (typeof value === 'number') {
    return value;
  }

  return fallback;
}
```

For a custom filter to play nice as [middleware](#createfiltermiddleware),
it is recommended to use the [`filterFallback()`](#filterfallback) function
to resolve any fallbacks that might be a function:

```js
import {
    filterFallback,
} from '@mcaskill/html-build-attributes/lib/filter/filter-fallback.js';

function filterNumber(value, name, fallback = false) {
  if (typeof value === 'number') {
    return value;
  }

  return filterFallback(value, name, fallback);
}
```

## `createFilterCallable()`

> [`@mcaskill/html-build-attributes/lib/filter/filter-callable.js`](/src/lib/filter/filter-callable.ts)

Creates a [filter function](#attrvaluefilter) that applies the given filter to
a given value or it's returned result if the value is a function.

### Syntax

```ts
createFilterCallable(
  filter: AttrValueFilter
): AttrValueFilter
```

### Examples

```js
import {
  createFilterCallable
} from '@mcaskill/html-build-attributes/lib/filter/filter-function.js';

const filterNumber = (value, name, fallback = false) => {
  if (typeof value === 'number') {
    return value;
  }

  return fallback;
};

const filterValueOrClosure = createFilterCallable(
  filterNumber
);

filterValueOrClosure(42);
// → 42

filterValueOrClosure(() => (42 * 2));
// → 84

filterValueOrClosure('hello');
// → false

filterValueOrClosure(() => 'hello');
// → false
```

## `createFilterList()`

> [`@mcaskill/html-build-attributes/lib/filter/filter-list.js`](/src/lib/filter/filter-list.ts)

Creates a [filter function](#attrvaluefilter) that applies a filter to
each item of the array and concatenates the list into a string separated by
a customizable delimiter.

### Syntax

```ts
createFilterList(
  filter: AttrValueFilter,
  oneOrManySeparators: string | object<AttrName, string>,
  fallbackSeparator?: string
): AttrValueFilter
```

### Examples

```js
import {
  createFilterList
} from '@mcaskill/html-build-attributes/lib/filter/filter-list.js';

const filterTokenList = createFilterList(filterToken, {
  'coords': ',',
}, ':');

filterTokenList([ 'a', 'b', 'c' ]);
// → a:b:c

filterTokenList([ 'a', 'b', 'c' ], 'coords');
// → a,b,c

const scopedFilterTokenList = createFilterList(filterToken, {
  'class': ' ',
});

scopedFilterTokenList([ 'a', 'b', 'c' ], 'class');
// → a b c

scopedFilterTokenList([ 'a', 'b', 'c' ]);
// → TypeError<array separator is not defined>

scopedFilterTokenList([ 'a', 'b', 'c' ], 'rel');
// → TypeError<attribute [rel] separator is not defined>
```

## `createFilterMiddleware()`

> [`@mcaskill/html-build-attributes/lib/filter/filter-middleware.js`](/src/lib/filter/filter-middleware.ts)

Creates a [filter function](#attrvaluefilter) from a collection of filters that
returns the filtered value from the first filter that returns a value.

### Syntax

```ts
createFilterMiddleware(
  filters: AttrValueFilter[]
): AttrValueFilter
```

### Examples

```js
import {
  createFilterMiddleware
} from '@mcaskill/html-build-attributes/lib/filter/filter-middleware.js';

const filterString = (value, name, next) => {
  if (typeof value === 'string') {
    return value;
  }

  return next(value, name);
};

const filterNumber = (value, name, next) => {
  if (typeof value === 'number') {
    return value;
  }

  return next(value, name);
};

const filterByType = createFilterMiddleware([
  filterString,
  filterNumber,
]);

filterByType('hello');
// → 'hello'

filterByType(42);
// → 42

filterByType([]);
// → false

filterByType(true);
// → false

filterByType(true, 'test', 'fallback');
// → 'fallback'
```

## `filterFallback()`

> [`@mcaskill/html-build-attributes/lib/filter/filter-fallback.js`](/src/lib/filter/filter-fallback.ts)

This function resolves the fallback of an attribute value filter.

If the fallback argument is a function it is assumed to be another filter
and is called with the value and name arguments, otherwise it is assumed
to be the value to return.

### Syntax

```ts
filterFallback(
  value: T,
  name?: AttrName,
  fallback?: AttrValueFilter | AttrValue
): AttrValue
```

### Examples

```js
import {
  filterFallback
} from '@mcaskill/html-build-attributes/lib/filter/filter-fallback.js';

function filterNumber(value, name, fallback = false) {
  if (typeof value === 'number') {
    return value;
  }

  return filterFallback(value, name, fallback);
}

filterNumber('hello', 'value');
// → false

filterNumber('hello', 'value', 0);
// → 0

filterNumber('hello', 'value', (value, name) => Number.parseInt(value));
// → NaN
```

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
