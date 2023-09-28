/**
 * @file Default Behaviour
 */

import {
    HTMLBuildAttributes
} from './lib/compose.js';

import {
    escapeHTMLEntities
} from './lib/escape/escape-html-entities.js';

import {
    createFilterCallable
} from './lib/filter/filter-callable.js';

import {
    createFilterList
} from './lib/filter/filter-list.js';

import {
    createFilterMiddleware
} from './lib/filter/filter-middleware.js';

import {
    filterStringable
} from './lib/filter/filter-stringable.js';

import {
    filterToken
} from './lib/filter/filter-token.js';

import {
    filterValue
} from './lib/filter/filter-value.js';

const filterList = createFilterList(filterToken, {
    'accept': ',',
    'coords': ',',
    'sizes':  ',',
    'srcset': ',',
}, ' ');

const filterMiddleware = createFilterMiddleware([
    filterList,
    filterValue,
    filterStringable,
]);

const filterHTMLAttributeValue = createFilterCallable(filterMiddleware);

const htmlBuildAttributes = new HTMLBuildAttributes(
    filterHTMLAttributeValue,
    escapeHTMLEntities
);

export const composeAttribute     = htmlBuildAttributes.composeAttribute.bind(htmlBuildAttributes);
export const composeAttributes    = htmlBuildAttributes.composeAttributes.bind(htmlBuildAttributes);
export const escapeAttributeValue = htmlBuildAttributes.escapeAttributeValue!.bind(htmlBuildAttributes);
export const filterAttributeValue = htmlBuildAttributes.filterAttributeValue!.bind(htmlBuildAttributes);
