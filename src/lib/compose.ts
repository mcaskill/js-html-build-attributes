/**
 * @file Attribute Composing
 */

import type {
    AttrMap,
    AttrName,
    AttrValueEscaper,
    AttrValueFilter,
    AttrMapComparator,
} from './types';

import { assertValidAttributeName } from './util/is-valid-attribute-name.js';

/**
 * HTML attributes composer.
 *
 * If a {@see this.compareAttributes comparator function} is assigned,
 * attributes are sorted according to its return value.
 *
 * If comparator function is not supplied, attributes will not be sorted.
 */
export class HTMLBuildAttributes
{
    /**
     * @public
     * @readonly
     * @type {?AttrValueFilter}
     */
    public readonly filterAttributeValue?: AttrValueFilter;

    /**
     * @public
     * @readonly
     * @type {?AttrValueEscaper}
     */
    public readonly escapeAttributeValue?: AttrValueEscaper;

    /**
     * @public
     * @readonly
     * @type {?AttrMapComparator}
     */
    public readonly compareAttributes?: AttrMapComparator;

    /**
     * Creates a new HTML attributes composer.
     *
     * @param  {AttrValueFilter}   [attributeValueFilter]
     * @param  {AttrValueEscaper}  [attributeValueEscaper]
     * @param  {AttrMapComparator} [attributesComparator]
     * @throws {TypeError} If an argument is not a function.
     */
    constructor(
        attributeValueFilter?: AttrValueFilter,
        attributeValueEscaper?: AttrValueEscaper,
        attributesComparator?: AttrMapComparator
    ) {
        const filterAttributeValueDescriptor: PropertyDescriptor = {};
        const escapeAttributeValueDescriptor: PropertyDescriptor = {};
        const compareAttributesDescriptor:    PropertyDescriptor = {};

        if (attributeValueFilter) {
            if (typeof attributeValueFilter === 'function') {
                filterAttributeValueDescriptor.value = attributeValueFilter;
            } else {
                throw new TypeError(
                    `${this.constructor.name} expected a filter function or nil`
                );
            }
        }

        if (attributeValueEscaper) {
            if (typeof attributeValueEscaper === 'function') {
                escapeAttributeValueDescriptor.value = attributeValueEscaper;
            } else {
                throw new TypeError(
                    `${this.constructor.name} expected an escaper function or nil`
                );
            }
        }

        if (attributesComparator) {
            if (typeof attributesComparator === 'function') {
                compareAttributesDescriptor.value = attributesComparator;
            } else {
                throw new TypeError(
                    `${this.constructor.name} expected a comparator function or nil`
                );
            }
        }

        Object.defineProperty(this, 'filterAttributeValue', filterAttributeValueDescriptor);
        Object.defineProperty(this, 'escapeAttributeValue', escapeAttributeValueDescriptor);
        Object.defineProperty(this, 'compareAttributes',    compareAttributesDescriptor);
    }

    /**
     * Generates a string of many HTML attributes.
     *
     * @param   {AttrMap} attributes
     * @returns {?string} Returns a string of many HTML attributes
     *     or `null` if all attributes are empty.
     */
    composeAttributes(attributes: AttrMap): string | null
    {
        /** @type {Array<[ AttrName, unknown ]>} */
        const attrs = Object.entries(attributes);

        if (this.compareAttributes) {
            attrs.sort(this.compareAttributes);
        }

        const composedAttributes = [];

        for (const [ name, value ] of attrs) {
            const composedAttribute = this.composeAttribute(name, value);

            if (composedAttribute != null) {
                composedAttributes.push(composedAttribute);
            }
        }

        if (!composedAttributes.length) {
            return null;
        }

        return composedAttributes.join(' ');
    }

    /**
     * Generates a string of a single HTML attribute.
     *
     * @param   {AttrName} name
     * @param   {unknown}  value
     * @returns {?string} Returns a string of a single HTML attribute
     *     or `null` if the attribute is empty.
     */
    composeAttribute(name: AttrName, value: unknown): string | null
    {
        assertValidAttributeName(name);

        if (this.filterAttributeValue) {
            value = this.filterAttributeValue(value, name);
        }

        switch (typeof value) {
            case 'boolean': {
                return value ? name : null;
            }

            case 'string': {
                if (this.escapeAttributeValue) {
                    value = this.escapeAttributeValue(value);
                }

                return `${name}="${value}"`;
            }
        }

        return null;
    }
}
