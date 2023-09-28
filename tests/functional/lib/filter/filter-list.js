import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
    createFilterList,
} from '@mcaskill/html-build-attributes/lib/filter/filter-list.js';

// Generic attribute name.
const attr = 'test';

// Placeholder value used as fallback in testing.
const EOF = Symbol('EOF');

/**
 * Filter List Factory
 */
{
    const test = suite('createFilterList');

    test('should throw a TypeError if the filter argument is not a function', () => {
        const expects = (err) => err instanceof TypeError;

        assert.throws(
            () => createFilterList('abc'),
            expects
        );
    });

    test('should throw a TypeError if the separators argument is invalid', () => {
        const expects = (err) => err instanceof TypeError;

        assert.throws(
            () => createFilterList((v) => v),
            expects
        );

        assert.throws(
            () => createFilterList((v) => v, 1),
            expects
        );

        assert.throws(
            () => createFilterList((v) => v, null),
            expects
        );
    });

    test('should not throw an error if the separators argument is valid', () => {
        assert.not.throws(
            () => createFilterList((v) => v, {}, ',')
        );

        assert.not.throws(
            () => createFilterList((v) => v, ',')
        );

        assert.not.throws(
            () => createFilterList((v) => v, {})
        );
    });

    test('should return a function', () => {
        const filter = createFilterList((v) => v, ',');

        assert.type(filter, 'function');
    });

    test.run();
}

/**
 * Filter List
 */
{
    const test = suite('filterList');

    test('should return the default fallback argument', () => {
        const filter = createFilterList((v) => v, ' ');
        const output = filter();

        assert.is(output, false);
    });

    test('should return the custom fallback argument', () => {
        const filter = createFilterList((v) => v, ' ');

        assert.is(filter('abc', attr, EOF), EOF);
    });

    test('should return the fallback if the array is empty', () => {
        const filter = createFilterList((v) => v, ' ');

        assert.is(filter([], attr, EOF), EOF);
    });

    test('should return the fallback if the array is not concatenable', () => {
        const filter = createFilterList((v) => v, ' ');

        assert.is(filter([ 'a', true, 'c' ], attr, EOF), EOF);
    });

    test('should process array into a separator-delimited string', () => {
        const filter = createFilterList((v) => v, {
            'accept': ',',
        }, ' ');

        assert.is(filter([ 'a', 'b', 'c' ], 'accept'), 'a,b,c');
        assert.is(filter([ 'a', 'b', 'c' ]), 'a b c');
    });

    test('should throw a TypeError if no separator matched', () => {
        const filter = createFilterList((v) => v, {});

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

    test.run();
}
