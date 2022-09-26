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

export {
    escapeAttributeValue,
    filterAttributeValue,
};

export const {
    composeAttribute,
    composeAttributes,
} = htmlBuildAttributes;
