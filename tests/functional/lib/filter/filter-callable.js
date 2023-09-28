import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
    createFilterCallable
} from '@mcaskill/html-build-attributes/lib/filter/filter-callable.js';

// Generic attribute name.
const attr = 'test';

// Placeholder value used as fallback in testing.
const EOF = Symbol('EOF');

/**
 * Filter Callable Factory
 */
{
    const test = suite('createFilterCallable');

    test('should throw a TypeError if the filter argument is not a function', () => {
        const expects = (err) => err instanceof TypeError;

        assert.throws(
            () => createFilterCallable('abc'),
            expects
        );
    });

    test('should return a function', () => {
        const filter = createFilterCallable((v) => v);

        assert.type(filter, 'function');
    });

    test.run();
}

/**
 * Filter Callable
 */
{
    const test = suite('filterCallable');

    test('if the value argument IS NOT a function, should return the value argument', () => {
        const filter = createFilterCallable((value, name, fallback = false) => {
            assert.is(value, 'hello');
            assert.is(name, attr);
            assert.is(fallback, false);

            return value.toUpperCase();
        });
        const output = filter('hello', attr);

        assert.is(output, 'HELLO');
    });

    test('if the value argument IS a function, should return the result of the value executed without arguments', () => {
        const filter = createFilterCallable((value, name, fallback) => {
            assert.is(value, 'hello');
            assert.is(name, attr);
            assert.is(fallback, EOF);

            return value.toUpperCase();
        });
        const output = filter(function () {
            assert.is(arguments.length, 0);

            return 'hello';
        }, attr, EOF);

        assert.is(output, 'HELLO');
    });

    test.run();
}
