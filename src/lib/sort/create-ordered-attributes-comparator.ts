import type {
    AttrName,
    AttrPair,
    AttrMapComparator,
    AttrOrder,
} from '../types.js';

/**
 * Creates a comparison function to sort attributes
 * with support for regular expressions and a wildcard.
 *
 * A standalone `*` represents all unspecified attributes,
 * useful for inserting these at a specific index among
 * the ordered attributes.
 *
 * @param   {AttrOrder[]} expectedOrder - The order to sort attributes into.
 * @throws  {TypeError} If the expectedOrder is empty.
 * @returns {AttrMapComparator}
 */
export function createOrderedAttributesComparator(expectedOrder: AttrOrder[]): AttrMapComparator
{
    if (!Array.isArray(expectedOrder) || !expectedOrder.length) {
        throw new TypeError(
            `createOrderedAttributesComparator expected an array with at least 1 attribute name, pattern, or wildcard`
        );
    }

    const restIndexInOrderFlag = expectedOrder.indexOf('*');
    const restInOrderFlag      = (restIndexInOrderFlag > -1);

    /**
     * @param   {AttrOrder} order
     * @param   {AttrName}  name
     * @returns {boolean}
     */
    function isInExpectedOrder(order: AttrOrder, name: AttrName): boolean
    {
        // Ignore the standalone wildcard to allow
        // other ordered attributes to match first.
        if (order === '*') {
            return false;
        }

        if (order instanceof RegExp) {
            return order.test(name);
        }

        return order === name;
    }

    /**
     * @type {AttrMapComparator}
     */
    function orderedAttributesComparator([ aName ]: AttrPair, [ bName ]: AttrPair): number
    {
        let aIndexInOrderFlag = expectedOrder.findIndex((order) => isInExpectedOrder(order, aName));
        let bIndexInOrderFlag = expectedOrder.findIndex((order) => isInExpectedOrder(order, bName));

        if (restInOrderFlag)   {
            if (aIndexInOrderFlag === -1) {
                aIndexInOrderFlag = restIndexInOrderFlag;
            }

            if (bIndexInOrderFlag === -1) {
                bIndexInOrderFlag = restIndexInOrderFlag;
            }
        }

        const aInOrderFlag = aIndexInOrderFlag > -1 ? 1 : 0;
        const bInOrderFlag = bIndexInOrderFlag > -1 ? 1 : 0;

        // sort by position in order parameter
        if (aInOrderFlag === 1 && bInOrderFlag === 1) {
            // sort alphabetically if they match the same position
            if (aIndexInOrderFlag === bIndexInOrderFlag) {
                return aName < bName ? -1 : 1;
            }

            return aIndexInOrderFlag - bIndexInOrderFlag;
        }

        // put attributes from order parameter before others
        const priorityOrder = bInOrderFlag - aInOrderFlag;

        if (priorityOrder !== 0) {
            return priorityOrder;
        }

        // sort alphabetically
        return aName < bName ? -1 : 1;
    }

    return orderedAttributesComparator;
}
