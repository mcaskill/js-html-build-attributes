/**
 * Converts the number to a string.
 *
 * The sign of -0 is preserved.
 *
 * An empty string is returned for `Infinity` and 'NaN' values.
 *
 * @param   {*} value - The value to convert.
 * @returns {string} Returns the string representation of the number.
 */
export function convertNumberToString(value: unknown): string
{
    if (!Number.isFinite(value)) {
        return '';
    }

    const result = (value as number).toString();

    // Preserve negative zero because
    // conversion to string omits it.
    if (result === '0' && (1 / (value as number)) == -(1 / 0)) {
        return '-0';
    }

    return result;
}
