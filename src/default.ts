/**
 * @file Default Behaviour
 */

import {
    HTMLBuildAttributes,
    createFilterArray,
    createFilterFunction,
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

const filterHTMLAttributeValue = createFilterFunction(
    createFilterResolver([
        filterTokenList,
        filterValue,
        filterStringable,
    ])
);

const htmlBuildAttributes = new HTMLBuildAttributes(
    filterHTMLAttributeValue,
    escapeHTMLEntities
);

export const composeAttribute     = htmlBuildAttributes.composeAttribute.bind(htmlBuildAttributes);
export const composeAttributes    = htmlBuildAttributes.composeAttributes.bind(htmlBuildAttributes);
export const escapeAttributeValue = htmlBuildAttributes.escapeAttributeValue!.bind(htmlBuildAttributes);
export const filterAttributeValue = htmlBuildAttributes.filterAttributeValue!.bind(htmlBuildAttributes);
