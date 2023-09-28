/**
 * @typedef {import("../types.js").AttrValueFilter} AttrValueFilter
 * @typedef {import("../types.js").AttrValueSeparator} AttrValueSeparator
 * @typedef {import("../types.js").AttrValueSeparatorMap} AttrValueSeparatorMap
 */
import type {
    AttrName,
    AttrValue,
    AttrValueFilter,
    AttrValueFilterFallback,
    AttrValueSeparator,
    AttrValueSeparatorMap,
} from '../types.js';

import {
    filterFallback
} from './filter-fallback.js';

function createFilterList(
    filter: AttrValueFilter,
    supportedSeparators: AttrValueSeparatorMap
): AttrValueFilter;

function createFilterList(
    filter: AttrValueFilter,
    defaultSeparator: AttrValueSeparator
): AttrValueFilter;

function createFilterList(
    filter: AttrValueFilter,
    supportedSeparators: AttrValueSeparatorMap,
    fallbackSeparator: AttrValueSeparator
): AttrValueFilter;

/**
 * Creates a filter function that applies a filter to each item of the array and
 * concatenates the list into a string separated by a customizable delimiter.
 *
 * @param   {AttrValueFilter}                          filter
 * @param   {AttrValueSeparator|AttrValueSeparatorMap} oneOrManySeparators
 * @param   {?AttrValueSeparator}                      [fallbackSeparator] -
 *     If `fallbackSeparator` is specified, this argument is used as
 *     the fallback separator when the the filtered attribute does not
 *     have a {@see oneOrManySeparators specified separator}.
 *
 *     If `oneOrManySeparators` is not specified, this argument is used as
 *     the default separator.
 *
 *     If this argument is not specified, the filter will throw an error
 *     if filtered attribute is unspecified in `oneOrManySeparators`.
 * @throws  {TypeError} If the filter is not a function.
 * @throws  {TypeError} If the separator or map of separators are missing or invalid.
 * @returns {AttrValueFilter}
 */
function createFilterList(
    filter: AttrValueFilter,
    oneOrManySeparators: AttrValueSeparator | AttrValueSeparatorMap,
    fallbackSeparator?: AttrValueSeparator
): AttrValueFilter {
    if (typeof filter !== 'function') {
        throw new TypeError(
            `createFilterList expected the filter to be a function`
        );
    }

    let defaultSeparator: AttrValueSeparator | undefined;
    let supportedSeparators: AttrValueSeparatorMap | undefined;

    switch (
        (oneOrManySeparators != null)
        ? (typeof oneOrManySeparators)
        : null
    ) {
        case 'string': {
            defaultSeparator = oneOrManySeparators as AttrValueSeparator;
            break;
        }

        case 'object': {
            supportedSeparators = oneOrManySeparators as AttrValueSeparatorMap;

            if (typeof fallbackSeparator === 'string') {
                defaultSeparator = fallbackSeparator;
            }
            break;
        }

        default: {
            throw new TypeError(
                'createFilterList expected one separator or a map of separators'
            );
        }
    }

    /**
     * Filters a value that is an array.
     *
     * If the value is an array of strings and numbers, these items are
     * concatenated into a string separated by a delimiter.
     *
     * If the processed array is empty, the attribute is rejected.
     *
     * @type   {AttrValueFilter}
     * @throws {TypeError} If the filter has no separators.
     */
    function filterList(
        value: unknown,
        name?: AttrName,
        fallback: AttrValueFilterFallback = false
    ): AttrValue {
        if (!Array.isArray(value) || !value.length) {
            return filterFallback(value, name, fallback);
        }

        const items = [];

        for (let item of value) {
            item = filter(item, name);

            if (typeof item === 'string') {
                items.push(item);
            } else {
                return filterFallback(value, name, fallback);
            }
        }

        /** @type {AttrValueSeparator} */
        let separator: AttrValueSeparator;

        if (supportedSeparators && name != null && supportedSeparators[name] != null) {
            separator = supportedSeparators[name];
        } else if (defaultSeparator != null) {
            separator = defaultSeparator;
        } else {
            const message = (name != null)
                ? `array separator is not defined for attribute [${name}]`
                : 'array separator is not defined';

            throw new TypeError(message);
        }

        return items.join(separator);
    }

    return filterList;
}

export { createFilterList };
