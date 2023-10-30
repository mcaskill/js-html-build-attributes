/**
 * @typedef {import("../types.js").AttrValueFilter} AttrValueFilter
 */
import type {
    AttrName,
    AttrValue,
    AttrValueFilter,
    AttrValueFilterFallback,
} from '../types.js';

import {
    filterFallback
} from './filter-fallback.js';

/**
 * Creates a filter function from a collection of filters that returns
 * the filtered value from the first filter that returns a value.
 *
 * @param   {AttrValueFilter[]} filters - One or more attribute value
 *     middleware filter functions.
 * @throws  {TypeError} If the array of filters is too small.
 * @throws  {TypeError} If the filters are not functions.
 * @returns {AttrValueFilter}
 */
export function createFilterMiddleware(
    filters: AttrValueFilter[]
): AttrValueFilter {
    if (!Array.isArray(filters) || filters.length < 1) {
        throw new TypeError(
            `createFilterMiddleware expected an array with at least 1 filter function`
        );
    }

    // Define the tail variable to assign the fallback value or function
    // from the constructed filter function.
    let tailFallback: AttrValueFilterFallback;

    const tailFilter = (value: unknown, name?: AttrName): AttrValue => filterFallback(value, name, tailFallback);

    const stacker = (next: AttrValueFilter, filter: AttrValueFilter) => {
        if (typeof filter !== 'function') {
            throw new TypeError(
                `createFilterMiddleware expected filter '${filter}' to be a function`
            );
        }

        return (value: unknown, name?: AttrName): AttrValue => filter(value, name, next);
    };

    // Reverse the array to process middleware like a queue:
    // first in, first out order (FIFO).
    filters = Array.from(filters);
    filters.reverse();

    const middleware = filters.reduce(stacker, tailFilter);

    /**
     * Filters a value through the middleware stack,
     * returning the first approved/filtered value.
     *
     * @type {AttrValueFilter}
     */
    function filterMiddleware(
        value: unknown,
        name?: AttrName,
        fallback: AttrValueFilterFallback = false
    ): AttrValue {
        tailFallback = fallback;

        return middleware(value, name);
    }

    return filterMiddleware;
}
