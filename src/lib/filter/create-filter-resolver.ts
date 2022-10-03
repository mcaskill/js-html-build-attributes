import type {
    AttrName,
    AttrValue,
    AttrValueFilter,
} from '../types';

import { TypeMismatchException } from '../error.js';

/**
 * Creates a resolver function to filter attribute values.
 *
 * @param   {AttrValueFilter[]} filters             - One or more attribute value filter functions.
 * @param   {?boolean}          [useFilterFunction] - If an attribute value is a function,
 *     filter its return value.
 * @throws  {TypeError} If the array of filters is too small.
 * @throws  {TypeError} If the filter is not a function.
 * @returns {AttrValueFilter}
 */
export function createFilterResolver(
    filters: AttrValueFilter[],
    useFilterFunction?: boolean
): AttrValueFilter {
    if (!Array.isArray(filters) || filters.length < 1) {
        throw new TypeError(
            `createFilterResolver an array with at least 1 filter function`
        );
    }

    for (const filter of filters) {
        if (typeof filter !== 'function') {
            throw new TypeError(
                `createFilterResolver expected filter '${filter}' must be a function`
            );
        }
    }

    /**
     * Returns the filtered value from the first filter
     * that approves the supplied value.
     *
     * @type   {AttrValueFilter}
     * @throws {TypeMismatchException} If the value could not be filtered.
     * @throws {Error}
     */
    function filterResolver(value: unknown, name?: AttrName): AttrValue
    {
        for (const filter of filters) {
            try {
                return filter(value, name);
            } catch (err) {
                if (err instanceof TypeMismatchException) {
                    continue;
                }

                throw err;
            }
        }

        throw TypeMismatchException.createNotFilterable(value, name);
    }

    /**
     * Filters a value that is a function.
     *
     * The function is called and its returned value is
     * passed through the collection of function filters.
     *
     * @type   {AttrValueFilter}
     * @throws {TypeMismatchException}
     */
    function filterFunction(value: unknown, name?: AttrName): AttrValue
    {
        if (typeof value === 'function') {
            return filterResolver(value(), name);
        }

        throw TypeMismatchException.createNotFilterable(value, name);
    }

    if (useFilterFunction) {
        /**
         * Call the filter function first.
         */
        filters.unshift(filterFunction);
    }

    return filterResolver;
}
