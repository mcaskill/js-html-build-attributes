import {
    HTMLBuildAttributes,
    createOrderedAttributesComparator,
    createFilterArray,
    createFilterResolver,
    escapeAttributeValue,
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

const filterTokenList = createFilterArray(filterToken, ' ');

const filterAttributeValue = createFilterResolver([
    filterValue,
    filterTokenList,
    filterStringable,
]);

const htmlBuildAttributes = new HTMLBuildAttributes(
    filterAttributeValue,
    escapeAttributeValue,
    compareAttributes
);

export default htmlBuildAttributes;
