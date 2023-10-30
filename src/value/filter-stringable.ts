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
    isStringable
} from '../util/is-stringable.js';

/**
 * Filters a value into its string representation or into a JSON string.
 *
 * @type {AttrValueFilter}
 */
export function filterStringable(
    value: unknown,
    name?: AttrName,
    fallback: AttrValueFilterFallback = false
): AttrValue {
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

    return filterFallback(value, name, fallback);
}
