/**
 * @file Attribute Errors
 */

import type { AttrName } from './types';

/**
 * Options that describe the error.
 *
 * @typedef {Object} ErrorInit
 *
 * @property {*} [cause] - A property indicating the specific cause of the error.
 */
interface ErrorInit {
    cause?: unknown;
}

declare type ErrorInterface = Error;

declare class Error implements ErrorInterface {
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;

    constructor(message?: string, init?: ErrorInit);

    /**
     * {@link https://v8.dev/docs/stack-trace-api#stack-trace-collection-for-custom-exceptions}.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types -- Allow catch-all 'function' parameter type.
    static captureStackTrace(error: object, constructor?: Function): void;
}

/**
 * Represents an error with a value to be filtered.
 */
export class FilterError extends Error
{
    /**
     * @param {string}    [message]
     * @param {ErrorInit} [options]
     */
    constructor(message?: string, options?: ErrorInit) {
        super(message, options);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name;

        // Maintains proper stack trace for where our error was thrown
        // (only available on V8)
        /* c8 ignore start */
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
        /* c8 ignore stop */
    }

    /**
     * Describes the attribute name or value.
     *
     * @param   {unknown}  [value]
     * @param   {AttrName} [name]
     * @returns {string}
     */
    static describeAttr(value?: unknown, name?: AttrName): string
    {
        if (name != null) {
            return `attribute [${name}]`;
        }

        const type = (typeof value);

        switch (type) {
            case 'object':
                if (Array.isArray(value)) {
                    return 'array';
                }

                return (value == null) ? 'null' : type;
        }

        return type;
    }

    /**
     * Creates an error with a generic "is not filterable" message.
     *
     * @param   {unknown}   [value]
     * @param   {AttrName}  [name]
     * @param   {ErrorInit} [options]
     * @returns {FilterError}
     */
    static createNotFilterable(value?: unknown, name?: AttrName, options?: ErrorInit): FilterError
    {
        const attr = this.describeAttr(value, name);

        return new this(`${attr} is not filterable`, options);
    }

    /**
     * Creates an error with a generic "is not concatenable" message.
     *
     * @param   {unknown}   [value]
     * @param   {AttrName}  [name]
     * @param   {ErrorInit} [options]
     * @returns {FilterError}
     */
    static createNotConcatenable(value?: unknown, name?: AttrName, options?: ErrorInit): FilterError
    {
        const attr = this.describeAttr(value, name);

        return new this(`${attr} is not concatenable`, options);
    }
}

/**
 * Represents a value that the filter is unable to convert.
 */
export class BadValueError extends FilterError
{
}

/**
 * Represents a value that does not conform to the filter's constraints.
 *
 * Indicates the filter does not accept the value and should maybe
 * try another filter.
 */
export class TypeMismatchError extends FilterError
{
}
