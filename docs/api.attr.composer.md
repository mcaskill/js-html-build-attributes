# Compose Attributes Module

> [`@mcaskill/html-build-attributes/composer.js`](/src/composer.ts)

The compose module provides the `Composer` class which
essentially behaves like a gloried key/value concatenator.

If the attribute name is an empty string or contains
[invalid characters][syntax-attribute-name],
a `TypeError` will be thrown.

> For all API functions listed:
>
> * `AttrName` is a string and represents an attribute name.
> * `AttrValue` is a string or boolean and represents a filtered attribute value.
> * `T` represents any data type.

## `Composer()`

### Syntax

```ts
new Composer(
  attributeValueFilter?: function,
  attributeValueEscaper?: function,
  attributesComparator?: function
)
```

Its constructor accepts up to three arguments:

* An [_attribute value filter_ function](/docs/api.value.filter.md)
  that approves, rejects, and mutates a value.
* An [_attribute value escaper_ function](/docs/api.value.escape.md)
  to encode any special characters in a value.
* A [_attribute comparator_ function](/docs/api.attr.sort.md)
  for sorting collections of attributes.

Each function will be bound to the class instance for convenience.

### Example

```js
import { Composer } from '@mcaskill/html-build-attributes/composer.js';
import he from 'he';

const htmlBuildAttributes = new Composer(
  (value, name) => {/* … */},
  he.escape,
  ([ aName ], [ bName ]) => (aName < bName ? -1 : 1)
);
```

## `Composer#composeAttribute()`

Generate a string of a HTML attribute from a name and value.

### Syntax

```ts
Composer.prototype.composeAttribute(name: AttrName, value: T): string|null
```

### Examples

```js
htmlBuildAttributes.composeAttribute('class', 'avatar');
// → class="avatar"

htmlBuildAttributes.composeAttribute('required', true);
// → required

htmlBuildAttributes.composeAttribute('required', false);
// → null
```

## `Composer#composeAttributes()`

Generate a string of many HTML attributes from a map of names and values.

### Syntax

```ts
Composer.prototype.composeAttributes(attributes: object<AttrName, T>): string|null
```

### Example

```js
const inputAttrs = {
  'type':           'file',
  'name':           'avatar',
  'multiple':       true,
  'disabled':       false,
  'accept':         [ 'image/png', 'image/jpeg' ],
  'data-type':      null,
  'data-max-files': 3,
};

console.log(htmlBuildAttributes.composeAttributes(inputAttrs));
// → type="file" name="avatar" multiple accept="image/png,image/jpeg" data-max-files="3"
```

## `Composer#compareAttributes()`

Compares HTML attributes for sorting.

This method is defined from the constructor's `attributesComparator` parameter.

### Syntax

```ts
Composer.prototype.compareAttributes: undefined
Composer.prototype.compareAttributes(
  a: [ AttrName, T ],
  b: [ AttrName, T ]
): number
```

### Examples

```js
const inputAttrs = {
  'type':           'file',
  'name':           'avatar',
  'multiple':       true,
  'disabled':       false,
  'accept':         [ 'image/png', 'image/jpeg' ],
  'data-type':      null,
  'data-max-files': 3,
};

console.log(htmlBuildAttributes.composeAttributes(inputAttrs));
// → accept="image/png,image/jpeg" data-max-files="3" multiple name="avatar" type="file"

Object.entries(attributes).sort(htmlBuildAttributes.compareAttributes);
// → [
//     [ 'accept',         [ 'image/png', 'image/jpeg' ] ],
//     [ 'data-max-files', 3 ],
//     [ 'data-type',      null ],
//     [ 'disabled',       false ],
//     [ 'multiple',       true ],
//     [ 'name',           'avatar' ],
//     [ 'type',           'file' ],
//   ]
```

## `Composer#escapeAttributeValue()`

Convert special characters to their corresponding HTML entities.

This method is defined from the constructor's `attributeValueEscaper` parameter.

### Syntax

```ts
Composer.prototype.escapeAttributeValue: undefined
Composer.prototype.escapeAttributeValue(value: string): string
```

### Example

```js
htmlBuildAttributes.escapeAttributeValue('{"id":1,"name":"Tim"}');
// → {&quot;id&quot;:1,&quot;name&quot;:&quot;Tim&quot;}
```

## `Composer#filterAttributeValue()`

Reject, approve, and parse a value for an HTML attribute.

This method is defined from the constructor's `attributeValueFilter` parameter.

### Syntax

```ts
Composer.prototype.filterAttributeValue: undefined
Composer.prototype.filterAttributeValue(value: T, name?: AttrName): AttrValue
```

### Examples

```js
htmlBuildAttributes.filterAttributeValue('avatar');
// → avatar

htmlBuildAttributes.filterAttributeValue({ id: 1, name: 'Tim' });
// → {"id":1,"name":"Tim"}

htmlBuildAttributes.filterAttributeValue(true);
// → true

htmlBuildAttributes.filterAttributeValue(false);
// → false

htmlBuildAttributes.filterAttributeValue(null);
// → false
```

[syntax-attribute-name]: https://html.spec.whatwg.org/dev/syntax.html#syntax-attribute-name
