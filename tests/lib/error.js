import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
    FilterError,
    BadValueError,
    TypeMismatchError,
} from '@mcaskill/html-build-attributes/lib/error';

/**
 * Adds common Error class unit tests.
 *
 * @param   {Suite}  test     - The test suite.
 * @param   {string} errName  - The error name.
 * @param   {Error}  errClass - The error class.
 * @returns {void}
 */
function addFilterErrorUnitTests(test, errName, errClass)
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

    addFilterErrorUnitTests(test, 'FilterError', FilterError);

    test(`should create error with the message "attribute [*] is not filterable"`, () => {
        const err = FilterError.createNotFilterable('main', 'id');

        assert.match(err.message, 'attribute [id] is not filterable');
    });

    test(`should create error with the message "value is not filterable"`, () => {
        [
            [ undefined,       'undefined' ],
            [ null,            'null'      ],
            [ 'hello',         'string'    ],
            [ 42,              'number'    ],
            [ true,            'boolean'   ],
            [ {},              'object'    ],
            [ (new Date),      'object'    ],
            [ (() => {}),      'function'  ],
            [ (Symbol('foo')), 'symbol'    ],
        ].forEach(([ value, expects ]) => {
            const err = FilterError.createNotFilterable(value);

            assert.match(err.message, `${expects} is not filterable`);
        });
    });

    test(`should create error with the message "array is not filterable"`, () => {
        const err = FilterError.createNotConcatenable([ 1, 2, 3 ]);

        assert.match(err.message, 'array is not concatenable');
    });

    test.run();
}

/**
 * Custom Attribute Error
 */
[
    [ 'BadValueError',     BadValueError ],
    [ 'TypeMismatchError', TypeMismatchError ],
].forEach(([ errName, errClass ]) => {
    const test = suite(`${errName}`);

    test('should extend FilterError', () => {
        assert.instance((new errClass), FilterError);
    });

    addFilterErrorUnitTests(test, errName, errClass);

    test.run();
});
