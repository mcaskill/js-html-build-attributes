import {
    FilterError,
    Composer,
    createFilterList,
    escapeHTMLEntities,
    filterFallback,
} from '@mcaskill/html-build-attributes';

/**
 * @type {RegExp} regexHasWhitespace - Match first whitespace character.
 */
const regexHasWhitespace = /\s/;

const filterTokenList = createFilterList((value, name, fallback = false) => {
    switch (typeof value) {
        case 'string': {
            if (!value.length) {
                throw FilterError.create('{attr} must not be empty', value, name);
            }

            if (regexHasWhitespace.test(value)) {
                throw FilterError.create('{attr} must not contain whitespace', value, name);
            }

            return value;
        }

        case 'bigint':
        case 'boolean':
        case 'number': {
            return value.toString();
        }
    }

    return filterFallback(value, name, fallback);
}, ' ');

const htmlBuildAttributes = new Composer(
    filterTokenList,
    escapeHTMLEntities
);

export default htmlBuildAttributes;
