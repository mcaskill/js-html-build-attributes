import {
    escapeHTMLEntities,
} from '../../dist/esm/value/index.js';

/**
 * Generates a string of HTML attributes.
 *
 * This function represents the original implementation transpiled from PHP.
 *
 * @see https://github.com/mcaskill/php-html-build-attributes/tree/v1.2.1 mcaskill/php-html-build-attributes
 *
 * @param   object   attrs
 * @param   function [escape=escapeHTMLEntities]
 * @returns string
 */
export function html_build_attributes(attrs, escape = escapeHTMLEntities)
{
    const html = [];
    for (let [ key, val ] of Object.entries(attrs)) {
        if (typeof key === 'string') {
            key = key.trim();

            if (key.length === 0) {
                continue;
            }
        }

        const valType = typeof val;

        if (valType === 'function') {
            val = val();
        }

        if (val == null) {
            continue;
        }

        if (valType === 'object' && valType.toArray === 'function') {
            val = val.toArray();
        }

        if (valType === 'boolean') {
            if (val) {
                html.push(key);
            }
            continue;
        } else if (Array.isArray(val)) {
            val = val.reduce(function (tokens, token) {
                const tokenType = typeof token;

                if (tokenType === 'string') {
                    token = token.trim();

                    if (token.length > 0) {
                        tokens.push(token);
                    }
                } else if (tokenType === 'number') {
                    tokens.push(token);
                }

                return tokens;
            }, []).join(' ');

            if (val.length === 0) {
                continue;
            }
        } else if (valType !== 'string' && valType !== 'number') {
            if (valType === 'object' && valType.toString === 'function') {
                val = val.toString();
            } else {
                val = JSON.stringify(val);
            }
        }

        if (typeof escape === 'function') {
            val = escape(val);
        }

        html.push(`${key}="${val}"`);
    }

    return html.join(' ');
}
