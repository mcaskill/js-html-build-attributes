import { composeAttributes } from '../dist/esm/default.js';
import { html_build_attributes } from '../examples/original-implementation/index.js';
import benchmark from 'benchmark';

const { Suite } = benchmark;

/**
 * Runs the benchmark.
 *
 * @param {string} name - A name to identify the suite.
 * @param {array}  args - The arguments to apply to each test subject.
 */
function bench(name, ...args) {
    console.log(`\n# ${name}`);

    (new Suite(name))
        .add('Original ', () => html_build_attributes.apply(html_build_attributes, args))
        .add('Current  ', () => composeAttributes.apply(composeAttributes, args))
        .on('cycle', (event) => console.log('  ' + event.target))
        .run();
}

bench(
    'Set #1',
    {
        'type':           'file',
        'name':           'avatar',
        'multiple':       true,
        'disabled':       false,
        'accept':         [ 'image/png', 'image/jpeg' ],
        'data-type':      null,
        'data-max-files': 3,
    }
);

bench(
    'Set #2',
    {
        'type':              'button',
        'id':                'ThemeLight',
        'aria-labelledby':   [ 'ThemeLight', 'ThemeLbl' ],
        'aria-pressed':      false,
        'data-toggle-theme': true,
    }
);

bench(
    'Set #3',
    {
        'data-list':   [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ],
        'data-person': {
            'id': 1,
            'name': 'Tim',
        },
    }
);
