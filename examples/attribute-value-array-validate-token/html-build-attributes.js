/**
 * @file Example: Validating array values for an HTML attribute.
 *
 * Example of a child class of `HTMLBuildAttributes` that overrides the
 * `parseArray()` method to validate that each element of the array similar
 * to {@link https://dom.spec.whatwg.org/#dom-domtokenlist-add `DOMTokenList`}.
 */

import { HTMLBuildAttributes } from '@mcaskill/html-build-attributes';

/**
 * @type {RegExp} regexHasASCIIWhitespace - Match first ASCII whitespace character.
 */
const regexHasASCIIWhitespace = /[\t\n\f\r ]/;

export default class extends HTMLBuildAttributes
{
    /**
     * Concatenates the array into a string separated by spaces.
     *
     * @param   {*[]}    value  - The attribute values to stringify.
     * @param   {string} [name] - The attribute name.
     * @returns {string|null} Returns the parsed value
     *     or `null` to ignore the attribute.
     */
    parseArray(value, name)
    {
        value.forEach((token) => this.assertValidToken(token));

        if (!value.length) {
            return null;
        }

        return value.join(' ');
    }

    /**
     * Asserts that the token is valid, throws an Error if not.
     *
     * @param  {string} token - The token.
     * @throws {SyntaxError} If the token is invalid.
     * @return {void}
     */
    assertValidToken(token)
    {
        if (!this.isValidToken(token)) {
            throw new SyntaxError(`'${token}' is not a valid token`);
        }
    }

    /**
     * Determines whether the token is valid.
     *
     * @param  {string} token - The token.
     * @return {boolean} Returns `true` if the token is valid,
     *     otherwise `false`.
     */
    isValidToken(token)
    {
        return (token.length && !regexHasASCIIWhitespace.test(token));
    }
}
