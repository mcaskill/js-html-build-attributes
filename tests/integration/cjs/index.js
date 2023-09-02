// const HTMLBuildAttributes = require('@mcaskill/html-build-attributes');
const { composeAttributes } = require('@mcaskill/html-build-attributes');
const { filterValue: filterValueA } = require('@mcaskill/html-build-attributes/lib');
const { filterValue: filterValueB } = require('@mcaskill/html-build-attributes/lib/filter');
const { filterValue: filterValueC } = require('@mcaskill/html-build-attributes/lib/filter/filter-value.js');

if (
    (typeof filterValueA !== 'function') ||
    (filterValueA !== filterValueB) ||
    (filterValueB !== filterValueC)
) {
    throw new Error('filterValue function not found');
}

if ('lang="en" dir="ltr" class="has-no-js test"' !== composeAttributes({
    lang:  'en',
    dir:   'ltr',
    class: [
        'has-no-js',
        'test',
    ],
})) {
    throw new Error('filterValue function not found');
}
