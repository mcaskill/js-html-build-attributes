/**
 * @typedef {import("../types.js").AttrValueFilter} AttrValueFilter
 */
import type {
    AttrName,
    AttrValue,
    AttrValueFilter,
    AttrValueFilterFallback,
} from '../types.js';

/**
 * Creates a filter function that applies the given filter to a given value or
 * it's returned result if the value is a function.
 *
 * @param   {AttrValueFilter} filter
 * @throws  {TypeError} If the filter is not a function.
 * @returns {AttrValueFilter}
 */
export function createFilterCallable(
    filter: AttrValueFilter
): AttrValueFilter {
    if (typeof filter !== 'function') {
        throw new TypeError(
            `createFilterCallable expected the filter to be a function`
        );
    }

    /**
     * Filters the result of the value if it is a function,
     * otherwise the value itself.
     *
     * The fallback argument is left undefined to allow the inner
     * filter function to use its own default value.
     *
     * @type {AttrValueFilter}
     */
    function filterCallable(
        value: unknown,
        name?: AttrName,
        fallback?: AttrValueFilterFallback
    ): AttrValue {
        if (typeof value === 'function') {
            value = value();
        }

        return filter(value, name, fallback);
    }

    return filterCallable;
}
