import { test } from 'uvu';
import * as assert from 'uvu/assert';
import htmlBuildAttributes from '@mcaskill/html-build-attributes';

test('should render attributes', () => {
    const now = new Date;

    const output = htmlBuildAttributes.composeAttributes({
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
        'data-options':   {
            a: 1,
            b: 0,
            c: null,
            d: true,
            e: false,
            f: [ 1, 2, 3 ],
        },
    });

    const expects = [
        'type="file"',
        'id="avatar"',
        'name="avatar"',
        'class="form-control form-control-sm"',
        'multiple',
        'accept="image/png,image/jpeg"',
        'data-max-files="3"',
        `data-datetime="${now.toISOString()}"`,
        'data-options="{&quot;a&quot;:1,&quot;b&quot;:0,&quot;c&quot;:null,&quot;d&quot;:true,&quot;e&quot;:false,&quot;f&quot;:[1,2,3]}"',
    ].join(' ');

    assert.is(output, expects);
});

test.run();
