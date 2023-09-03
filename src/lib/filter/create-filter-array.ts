import type {
    AttrName,
    AttrValue,
    AttrValueFilter,
    AttrValueSeparator,
    AttrValueSeparatorMap,
} from '../types.js';

import { TypeMismatchException } from '../error.js';

function createFilterArray(
    filter: AttrValueFilter,
    supportedSeparators: AttrValueSeparatorMap
): AttrValueFilter;

function createFilterArray(
    filter: AttrValueFilter,
    defaultSeparator: AttrValueSeparator
): AttrValueFilter;

function createFilterArray(
    filter: AttrValueFilter,
    supportedSeparators: AttrValueSeparatorMap,
    fallbackSeparator: AttrValueSeparator
): AttrValueFilter;

/**
 * Creates a function to filter a value that is an array.
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
function createFilterArray(
    filter: AttrValueFilter,
    oneOrManySeparators: AttrValueSeparator | AttrValueSeparatorMap,
    fallbackSeparator?: AttrValueSeparator
): AttrValueFilter {
    if (typeof filter !== 'function') {
        throw new TypeError(
            `createFilterArray expected the filter to be a function`
        );
    }

    let defaultSeparator: AttrValueSeparator | undefined;
    let supportedSeparators: AttrValueSeparatorMap | undefined;

    switch (typeof oneOrManySeparators) {
        case 'string': {
            defaultSeparator = oneOrManySeparators;
            break;
        }

        case 'object': {
            if (oneOrManySeparators != null) {
                supportedSeparators = oneOrManySeparators;

                if (typeof fallbackSeparator === 'string') {
                    defaultSeparator = fallbackSeparator;
                }
                break;
            }
            // falls through
        }

        default: {
            throw new TypeError(
                'createFilterArray expected one separator or a map of separators'
            );
        }
    }

    /**
     * Filters a value that is an array.
     *
     * If the value is an array of strings and numbers, these tokens are
     * concatenated into a string separated by a delimiter.
     *
     * If the processed array is empty, the attribute is rejected.
     *
     * @type   {AttrValueFilter}
     * @throws {TypeError} If the filter has no separators.
     * @throws {TypeMismatchException} If the value could not be
     *     concatenated or filtered.
     */
    function filterArray(value: unknown, name?: AttrName): AttrValue
    {
        /** @type {AttrValueSeparator} */
        let separator: AttrValueSeparator;

        if (Array.isArray(value)) {
            if (!value.length) {
                return null;
            }

            const tokens = [];

            for (const token of value) {
                try {
                    tokens.push(filter(token));
                } catch (err) {
                    throw TypeMismatchException.createNotConcatenable(value, name, { cause: err });
                }
            }

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

            return tokens.join(separator);
        }

        throw TypeMismatchException.createNotFilterable(value, name);
    }

    return filterArray;
}

export { createFilterArray };
