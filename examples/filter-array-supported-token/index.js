import {
    HTMLBuildAttributes,
    TypeMismatchException,
    createFilterArray,
    escapeHTMLEntities,
} from '@mcaskill/html-build-attributes';

/**
 * @type {string[]} allowedValuesOfIFrameSandbox - List of
 *     {@link https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox allowed values}
 *     of the `iframe` element's `sandbox` attribute.
 */
const allowedValuesOfIFrameSandbox = [
    'allow-forms',
    'allow-modals',
    'allow-orientation-lock',
    'allow-pointer-lock',
    'allow-popups',
    'allow-popups-to-escape-sandbox',
    'allow-presentation',
    'allow-same-origin',
    'allow-scripts',
    'allow-top-navigation',
    'allow-top-navigation-by-user-activation',
    'allow-downloads',
];

const filterTokenList = createFilterArray((value, name) => {
    if (name === 'sandbox') {
        if (allowedValuesOfIFrameSandbox.includes(value)) {
            return value;
        }

        throw new TypeError(
            `'${value}' is not a supported "sanbox" token`
        );
    }

    switch (typeof value) {
        case 'string': {
            return value;
        }

        case 'bigint':
        case 'boolean':
        case 'number': {
            return value.toString();
        }
    }

    throw TypeMismatchException.createNotFilterable(value, name);
}, ' ');

const htmlBuildAttributes = new HTMLBuildAttributes(
    filterTokenList,
    escapeHTMLEntities
);

export default htmlBuildAttributes;
