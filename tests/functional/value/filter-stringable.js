import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
    filterStringable,
} from '@mcaskill/html-build-attributes/value/filter-stringable.js';

// Generic attribute name.
const attr = 'test';

// Placeholder value used as fallback in testing.
const EOF = Symbol('EOF');

/**
 * Filter Stringable
 */
{
    const test = suite('filterStringable');

    class Person {
        constructor(id, name) {
            this.id = id;
            this.name = name;
        }
    }

    test('should return the default fallback argument', () => {
        const output = filterStringable();

        assert.is(output, false);
    });

    test('should return the custom fallback argument', () => {
        [
            null,
            undefined,
        ].forEach((input) => {
            assert.is(filterStringable(input, attr, EOF), EOF);
        });
    });

    test('should allow JSON.stringify to throw errors', () => {
        assert.throws(
            () => filterStringable({ x: 2n }),
            (err) => (err instanceof TypeError)
        );
    });

    test('should serialize value into a JSON string via JSON.stringify', () => {
        [
            [ {},                     '{}'                    ],
            [ true,                   'true'                  ],
            [ 'foo',                  '"foo"'                 ],
            [ [ 1, 'false', false],   '[1,"false",false]'     ],
            [ [ NaN, null, Infinity], '[null,null,null]'      ],
            [ { x: 5, y: 6 },         '{"x":5,"y":6}'         ],
            [ (new Person(1, 'Tim')), '{"id":1,"name":"Tim"}' ],
        ].forEach(([ input, expects ]) => {
            assert.is(filterStringable(input), expects);
        });
    });

    test('should serialize object using toJSON via JSON.stringify', () => {
        class JsonablePerson extends Person {
            toJSON() {
                return `${this.id}:${this.name}`;
            }
        }

        assert.is(
            filterStringable(new JsonablePerson(1, 'Tim')),
            '"1:Tim"'
        );
    });

    test('should process Date object into a ISO 8601 formatted string', () => {
        assert.is(
            filterStringable(new Date(2006, 0, 2, 15, 4, 5)),
            '2006-01-02T20:04:05.000Z'
        );
    });

    test('should process object using toString', () => {
        class StringablePerson extends Person {
            toString() {
                return this.name;
            }
        }

        assert.is(
            filterStringable(new StringablePerson(1, 'Tim')),
            'Tim'
        );
    });

    test.run();
}
