/**
 * @file Example: Supported array values for an HTML attribute.
 *
 * Example of a child class of `HTMLBuildAttributes` that overrides the
 * `parseArray()` method to define supported array elements similar to
 * {@link https://dom.spec.whatwg.org/#concept-supported-tokens `DOMTokenList`}.
 */

import { HTMLBuildAttributes } from '@mcaskill/html-build-attributes';

/**
 * @type {string[]} allowedValuesOfIFrameSandbox - List of
 *     {@link https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox allowed values}
 *     of the `iframe` element's `sandbox` attribute.
 */
const allowedValuesOfIFrameSandbox = [
    'allow-forms',
    'allow-modals',
    'allow-orientation-lock',
    'allow-pointer-lock',
    'allow-popups',
    'allow-popups-to-escape-sandbox',
    'allow-presentation',
    'allow-same-origin',
    'allow-scripts',
    'allow-top-navigation',
    'allow-top-navigation-by-user-activation',
    'allow-downloads',
];

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
        if (name === 'sandbox') {
            value.forEach((token) => this.assertSupportedSandboxToken(token));
        }

        if (!value.length) {
            return null;
        }

        return value.join(' ');
    }

    /**
     * Asserts that the "sandbox" token is supported, throws an Error if not.
     *
     * @param  {string} token - The token.
     * @throws {TypeError} If the token is insupported.
     * @return {void}
     */
    assertSupportedSandboxToken(token)
    {
        if (!this.isSupportedSandboxToken(token)) {
            throw new TypeError(`'${token}' is not a supported "sanbox" token`);
        }
    }

    /**
     * Determines whether the "sandbox" token is supported.
     *
     * @param  {string} token - The token.
     * @return {boolean} Returns `true` if the token is supported,
     *     otherwise `false`.
     */
    isSupportedSandboxToken(token)
    {
        return allowedValuesOfIFrameSandbox.includes(token);
    }
}
