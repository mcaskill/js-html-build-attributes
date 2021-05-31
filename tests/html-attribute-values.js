import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import htmlBuildAttributes from '@mcaskill/html-build-attributes';

// ---

const nil = suite('Nill');

nil('should ignore attribute with null', () => {
    const output = htmlBuildAttributes.composeAttribute('data-is-null', null);
    assert.is(output, null);
});

nil('should ignore attribute with undefined', () => {
    const output = htmlBuildAttributes.composeAttribute('data-is-undefined', void 0);
    assert.is(output, null);
});

nil('should ignore attribute with symbol', () => {
    const input = Symbol('foo');
    const output = htmlBuildAttributes.composeAttribute('data-is-symbol', input);
    assert.is(output, null);
});

nil.run();

// ---

const str = suite('String');

str('should render attribute with empty string', () => {
    const output = htmlBuildAttributes.composeAttribute('value', '');
    assert.snapshot(output, 'value=""');
});

str('should render attribute with primitive string', () => {
    const output = htmlBuildAttributes.composeAttribute('id', 'main');
    assert.snapshot(output, 'id="main"');
});

str('should render attribute with String object', () => {
    const input = new String('String object');
    const output = htmlBuildAttributes.composeAttribute('value', input);
    assert.snapshot(output, 'value="String object"');
});

str.run();

// ---

const num = suite('Number');

num('should render attribute with zero', () => {
    const output = htmlBuildAttributes.composeAttribute('data-attempts', 0);
    assert.snapshot(output, 'data-attempts="0"');
});

num('should render attribute with finite number', () => {
    const output = htmlBuildAttributes.composeAttribute('maxlength', 255);
    assert.snapshot(output, 'maxlength="255"');
});

num('should ignore attribute with non-finite number', () => {
    const output = htmlBuildAttributes.composeAttribute('value', (1000 / 0));
    assert.is(output, null);
});

num('should ignore attribute with Infinity', () => {
    const output = htmlBuildAttributes.composeAttribute('value', Infinity);
    assert.is(output, null);
});

num('should ignore attribute with NaN', () => {
    const output = htmlBuildAttributes.composeAttribute('value', NaN);
    assert.is(output, null);
});

num('should render attribute with Number object', () => {
    const input = new Number('123');
    const output = htmlBuildAttributes.composeAttribute('value', input);
    assert.snapshot(output, 'value="123"');
});

num('should render attribute with primitive bigint', () => {
    const input = BigInt('0x1fffffffffffff');

    const output = htmlBuildAttributes.composeAttribute('data-max-file-size', input);
    assert.snapshot(output, 'data-max-file-size="9007199254740991"');
});

num.run();

// ---

const bool = suite('Boolean');

bool('should render attribute with true', () => {
    const output = htmlBuildAttributes.composeAttribute('disabled', true);
    assert.snapshot(output, 'disabled');
});

bool('should ignore attribute with false', () => {
    const output = htmlBuildAttributes.composeAttribute('required', false);
    assert.is(output, null);
});

bool('should render attribute with Boolean object', () => {
    const input = new Boolean('false');
    const output = htmlBuildAttributes.composeAttribute('required', input);
    assert.is(output, 'required="true"');
});

bool.run();

// ---

const arr = suite('Array');

arr('should render attribute with string list', () => {
    const input = [ 'foo', 'baz', 'qux' ];
    const output = htmlBuildAttributes.composeAttribute('class', input);
    assert.snapshot(output, 'class="foo baz qux"');
});

arr('should render attribute with mixed list', () => {
    const input = [ 'foo', ' ', 'baz', null, {}, true, false, [ 'qux', 'xyz' ] ];
    const output = htmlBuildAttributes.composeAttribute('class', input);
    assert.snapshot(output, 'class="foo   baz [object Object] true false qux,xyz"');
});

arr('should ignore attribute with empty list', () => {
    const output = htmlBuildAttributes.composeAttribute('class', []);
    assert.is(output, null);
});

arr.run();

// ---

const obj = suite('Object');

obj('should render attribute with object using toString', () => {
    class Person {
        constructor(id, name) {
            this.id = id;
            this.name = name;
        }

        toString() {
            return this.name;
        }
    }

    const input = new Person(1, 'Tim');

    const output = htmlBuildAttributes.composeAttribute('data-name', input);
    assert.snapshot(output, 'data-name="Tim"');
});

obj('should render attribute with object using toJSON', () => {
    class Person {
        constructor(id, name) {
            this.id = id;
            this.name = name;
        }

        toJSON() {
            return `${this.id}:${this.name}`;
        }
    }

    const input = new Person(1, 'Tim');

    const output = htmlBuildAttributes.composeAttribute('data-name', input);
    assert.snapshot(output, 'data-name="&quot;1:Tim&quot;"');
});

obj('should render attribute with object converted to JSON', () => {
    class Person {
        constructor(id, name) {
            this.id = id;
            this.name = name;
        }
    }

    const input = new Person(1, 'Tim');

    const output = htmlBuildAttributes.composeAttribute('data-json', input);
    assert.snapshot(output, 'data-json="{&quot;id&quot;:1,&quot;name&quot;:&quot;Tim&quot;}"');
});

obj('should ignore attribute with invalid JSON value', () => {
    const input = {
        foo: 2n,
    };

    assert.throws(
        () => htmlBuildAttributes.composeAttribute('data-json', input),
        (err) => err instanceof TypeError
    );
});

obj.run();
