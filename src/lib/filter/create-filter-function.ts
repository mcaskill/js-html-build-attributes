import type {
    AttrName,
    AttrValue,
    AttrValueFilter,
} from '../types.js';

/**
 * Creates a function to filter a value that might be a function.
 *
 * @param   {AttrValueFilter} filter
 * @throws  {TypeError} If the filter is not a function.
 * @returns {AttrValueFilter}
 */
function createFilterFunction(
    filter: AttrValueFilter
): AttrValueFilter {
    if (typeof filter !== 'function') {
        throw new TypeError(
            `createFilterFunction expected the filter to be a function`
        );
    }

    /**
     * If a value is a function, its return value is filtered,
     * otherwise the value itself is filtered.
     *
     * @type {AttrValueFilter}
     */
    function filterFunction(value: unknown, name?: AttrName): AttrValue
    {
        if (typeof value === 'function') {
            value = value();
        }

        return filter(value, name);
    }

    return filterFunction;
}

export { createFilterFunction };
