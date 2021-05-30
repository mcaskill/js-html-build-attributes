import HTMLBuildAttributes from './html-build-attributes.js';

const htmlBuildAttributes   = new HTMLBuildAttributes();
const composeHTMLAttributes = htmlBuildAttributes.composeAttributes.bind(htmlBuildAttributes);
const composeHTMLAttribute  = htmlBuildAttributes.composeAttribute.bind(htmlBuildAttributes);

export {
    composeHTMLAttribute,
    composeHTMLAttributes,
    htmlBuildAttributes as default,
    HTMLBuildAttributes,
};
