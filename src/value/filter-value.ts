/**
 * @typedef {import("../types.js").AttrValueFilter} AttrValueFilter
 */
import type {
    AttrName,
    AttrValue,
    AttrValueFilterFallback,
} from '../types.js';

import {
    filterFallback
} from './filter-fallback.js';

import {
    FilterError
} from '../error.js';

import {
    convertNumberToString
} from '../util/convert-number-to-string.js';

/**
 * Filters a value that is a string, number, boolean, or BigInt.
 *
 * @type   {AttrValueFilter}
 * @throws {FilterError}
 */
export function filterValue(
    value: unknown,
    name?: AttrName,
    fallback: AttrValueFilterFallback = false
): AttrValue {
    switch (typeof value) {
        case 'string': {
            return value;
        }

        case 'boolean': {
            if (name && name.startsWith('aria-')) {
                return value.toString();
            }

            return value;
        }

        case 'bigint': {
            return value.toString();
        }

        case 'number': {
            if (!Number.isFinite(value)) {
                throw FilterError.create('{attr} is not finite', value, name);
            }

            return convertNumberToString(value);
        }
    }

    return filterFallback(value, name, fallback);
}
