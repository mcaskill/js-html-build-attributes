/**
 * @file Example: Conditionally rendering a single HTML attribute.
 *
 * Example of a child class of `HTMLBuildAttributes` that overrides the
 * `composeAttribute()` method to add an optional `condition` parameter to
 * control whether an attribute is rendered or not, independent of the value.
 */

import { HTMLBuildAttributes } from '@mcaskill/html-build-attributes';

export default class extends HTMLBuildAttributes
{
    /**
     * Generates a string of a single HTML attribute.
     *
     * @param   {string}  name        - The attribute name.
     * @param   {*}       value       - The attribute value.
     * @param   {boolean} [condition] - The condition to render the attribute.
     * @returns {string|null} Returns a string of a single HTML attribute
     *     or a `null` if the attribute is empty or invalid.
     */
    composeAttribute(name, value, condition)
    {
        this.assertValidName(name);

        if (condition == null) {
            condition = value;
        }

        if (this.resolveCondition(condition)) {
            value = this.parseValue(value, name);

            if (value != null) {
                if (value === true) {
                    return name;
                }

                return `${name}="${this.escapeValue(value)}"`;
            }
        }

        return null;
    }

    /**
     * Resolves whether to render an attribute or not.
     *
     * @param  {*}       condition - The condition to resolve.
     * @return {boolean} Returns `true` to render an attribute,
     *     otherwise `false` to ignore the attribute.
     */
    resolveCondition(condition)
    {
        switch (typeof condition) {
            case 'boolean':
                return condition;

            case 'number':
                return Number.isFinite(condition);

            case 'bigint':
            case 'string':
                return true;
        }

        if (this.isNil(condition)) {
            return false;
        }

        if (Array.isArray(condition)) {
            return (condition.length > 0);
        }

        return !!condition;
    }
}
