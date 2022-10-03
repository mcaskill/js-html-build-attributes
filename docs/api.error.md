# Error Module

> `@mcaskill/html-build-attributes/lib/error.js`

The error module provides custom `Error` objects thrown to escape filters
and when runtime errors occur.

> For all API functions listed:
>
> * `AttrName` is a string and represents an attribute name.
> * `AttrValue` is a string, boolean, or null, and represents a filtered attribute value.
> * `T` represents any data type.

## `FilterException()`

The `FilterException` object represents an error with a value to be filtered.

The [`BadValueException`](#badvalueerror) and [`TypeMismatchException`](#typemismatcherror)
objects extend the `FilterException` object.

### Syntax

```ts
new FilterException(message: string, options?: object)
```

## `FilterException.describeAttr()`

A static method to format the attribute name or value.

This method is used by the static creator methods to generate an error message.

### Syntax

```ts
FilterException.describeAttr(value?: T, name?: AttrName): string
```

### Example

```js
FilterException.describeAttr(null);
// → null

FilterException.describeAttr(undefined);
// → undefined

FilterException.describeAttr(true);
// → boolean

FilterException.describeAttr(42);
// → number

FilterException.describeAttr('hello');
// → string

FilterException.describeAttr([ 1, 2, 3 ]);
// → array

FilterException.describeAttr(new Date());
// → object

FilterException.describeAttr('hello', 'class');
// → attribute [class]
```

## `FilterException.createNotFilterable()`

A static method to create a new error object with a generic "is not filterable"
message derived from the provided parameters.

This method is recommended for creating `TypeMismatchException` objects.

### Syntax

```ts
FilterException.createNotFilterable(
  value?: T,
  name?: AttrName,
  options?: object
): FilterException
```

### Example

```js
function filterNumber(value) {
  if (typeof value === 'number') {
    return value;
  }

  throw new TypeMismatchException.createNotFilterable(value);
}
```

## `FilterException.createNotConcatenable()`

A static method to create a new error object with a generic "is not concatenable"
message derived from the provided parameters.

This method is recommended for creating `TypeMismatchException` objects.

### Syntax

```ts
FilterException.createNotConcatenable(
  value?: T,
  name?: AttrName,
  options?: object
): FilterException
```

### Example

```js
function filterList(value) {
  const tokens = [];

  for (const token of value) {
    try {
      tokens.push(filterString(token));
    } catch (err) {
      throw TypeMismatchException.createNotConcatenable(value, null, { cause: err });
    }
  }

  return tokens;
}
```

## `BadValueException()`

The `BadValueException` object represents a value that
a filter is unable to convert.

### Example

```js
function assertFiniteNumber(value) {
  if (Number.isFinite(value)) {
    return value;
  }

  throw new BadValueException('number is not finite');
}
```

## `TypeMismatchException()`

The `TypeMismatchException` object represents a value that
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

  throw new TypeMismatchException('value is not a number');
}
```
