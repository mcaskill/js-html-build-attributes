import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
    filterFallback,
} from '@mcaskill/html-build-attributes/lib/filter/filter-fallback.js';

// Generic attribute name.
const attr = 'test';

/**
 * Filter Fallback
 */
{
    const test = suite('filterFallback');

    test('should return the default fallback argument', () => {
        const output = filterFallback();

        assert.is(output, false);
    });

    test('if the custom fallback argument IS NOT a function, should return the fallback argument', () => {
        const output = filterFallback('hello', attr, 'hey');

        assert.is(output, 'hey');
    });

    test('if the custom fallback argument IS a function, should return the result of the fallback executed with the value and name arguments', () => {
        const output = filterFallback('hello', attr, function (value, name) {
            assert.is(value, 'hello');
            assert.is(name, attr);

            return 'bonjour';
        });

        assert.is(output, 'bonjour');
    });

    test.run();
}
