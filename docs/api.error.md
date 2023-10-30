# Error Module

> [`@mcaskill/html-build-attributes/error.js`](/src/error.ts)

The error module provides a custom `Error` object meant to be used by
filter functions. This is mostly useful to catch errors related to
attribute value filtering.

> For all API functions listed:
>
> * `T` represents any data type.
> * `AttrName` is a string and represents an attribute name.
> * `AttrValue` is a string or boolean and represents a filtered attribute value.

## `FilterError()`

The `FilterError` object represents an error with a value being filtered.

### Syntax

```ts
new FilterError(message: string, options?: object)
```

## `FilterError.describeAttr()`

A static method to format the attribute name or value.

This method is used by the static creator method to generate a descriptor
for the placeholder token.

### Syntax

```ts
FilterError.describeAttr(value?: T, name?: AttrName): string
```

### Examples

```js
FilterError.describeAttr(null);
// → 'null'

FilterError.describeAttr(undefined);
// → 'undefined'

FilterError.describeAttr(true);
// → 'boolean'

FilterError.describeAttr(42);
// → 'number'

FilterError.describeAttr([ 1, 2, 3 ]);
// → 'Array'

FilterError.describeAttr({});
// → 'Object'

FilterError.describeAttr(new Date());
// → 'Date'

FilterError.describeAttr('hello');
// → 'string'

FilterError.describeAttr('hello', 'class');
// → 'attribute [class]'
```

## `FilterError.create()`

A static method to create a new error object with a message where `{attr}`
is a placeholder that will be substituded with a name or value.

### Syntax

```ts
FilterError.create(
  message: string,
  value: T,
  name?: AttrName,
  options?: object
): FilterError
```

### Example

```js
function filterNumber(value, name) {
  if (typeof value === 'number') {
    return value;
  }

  throw FilterError.create('{attr} is not a number', value, name);
}

filterNumber(true);
// → Uncaught FilterError: boolean is not a number
```
