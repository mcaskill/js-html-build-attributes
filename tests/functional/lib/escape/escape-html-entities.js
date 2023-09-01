import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
    escapeMap,
    regexUnescaped,
    escapeHTMLEntities,
} from '@mcaskill/html-build-attributes/lib/escape/escape-html-entities.js';

/**
 * Escape Map
 */
{
    const test = suite('escapeMap');

    test('should match regexUnescaped pattern', () => {
        assert.equal(
            Object.keys(escapeMap).sort(),
            regexUnescaped.source.slice(1, -1).split('').sort(),
            `Expected regexUnescaped pattern and escapeMap keys to match`
        );
    });

    test.run();
}

/**
 * Escape HTML Entities
 */
{
    const test = suite('escapeHTMLEntities');

    test('should convert special characters to HTML entities', () => {
        const escaped = escapeHTMLEntities('&<>"\'`');

        assert.is(escaped, '&amp;&lt;&gt;&quot;&#39;&#96;');
    });

    test('should handle values with nothing to escape', () => {
        const escaped = escapeHTMLEntities('“the crimes of the ‘good Samaritans’”');

        assert.is(escaped, '“the crimes of the ‘good Samaritans’”');
    });

    test.run();
}
