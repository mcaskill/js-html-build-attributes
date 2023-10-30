# Example: Validating tokens for an HTML attribute

This example demonstrates a variant of the [`filterToken`][filter-token] function
that validates string tokens similar to [`DOMTokenList#add`][dom-domtokenlist-add]:

> For each _token_ in _tokens_:
> 
> 1. If _token_ is the empty string, then throw a "`SyntaxError`" `DOMException`.
> 2. If _token_ contains any ASCII whitespace, then throw an "`InvalidCharacterError`" `DOMException`.

[dom-domtokenlist-add]: https://dom.spec.whatwg.org/#dom-domtokenlist-add
[filter-token]:         /src/value/filter-token.ts
