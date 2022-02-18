import type {
    AttrName,
    AttrValue,
} from '../types';

import {
    BadValueError,
    TypeMismatchError,
} from '../error.js';

import { convertNumberToString } from '../util/convert-number-to-string.js';

/**
 * Filters a value that is a string, number, boolean, or BigInt for a token list.
 *
 * @type   {AttrValueFilter}
 * @throws {TypeMismatchError}
 */
export function filterToken(value: unknown, name?: AttrName): AttrValue
{
    switch (typeof value) {
        case 'string': {
            return value;
        }

        case 'bigint':
        case 'boolean': {
            return value.toString();
        }

        case 'number': {
            if (!Number.isFinite(value)) {
                throw new BadValueError(
                    `${name || 'number'} is not finite`
                );
            }

            return convertNumberToString(value);
        }
    }

    throw TypeMismatchError.createNotFilterable(value, name);
}
