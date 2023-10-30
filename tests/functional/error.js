import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
    FilterError,
} from '@mcaskill/html-build-attributes/error.js';

/**
 * Adds common Error class unit tests.
 *
 * @param   {Suite}  test     - The test suite.
 * @param   {string} errName  - The error name.
 * @param   {Error}  errClass - The error class.
 * @returns {void}
 */
function addErrorUnitTests(test, errName, errClass)
{
    const err = new errClass;

    test(`should be an instance of ${errName}`, () => {
        assert.instance(err, errClass);
    });

    test(`should have the name "${errName}"`, () => {
        assert.is(err.name, errName);
    });

    test('should have a string representation including its name and message', () => {
        assert.match(err.toString(), new RegExp(`^${errName}`));
    });

    test('should have a stack trace starting with its name', () => {
        assert.match(err.stack, err.name);
    });
}

/**
 * Filter Attribute Error Messages
 */
{
    const test = suite('FilterError');

    test('should extend Error', () => {
        assert.instance((new FilterError), Error);
    });

    addErrorUnitTests(test, 'FilterError', FilterError);

    const creatorDataSet = [
        [ undefined,       'undefined' ],
        [ null,            'null'      ],
        [ 'hello',         'string'    ],
        [ 42,              'number'    ],
        [ true,            'boolean'   ],
        [ {},              'Object'    ],
        [ (new Date),      'Date'      ],
        [ [ 1, 2, 3 ],     'Array'     ],
        [
            /* c8 ignore next */
            (() => {}),
            'function',
        ],
        [ (Symbol('foo')), 'symbol'    ],
    ];

    test(`should create error with the message "* is not filterable"`, () => {
        creatorDataSet.forEach(([ value, expects ]) => {
            const err = FilterError.create('{attr} is not filterable', value);

            assert.match(err.message, `${expects} is not filterable`);
        });
    });

    test(`should create error with the message "attribute [*] is not filterable"`, () => {
        const err = FilterError.create('{attr} is not filterable', 'main', 'id');

        assert.match(err.message, 'attribute [id] is not filterable');
    });

    test.run();
}
