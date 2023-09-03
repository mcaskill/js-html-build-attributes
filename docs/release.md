# Release Guide

Please take a moment to review this document in order to make the update
process easy and effective for everyone involved.

This package follows [semantic versioning](https://semver.org/), which means
breaking changes may occur between major releases.

Ensure code has been thoroughly linted and tested,
see [`package.json`](../package.json) and [`Makefile`](../Makefile)
for available scripts.

Ensure all occurrences of version numbers, releases branch, and branch aliases
reflect the new release of the plugin.

## Notes

1. `npm version <newversion>` — Build the distribution files and tag the source package.
2. `npm publish` — Publish the distribution files to the NPM registry.

### Node Version

1. [`.nvmrc`](../.nvmrc)
2. [`package.json`](../package.json):
    1. `engines.node`
3. [`README.md`](../README.md)

### NPM Version

1. [`package.json`](../package.json):
    1. `engines.npm`

### Package Version

1. [`package.json`](../package.json):
    1. `version`
