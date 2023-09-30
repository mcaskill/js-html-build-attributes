# Changelog

## 0.2.0

Breaking changes

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
