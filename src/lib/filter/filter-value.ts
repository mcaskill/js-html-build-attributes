/**
 * @typedef {import("../types.js").AttrValueFilter} AttrValueFilter
 */
import type {
    AttrName,
    AttrValue,
} from '../types.js';

import {
    BadValueException,
    TypeMismatchException,
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
        return false;
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
                throw new BadValueException(
                    `${name || 'number'} is not finite`
                );
            }

            return convertNumberToString(value);
        }
    }

    throw TypeMismatchException.createNotFilterable(value, name);
}
