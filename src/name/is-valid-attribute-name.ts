/**
 * @file Attribute Name Validation
 */

/**
 * @type {RegExp} - Match a valid HTML attribute name.
 */
export const regexValidAttributeName = /^[a-z:_]([a-z0-9:\-_]+)?$/i;

/**
 * Checks if the attribute name is a valid.
 *
 * @param   {string} name - The attribute name.
 * @returns {boolean} Returns `true` if the attribute name is valid,
 *     otherwise `false`.
 */
export function isValidAttributeName(name: string): boolean
{
    if (name) {
        return regexValidAttributeName.test(name);
    }

    return false;
}

/**
 * Asserts that the attribute name is valid, throws an Error if not.
 *
 * @param   {string} name - The attribute name.
 * @throws  {TypeError} If the attribute name is invalid.
 * @returns {void}
 */
export function assertValidAttributeName(name: string): void
{
    if (!isValidAttributeName(name)) {
        throw new TypeError(
            `'${name}' is not a valid attribute name`
        );
    }
}
