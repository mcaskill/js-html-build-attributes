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
 * Filters a value that is a string, number, boolean, or BigInt.
 *
 * @type {AttrValueFilter}
 */
export function filterValue(value: unknown, name?: AttrName): AttrValue
{
    if (value == null) {
        return null;
    }

    if (typeof value === 'boolean') {
        if (name && name.startsWith('aria-')) {
            return value.toString();
        }

        return value;
    }

    switch (typeof value) {
        case 'string': {
            return value;
        }

        case 'bigint': {
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
