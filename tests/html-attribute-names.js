import { test } from 'uvu';
import * as assert from 'uvu/assert';
import htmlBuildAttributes from '@mcaskill/html-build-attributes';

// ---

test('should render attribute with valid name', () => {
    const output = htmlBuildAttributes.composeAttribute('id', 'main');
    assert.snapshot(output, 'id="main"');
});

test('should ignore attribute with bad name', () => {
    assert.throws(
        () => htmlBuildAttributes.composeAttribute('data~type', 'oops'),
        (err) => err instanceof SyntaxError
    );
});

test.run();
