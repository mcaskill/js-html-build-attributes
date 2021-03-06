import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { HTMLBuildAttributes } from '@mcaskill/html-build-attributes/lib/compose';
import {
    createFilterArray,
    createFilterResolver,
    filterToken,
    filterValue,
} from '@mcaskill/html-build-attributes/lib/filter';

/**
 * Class Constructor
 */
{
    const test = suite('constructor');

    test('should be an instance of HTMLBuildAttributes', () => {
        assert.instance((new HTMLBuildAttributes), HTMLBuildAttributes);
    });

    test('should assign supplied functions to class properties', () => {
        const noop = () => {};

        [
            [ noop, false, null ],
            [ null, noop, false ],
            [ false, null, noop ],
        ].forEach(([ filterFn, escapeFn, compareFn ]) => {
            let html;

            assert.not.throws(
                () => html = new HTMLBuildAttributes(filterFn, escapeFn, compareFn)
            );

            assert.is(html.filterAttributeValue, filterFn || undefined);
            assert.is(html.escapeAttributeValue, escapeFn || undefined);
            assert.is(html.compareAttributes, compareFn || undefined);
        });
    });

    test('should throw a TypeError when parameters are not functions', () => {
        [
            [ true, false, null ],
            [ null, 'xy', false ],
            [ false, null, 1234 ],
        ].forEach((args) => {
            assert.throws(
                () => new HTMLBuildAttributes(...args),
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
    };

    /**
     * @type {AttrValueFilter}
     */
    const filterTokenList = createFilterArray(filterToken, ' ');

    /**
     * @type {AttrValueFilter}
     */
    const filterAttributeValue = createFilterResolver([
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
    const escapeAttrValue = (value) => value.toUpperCase();

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
        const html = new HTMLBuildAttributes;

        assert.throws(
            () => html.composeAttribute('data~type', 'stub'),
            (err) => err instanceof TypeError
        );
    });

    test('should return `null` if no attributes are composed', () => {
        const html = new HTMLBuildAttributes;

        const output = html.composeAttributes({
            'foo': null,
            'baz': false,
        });

        assert.is(output, null);
    });

    test('should only compose attributes from `true` and strings', () => {
        const html = new HTMLBuildAttributes;

        const output = html.composeAttributes(inputAttrs);

        const expects = [
            'type="button"',
            'disabled',
            'aria-disabled',
            'id="ThemeLight"',
            'onclick="toggleTheme(this.id);"',
        ].join(' ');

        assert.is(output, expects);
    });

    test('should sort, compose, and escape attributes map according to comparator, filter, and escaper', () => {
        const html = new HTMLBuildAttributes(filterAttributeValue, escapeAttrValue, compareAttrName);

        const output = html.composeAttributes(inputAttrs);

        const expects = [
            'aria-disabled="TRUE"',
            'aria-labelledby="THEMELIGHT THEMELBL"',
            'aria-pressed="FALSE"',
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
