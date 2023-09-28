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
 * Filters a value that is a string, number, boolean, or BigInt for a token list.
 *
 * This filter is designed to replicate most of the behaviour of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList DOMTokenList}.
 *
 * @type   {AttrValueFilter}
 * @throws {FilterError}
 */
export function filterToken(
    value: unknown,
    name?: AttrName,
    fallback: AttrValueFilterFallback = false
): AttrValue {
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
                throw FilterError.create('{attr} is not finite', value, name);
            }

            return convertNumberToString(value);
        }
    }

    return filterFallback(value, name, fallback);
}
