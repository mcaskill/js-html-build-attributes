// import HTMLBuildAttributes from '@mcaskill/html-build-attributes';
import { composeAttributes } from '@mcaskill/html-build-attributes';
import { filterValue as filterValueA } from '@mcaskill/html-build-attributes/lib';
import { filterValue as filterValueB } from '@mcaskill/html-build-attributes/lib/filter';
import { filterValue as filterValueC } from '@mcaskill/html-build-attributes/lib/filter/filter-value.js';

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
