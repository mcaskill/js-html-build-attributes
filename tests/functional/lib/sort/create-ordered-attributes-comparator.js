import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
    createOrderedAttributesComparator
} from '@mcaskill/html-build-attributes/lib/sort/create-ordered-attributes-comparator.js';

/**
 * Ordered Attributes Comparator Factory
 */
{
    const test = suite('createOrderedAttributesComparator');

    test('should throw a TypeError if expectedOrder is invalid or empty', () => {
        const expects = (err) => err instanceof TypeError;

        assert.throws(
            () => createOrderedAttributesComparator('abc'),
            expects
        );

        assert.throws(
            () => createOrderedAttributesComparator([]),
            expects
        );
    });

    test('should return a comparator function', () => {
        const comparator = createOrderedAttributesComparator([
            'foo',
            'baz',
        ]);

        assert.type(comparator, 'function');

        [
            [ 'foo', 'baz', -1 ],
            [ 'foo', 'abc', -1 ],
            [ 'foo', 'xyz', -1 ],
            [ 'baz', 'foo', +1 ],
            [ 'baz', 'abc', -1 ],
            [ 'baz', 'xyz', -1 ],
            [ 'abc', 'foo', +1 ],
            [ 'abc', 'baz', +1 ],
            [ 'abc', 'xyz', -1 ],
            [ 'xyz', 'foo', +1 ],
            [ 'xyz', 'baz', +1 ],
            [ 'xyz', 'abc', +1 ],
        ].forEach(([ a, b, expects ]) => {
            assert.is(
                comparator([ a ], [ b ]),
                expects,
                `Expected "${a}" ${
                    expects > 0
                    ? 'after'
                    : (expects < 0
                        ? 'before'
                        : 'equal to')
                } "${b}"`
            );
        });
    });

    test.run();
}

/**
 * Ordered Attributes Comparator
 */
{
    const test = suite('orderedAttributesComparator');

    test('should sort according to explicit order', () => {
        const comparator = createOrderedAttributesComparator([
            'foo',
            'baz',
        ]);

        const actual = [
            [ 'baz' ],
            [ 'xyz' ],
            [ 'abc' ],
            [ 'foo' ],
        ].sort(comparator);

        const expects = [
            [ 'foo' ],
            [ 'baz' ],
            [ 'abc' ],
            [ 'xyz' ],
        ];

        assert.equal(
            actual,
            expects,
            'Expected values to be sorted in specific order'
        );
    });

    test('should sort according to RegExp patterns', () => {
        const comparator = createOrderedAttributesComparator([
            /^xmlns(:.+$)?$/,
            'fill',
            /^x[1-9]?$/,
            /^y[1-9]?$/,
        ]);

        const actual = [
            [ 'xmlns:editor2' ],
            [ 'fill' ],
            [ 'b' ],
            [ 'y' ],
            [ 'y2' ],
            [ 'y1' ],
            [ 'xmlns:xlink' ],
            [ 'xmlns:editor1' ],
            [ 'x0' ],
            [ 'x1' ],
            [ 'xmlns' ],
            [ 'd' ],
            [ 'x' ],
        ].sort(comparator);

        const expects = [
            [ 'xmlns' ],
            [ 'xmlns:editor1' ],
            [ 'xmlns:editor2' ],
            [ 'xmlns:xlink' ],
            [ 'fill' ],
            [ 'x' ],
            [ 'x1' ],
            [ 'y' ],
            [ 'y1' ],
            [ 'y2' ],
            [ 'b' ],
            [ 'd' ],
            [ 'x0' ],
        ];

        assert.equal(
            actual,
            expects,
            'Expected values to be sorted in specific order'
        );
    });

    test('should sort according to wildcard', () => {
        const comparator = createOrderedAttributesComparator([
            'id',
            'src',
            'width',
            'height',
            '*',
            'role',
            'aria-label',
        ]);

        const actual = [
            [ 'role' ],
            [ 'aria-label' ],
            [ 'id' ],
            [ 'src' ],
            [ 'foo' ],
            [ 'height' ],
            [ 'baz' ],
            [ 'width' ],
            [ 'class' ],
            [ 'qux' ],
        ].sort(comparator);

        const expects = [
            [ 'id' ],
            [ 'src' ],
            [ 'width' ],
            [ 'height' ],
            [ 'baz' ],
            [ 'class' ],
            [ 'foo' ],
            [ 'qux' ],
            [ 'role' ],
            [ 'aria-label' ],
        ];

        assert.equal(
            actual,
            expects,
            'Expected values to be sorted in specific order'
        );
    });

    test.run();
}
