# HTML Build Attributes

> ES2017, TypeScript 4, Node 14

Generate a string of HTML attributes.

## Install

```shell
npm install @mcaskill/html-build-attributes
```

## Upgrade

This package follows [semantic versioning](https://semver.org/),
which means breaking changes may occur between major releases.

## Usage

> Browse [`/examples`](/examples) for a list of demonstrations and enhancements.

The following example demonstrates the [default module](#default-module):

```js
import {
  composeAttribute,
  composeAttributes,
  escapeAttributeValue,
  filterAttributeValue,
} from '@mcaskill/html-build-attributes/default.js';

const inputAttrs = {
  'type':           'file',
  'name':           'avatar',
  'multiple':       true,
  'disabled':       false,
  'accept':         [ 'image/png', 'image/jpeg' ],
  'data-type':      null,
  'data-max-files': 3,
};

console.log(`<input ${composeAttributes(inputAttrs)}>`);
// → <input type="file" name="avatar" multiple accept="image/png,image/jpeg" data-max-files="3">

const buttonAttrs = {
  'type':              'button',
  'id':                'ThemeLight',
  'aria-labelledby':   [ 'ThemeLight', 'ThemeLbl' ],
  'aria-pressed':      false,
  'data-toggle-theme': true,
};

console.log(`<button ${composeAttributes(buttonAttrs)}>Light</button>`);
// → <button type="button" id="ThemeLight" aria-labelledby="ThemeLight ThemeLbl" aria-pressed="false" data-toggle-theme>Light</button>

composeAttributes({ class: [], disabled: false });
// → null

composeAttribute('class', 'avatar');
// → class="avatar"

composeAttribute('aria-hidden', true);
// → aria-hidden="true"

composeAttribute('required', true);
// → required

composeAttribute('required', false);
// → null

filterAttributeValue({ id: 1, name: 'Tim' });
// → {"id":1,"name":"Tim"}

escapeAttributeValue('{"id":1,"name":"Tim"}');
// → {&quot;id&quot;:1,&quot;name&quot;:&quot;Tim&quot;}
```

## API

> View [API documentation](/docs)

### Default Module

> `@mcaskill/html-build-attributes/default.js`

A preset instance of [`HTMLBuildAttributes`](/docs/api.compose.md)
is available ([featured above](#usage)). It's equiped with basic filters and
escape of common HTML entities, which should cover most HTML tags.

* **`composeAttribute(name: string, value: unknown): string|null`**

  A reference to [`HTMLBuildAttributes#composeAttribute()`](/docs/api.compose.md#htmlbuildattributescomposeattribute)
  from which you can generate a string of one HTML attribute.

* **`composeAttributes(attributes: object<string, unknown>): string|null`**

  A reference to [`HTMLBuildAttributes#composeAttributes()`](/docs/api.compose.md#htmlbuildattributescomposeattributes)
  from which you can generate a string of many HTML attributes.

* **`escapeAttributeValue(value: string): string`**

  A reference to [`HTMLBuildAttributes#escapeAttributeValue()`](/docs/api.compose.md#htmlbuildattributesescapeattributevalue)
  from which you can convert special characters to their corresponding HTML entities.

* **`filterAttributeValue(value: unknown, name?: string): string|boolean|null`**

  A reference to [`HTMLBuildAttributes#filterAttributeValue()`](/docs/api.compose.md#htmlbuildattributesfilterattributevalue)
  from which you can approve, reject, and parse a value for an HTML attribute.

## Implementations in other languages

* [mcaskill/php-html-build-attributes](https://github.com/mcaskill/php-html-build-attributes) — 
  A PHP implementation of this package.

## Related

* [`classnames`](https://github.com/JedWatson/classnames) — 
  A simple utility for conditionally joining CSS class names together.
* [`clsx`](https://github.com/lukeed/clsx) —
  A faster & smaller drop-in replacement for the `classnames` module.
* [`he`](https://github.com/mathiasbynens/he) — 
  A robust HTML entity encoder/decoder.
* [`lodash.escape`](https://lodash.com/docs/4.17.15#escape) — 
  A basic HTML entity encoder.

## See Also

* [Ambiguous ampersands](https://mathiasbynens.be/notes/ambiguous-ampersands), 
  2011, by Mathias Bynens
