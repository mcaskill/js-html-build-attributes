/**
 * @file Example: Rendering closure values for an HTML attribute.
 *
 * Example of a child class of `HTMLBuildAttributes` that overrides the
 * `parseValue()` method to resolve any value that is a function.
 */

import { HTMLBuildAttributes } from '@mcaskill/html-build-attributes';

export default class extends HTMLBuildAttributes
{
    /**
     * Converts the value into a string or boolean.
     *
     * @param   {*}      value  - The attribute value.
     * @param   {string} [name] - The attribute name.
     * @returns {string|boolean|null} Returns the parsed value
     *     or `null` to ignore the attribute.
     */
    parseValue(value, name)
    {
        if (typeof value === 'function') {
            value = value();
        }

        return super.parseValue(value, name);
    }
}
