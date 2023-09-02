import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { createFilterChain } from '@mcaskill/html-build-attributes/lib/filter';

/**
 * Filter Chain Factory
 */
{
    const test = suite('createFilterChain');

    test('should throw a TypeError if filters are invalid or too few', () => {
        const expects = (err) => err instanceof TypeError;

        assert.throws(
            () => createFilterChain('abc'),
            expects
        );

        assert.throws(
            () => createFilterChain([ 1 ]),
            expects
        );

        assert.throws(
            () => createFilterChain([ 1, 2 ]),
            expects
        );
    });

    test('should return a function', () => {
        const uppercase = (v) =>  v.toUpperCase();
        const reverse   = (v) =>  [ ...v ].reverse().join('');

        const filter = createFilterChain([
            uppercase,
            reverse,
        ]);

        assert.type(filter, 'function');
    });

    test.run();
}

/**
 * Filter Chain
 */
{
    const test = suite('filterChain');

    test('should pass value through filter functions from left-to-right', () => {
        const capitalize = (v) => v.replace(/\b\w/g, (w) => w.toUpperCase());
        const reverse    = (v) => [ ...v ].reverse().join('');

        const filterA = createFilterChain([
            capitalize,
            reverse,
        ]);

        assert.is(filterA('hello world'), 'dlroW olleH');

        const filterB = createFilterChain([
            reverse,
            capitalize,
        ]);

        assert.is(filterB('hello world'), 'Dlrow Olleh');
    });

    test.run();
}
