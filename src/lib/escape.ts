/**
 * @file Attribute Escaping
 */

import type { HTMLCharEscapeMap } from './types';

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
export function escapeAttributeValue(string: string): string
{
    if (string && regexHasUnescaped.test(string)) {
        return string.replace(regexUnescaped, (chr) => escapeMap[chr]);
    }

    return string;
}
