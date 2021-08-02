/**
 * @file Defines a class for converting an object or a value
 * into a string of HTML attributes.
 */

/**
 * Map of HTML attribute names and values.
 *
 * A primitive interpretation of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap `NamedNodeMap`}
 * and {@link https://developer.mozilla.org/en-US/docs/Web/API/Attr `Attr`}.
 *
 * @typedef {Object<string, *>} AttributeMap
 */
type AttributeMap = Record<string, unknown>;

/**
 * Value of an HTML attribute.
 *
 * @typedef {string|boolean|null} FilteredValue
 */
type FilteredValue = string | boolean | null;

/**
 * Map of characters to entities.
 *
 * @typedef {Object<string, string>} EscapeMap
 */
type EscapeMap = Record<string, string>;

/**
 * @type {RegExp} - Match a valid HTML attribute name.
 */
export const regexValidAttributeName = /^[a-z:_]([a-z0-9:\-_]+)?$/i;

/**
 * The escape function and related variables are derived from Lodash (4.0.1),
 * which is subject to the {@link https://github.com/lodash/lodash/blob/master/LICENSE MIT license}.
 *
 * @var {RegExp}    regexUnescaped    - Match all special characters.
 * @var {RegExp}    regexHasUnescaped - Match first special character.
 * @var {EscapeMap} escapeMap         - Map of characters to HTML entities.
 */
export const regexUnescaped = /[&<>"'`]/g;
export const regexHasUnescaped = RegExp(regexUnescaped.source);
export const escapeMap: EscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;',
};

/**
 * HTML attributes composer.
 */
export default class HTMLBuildAttributes
{
    /**
     * Generates a string of many HTML attributes.
     *
     * @param   {AttributeMap} attributes -
     *     An object of attribute names and values.
     * @returns {string|null} Returns a string of many HTML attributes
     *     or `null` if all attributes are invalid or empty.
     */
    composeAttributes(attributes: AttributeMap): string | null
    {
        const html = [];

        for (const [ name, value ] of Object.entries(attributes)) {
            const attribute = this.composeAttribute(name, value);

            if (!this.isNil(attribute)) {
                html.push(attribute);
            }
        }

        if (!html.length) {
            return null;
        }

        return html.join(' ');
    }

    /**
     * Generates a string of a single HTML attribute.
     *
     * @param   {string} name  - The attribute name.
     * @param   {*}      value - The attribute value.
     * @returns {string|null} Returns a string of a single HTML attribute
     *     or a `null` if the attribute is empty or invalid.
     */
    composeAttribute(name: string, value: unknown): string | null
    {
        this.assertValidName(name);

        value = this.filterValue(value, name);

        switch (typeof value) {
            case 'boolean':
                return value ? name : null;

            case 'string':
                return `${name}="${this.escapeValue(value)}"`;
        }

        return null;
    }

    /**
     * Filters the value into a string or boolean.
     *
     * @param   {*}      value - The attribute value to filter.
     * @param   {string} name  - The attribute name.
     * @returns {FilteredValue} Returns the filtered value
     *     or `null` to ignore the attribute.
     */
    filterValue(value: unknown, name: string): FilteredValue
    {
        if (this.isNil(value)) {
            return null;
        }

        if (Array.isArray(value)) {
            return this.filterArray(value, name);
        }

        switch (typeof value) {
            case 'boolean':
            case 'string':
                return value;

            case 'bigint':
                return value.toString();

            case 'number':
                return this.filterNumber(value, name);

            case 'object':
                return this.filterObject(value, name);
        }

        return null;
    }

    /**
     * Filters a value that is a number or BigInt.
     *
     * @param   {*}      value - The attribute value to filter.
     * @param   {string} name  - The attribute name.
     * @returns {FilteredValue} Returns the filtered value or `null`.
     */
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -- Preserve optional parameter.
    filterNumber(value: unknown, name: string): FilteredValue
    {
        if (!Number.isFinite(value)) {
            return null;
        }

        return value.toString();
    }

    /**
     * Filters a value that is a list of tokens.
     *
     * Arrays will be concatenated into a string separated by spaces.
     *
     * @param   {*}      value - The attribute value to filter.
     * @param   {string} name  - The attribute name.
     * @returns {FilteredValue} Returns the filtered value or `null`.
     */
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -- Preserve optional parameter.
    filterArray(value: unknown, name: string): FilteredValue
    {
        value = value.filter((token: unknown): boolean => (token != null));

        if (!value.length) {
            return null;
        }

        return value.join(' ');
    }

    /**
     * Converts the object to its string representation or into a JSON string.
     *
     * @param   {*}      value - The attribute value to filter.
     * @param   {string} name  - The attribute name.
     * @returns {FilteredValue} Returns the filtered value or `null`.
     */
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -- Preserve optional parameter.
    filterObject(value: unknown, name: string): FilteredValue
    {
        if (typeof value === 'object' && value !== null) {
            if (value.toString !== Object.prototype.toString) {
                return value.toString();
            }
        }

        return JSON.stringify(value);
    }

    /**
     * Converts special characters to their corresponding HTML entities.
     *
     * @param   {string} string - The string to escape.
     * @returns {string} Returns the escaped string.
     */
    escapeValue(string: string): string
    {
        if (string && regexHasUnescaped.test(string)) {
            return string.replace(
                regexUnescaped,
                (chr: string): string => escapeMap[chr]
            );
        }

        return string;
    }

    /**
     * Asserts that the attribute name is valid, throws an Error if not.
     *
     * @param  {string} name - The attribute name.
     * @throws {SyntaxError} If the attribute name is invalid.
     * @return {void}
     */
    assertValidName(name: string): void
    {
        if (!this.isValidName(name)) {
            throw new SyntaxError(`'${name}' is not a valid attribute name`);
        }
    }

    /**
     * Determines whether the attribute name is valid.
     *
     * @param  {string} name - The attribute name.
     * @return {boolean} Returns `true` if the attribute name is valid,
     *     otherwise `false`.
     */
    isValidName(name: string): boolean
    {
        return (!!name && regexValidAttributeName.test(name));
    }

    /**
     * Checks if value is `null` or `undefined`.
     *
     * Note: `undefined` and `null` are
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#loose_equality_using_ loosely equal}.
     *
     * Adapted from {@link https://lodash.com/docs/4.17.15#isNil `_.isNil`},
     * {@link https://github.com/lodash/lodash/blob/4.17.15/LICENSE license MIT}
     *
     * @param  {*} value - The value to check.
     * @return {boolean} Returns `true` if the value is nullish,
     *     otherwise `false`.
     */
    isNil(value: unknown): boolean
    {
        return (value == null);
    }
}
