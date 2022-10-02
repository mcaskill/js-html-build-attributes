# Escape Module

## `escapeHTMLEntities()`

> `@mcaskill/html-build-attributes/lib/escape/escape-html-entities.js`

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
} from '@mcaskill/html-build-attributes/lib/escape/escape-html-entities.js';

escapeHTMLEntities('{"id":1,"name":"Tim"}');
// → {&quot;id&quot;:1,&quot;name&quot;:&quot;Tim&quot;}

escapeHTMLEntities('<img>');
// → &lt;img&gt;
```
