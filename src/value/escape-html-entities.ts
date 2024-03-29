import type {
    HTMLCharEscapeMap
} from '../types.js';

/**
 * @type {HTMLCharEscapeMap} - Map of characters to HTML entities.
 */
export const escapeMap: HTMLCharEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;',
};

/**
 * @type {RegExp} - Match all special characters.
 */
export const regexUnescaped = /[&<>"'`]/g;

/**
 * @type {RegExp} - Match first special character.
 */
export const regexHasUnescaped = RegExp(regexUnescaped.source);

/**
 * @type {AttrValueEscaper}
 */
export function escapeHTMLEntities(string: string): string
{
    if (string && regexHasUnescaped.test(string)) {
        return string.replace(regexUnescaped, (chr) => escapeMap[chr]);
    }

    return string;
}
