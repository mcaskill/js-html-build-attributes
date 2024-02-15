import {
    Composer,
    escapeHTMLEntities,
} from '@mcaskill/html-build-attributes';

/**
 * @param   {...*} args
 * @returns {(string|number)[]}
 */
function parseTokens(...args)
{
    const tokens = [];

    for (const arg of args) {
        if (arg == null) {
            continue;
        }

        if (Array.isArray(arg)) {
            if (arg.length) {
                const subset = parseTokens(...arg);
                if (subset.length) {
                    tokens.push(...subset);
                }
            }

            continue;
        }

        switch (typeof arg) {
            case 'bigint':
                tokens.push(arg.toString());
                continue;

            case 'number':
                if (Number.isFinite(arg)) {
                    tokens.push(arg);
                }
                continue;

            case 'string':
                tokens.push(arg);
                continue;

            case 'object':
                if (arg.toString !== Object.prototype.toString) {
                    const str = arg.toString();
                    tokens.push(str);
                }

                for (const [ key, condition ] of Object.entries(arg)) {
                    if (condition) {
                        tokens.push(key);
                    }
                }
                continue;
        }
    }

    return tokens;
}

function filterTokens(value)
{
    if (!Array.isArray(value)) {
        value = [ value ];
    }

    value = parseTokens(...value);

    if (!value.length) {
        return false;
    }

    return value.join(' ');
}

const htmlBuildAttributes = new Composer(
    filterTokens,
    escapeHTMLEntities
);

export default htmlBuildAttributes;
