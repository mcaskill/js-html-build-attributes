import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
    createFilterFunction
} from '@mcaskill/html-build-attributes/lib/filter/create-filter-function.js';

const uppercase  = (v) => v.toUpperCase();

/**
 * Filter Function Factory
 */
{
    const test = suite('createFilterFunction');

    test('should throw a TypeError if filters are invalid or too few', () => {
        const expects = (err) => err instanceof TypeError;

        assert.throws(
            () => createFilterFunction('abc'),
            expects
        );
    });

    test('should return a function', () => {
        const filter = createFilterFunction(
            uppercase
        );

        assert.type(filter, 'function');
    });

    test.run();
}

/**
 * Filter Function
 */
{
    const test = suite('filterFunction');

    test('should process the return value if input value is a function', () => {
        const filter = createFilterFunction(
            uppercase
        );

        assert.is(filter(() => 'hello world'), 'HELLO WORLD');

        assert.is(filter('hello world'), 'HELLO WORLD');
    });

    test.run();
}
