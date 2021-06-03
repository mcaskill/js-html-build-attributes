/**
 * @file Example: Rendering complex array values for an HTML attribute.
 *
 * Example of a child class of `HTMLBuildAttributes` that overrides the
 * `parseArray()` method to parse each element of the array and recursively
 * flatten the array to a single level to be concatenated into a string.
 */

import { HTMLBuildAttributes } from '@mcaskill/html-build-attributes';

export default class extends HTMLBuildAttributes
{
    /**
     * Recursively concatenates and parses the array into a string
     * separated by spaces.
     *
     * @param   {*[]}    value  - The attribute values to stringify.
     * @param   {string} [name] - The attribute name.
     * @returns {string|null} Returns the parsed value
     *     or `null` to ignore the attribute.
     */
    parseArray(value, name)
    {
        value = this.parseTokenList(...value);

        if (!value.length) {
            return null;
        }

        return value.join(' ');
    }

    /**
     * Parses one or more tokens into a single-level array of strings.
     *
     * @param   {...*} token - A token to parse.
     * @returns {(string|number)[]} Returns the parsed tokens.
     */
    parseTokenList(...args)
    {
        const tokens = [];

        for (const arg of args) {
            if (arg == null) {
                continue;
            }

            if (Array.isArray(arg)) {
                if (arg.length) {
                    const subset = this.parseTokenList(...arg);
                    if (subset.length) {
                        tokens.push(...subset);
                    }
                }

                continue;
            }

            switch (typeof arg) {
                case 'bigint':
                    tokens.push(arg.toString());
                    continue;

                case 'number':
                    if (Number.isFinite(arg)) {
                        tokens.push(arg);
                    }
                    continue;

                case 'string':
                    tokens.push(arg);
                    continue;

                case 'object':
                    if (arg.toString !== Object.prototype.toString) {
                        const str = arg.toString();
                        tokens.push(str);
                    }

                    for (const [ key, condition ] of Object.entries(arg)) {
                        if (condition) {
                            tokens.push(key);
                        }
                    }
                    continue;
            }
        }

        return tokens;
    }
}
