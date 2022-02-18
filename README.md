# HTML Build Attributes

> ES2017, TypeScript 4 >= 4.4, Node 12 >= 12.20, Node 14 >= 14.14, Node 16

Generate a string of HTML attributes.

## Install

```
$ npm install @mcaskill/html-build-attributes
```

## Upgrade

This package follows [semantic versioning][semver], which means
breaking changes may occur between major releases.

## Usage

> Browse [`/examples`](/examples) for a list of demonstrations and enhancements.

```js
import htmlBuildAttributes from '@mcaskill/html-build-attributes';

const inputAttrs = {
  'type':           'file',
  'name':           'avatar',
  'multiple':       true,
  'disabled':       false,
  'accept':         [ 'image/png', 'image/jpeg' ],
  'data-type':      null,
  'data-max-files': 3,
};

console.log(`<input ${htmlBuildAttributes.composeAttributes(inputAttrs)}>`);
// → <input type="file" name="avatar" multiple accept="image/png,image/jpeg" data-max-files="3">

const buttonAttrs = {
  'type':              'button',
  'id':                'ThemeLight',
  'aria-labelledby':   [ 'ThemeLight', 'ThemeLbl' ],
  'aria-pressed':      false,
  'data-toggle-theme': true,
};

console.log(`<button ${htmlBuildAttributes.composeAttributes(buttonAttrs)}>Light</button>`);
// → <button type="button" id="ThemeLight" aria-labelledby="ThemeLight ThemeLbl" aria-pressed="false" data-toggle-theme>Light</button>

htmlBuildAttributes.composeAttributes({
  'class': [],
  'disabled': false,
});
// → null

htmlBuildAttributes.composeAttribute('aria-hidden', true);
// → aria-hidden="true"

htmlBuildAttributes.composeAttribute('required', true);
// → required

htmlBuildAttributes.composeAttribute('required', false);
// → null

htmlBuildAttributes.filterAttributeValue({ id: 1, name: 'Tim' });
// → {"id":1,"name":"Tim"}

htmlBuildAttributes.escapeAttributeValue('{"id":1,"name":"Tim"}');
// → {&quot;id&quot;:1,&quot;name&quot;:&quot;Tim&quot;}
```

## API

### Module: `@mcaskill/html-build-attributes`

The main entry point provides a default instance of [`HTMLBuildAttributes`](#module-mcaskillhtml-build-attributeslibcompose)
paired with generic filters, and basic string escape, that should cover most use cases.

* `htmlBuildAttributes` — An instance of `HTMLBuildAttributes`.
* `composeHTMLAttributes(attributes: object<string, unknown>): ?string` —
  A reference to `htmlBuildAttributes#composeHTMLAttributes()` from which you
  can generate a string of many HTML attributes.
* `composeHTMLAttribute(name: string, value: unknown): ?string` —
  A reference to `htmlBuildAttributes#composeHTMLAttribute()` from which you
  can generate a string of one HTML attribute.

### Module: `@mcaskill/html-build-attributes/lib/compose`

The `HTMLBuildAttributes` class is primarily a gloried key/value concatenator.

Its constructor accepts three arguments:

* _Filter_ function that approves, rejects, and mutates a value.
* _Escape_ function to encode any special characters in a value.
* _Comparator_ function for sorting collections of attributes.

```js
import { HTMLBuildAttributes } from '@mcaskill/html-build-attributes/lib/compose';
import he from 'he';

const htmlBuildAttributes = new HTMLBuildAttributes(
  (value, name) => {/* … */},
  he.escape,
  ([ aName ], [ bName ]) => (aName < bName ? -1 : 1)
);
```

If the attribute name is an empty string or contains [invalid characters][syntax-attribute-name],
a `TypeError` will be thrown.

### Module: `@mcaskill/html-build-attributes/lib/escape`

The `escapeAttributeValue` function converts the following characters in a string
to their corresponding HTML entities:  
`&`, `<`, `>`, `"`, `'`, and `` ` ``.

### Modules: `@mcaskill/html-build-attributes/lib/filter`

#### Factory: `createFilterArray`

Creates a function that applies a filter to each item of the array and
concatenates the list into a string separated by a customizable delimiter.

#### Factory: `createFilterChain`

Creates a function that applies multiple filters
to a value.

#### Factory: `createFilterResolver`

Creates a function, from a collection of filters, that returns the filtered
value from the first filter that returns a value.

Optionally, the resolver can check if the input value is a function and filter
its return value.

#### Filter: `filterStringable`

This function filters a value into its string representation or
into a JSON string.

1. If a `Date`, the attribute is rendered and the value is converted
   to [ISO format][Date.toISOString].

1. If [stringable][Object.toString], the attribute is rendered and
   the value is converted to its string representation.

1. Otherwise, the attribute is rendered and the value is serialized
   as a [JSON string][JSON.stringify].

#### Filter: `filterToken`

This function filters a value that is a string, number, boolean, or BigInt.

1. If a _string_, the token is concatenated.

   Leading and trailing whitespace is preserved.

   An empty string is rendered.

1. If a _boolean_, the token is converted to a string and is concatenated.

1. If a _BigInt_, the token is concatenated.

1. If a _number_ and finite, the token is concatenated.

   A sign of `-0` is preserved.

#### Filter: `filterValue`

This function filters a value that is a string, number, boolean, or BigInt.

1. If _nullish_ (`null` or `undefined`), the attribute is discarded.

1. If a _boolean_ and

   1. the attribute name starts with `aria-`,
      the boolean is converted to a string.

   1. is `true`, only the attribute name is rendered.

   1. is `false`, the attribute is discarded.

1. If a _string_, the attribute is rendered.

   Leading and trailing whitespace is preserved.

   An empty string is rendered.

1. If a _BigInt_, the attribute is rendered.

1. If a _number_ and finite, the attribute is rendered.

   A sign of `-0` is preserved.

### Modules: `@mcaskill/html-build-attributes/lib/sort`

#### Factory: `createOrderedAttributesComparator`

Creates a comparison function to sort attributes with support for regular
expressions and a wildcard.

A standalone `*` represents all unspecified attributes, useful for inserting
these at a specific index among the ordered attributes.

> View [example](/examples/compose-attributes-expected-order) of sorting.

## See Also

* [mcaskill/php-html-build-attributes](https://github.com/mcaskill/php-html-build-attributes) — 
  A PHP implementation of this package.
* [`classnames`](https://github.com/JedWatson/classnames) — 
  A simple utility for conditionally joining CSS class names together.
* [`clsx`](https://github.com/lukeed/clsx) —
  A faster & smaller drop-in replacement for the `classnames` module.
* [`lodash.escape`](https://lodash.com/docs/4.17.15#escape) — 
  A basic HTML entity encoder.
* [`he`](https://github.com/mathiasbynens/he) — 
  A robust HTML entity encoder/decoder.
* [Ambiguous ampersands](https://mathiasbynens.be/notes/ambiguous-ampersands), 
  2011, by Mathias Bynens


[Date.toISOString]:      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
[domtokenlist-add]:      https://dom.spec.whatwg.org/#ref-for-dom-domtokenlist-add%E2%91%A0
[falsy]:                 https://developer.mozilla.org/en-US/docs/Glossary/Falsy
[JSON.stringify]:        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[Object.toString]:       https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
[semver]:                https://semver.org/
[syntax-attribute-name]: https://html.spec.whatwg.org/dev/syntax.html#syntax-attribute-name
