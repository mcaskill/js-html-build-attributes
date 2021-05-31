import { test } from 'uvu';
import * as assert from 'uvu/assert';
import htmlBuildAttributes from '@mcaskill/html-build-attributes';

// ---

test('should render attributes', () => {
    const output = htmlBuildAttributes.composeAttributes({
        'type':           'file',
        'id':             'avatar',
        'name':           'avatar',
        'class':          [ 'form-control', 'form-control-sm' ],
        'multiple':       true,
        'disabled':       false,
        'accept':         [ 'image/png', 'image/jpeg' ].join(','),
        'data-type':      null,
        'data-max-files': 3,
    });
    assert.snapshot(output, 'type="file" id="avatar" name="avatar" class="form-control form-control-sm" multiple accept="image/png,image/jpeg" data-max-files="3"');
});

test('should ignore attributes with empty map', () => {
    const output = htmlBuildAttributes.composeAttributes({
        'required': false,
        'disabled': null,
    });
    assert.is(output, null);
});

test.run();
