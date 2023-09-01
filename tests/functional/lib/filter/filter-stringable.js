import { test } from 'uvu';
import * as assert from 'uvu/assert';
import {
    filterStringable
} from '@mcaskill/html-build-attributes/lib/filter/filter-stringable.js';
import {
    TypeMismatchException
} from '@mcaskill/html-build-attributes/lib/error.js';

/**
 * Filter Stringable
 */
{
    class Person {
        constructor(id, name) {
            this.id = id;
            this.name = name;
        }
    }

    test('should throw a TypeMismatchException if value does not match filter', () => {
        const assertion = () => filterStringable(null);

        assert.throws(
            assertion,
            (err) => err instanceof TypeMismatchException
        );

        assert.throws(
            assertion,
            /^null is not filterable$/
        );
    });

    test('should throw unexpected error from JSON.stringify', () => {
        assert.throws(
            () => filterStringable({ x: 2n }),
            (err) => err instanceof TypeError
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
        ].forEach(([ value, expects ]) => {
            assert.is(filterStringable(value), expects);
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
