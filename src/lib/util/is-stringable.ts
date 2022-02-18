/**
 * Checks if value is an object that can be represented as a string.
 *
 * @param   {*} value - The value to check.
 * @returns {boolean} Returns `true` if the value is an object having
 *     a `toString()` method, otherwise `false`.
 */
// eslint-disable-next-line @typescript-eslint/ban-types -- Allow catch-all 'object' return type.
export function isStringable(value: unknown): value is object
{
    if (value && typeof value === 'object') {
        return (value.toString !== Object.prototype.toString);
    }

    return false;
}
