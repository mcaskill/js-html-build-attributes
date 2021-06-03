/**
 * @file Example: Customizing array separator for an HTML attribute.
 *
 * Example of a child class of `HTMLBuildAttributes` that overrides the
 * `parseArray()` method to change the separator string based on the
 * attribute name.
 */

import { HTMLBuildAttributes } from '@mcaskill/html-build-attributes';

export default class extends HTMLBuildAttributes
{
    /**
     * Concatenates the array into a string separated by spaces
     * or commas.
     *
     * @param   {*[]}    value  - The attribute values to stringify.
     * @param   {string} [name] - The attribute name.
     * @returns {string|null} Returns the parsed value
     *     or `null` to ignore the attribute.
     */
    parseArray(value, name)
    {
        value = value.filter((token) => (token != null));

        if (!value.length) {
            return null;
        }

        if (name === 'accept') {
            return value.join(', ');
        }

        return value.join(' ');
    }
}
