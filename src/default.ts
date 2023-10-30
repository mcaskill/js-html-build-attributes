/**
 * @file Default Behaviour
 */

import {
    HTMLBuildAttributes
} from './compose.js';

import {
    escapeHTMLEntities
} from './value/escape-html-entities.js';

import {
    createFilterCallable
} from './value/filter-callable.js';

import {
    createFilterList
} from './value/filter-list.js';

import {
    createFilterMiddleware
} from './value/filter-middleware.js';

import {
    filterStringable
} from './value/filter-stringable.js';

import {
    filterToken
} from './value/filter-token.js';

import {
    filterValue
} from './value/filter-value.js';

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
