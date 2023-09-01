import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
    createFilterResolver
} from '@mcaskill/html-build-attributes/lib/filter/create-filter-resolver.js';
import {
    TypeMismatchException
} from '@mcaskill/html-build-attributes/lib/error.js';

const uppercase  = (v) => v.toUpperCase();
const capitalize = (v) => v.replace(/\b\w/g, (w) => w.toUpperCase());
const reverse    = (v) => [ ...v ].reverse().join('');

/**
 * Filter Resolver Factory
 */
{
    const test = suite('createFilterResolver');

    test('should throw a TypeError if filters are invalid or too few', () => {
        const expects = (err) => err instanceof TypeError;

        assert.throws(
            () => createFilterResolver('abc'),
            expects
        );

        assert.throws(
            () => createFilterResolver([]),
            expects
        );

        assert.throws(
            () => createFilterResolver([ 1 ]),
            expects
        );
    });

    test('should return a function', () => {
        const filter = createFilterResolver([
            uppercase,
            reverse,
        ]);

        assert.type(filter, 'function');
    });

    test.run();
}

/**
 * Filter Resolver
 */
{
    const test = suite('filterResolver');

    const unexpectedError = new Error();

    const filterThrowMismatch = () => {
        throw new TypeMismatchException;
    };

    const filterThrowError = () => {
        throw unexpectedError;
    };

    test('should throw a TypeMismatchException if value does not match any filter', () => {
        const filter = createFilterResolver([
            filterThrowMismatch,
            filterThrowMismatch,
        ]);

        const assertion = () => filter('abc');

        assert.throws(
            assertion,
            (err) => err instanceof TypeMismatchException
        );

        assert.throws(
            assertion,
            /^string is not filterable$/
        );
    });

    test('should throw unexpected errors from filters', () => {
        const filterA = createFilterResolver([
            filterThrowError,
            filterThrowMismatch,
        ]);

        assert.throws(
            () => filterA('abc'),
            (err) => (err === unexpectedError)
        );

        const filterB = createFilterResolver([
            filterThrowError,
            filterThrowMismatch,
        ], true);

        assert.throws(
            () => filterB('abc'),
            (err) => (err === unexpectedError)
        );
    });

    test('should process value through filter functions from left-to-right', () => {
        const filterA = createFilterResolver([
            capitalize,
            reverse,
        ]);

        assert.is(filterA('hello world'), 'Hello World');

        const filterB = createFilterResolver([
            reverse,
            capitalize,
        ]);

        assert.is(filterB('hello world'), 'dlrow olleh');
    });

    test('should process called function value through filter functions', () => {
        const filterA = createFilterResolver([
            capitalize,
            reverse,
        ], true);

        assert.is(filterA(() => () => 'hello world'), 'Hello World');

        const filterB = createFilterResolver([
            reverse,
            capitalize,
        ], true);

        assert.is(filterB(() => () => 'hello world'), 'dlrow olleh');
    });

    test.run();
}
