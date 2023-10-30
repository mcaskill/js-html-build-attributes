import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
    filterToken,
} from '@mcaskill/html-build-attributes/value/filter-token.js';
import {
    FilterError,
} from '@mcaskill/html-build-attributes/error.js';

// Generic attribute name.
const attr = 'test';

// Placeholder value used as fallback in testing.
const EOF = Symbol('EOF');

/**
 * Filter Token
 */
{
    const test = suite('filterToken');

    test('should return the default fallback argument', () => {
        const output = filterToken();

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
            assert.is(filterToken(input, attr, EOF), EOF);
        });
    });

    test('should return boolean as string', () => {
        assert.is(filterToken(true), 'true');
        assert.is(filterToken(false), 'false');
    });

    test('should return value intact if string', () => {
        assert.is(filterToken('Hello World'), 'Hello World');
        assert.is(filterToken('  foo bar '), '  foo bar ');
    });

    test('should return BigInt as string', () => {
        assert.is(filterToken(BigInt('0x1fffffffffffff')), '9007199254740991');
        assert.is(filterToken(2n), '2');
    });

    test('should return number as string', () => {
        assert.is(filterToken(42), '42');
        assert.is(filterToken(12.24), '12.24');
        assert.is(filterToken(-0), '-0');
    });

    test('should throw a FilterError if value is not a finite number', () => {
        const assertion = () => filterToken(1 / 0);

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
