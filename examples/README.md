# Examples

A list of demonstrations and enhancements for `HTMLBuildAttributes`.

## Enhancements

### [Conditionally rendering a single HTML attribute](/attribute-condition)

Example of a child class of `HTMLBuildAttributes` that overrides the
`composeAttribute()` method to add an optional `condition` parameter to
control whether an attribute is rendered or not, independent of the value.

### [Rendering complex array values for an HTML attribute](/attribute-value-array)

Example of a child class of `HTMLBuildAttributes` that overrides the
`parseArray()` method to parse each element of the array and recursively
flatten the array to a single level to be concatenated into a string.

### [Customizing array separator for an HTML attribute](/attribute-value-array-join)

Example of a child class of `HTMLBuildAttributes` that overrides the
`parseArray()` method to change the separator string based on the
attribute name.

### [Supported array values for an HTML attribute](/attribute-value-array-supported-token)

Example of a child class of `HTMLBuildAttributes` that overrides the
`parseArray()` method to define supported array elements similar to
[`DOMTokenList`](https://dom.spec.whatwg.org/#concept-supported-tokens).

### [Validating array values for an HTML attribute](/attribute-value-array-validate-token)

Example of a child class of `HTMLBuildAttributes` that overrides the
`parseArray()` method to validate that each element of the array similar
to [`DOMTokenList`](https://dom.spec.whatwg.org/#dom-domtokenlist-add).

### [Rendering closure values for an HTML attribute](/attribute-value-closure)

Example of a child class of `HTMLBuildAttributes` that overrides the
`parseValue()` method to resolve any value that is a function.
