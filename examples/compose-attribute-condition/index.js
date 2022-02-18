import {
    HTMLBuildAttributes
} from '@mcaskill/html-build-attributes';

export default class extends HTMLBuildAttributes
{
    /**
     * @param   {string} name
     * @param   {*}      value
     * @param   {*}      [condition]
     * @returns {?string}
     */
    composeAttribute(name, value, condition)
    {
        if (condition == null) {
            condition = value;
        }

        if (this.resolveCondition(condition)) {
            return super.composeAttribute(name, value);
        }

        return null;
    }

    /**
     * @param  {*} condition
     * @return {boolean}
     */
    resolveCondition(condition)
    {
        switch (typeof condition) {
            case 'function':
                return !!condition();

            case 'boolean':
                return condition;

            case 'number':
            case 'bigint':
            case 'string':
                return !!condition;
        }

        if (condition == null) {
            return false;
        }

        if (Array.isArray(condition)) {
            return !!condition.length;
        }

        return !!condition;
    }
}
