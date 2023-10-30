# Escape Attribute Value Module

## `escapeHTMLEntities()`

> [`@mcaskill/html-build-attributes/value/escape-html-entities.js`](/src/value/escape-html-entities.ts)

The function converts the following characters in a string to their
corresponding HTML entities: `&`, `<`, `>`, `"`, `'`, and `` ` ``.

### Syntax

```ts
escapeHTMLEntities(string: string): string
```

### Examples

```js
import {
  escapeHTMLEntities
} from '@mcaskill/html-build-attributes/value/escape-html-entities.js';

escapeHTMLEntities('{"id":1,"name":"Tim"}');
// → {&quot;id&quot;:1,&quot;name&quot;:&quot;Tim&quot;}

escapeHTMLEntities('<img>');
// → &lt;img&gt;
```
