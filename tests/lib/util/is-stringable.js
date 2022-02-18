import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { isStringable } from '@mcaskill/html-build-attributes/lib/util';

test('should return `true` when value is stringable', () => {
    [
        (new Number('123')),
        (new Date),
    ].forEach((value) => {
        assert.is(isStringable(value), true);
    });
});

test('should return `false` when value is not stringable', () => {
    [
        null,
        {},
    ].forEach((value) => {
        assert.is(isStringable(value), false);
    });
});

test.run();
