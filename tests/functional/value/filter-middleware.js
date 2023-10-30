import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
    filterFallback,
} from '@mcaskill/html-build-attributes/value/filter-fallback.js';
import {
    createFilterMiddleware,
} from '@mcaskill/html-build-attributes/value/filter-middleware.js';

// Generic attribute name.
const attr = 'test';

// Placeholder value used as fallback in testing.
const EOF = Symbol('EOF');

// Generic attribute value transformations.
const uppercase = (value, name, fallback) => {
    if (typeof value === 'string') {
        return value.toUpperCase();
    }

    return filterFallback(value, name, fallback);
};
const capitalize = (value, name, fallback) => {
    if (typeof value === 'string') {
        return value.replace(/\b\w/g, (w) => w.toUpperCase());
    }

    return filterFallback(value, name, fallback);
};
const reverse = (value, name, fallback) => {
    if (typeof value === 'string') {
        return [ ...value ].reverse().join('');
    }

    return filterFallback(value, name, fallback);
};

/**
 * Filter Middleware Factory
 */
{
    const test = suite('createFilterMiddleware');

    test('should throw a TypeError if the filters argument is not an array', () => {
        const expects = (err) => err instanceof TypeError;

        assert.throws(
            () => createFilterMiddleware('abc'),
            expects
        );
    });

    test('should throw a TypeError if the filters argument is too small', () => {
        const expects = (err) => err instanceof TypeError;

        assert.throws(
            () => createFilterMiddleware([]),
            expects
        );

        assert.throws(
            () => createFilterMiddleware([ 1 ]),
            expects
        );
    });

    test('should throw a TypeError if the filters argument is not an array of functions', () => {
        const expects = (err) => err instanceof TypeError;

        assert.throws(
            () => createFilterMiddleware([ 1, 2, 3 ]),
            expects
        );
    });

    test('should return a function', () => {
        const filter = createFilterMiddleware([
            uppercase,
            reverse,
        ]);

        assert.type(filter, 'function');
    });

    test.run();
}

/**
 * Filter Middleware
 */
{
    const test = suite('filterMiddleware');

    const unexpectedError = new Error();

    const filterThrowError = () => {
        throw unexpectedError;
    };

    test('should return the default fallback argument', () => {
        const filter = createFilterMiddleware([
            uppercase,
            reverse,
        ]);
        const output = filter();

        assert.is(output, false);
    });

    test('should return the custom fallback argument', () => {
        const filters = [
            uppercase,
            reverse,
        ];

        const filter = createFilterMiddleware(filters);

        assert.is(filter(null, attr, EOF), EOF);
        assert.is(filter(null, attr, () => EOF), EOF);
    });

    test('should throw unexpected errors from filters', () => {
        const filter = createFilterMiddleware([
            filterFallback,
            filterThrowError,
        ]);

        assert.throws(
            () => filter('abc'),
            (err) => (err === unexpectedError)
        );
    });

    test('should process value through filter functions from left-to-right', () => {
        const filterA = createFilterMiddleware([
            capitalize,
            reverse,
        ]);

        assert.is(filterA('hello world'), 'Hello World');

        const filterB = createFilterMiddleware([
            reverse,
            capitalize,
        ]);

        assert.is(filterB('hello world'), 'dlrow olleh');
    });

    test.run();
}
