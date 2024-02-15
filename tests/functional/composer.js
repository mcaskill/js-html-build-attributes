import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
    Composer
} from '@mcaskill/html-build-attributes/composer.js';
import {
    createFilterList,
    createFilterMiddleware,
    filterToken,
    filterValue,
} from '@mcaskill/html-build-attributes/value';

/**
 * Class Constructor
 */
{
    const test = suite('constructor');

    test('should be an instance of Composer', () => {
        assert.instance((new Composer), Composer);
    });

    test('should assign `this` to class property functions', () => {
        let html;

        // Traditional functions
        const filterTradFn = function (value) {
            assert.is(this, html);
            return value;
        };
        const escapeTradFn = function (value) {
            assert.is(this, html);
            return value;
        };
        const compareTradFn = function ([ aName ], [ bName ]) {
            assert.is(this, html);
            return (aName < bName ? -1 : 1);
        };

        // Arrow functions
        const filterAnonFn = (value) => {
            assert.is(this, undefined);
            return value;
        };
        const escapeAnonFn = (value) => {
            assert.is(this, undefined);
            return value;
        };
        const compareAnonFn = ([ aName ], [ bName ]) => {
            assert.is(this, undefined);
            return (aName < bName ? -1 : 1);
        };

        [
            [ filterTradFn, escapeTradFn, compareTradFn ],
            [ filterAnonFn, escapeAnonFn, compareAnonFn ],
        ].forEach(([ filterFn, escapeFn, compareFn ]) => {
            html = new Composer(filterFn, escapeFn, compareFn);

            html.filterAttributeValue('button', 'type');
            html.escapeAttributeValue('button');
            [
               [ 'type', 'button' ],
               [ 'class', 'btn' ],
            ].sort(html.compareAttributes);
        });
    });

    test('should throw a TypeError when parameters are not functions', () => {
        [
            [ true, false, null ],
            [ null, 'xy', false ],
            [ false, null, 1234 ],
        ].forEach((args) => {
            assert.throws(
                () => new Composer(...args),
                (err) => err instanceof TypeError
            );
        });
    });

    test.run();
}

/**
 * Compose Attributes
 */
{
    const test = suite('composeAttributes');

    /**
     * Map of HTML attribute names and values.
     *
     * @type {AttrMap}
     */
    const inputAttrs = {
        'type':            'button',
        'role':            null,
        'hidden':          false,
        'disabled':        true,
        'aria-disabled':   true,
        'aria-pressed':    false,
        'tabindex':        0,
        'id':              'ThemeLight',
        'class':           [],
        'aria-labelledby': [ 'ThemeLight', 'ThemeLbl' ],
        'onclick':         'toggleTheme(this.id);',
        'data-reverse':    'hello',
    };

    /**
     * @type {AttrValueFilter}
     */
    const filterTokenList = createFilterList(filterToken, ' ');

    /**
     * @type {AttrValueFilter}
     */
    const filterAttributeValue = createFilterMiddleware([
        filterValue,
        filterTokenList,
    ]);

    /**
     * Escapes the given attribute value.
     *
     * For testing purposes, this function converts the string value to uppercase.
     *
     * @type {AttrValueEscaper}
     */
    const escapeAttrValue = (value, name) => (name === 'data-reverse')
        ? value.split('').reverse().join('')
        : value.toUpperCase();

    /**
     * Compares attributes to sort.
     *
     * For testing purposes, this function compares attribute names' sequences
     * of UTF-16 code units values to sort in ascending order.
     *
     * @type {AttrMapComparator}
     */
    const compareAttrName = ([ a ], [ b ]) => (a > b ? 1 : (a < b ? -1 : 0));

    test('should throw a TypeError when attribute name is invalid', () => {
        const html = new Composer;

        assert.throws(
            () => html.composeAttribute('data~type', 'stub'),
            (err) => err instanceof TypeError
        );
    });

    test('should return `null` if no attributes are composed', () => {
        const html = new Composer;

        const output = html.composeAttributes({
            'foo': null,
            'baz': false,
        });

        assert.is(output, null);
    });

    test('should only compose attributes from `true` and strings', () => {
        const html = new Composer;

        const output = html.composeAttributes(inputAttrs);

        const expects = [
            'type="button"',
            'disabled',
            'aria-disabled',
            'id="ThemeLight"',
            'onclick="toggleTheme(this.id);"',
            'data-reverse="hello"',
        ].join(' ');

        assert.is(output, expects);
    });

    test('should sort, compose, and escape attributes map according to comparator, filter, and escaper', () => {
        const html = new Composer(filterAttributeValue, escapeAttrValue, compareAttrName);

        const output = html.composeAttributes(inputAttrs);

        const expects = [
            'aria-disabled="TRUE"',
            'aria-labelledby="THEMELIGHT THEMELBL"',
            'aria-pressed="FALSE"',
            'data-reverse="olleh"',
            'disabled',
            'id="THEMELIGHT"',
            'onclick="TOGGLETHEME(THIS.ID);"',
            'tabindex="0"',
            'type="BUTTON"',
        ].join(' ');

        assert.is(output, expects);
    });

    test.run();
}
