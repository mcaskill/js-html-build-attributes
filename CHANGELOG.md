# Changelog

## Unreleased

Breaking changes:

* Reorganize library:
  * Un-nest contents of the `lib/` directory/export.
  * Group attribute (tuple) related modules under `attr/` from `lib/sort/sort-ordered-attributes.js`.
  * Group name related modules under `name/` from `lib/util/is-valid-attribute-name.js`.
  * Group value related modules under `value/` from `lib/escape/*.js` and `lib/filter/*.js`.
  * Rename documentation file names to reflect relation to attribute, name, or value.

## 0.2.4

* Ensure `README.md` and `LICENSE` files are included in NPM distribution.

## 0.2.3

* Reorganize TypeScript building and NPM distribution.

## 0.2.2

* Revert NPM manifest to include `main` and `types` matching package module type.

## 0.2.1

* Revert NPM exports back to `import`/`require` instead of `require`/`default`.
* Add `sideEffects` hint to NPM manifest.
* Remove source maps from distribution files since we do not include source.

## 0.2.0

Breaking changes:

* Replace underperformant throw/catch pattern with a classic fallback/middleware pattern.
* Replace `createFilterResolver()` with `createFilterMiddleware()`.
* Replace `createFilterArray()` with `createFilterList()`.
* Add `createFilterCallable()` for a more versatile name; this filter is not recursive unlike its predecessor `filterFunction()`.
* Add `filterFallback()` to resolve the fallback argument with support for the middleware pattern.
* Remove obsolete `createFilterChain()`.
* Fix TS/JSDoc reference.

## 0.1.3

Note: With Node v16+, the V8 coverage is reporting false-negatives.

* Require at least Node v16
* Improve `AttrValueEscaper` type to include the attribute name.
* Remove `null` from `AttrValue` type; redundant given `false` has the same
  behaviour and simplifies the typing.
* Update TypeScript configuration and NPM exports:
  * Emit dedicated TS declaration files and maps for CJS and ESM instead
    of a set of unified declaration files which risks being incompatible
    for either CJS or ESM.
  * Add dedicated root package index to export all modules.

## 0.1.2

* Fix throwing new `TypeError` in `createFilterArray()` factory function.

## 0.1.1

* Fix main entry points to target default instance.

## 0.1.0

* Initial public release.
