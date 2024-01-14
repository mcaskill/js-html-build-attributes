import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
    isValidAttributeName,
    assertValidAttributeName,
} from '@mcaskill/html-build-attributes/name/is-valid-attribute-name.js';

/**
 * Attribute Name Validation
 */
{
    const test = suite('isValidAttributeName');

    test('should return `true` when attribute name is valid', () => {
        [
            ':',
            '::',
            ':-',
            ':_',
            '_',
            '_:',
            '_-',
            '__',
            '@',
            'a',
            'a:',
            'a:b',
            'a:1',
            'a-',
            'a-b-c',
            'a_',
            'a.',
            'a1',
            'ABC',
        ].forEach((attr) => {
            assert.is(isValidAttributeName(attr), true);
        });
    });

    test('should return `false` when attribute name is invalid', () => {
        [
            '',
            '-',
            '~',
            '†',
            '1',
            'a b',
            'data+type',
        ].forEach((attr) => {
            assert.is(isValidAttributeName(attr), false);
        });
    });

    test.run();
}

/**
 * Attribute Name Assertion
 */
{
    const test = suite('assertValidAttributeName');

    test('should not throw an error when attribute name is valid', () => {
        assert.not.throws(
            () => assertValidAttributeName(':')
        );
    });

    test('should throw a TypeError when attribute name is invalid', () => {
        assert.throws(
            () => assertValidAttributeName('-'),
            (err) => err instanceof TypeError
        );
    });

    test.run();
}
