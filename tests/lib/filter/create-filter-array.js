import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { createFilterArray } from '@mcaskill/html-build-attributes/lib/filter';
import { TypeMismatchError } from '@mcaskill/html-build-attributes/lib/error';

/**
 * Filter Array Factory
 */
{
    const test = suite('createFilterArray');

    test('should throw a TypeError if filter is not a function', () => {
        const expects = (err) => err instanceof TypeError;

        assert.throws(
            () => createFilterArray('abc'),
            expects
        );
    });

    test('should throw a TypeError if separators are invalid', () => {
        const expects = (err) => err instanceof TypeError;

        assert.throws(
            () => createFilterArray((v) => v),
            expects
        );

        assert.throws(
            () => createFilterArray((v) => v, 1),
            expects
        );

        assert.throws(
            () => createFilterArray((v) => v, null),
            expects
        );
    });

    test('should not throw an error if separators are valid', () => {
        assert.not.throws(
            () => createFilterArray((v) => v, {}, ',')
        );

        assert.not.throws(
            () => createFilterArray((v) => v, ',')
        );

        assert.not.throws(
            () => createFilterArray((v) => v, {})
        );
    });

    test('should return a function', () => {
        const filter = createFilterArray((v) => v, ',');

        assert.type(filter, 'function');
    });

    test.run();
}

/**
 * Filter Array
 */
{
    const test = suite('filterArray');

    test('should throw a TypeMismatchError if value does not match filter', () => {
        const filter = createFilterArray((v) => v, ',');

        const assertion = () => filter('abc');

        assert.throws(
            assertion,
            (err) => err instanceof TypeMismatchError
        );

        assert.throws(
            assertion,
            /^string is not filterable$/
        );
    });

    test('should throw a TypeError if no separator matched', () => {
        const filter = createFilterArray((v) => v, {});

        const assertionA = () => filter([ 'a', 'b', 'c' ]);

        assert.throws(
            assertionA,
            (err) => err instanceof TypeError
        );

        assert.throws(
            assertionA,
            /^array separator is not defined$/
        );

        const assertionB = () => filter([ 'a', 'b', 'c' ], 'class');

        assert.throws(
            assertionB,
            (err) => err instanceof TypeError
        );

        assert.throws(
            assertionB,
            /^array separator is not defined for attribute \[class\]$/
        );
    });

    test('should throw a TypeMismatchError if value is not concatenable', () => {
        const filter = createFilterArray(() => {
            throw new Error;
        }, ',');

        const assertion = () => filter([ 'a', 'b', 'c' ]);

        assert.throws(
            assertion,
            (err) => err instanceof TypeMismatchError
        );

        assert.throws(
            assertion,
            /^array is not concatenable$/
        );
    });

    test('should process array into a separator-delimited string', () => {
        const filter = createFilterArray((v) => v, {
            'accept': ',',
        }, ' ');

        assert.is(filter([ 'a', 'b', 'c' ], 'accept'), 'a,b,c');
        assert.is(filter([ 'a', 'b', 'c' ]), 'a b c');
    });

    test.run();
}
