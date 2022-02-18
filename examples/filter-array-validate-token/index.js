import {
    BadValueError,
    HTMLBuildAttributes,
    TypeMismatchError,
    createFilterArray,
    escapeAttributeValue,
} from '@mcaskill/html-build-attributes';

/**
 * @type {RegExp} regexHasWhitespace - Match first whitespace character.
 */
const regexHasWhitespace = /\s/;

const filterTokenList = createFilterArray((value, name) => {
    switch (typeof value) {
        case 'string': {
            if (!value.length) {
                throw new BadValueError(
                    `${name || 'string'} must not be empty`
                );
            }

            if (regexHasWhitespace.test(value)) {
                throw new BadValueError(
                    `${name || 'string'} must not contain whitespace`
                );
            }

            return value;
        }

        case 'bigint':
        case 'boolean':
        case 'number': {
            return value.toString();
        }
    }

    throw TypeMismatchError.createNotFilterable(value, name);
}, ' ');

const htmlBuildAttributes = new HTMLBuildAttributes(
    filterTokenList,
    escapeAttributeValue
);

export default htmlBuildAttributes;
