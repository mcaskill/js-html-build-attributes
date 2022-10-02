/**
 * @file Default Behaviour
 */

import {
    HTMLBuildAttributes,
    createFilterArray,
    createFilterResolver,
    escapeHTMLEntities,
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

const filterHTMLAttributeValue = createFilterResolver([
    filterValue,
    filterTokenList,
    filterStringable,
], true);

const htmlBuildAttributes = new HTMLBuildAttributes(
    filterHTMLAttributeValue,
    escapeHTMLEntities
);

export const {
    composeAttribute,
    composeAttributes,
    escapeAttributeValue,
    filterAttributeValue,
} = htmlBuildAttributes;
