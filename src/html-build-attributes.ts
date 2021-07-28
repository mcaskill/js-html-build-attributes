/**
 * @file Defines a class for converting an object or a value
 * into a string of HTML attributes.
 */

/**
 * Map of attribute names and values.
 *
 * A primitive interpretation of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap `NamedNodeMap`}
 * and  {@link https://developer.mozilla.org/en-US/docs/Web/API/Attr `Attr`}.
 *
 * @typedef {Object<string, *>} HTMLAttributeMap
 */
type HTMLAttributeMap = Record<string, unknown>;

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
     * @param   {HTMLAttributeMap} attributes - An object of attribute names and values.
     * @returns {string|null} Returns a string of many HTML attributes
     *     or `null` if all attributes are invalid or empty.
     */
    composeAttributes(attributes: HTMLAttributeMap): string | null
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

        value = this.parseValue(value, name);

        switch (typeof value) {
            case 'boolean':
                return value ? name : null;

            case 'string':
                return `${name}="${this.escapeValue(value)}"`;
        }

        return null;
    }

    /**
     * Converts the value into a string or boolean.
     *
     * @param   {*}      value - The attribute value.
     * @param   {string} name  - The attribute name.
     * @returns {string|boolean|null} Returns the parsed value
     *     or `null` to ignore the attribute.
     */
    parseValue(value: unknown, name: string): string | boolean | null
    {
        if (this.isNil(value)) {
            return null;
        }

        if (Array.isArray(value)) {
            return this.parseArray(value, name);
        }

        switch (typeof value) {
            case 'boolean':
            case 'string':
                return value;

            case 'bigint':
                return value.toString();

            case 'number':
                return this.parseNumber(value, name);

            case 'object':
                return this.parseObject(value, name);
        }

        return null;
    }

    /**
     * Converts the number value into a string.
     *
     * @param   {number} value - The attribute values to stringify.
     * @param   {string} name  - The attribute name.
     * @returns {string|null} Returns the parsed value
     *     or `null` to ignore the attribute.
     */
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -- Preserve optional parameter.
    parseNumber(value: number, name: string): string | null
    {
        if (!Number.isFinite(value)) {
            return null;
        }

        return value.toString();
    }

    /**
     * Concatenates the array into a string separated by spaces.
     *
     * @param   {*[]}    value - The attribute values to stringify.
     * @param   {string} name  - The attribute name.
     * @returns {string|null} Returns the parsed value
     *     or `null` to ignore the attribute.
     */
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -- Preserve optional parameter.
    parseArray(value: unknown[], name: string): string | null
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
     * @param   {*}      value - The attribute value to stringify.
     * @param   {string} name  - The attribute name.
     * @returns {string|null} Returns the parsed value
     *     or `null` to ignore the attribute.
     */
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -- Preserve optional parameter.
    parseObject(value: unknown, name: string): string | null
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
     * Determines whether the value is `null` or `undefined`.
     *
     * @param  {*} value - The value to check.
     * @return {boolean} Returns `true` if the value is `null` or `undefined`,
     *     otherwise `false`.
     */
    isNil(value: unknown): boolean
    {
        return (value == null);
    }
}
