import type {
    AttrName,
    AttrValue,
} from '../types';

import { TypeMismatchError } from '../error.js';

import { isStringable } from '../util/is-stringable.js';

/**
 * Filters a value into its string representation or into a JSON string.
 *
 * @type   {AttrValueFilter}
 * @throws {TypeMismatchError}
 */
export function filterStringable(value: unknown, name?: AttrName): AttrValue
{
    if (value != null) {
        if (!Array.isArray(value)) {
            if (value instanceof Date) {
                return value.toISOString();
            }

            if (isStringable(value)) {
                return value.toString();
            }
        }

        return JSON.stringify(value);
    }

    throw TypeMismatchError.createNotFilterable(value, name);
}
