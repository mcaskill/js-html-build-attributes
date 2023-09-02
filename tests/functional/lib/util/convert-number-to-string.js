import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { convertNumberToString } from '@mcaskill/html-build-attributes/lib/util';

test('should return empty string when value is not a finite number', () => {
    [
        null,
        'abc',
        (1 / 0),
        ('a' / 'b'),
    ].forEach((value) => {
        assert.is(convertNumberToString(value), '');
    });
});

test('should return number as string', () => {
    assert.is(convertNumberToString(123), '123');
    assert.is(convertNumberToString(1.1), '1.1');
    assert.is(convertNumberToString(1.0), '1');
});

test('should preserve negative zero', () => {
    assert.is(convertNumberToString(-0), '-0');
});

test.run();
