import { test } from 'uvu';
import * as assert from 'uvu/assert';
import {
    composeAttribute,
    composeAttributes,
    escapeAttributeValue,
    filterAttributeValue,
} from '@mcaskill/html-build-attributes';
import { filterValue as filterValueA } from '@mcaskill/html-build-attributes/lib';
import { filterValue as filterValueB } from '@mcaskill/html-build-attributes/lib/filter';
import { filterValue as filterValueC } from '@mcaskill/html-build-attributes/lib/filter/filter-value.js';

if (
    (typeof filterValueA !== 'function') ||
    (filterValueA !== filterValueB) ||
    (filterValueB !== filterValueC)
) {
    throw new Error('filterValue function not found');
}

const now = new Date();

const input = {
    'type':           'file',
    'id':             'avatar',
    'name':           'avatar',
    'class':          [ 'form-control', 'form-control-sm' ],
    'multiple':       true,
    'disabled':       false,
    'accept':         [ 'image/png', 'image/jpeg' ],
    'data-type':      null,
    'data-max-files': 3,
    'data-datetime':  now,
    'data-array':     [ true, false, null ],
    'data-options':   {
        a: 1,
        b: 0,
        c: null,
        d: true,
        e: false,
        f: [ 1, 2, 3 ],
    },
};

const expected = {
    'type':           'type="file"',
    'id':             'id="avatar"',
    'name':           'name="avatar"',
    'class':          'class="form-control form-control-sm"',
    'multiple':       'multiple',
    'disabled':       null,
    'accept':         'accept="image/png,image/jpeg"',
    'data-type':      null,
    'data-max-files': 'data-max-files="3"',
    'data-datetime':  `data-datetime="${now.toISOString()}"`,
    'data-array':     `data-array="[true,false,null]"`,
    'data-options':   'data-options="{&quot;a&quot;:1,&quot;b&quot;:0,&quot;c&quot;:null,&quot;d&quot;:true,&quot;e&quot;:false,&quot;f&quot;:[1,2,3]}"',
};

test('should be composable, filterable, and escapable', () => {
    assert.type(composeAttribute, 'function');
    assert.type(composeAttributes, 'function');
    assert.type(escapeAttributeValue, 'function');
    assert.type(filterAttributeValue, 'function');
});

test('should render each attribute', () => {
    for (const [ name, value ] of Object.entries(input)) {
        const output = composeAttribute(name, value);

        assert.is(output, expected[name]);
    }
});

test('should render set of attributes', () => {
    const output = composeAttributes(input);

    assert.is(
        output,
        Object.values(expected).filter((attr) => attr !== null).join(' ')
    );
});

test.run();
