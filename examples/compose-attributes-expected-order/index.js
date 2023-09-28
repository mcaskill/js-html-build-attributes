import {
    HTMLBuildAttributes,
    createOrderedAttributesComparator,
    createFilterList,
    createFilterMiddleware,
    escapeHTMLEntities,
    filterStringable,
    filterToken,
    filterValue,
} from '@mcaskill/html-build-attributes';

const htmlAttributesOrder = [
    'id',
    'for',
    'name',
    'href',
    'target',
    'rel',
    'alt',
    'title',
    'src',
    'srcset',
    'sizes',
    'width',
    'height',
    'class',
    'style',
];

const svgAttributesOrder = [
    'id',
    'href',
    'viewBox',
    'width',
    'height',
    /^x\d?$/,
    /^y\d?$/,
    'cx',
    'cy',
    'rx',
    'ry',
    'r',
    'd',
    'points',
    'marker',
    'fill',
    'stroke',
    'class',
    'style',
];

const compareAttributes = createOrderedAttributesComparator([
    'xmlns',
    /^.+:.+$/,
    ...(new Set([
        ...htmlAttributesOrder,
        ...svgAttributesOrder,
    ])),
    '*',
    'role',
    /^aria-.+$/,
    /^data-.+$/,
]);

const filterTokenList = createFilterList(filterToken, ' ');

const filterAttributeValue = createFilterMiddleware([
    filterValue,
    filterTokenList,
    filterStringable,
]);

const htmlBuildAttributes = new HTMLBuildAttributes(
    filterAttributeValue,
    escapeHTMLEntities,
    compareAttributes
);

export default htmlBuildAttributes;
