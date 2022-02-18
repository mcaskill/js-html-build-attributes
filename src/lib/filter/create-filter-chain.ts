import type {
    AttrName,
    AttrValue,
    AttrValueFilter,
} from '../types';

/**
 * Creates a function to apply multiple filters to attribute values.
 *
 * @param   {AttrValueFilter[]} filters - Two or more attribute value filter functions.
 * @throws  {TypeError} If the array of filters is too small.
 * @throws  {TypeError} If a filter is not a function.
 * @returns {AttrValueFilter}
 */
export function createFilterChain(filters: AttrValueFilter[]): AttrValueFilter
{
    if (!Array.isArray(filters) || filters.length < 2) {
        throw new TypeError(
            `createFilterChain expected an array with at least 2 filter functions`
        );
    }

    for (const filter of filters) {
        if (typeof filter !== 'function') {
            throw new TypeError(
                `createFilterChain expected filter '${filter}' must be a function`
            );
        }
    }

    /**
     * Filters a value through a chain of filters.
     *
     * @type {AttrValueFilter}
     */
    function filterChain(value: unknown, name?: AttrName): AttrValue
    {
        for (const filter of filters) {
            value = filter(value, name);
        }

        return (value as AttrValue);
    }

    return filterChain;
}
