import { test } from 'uvu';
import * as assert from 'uvu/assert';
import {
    filterToken
} from '@mcaskill/html-build-attributes/lib/filter/filter-token.js';
import {
    BadValueException,
    TypeMismatchException,
} from '@mcaskill/html-build-attributes/lib/error.js';

/**
 * Filter Token
 */
{
    test('should throw a TypeMismatchException if value does not match filter', () => {
        [
            [ null,          /^null is not filterable$/ ],
            [ (new Date),    /^object is not filterable$/ ],
            [ Symbol('foo'), /^symbol is not filterable$/ ],
        ].forEach(([ value, expects ]) => {
            const assertion = () => filterToken(value);

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

    test('should return value if boolean', () => {
        assert.is(filterToken(true), 'true');
        assert.is(filterToken(false), 'false');
    });

    test('should return value if string', () => {
        assert.is(filterToken('Hello World'), 'Hello World');
        assert.is(filterToken('  foo bar '), '  foo bar ');
    });

    test('should return value as string if BigInt', () => {
        assert.is(filterToken(BigInt('0x1fffffffffffff')), '9007199254740991');
        assert.is(filterToken(2n), '2');
    });

    test('should return value as string if number', () => {
        assert.is(filterToken(42), '42');
        assert.is(filterToken(12.24), '12.24');
        assert.is(filterToken(-0), '-0');
    });

    test('should throw a BadValueException if value is not a finite number', () => {
        const assertion = () => filterToken(1 / 0);

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
