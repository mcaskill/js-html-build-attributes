import { test } from 'uvu';
import * as assert from 'uvu/assert';
import {
    filterValue
} from '@mcaskill/html-build-attributes/lib/filter/filter-value.js';
import {
    BadValueException,
    TypeMismatchException,
} from '@mcaskill/html-build-attributes/lib/error.js';

/**
 * Filter Value
 */
{
    test('should throw a TypeMismatchException if value does not match filter', () => {
        [
            [ (new Date),    /^object is not filterable$/ ],
            [ Symbol('foo'), /^symbol is not filterable$/ ],
        ].forEach(([ value, expects ]) => {
            const assertion = () => filterValue(value);

            assert.throws(
                assertion,
                (err) => err instanceof TypeMismatchException
            );

            assert.throws(
                assertion,
                expects
            );
        });
    });

    test('should return false if value is nil', () => {
        assert.is(filterValue(null), false);
        assert.is(filterValue(undefined), false);
    });

    test('should return value if boolean', () => {
        assert.is(filterValue(true), true);
        assert.is(filterValue(false), false);
    });

    test('should return boolean as string if name starts with "aria-"', () => {
        assert.is(filterValue(true, 'aria-hidden'), 'true');
        assert.is(filterValue(false, 'aria-hidden'), 'false');
    });

    test('should return value if string', () => {
        assert.is(filterValue('Hello World'), 'Hello World');
        assert.is(filterValue('  foo bar '), '  foo bar ');
    });

    test('should return value as string if BigInt', () => {
        assert.is(filterValue(BigInt('0x1fffffffffffff')), '9007199254740991');
        assert.is(filterValue(2n), '2');
    });

    test('should return value as string if number', () => {
        assert.is(filterValue(42), '42');
        assert.is(filterValue(12.24), '12.24');
        assert.is(filterValue(-0), '-0');
    });

    test('should throw a BadValueException if value is not a finite number', () => {
        const assertion = () => filterValue(1 / 0);

        assert.throws(
            assertion,
            (err) => err instanceof BadValueException
        );

        assert.throws(
            assertion,
            /^number is not finite/
        );
    });

    test.run();
}
