import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
    filterValue,
} from '@mcaskill/html-build-attributes/lib/filter/filter-value.js';
import {
    FilterError,
} from '@mcaskill/html-build-attributes/lib/error.js';

// Generic attribute name.
const attr = 'test';

// Placeholder value used as fallback in testing.
const EOF = Symbol('EOF');

/**
 * Filter Value
 */
{
    const test = suite('filterValue');

    test('should return the default fallback argument', () => {
        const output = filterValue();

        assert.is(output, false);
    });

    test('should return the custom fallback argument', () => {
        [
            null,
            undefined,
            (new Boolean),
            (new Number),
            (new String),
            (new Date),
            Symbol('foo'),
        ].forEach((input) => {
            assert.is(filterValue(input, attr, EOF), EOF);
        });
    });

    test('should return value intact if boolean', () => {
        assert.is(filterValue(true), true);
        assert.is(filterValue(false), false);
    });

    test('should return boolean as string if name starts with "aria-"', () => {
        assert.is(filterValue(true, 'aria-hidden'), 'true');
        assert.is(filterValue(false, 'aria-hidden'), 'false');
    });

    test('should return value intact if string', () => {
        assert.is(filterValue('Hello World'), 'Hello World');
        assert.is(filterValue('  foo bar '), '  foo bar ');
    });

    test('should return BigInt as string', () => {
        assert.is(filterValue(BigInt('0x1fffffffffffff')), '9007199254740991');
        assert.is(filterValue(2n), '2');
    });

    test('should return number as string', () => {
        assert.is(filterValue(42), '42');
        assert.is(filterValue(12.24), '12.24');
        assert.is(filterValue(-0), '-0');
    });

    test('should throw a FilterError if value is not a finite number', () => {
        const assertion = () => filterValue(1 / 0);

        assert.throws(
            assertion,
            (err) => err instanceof FilterError
        );

        assert.throws(
            assertion,
            /^number is not finite/
        );
    });

    test.run();
}
