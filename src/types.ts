/**
 * @file Library TypeScript Declarations
 */

/**
 * Map of HTML attribute names and values.
 *
 * A primitive interpretation of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap `NamedNodeMap`}
 * and {@link https://developer.mozilla.org/en-US/docs/Web/API/Attr `Attr`}.
 *
 * @typedef {Object<AttrName, unknown>} AttrMap
 */
export type AttrMap = Record<AttrName, unknown>;

/**
 * Compares attributes to sort.
 *
 * @callback AttrMapComparator
 *
 * @param   {AttrPair} a
 * @param   {AttrPair} b
 * @returns {number}
 */
export type AttrMapComparator = (a: AttrPair, b: AttrPair) => number;

/**
 * An attribute name.
 *
 * @typedef {string} AttrName
 */
export type AttrName = string;

/**
 * An HTML attribute name or pattern for sorting.
 *
 * @typedef {AttrName|RegExp} AttrOrder
 */
export type AttrOrder = AttrName | RegExp;

/**
 * Pair of an HTML attribute's name and value.
 *
 * @typedef {[ AttrName, unknown? ]} AttrPair
 */
export type AttrPair = [ AttrName, unknown? ];

/**
 * A filtered attribute value.
 *
 * Either:
 *
 * - `string`: Should render attribute.
 * - `true`: Should render attribute.
 * - `false`: Should reject attribute.
 *
 * @typedef {string|boolean} AttrValue
 */
export type AttrValue = string | boolean;

/**
 * Converts special characters to their corresponding HTML entities.
 *
 * @callback AttrValueEscaper
 *
 * @param   {string}   value
 * @param   {AttrName} [name]
 * @returns {string}
 */
export type AttrValueEscaper = (value: string, name?: AttrName) => string;

/**
 * Approves, rejects, and parses a value for an HTML attribute.
 *
 * @callback AttrValueFilter
 *
 * @param   {*}                        value
 * @param   {?AttrName}                [name]
 * @param   {?AttrValueFilterFallback} [fallback]
 * @returns {AttrValue}
 */
export type AttrValueFilter = (value: unknown, name?: AttrName, fallback?: AttrValueFilterFallback) => AttrValue;

/**
 * A fallback filter function or attribute value.
 *
 * @typedef {AttrValueFilter|AttrValue} AttrValueFilterFallback
 */
export type AttrValueFilterFallback = AttrValueFilter | AttrValue;

/**
 * An HTML attribute value separator.
 *
 * @typedef {string} AttrValueSeparator
 */
export type AttrValueSeparator = string;

/**
 * Map of HTML attribute names and separator strings.
 *
 * @typedef {Object<AttrName, string>} AttrValueSeparatorMap
 */
export type AttrValueSeparatorMap = Record<AttrName, AttrValueSeparator>;

/**
 * Map of characters to entities.
 *
 * @typedef {Object<string, string>} HTMLCharEscapeMap
 */
export type HTMLCharEscapeMap = Record<string, string>;

/**
 * Either null or undefined.
 *
 * @typedef {null|undefined} Nil
 */
export type Nil = null | undefined;
