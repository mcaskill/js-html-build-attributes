# Error Module

> `@mcaskill/html-build-attributes/lib/error.js`

The error module provides custom `Error` objects thrown to escape filters
and when runtime errors occur.

> For all API functions listed:
>
> * `AttrName` is a string and represents an attribute name.
> * `AttrValue` is a string, boolean, or null, and represents a filtered attribute value.
> * `T` represents any data type.

## `FilterError()`

The `FilterError` object represents an error with a value to be filtered.

The [`BadValueError`](#badvalueerror) and [`TypeMismatchError`](#typemismatcherror)
objects extend the `FilterError` object.

### Syntax

```ts
new FilterError(message: string, options?: object)
```

## `FilterError.describeAttr()`

A static method to format the attribute name or value.

This method is used by the static creator methods to generate an error message.

### Syntax

```ts
FilterError.describeAttr(value?: T, name?: AttrName): string
```

### Example

```js
FilterError.describeAttr(null);
// → null

FilterError.describeAttr(undefined);
// → undefined

FilterError.describeAttr(true);
// → boolean

FilterError.describeAttr(42);
// → number

FilterError.describeAttr('hello');
// → string

FilterError.describeAttr([ 1, 2, 3 ]);
// → array

FilterError.describeAttr(new Date());
// → object

FilterError.describeAttr('hello', 'class');
// → attribute [class]
```

## `FilterError.createNotFilterable()`

A static method to create a new error object with a generic "is not filterable"
message derived from the provided parameters.

This method is recommended for creating `TypeMismatchError` objects.

### Syntax

```ts
FilterError.createNotFilterable(
  value?: T,
  name?: AttrName,
  options?: object
): FilterError
```

### Example

```js
function filterNumber(value) {
  if (typeof value === 'number') {
    return value;
  }

  throw new TypeMismatchError.createNotFilterable(value);
}
```

## `FilterError.createNotConcatenable()`

A static method to create a new error object with a generic "is not concatenable"
message derived from the provided parameters.

This method is recommended for creating `TypeMismatchError` objects.

### Syntax

```ts
FilterError.createNotConcatenable(
  value?: T,
  name?: AttrName,
  options?: object
): FilterError
```

### Example

```js
function filterList(value) {
  const tokens = [];

  for (const token of value) {
    try {
      tokens.push(filterString(token));
    } catch (err) {
      throw TypeMismatchError.createNotConcatenable(value, null, { cause: err });
    }
  }

  return tokens;
}
```

## `BadValueError()`

The `BadValueError` object represents a value that
a filter is unable to convert.

### Example

```js
function assertFiniteNumber(value) {
  if (Number.isFinite(value)) {
    return value;
  }

  throw new BadValueError('number is not finite');
}
```

## `TypeMismatchError()`

The `TypeMismatchError` object represents a value that
does not conform to the filter's constraints.

For the [compose module](/docs/api.compose.md) and
[aggregate filters](/docs/api.filter.md), this indicates a filter
does not accept the value and should maybe try another filter.

### Example

```js
function filterNumber(value) {
  if (typeof value === 'number') {
    return value;
  }

  throw new TypeMismatchError('value is not a number');
}
```
