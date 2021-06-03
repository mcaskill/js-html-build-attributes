# HTMLBuildAttributes

> ES2019, TypeScript 4 >= 4.3, Node 12 >= 12.20, Node 14 >= 14.14, Node 16

Generate a string of HTML attributes.

## Install

```
$ npm install @mcaskill/html-build-attributes
```

## Upgrade

This package follows [semantic versioning](https://semver.org/), which means
breaking changes may occur between major releases.

## Usage

```js
import htmlBuildAttributes from '@mcaskill/html-build-attributes';

const attrs = {
  'type':           'file',
  'id':             'avatar',
  'name':           'avatar',
  'class':          [ 'form-control', 'form-control-sm' ],
  'multiple':       true,
  'disabled':       false,
  'accept':         [ 'image/png', 'image/jpeg' ].join(','),
  'data-type':      null,
  'data-max-files': 3,
};

console.log(`<input ${htmlBuildAttributes.composeAttributes(attrs)}>`);
```

```html
<input type="file" id="avatar" name="avatar" class="form-control form-control-sm" multiple accept="image/png,image/jpeg" data-max-files="3">
```

Browse [`/examples`](/examples) for a list of demonstrations and enhancements.

## API

### Default Behaviour

If an attribute name is an empty string or contains [invalid characters][html-attribute-name],
a `SyntaxError` will be thrown.

If an attribute value is `null` or `undefined` (hereafter referred to as `nil`),
the attribute is ignored.

If an attribute value is an array, any `nil` elements of the array are removed
and the array is concatenated and separated by spaces. If the sanitized array
is empty, the attribute is ignored.

If an attribute value is a boolean and `true`, only the attribute name will be
rendered, otherwise the attribute is ignored.

If the attribute value is a BigInt, the attribute will be rendered.

If the attribute value is a finite number, the attribute will be rendered,
otherwise the attribute is ignored.

If the attribute value is a string, the attribute will be rendered even if empty.

If the attribute value is an object that implements [`toString`][Object.toString],
that method is called, otherwise it is [converted to a JSON string][JSON.stringify].

### `htmlBuildAttributes`

The default instance of [`HTMLBuildAttributes`](#HTMLBuildAttributes).

```js
import htmlBuildAttributes from '@mcaskill/html-build-attributes';

htmlBuildAttributes.composeAttributes({ 'class': [ 'btn', null, 'btn-primary' ] });
htmlBuildAttributes.composeAttribute('class', [ 'btn', null, 'btn-primary' ]);
// → class="btn btn-primary"

htmlBuildAttributes.parseValue({ id: 1, name: 'Tim' });
// → {"id":1,"name":"Tim"}

htmlBuildAttributes.escapeValue('{"id":1,"name":"Tim"}');
// → {&quot;id&quot;:1,&quot;name&quot;:&quot;Tim&quot;}
```

### `composeHTMLAttributes(attributes: object<string, any>): ?string`

A reference to `htmlBuildAttributes#composeHTMLAttributes()`, bound to the default
instance, from which you can generate a string of many HTML attributes.

```js
import { composeHTMLAttributes } from '@mcaskill/html-build-attributes';

composeHTMLAttributes({
  'id': 'modal',
  'aria-labelledby': 'modal-title',
});
// → id="modal" aria-labelledby="modal-title"

composeHTMLAttributes({
  'class': [],
  'disabled': false,
});
// → null
```

### `composeHTMLAttribute(name: string, value: any): ?string`

A reference to `htmlBuildAttributes#composeHTMLAttribute()`, bound to the default
instance, from which you can generate a string of one HTML attribute.

```js
import { composeHTMLAttribute } from '@mcaskill/html-build-attributes';

composeHTMLAttribute('class', 'btn btn-secondary');
// → class="btn btn-secondary"

composeHTMLAttribute('required', true);
// → required

composeHTMLAttribute('required', false);
// → null
```

### `HTMLBuildAttributes`

The base object to parse values for attributes and generate HTML attribute strings.

This object can be extended to customize the behaviour of HTML attributes, values,
and the final string.

```js
import { HTMLBuildAttributes } from '@mcaskill/html-build-attributes';
import he from 'he';

export class extends HTMLBuildAttributes {
  escapeValue(string) {
    return he.escape(string);
  }
}
```

## See Also

* [mcaskill/php-html-build-attributes](https://github.com/mcaskill/php-html-build-attributes) — 
  A PHP implementation of this package.
* [classnames](https://github.com/JedWatson/classnames) — 
  A simple utility for conditionally joining CSS class names together.
* [lodash.escape](https://lodash.com/docs/4.17.15#escape) — 
  A basic HTML entity encoder.
* [_he_](https://github.com/mathiasbynens/he) — 
  A robust HTML entity encoder/decoder.
* [Ambiguous ampersands](https://mathiasbynens.be/notes/ambiguous-ampersands), 
  2011, by Mathias Bynens


[falsy]:               https://developer.mozilla.org/en-US/docs/Glossary/Falsy
[html-attribute-name]: https://html.spec.whatwg.org/dev/syntax.html#syntax-attribute-name
[JSON.stringify]:      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[Object.toString]:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
