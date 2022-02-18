/**
 * @file Default Behaviour
 */

import {
    HTMLBuildAttributes,
    createFilterArray,
    createFilterResolver,
    escapeAttributeValue,
    filterStringable,
    filterToken,
    filterValue,
} from './lib/index.js';

const filterTokenList = createFilterArray(filterToken, {
    'accept': ',',
    'coords': ',',
    'sizes':  ',',
    'srcset': ',',
}, ' ');

const filterAttributeValue = createFilterResolver([
    filterValue,
    filterTokenList,
    filterStringable,
], true);

const htmlBuildAttributes = new HTMLBuildAttributes(
    filterAttributeValue,
    escapeAttributeValue
);

export default htmlBuildAttributes;

export const composeHTMLAttributes = htmlBuildAttributes.composeAttributes.bind(htmlBuildAttributes);
export const composeHTMLAttribute  = htmlBuildAttributes.composeAttribute.bind(htmlBuildAttributes);
