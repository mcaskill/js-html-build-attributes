/**
 * @typedef {import("../types.js").AttrValueFilter} AttrValueFilter
 */
import type {
    AttrName,
    AttrValue,
    AttrValueFilterFallback,
} from '../types.js';

/**
 * Resolves the fallback of an attribute value filter.
 *
 * If the fallback argument is a function it is assumed to be another filter
 * and is called with the value and name arguments, otherwise it is assumed
 * to be the value to return.
 *
 * @type {AttrValueFilter}
 */
export function filterFallback(
    value: unknown,
    name?: AttrName,
    fallback: AttrValueFilterFallback = false
): AttrValue {
    if (typeof fallback === 'function') {
        return fallback(value, name);
    }

    return fallback;
}
