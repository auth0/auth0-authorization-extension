module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 166);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("joi@9.0.4");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Crypto = __webpack_require__(16);
const Path = __webpack_require__(14);
const Util = __webpack_require__(28);
const Escape = __webpack_require__(76);


// Declare internals

const internals = {};


// Clone object or array

exports.clone = function (obj, seen) {

    if (typeof obj !== 'object' ||
        obj === null) {

        return obj;
    }

    seen = seen || { orig: [], copy: [] };

    const lookup = seen.orig.indexOf(obj);
    if (lookup !== -1) {
        return seen.copy[lookup];
    }

    let newObj;
    let cloneDeep = false;

    if (!Array.isArray(obj)) {
        if (Buffer.isBuffer(obj)) {
            newObj = new Buffer(obj);
        }
        else if (obj instanceof Date) {
            newObj = new Date(obj.getTime());
        }
        else if (obj instanceof RegExp) {
            newObj = new RegExp(obj);
        }
        else {
            const proto = Object.getPrototypeOf(obj);
            if (proto &&
                proto.isImmutable) {

                newObj = obj;
            }
            else {
                newObj = Object.create(proto);
                cloneDeep = true;
            }
        }
    }
    else {
        newObj = [];
        cloneDeep = true;
    }

    seen.orig.push(obj);
    seen.copy.push(newObj);

    if (cloneDeep) {
        const keys = Object.getOwnPropertyNames(obj);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const descriptor = Object.getOwnPropertyDescriptor(obj, key);
            if (descriptor &&
                (descriptor.get ||
                 descriptor.set)) {

                Object.defineProperty(newObj, key, descriptor);
            }
            else {
                newObj[key] = exports.clone(obj[key], seen);
            }
        }
    }

    return newObj;
};


// Merge all the properties of source into target, source wins in conflict, and by default null and undefined from source are applied

/*eslint-disable */
exports.merge = function (target, source, isNullOverride /* = true */, isMergeArrays /* = true */) {
/*eslint-enable */

    exports.assert(target && typeof target === 'object', 'Invalid target value: must be an object');
    exports.assert(source === null || source === undefined || typeof source === 'object', 'Invalid source value: must be null, undefined, or an object');

    if (!source) {
        return target;
    }

    if (Array.isArray(source)) {
        exports.assert(Array.isArray(target), 'Cannot merge array onto an object');
        if (isMergeArrays === false) {                                                  // isMergeArrays defaults to true
            target.length = 0;                                                          // Must not change target assignment
        }

        for (let i = 0; i < source.length; ++i) {
            target.push(exports.clone(source[i]));
        }

        return target;
    }

    const keys = Object.keys(source);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const value = source[key];
        if (value &&
            typeof value === 'object') {

            if (!target[key] ||
                typeof target[key] !== 'object' ||
                (Array.isArray(target[key]) !== Array.isArray(value)) ||
                value instanceof Date ||
                Buffer.isBuffer(value) ||
                value instanceof RegExp) {

                target[key] = exports.clone(value);
            }
            else {
                exports.merge(target[key], value, isNullOverride, isMergeArrays);
            }
        }
        else {
            if (value !== null &&
                value !== undefined) {                              // Explicit to preserve empty strings

                target[key] = value;
            }
            else if (isNullOverride !== false) {                    // Defaults to true
                target[key] = value;
            }
        }
    }

    return target;
};


// Apply options to a copy of the defaults

exports.applyToDefaults = function (defaults, options, isNullOverride) {

    exports.assert(defaults && typeof defaults === 'object', 'Invalid defaults value: must be an object');
    exports.assert(!options || options === true || typeof options === 'object', 'Invalid options value: must be true, falsy or an object');

    if (!options) {                                                 // If no options, return null
        return null;
    }

    const copy = exports.clone(defaults);

    if (options === true) {                                         // If options is set to true, use defaults
        return copy;
    }

    return exports.merge(copy, options, isNullOverride === true, false);
};


// Clone an object except for the listed keys which are shallow copied

exports.cloneWithShallow = function (source, keys) {

    if (!source ||
        typeof source !== 'object') {

        return source;
    }

    const storage = internals.store(source, keys);    // Move shallow copy items to storage
    const copy = exports.clone(source);               // Deep copy the rest
    internals.restore(copy, source, storage);       // Shallow copy the stored items and restore
    return copy;
};


internals.store = function (source, keys) {

    const storage = {};
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const value = exports.reach(source, key);
        if (value !== undefined) {
            storage[key] = value;
            internals.reachSet(source, key, undefined);
        }
    }

    return storage;
};


internals.restore = function (copy, source, storage) {

    const keys = Object.keys(storage);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        internals.reachSet(copy, key, storage[key]);
        internals.reachSet(source, key, storage[key]);
    }
};


internals.reachSet = function (obj, key, value) {

    const path = key.split('.');
    let ref = obj;
    for (let i = 0; i < path.length; ++i) {
        const segment = path[i];
        if (i + 1 === path.length) {
            ref[segment] = value;
        }

        ref = ref[segment];
    }
};


// Apply options to defaults except for the listed keys which are shallow copied from option without merging

exports.applyToDefaultsWithShallow = function (defaults, options, keys) {

    exports.assert(defaults && typeof defaults === 'object', 'Invalid defaults value: must be an object');
    exports.assert(!options || options === true || typeof options === 'object', 'Invalid options value: must be true, falsy or an object');
    exports.assert(keys && Array.isArray(keys), 'Invalid keys');

    if (!options) {                                                 // If no options, return null
        return null;
    }

    const copy = exports.cloneWithShallow(defaults, keys);

    if (options === true) {                                         // If options is set to true, use defaults
        return copy;
    }

    const storage = internals.store(options, keys);   // Move shallow copy items to storage
    exports.merge(copy, options, false, false);     // Deep copy the rest
    internals.restore(copy, options, storage);      // Shallow copy the stored items and restore
    return copy;
};


// Deep object or array comparison

exports.deepEqual = function (obj, ref, options, seen) {

    options = options || { prototype: true };

    const type = typeof obj;

    if (type !== typeof ref) {
        return false;
    }

    if (type !== 'object' ||
        obj === null ||
        ref === null) {

        if (obj === ref) {                                                      // Copied from Deep-eql, copyright(c) 2013 Jake Luer, jake@alogicalparadox.com, MIT Licensed, https://github.com/chaijs/deep-eql
            return obj !== 0 || 1 / obj === 1 / ref;        // -0 / +0
        }

        return obj !== obj && ref !== ref;                  // NaN
    }

    seen = seen || [];
    if (seen.indexOf(obj) !== -1) {
        return true;                            // If previous comparison failed, it would have stopped execution
    }

    seen.push(obj);

    if (Array.isArray(obj)) {
        if (!Array.isArray(ref)) {
            return false;
        }

        if (!options.part && obj.length !== ref.length) {
            return false;
        }

        for (let i = 0; i < obj.length; ++i) {
            if (options.part) {
                let found = false;
                for (let j = 0; j < ref.length; ++j) {
                    if (exports.deepEqual(obj[i], ref[j], options)) {
                        found = true;
                        break;
                    }
                }

                return found;
            }

            if (!exports.deepEqual(obj[i], ref[i], options)) {
                return false;
            }
        }

        return true;
    }

    if (Buffer.isBuffer(obj)) {
        if (!Buffer.isBuffer(ref)) {
            return false;
        }

        if (obj.length !== ref.length) {
            return false;
        }

        for (let i = 0; i < obj.length; ++i) {
            if (obj[i] !== ref[i]) {
                return false;
            }
        }

        return true;
    }

    if (obj instanceof Date) {
        return (ref instanceof Date && obj.getTime() === ref.getTime());
    }

    if (obj instanceof RegExp) {
        return (ref instanceof RegExp && obj.toString() === ref.toString());
    }

    if (options.prototype) {
        if (Object.getPrototypeOf(obj) !== Object.getPrototypeOf(ref)) {
            return false;
        }
    }

    const keys = Object.getOwnPropertyNames(obj);

    if (!options.part && keys.length !== Object.getOwnPropertyNames(ref).length) {
        return false;
    }

    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor.get) {
            if (!exports.deepEqual(descriptor, Object.getOwnPropertyDescriptor(ref, key), options, seen)) {
                return false;
            }
        }
        else if (!exports.deepEqual(obj[key], ref[key], options, seen)) {
            return false;
        }
    }

    return true;
};


// Remove duplicate items from array

exports.unique = (array, key) => {

    let result;
    if (key) {
        result = [];
        const index = new Set();
        array.forEach((item) => {

            const identifier = item[key];
            if (!index.has(identifier)) {
                index.add(identifier);
                result.push(item);
            }
        });
    }
    else {
        result = Array.from(new Set(array));
    }

    return result;
};


// Convert array into object

exports.mapToObject = function (array, key) {

    if (!array) {
        return null;
    }

    const obj = {};
    for (let i = 0; i < array.length; ++i) {
        if (key) {
            if (array[i][key]) {
                obj[array[i][key]] = true;
            }
        }
        else {
            obj[array[i]] = true;
        }
    }

    return obj;
};


// Find the common unique items in two arrays

exports.intersect = function (array1, array2, justFirst) {

    if (!array1 || !array2) {
        return [];
    }

    const common = [];
    const hash = (Array.isArray(array1) ? exports.mapToObject(array1) : array1);
    const found = {};
    for (let i = 0; i < array2.length; ++i) {
        if (hash[array2[i]] && !found[array2[i]]) {
            if (justFirst) {
                return array2[i];
            }

            common.push(array2[i]);
            found[array2[i]] = true;
        }
    }

    return (justFirst ? null : common);
};


// Test if the reference contains the values

exports.contain = function (ref, values, options) {

    /*
        string -> string(s)
        array -> item(s)
        object -> key(s)
        object -> object (key:value)
    */

    let valuePairs = null;
    if (typeof ref === 'object' &&
        typeof values === 'object' &&
        !Array.isArray(ref) &&
        !Array.isArray(values)) {

        valuePairs = values;
        values = Object.keys(values);
    }
    else {
        values = [].concat(values);
    }

    options = options || {};            // deep, once, only, part

    exports.assert(arguments.length >= 2, 'Insufficient arguments');
    exports.assert(typeof ref === 'string' || typeof ref === 'object', 'Reference must be string or an object');
    exports.assert(values.length, 'Values array cannot be empty');

    let compare;
    let compareFlags;
    if (options.deep) {
        compare = exports.deepEqual;

        const hasOnly = options.hasOwnProperty('only');
        const hasPart = options.hasOwnProperty('part');

        compareFlags = {
            prototype: hasOnly ? options.only : hasPart ? !options.part : false,
            part: hasOnly ? !options.only : hasPart ? options.part : true
        };
    }
    else {
        compare = (a, b) => a === b;
    }

    let misses = false;
    const matches = new Array(values.length);
    for (let i = 0; i < matches.length; ++i) {
        matches[i] = 0;
    }

    if (typeof ref === 'string') {
        let pattern = '(';
        for (let i = 0; i < values.length; ++i) {
            const value = values[i];
            exports.assert(typeof value === 'string', 'Cannot compare string reference to non-string value');
            pattern += (i ? '|' : '') + exports.escapeRegex(value);
        }

        const regex = new RegExp(pattern + ')', 'g');
        const leftovers = ref.replace(regex, ($0, $1) => {

            const index = values.indexOf($1);
            ++matches[index];
            return '';          // Remove from string
        });

        misses = !!leftovers;
    }
    else if (Array.isArray(ref)) {
        for (let i = 0; i < ref.length; ++i) {
            let matched = false;
            for (let j = 0; j < values.length && matched === false; ++j) {
                matched = compare(values[j], ref[i], compareFlags) && j;
            }

            if (matched !== false) {
                ++matches[matched];
            }
            else {
                misses = true;
            }
        }
    }
    else {
        const keys = Object.keys(ref);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const pos = values.indexOf(key);
            if (pos !== -1) {
                if (valuePairs &&
                    !compare(valuePairs[key], ref[key], compareFlags)) {

                    return false;
                }

                ++matches[pos];
            }
            else {
                misses = true;
            }
        }
    }

    let result = false;
    for (let i = 0; i < matches.length; ++i) {
        result = result || !!matches[i];
        if ((options.once && matches[i] > 1) ||
            (!options.part && !matches[i])) {

            return false;
        }
    }

    if (options.only &&
        misses) {

        return false;
    }

    return result;
};


// Flatten array

exports.flatten = function (array, target) {

    const result = target || [];

    for (let i = 0; i < array.length; ++i) {
        if (Array.isArray(array[i])) {
            exports.flatten(array[i], result);
        }
        else {
            result.push(array[i]);
        }
    }

    return result;
};


// Convert an object key chain string ('a.b.c') to reference (object[a][b][c])

exports.reach = function (obj, chain, options) {

    if (chain === false ||
        chain === null ||
        typeof chain === 'undefined') {

        return obj;
    }

    options = options || {};
    if (typeof options === 'string') {
        options = { separator: options };
    }

    const path = chain.split(options.separator || '.');
    let ref = obj;
    for (let i = 0; i < path.length; ++i) {
        let key = path[i];
        if (key[0] === '-' && Array.isArray(ref)) {
            key = key.slice(1, key.length);
            key = ref.length - key;
        }

        if (!ref ||
            !((typeof ref === 'object' || typeof ref === 'function') && key in ref) ||
            (typeof ref !== 'object' && options.functions === false)) {         // Only object and function can have properties

            exports.assert(!options.strict || i + 1 === path.length, 'Missing segment', key, 'in reach path ', chain);
            exports.assert(typeof ref === 'object' || options.functions === true || typeof ref !== 'function', 'Invalid segment', key, 'in reach path ', chain);
            ref = options.default;
            break;
        }

        ref = ref[key];
    }

    return ref;
};


exports.reachTemplate = function (obj, template, options) {

    return template.replace(/{([^}]+)}/g, ($0, chain) => {

        const value = exports.reach(obj, chain, options);
        return (value === undefined || value === null ? '' : value);
    });
};


exports.formatStack = function (stack) {

    const trace = [];
    for (let i = 0; i < stack.length; ++i) {
        const item = stack[i];
        trace.push([item.getFileName(), item.getLineNumber(), item.getColumnNumber(), item.getFunctionName(), item.isConstructor()]);
    }

    return trace;
};


exports.formatTrace = function (trace) {

    const display = [];

    for (let i = 0; i < trace.length; ++i) {
        const row = trace[i];
        display.push((row[4] ? 'new ' : '') + row[3] + ' (' + row[0] + ':' + row[1] + ':' + row[2] + ')');
    }

    return display;
};


exports.callStack = function (slice) {

    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi

    const v8 = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {

        return stack;
    };

    const capture = {};
    Error.captureStackTrace(capture, this);     // arguments.callee is not supported in strict mode so we use this and slice the trace of this off the result
    const stack = capture.stack;

    Error.prepareStackTrace = v8;

    const trace = exports.formatStack(stack);

    return trace.slice(1 + slice);
};


exports.displayStack = function (slice) {

    const trace = exports.callStack(slice === undefined ? 1 : slice + 1);

    return exports.formatTrace(trace);
};


exports.abortThrow = false;


exports.abort = function (message, hideStack) {

    if ("production" === 'test' || exports.abortThrow === true) {
        throw new Error(message || 'Unknown error');
    }

    let stack = '';
    if (!hideStack) {
        stack = exports.displayStack(1).join('\n\t');
    }
    console.log('ABORT: ' + message + '\n\t' + stack);
    process.exit(1);
};


exports.assert = function (condition /*, msg1, msg2, msg3 */) {

    if (condition) {
        return;
    }

    if (arguments.length === 2 && arguments[1] instanceof Error) {
        throw arguments[1];
    }

    let msgs = [];
    for (let i = 1; i < arguments.length; ++i) {
        if (arguments[i] !== '') {
            msgs.push(arguments[i]);            // Avoids Array.slice arguments leak, allowing for V8 optimizations
        }
    }

    msgs = msgs.map((msg) => {

        return typeof msg === 'string' ? msg : msg instanceof Error ? msg.message : exports.stringify(msg);
    });

    throw new Error(msgs.join(' ') || 'Unknown error');
};


exports.Timer = function () {

    this.ts = 0;
    this.reset();
};


exports.Timer.prototype.reset = function () {

    this.ts = Date.now();
};


exports.Timer.prototype.elapsed = function () {

    return Date.now() - this.ts;
};


exports.Bench = function () {

    this.ts = 0;
    this.reset();
};


exports.Bench.prototype.reset = function () {

    this.ts = exports.Bench.now();
};


exports.Bench.prototype.elapsed = function () {

    return exports.Bench.now() - this.ts;
};


exports.Bench.now = function () {

    const ts = process.hrtime();
    return (ts[0] * 1e3) + (ts[1] / 1e6);
};


// Escape string for Regex construction

exports.escapeRegex = function (string) {

    // Escape ^$.*+-?=!:|\/()[]{},
    return string.replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&');
};


// Base64url (RFC 4648) encode

exports.base64urlEncode = function (value, encoding) {

    exports.assert(typeof value === 'string' || Buffer.isBuffer(value), 'value must be string or buffer');
    const buf = (Buffer.isBuffer(value) ? value : new Buffer(value, encoding || 'binary'));
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
};


// Base64url (RFC 4648) decode

exports.base64urlDecode = function (value, encoding) {

    if (typeof value !== 'string') {

        return new Error('Value not a string');
    }

    if (!/^[\w\-]*$/.test(value)) {

        return new Error('Invalid character');
    }

    const buf = new Buffer(value, 'base64');
    return (encoding === 'buffer' ? buf : buf.toString(encoding || 'binary'));
};


// Escape attribute value for use in HTTP header

exports.escapeHeaderAttribute = function (attribute) {

    // Allowed value characters: !#$%&'()*+,-./:;<=>?@[]^_`{|}~ and space, a-z, A-Z, 0-9, \, "

    exports.assert(/^[ \w\!#\$%&'\(\)\*\+,\-\.\/\:;<\=>\?@\[\]\^`\{\|\}~\"\\]*$/.test(attribute), 'Bad attribute value (' + attribute + ')');

    return attribute.replace(/\\/g, '\\\\').replace(/\"/g, '\\"');                             // Escape quotes and slash
};


exports.escapeHtml = function (string) {

    return Escape.escapeHtml(string);
};


exports.escapeJavaScript = function (string) {

    return Escape.escapeJavaScript(string);
};


exports.nextTick = function (callback) {

    return function () {

        const args = arguments;
        process.nextTick(() => {

            callback.apply(null, args);
        });
    };
};


exports.once = function (method) {

    if (method._hoekOnce) {
        return method;
    }

    let once = false;
    const wrapped = function () {

        if (!once) {
            once = true;
            method.apply(null, arguments);
        }
    };

    wrapped._hoekOnce = true;

    return wrapped;
};


exports.isInteger = function (value) {

    return (typeof value === 'number' &&
            parseFloat(value) === parseInt(value, 10) &&
            !isNaN(value));
};


exports.ignore = function () { };


exports.inherits = Util.inherits;


exports.format = Util.format;


exports.transform = function (source, transform, options) {

    exports.assert(source === null || source === undefined || typeof source === 'object' || Array.isArray(source), 'Invalid source object: must be null, undefined, an object, or an array');
    const separator = (typeof options === 'object' && options !== null) ? (options.separator || '.') : '.';

    if (Array.isArray(source)) {
        const results = [];
        for (let i = 0; i < source.length; ++i) {
            results.push(exports.transform(source[i], transform, options));
        }
        return results;
    }

    const result = {};
    const keys = Object.keys(transform);

    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const path = key.split(separator);
        const sourcePath = transform[key];

        exports.assert(typeof sourcePath === 'string', 'All mappings must be "." delineated strings');

        let segment;
        let res = result;

        while (path.length > 1) {
            segment = path.shift();
            if (!res[segment]) {
                res[segment] = {};
            }
            res = res[segment];
        }
        segment = path.shift();
        res[segment] = exports.reach(source, sourcePath, options);
    }

    return result;
};


exports.uniqueFilename = function (path, extension) {

    if (extension) {
        extension = extension[0] !== '.' ? '.' + extension : extension;
    }
    else {
        extension = '';
    }

    path = Path.resolve(path);
    const name = [Date.now(), process.pid, Crypto.randomBytes(8).toString('hex')].join('-') + extension;
    return Path.join(path, name);
};


exports.stringify = function () {

    try {
        return JSON.stringify.apply(null, arguments);
    }
    catch (err) {
        return '[Cannot display object: ' + err.message + ']';
    }
};


exports.shallow = function (source) {

    const target = {};
    const keys = Object.keys(source);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        target[key] = source[key];
    }

    return target;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("boom@3.2.2");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("lodash@3.10.1");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _auth0ExtensionTools = __webpack_require__(12);

module.exports = (0, _auth0ExtensionTools.config)();

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("bluebird@3.5.0");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMembers = exports.getPermissionsByRoles = exports.getPermissionsForRoles = exports.getRolesForUser = exports.getRolesForGroups = exports.getParentGroups = exports.getChildGroups = exports.getMappingsWithNames = exports.getGroupsCached = exports.getRolesCached = exports.getPermissionsCached = exports.getConnectionsCached = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getDynamicUserGroups = getDynamicUserGroups;
exports.getUserGroups = getUserGroups;
exports.getGroupExpanded = getGroupExpanded;
exports.getGroupsExpanded = getGroupsExpanded;
exports.getUserData = getUserData;

var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _nconf = __webpack_require__(182);

var _nconf2 = _interopRequireDefault(_nconf);

var _bluebird = __webpack_require__(6);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lruMemoizer = __webpack_require__(181);

var _lruMemoizer2 = _interopRequireDefault(_lruMemoizer);

var _multipartRequest = __webpack_require__(11);

var _multipartRequest2 = _interopRequireDefault(_multipartRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var avoidBlock = function avoidBlock(action) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new _bluebird2.default(function (resolve, reject) {
      setImmediate(function () {
        try {
          resolve(action.apply(undefined, args));
        } catch (e) {
          reject(e);
        }
      });
    });
  };
};

var compact = function compact(entity) {
  return {
    _id: entity._id,
    name: entity.name,
    description: entity.description
  };
};

/*
 * Cache connections.
 */
var getConnectionsCached = exports.getConnectionsCached = (0, _lruMemoizer2.default)({
  load: function load(auth0, callback) {
    (0, _multipartRequest2.default)(auth0, 'connections', { fields: 'id,name,strategy' }).then(function (connections) {
      return _lodash2.default.chain(connections).sortBy(function (conn) {
        return conn.name.toLowerCase();
      }).value();
    }).then(function (connections) {
      return callback(null, connections);
    }).catch(function (err) {
      return callback(err);
    });
  },
  hash: function hash(auth0) {
    return auth0.hash || 'connections';
  },
  max: 100,
  maxAge: _nconf2.default.get('DATA_CACHE_MAX_AGE')
});

/*
 * Cache permissions.
 */
var getPermissionsCached = exports.getPermissionsCached = (0, _lruMemoizer2.default)({
  load: function load(db, callback) {
    db.getPermissions().then(function (permissions) {
      callback(null, permissions);
    }).catch(function (err) {
      return callback(err);
    });
  },
  hash: function hash(db) {
    return db.hash || 'permissions';
  },
  max: 100,
  maxAge: _nconf2.default.get('DATA_CACHE_MAX_AGE')
});

/*
 * Cache roles.
 */
var getRolesCached = exports.getRolesCached = (0, _lruMemoizer2.default)({
  load: function load(db, callback) {
    db.getRoles().then(function (roles) {
      callback(null, roles);
    }).catch(function (err) {
      return callback(err);
    });
  },
  hash: function hash(db) {
    return db.hash || 'roles';
  },
  max: 100,
  maxAge: _nconf2.default.get('DATA_CACHE_MAX_AGE')
});

/*
 * Cache groups.
 */
var getGroupsCached = exports.getGroupsCached = (0, _lruMemoizer2.default)({
  load: function load(db, callback) {
    db.getGroups().then(function (groups) {
      callback(null, groups);
    }).catch(function (err) {
      return callback(err);
    });
  },
  hash: function hash(db) {
    return db.hash || 'groups';
  },
  max: 100,
  maxAge: _nconf2.default.get('DATA_CACHE_MAX_AGE')
});

/*
 * Get the full connection names for all mappings.
 */
var getMappingsWithNames = exports.getMappingsWithNames = function getMappingsWithNames(auth0, groupMappings) {
  return new _bluebird2.default(function (resolve, reject) {
    getConnectionsCached(auth0, function (err, connections) {
      if (err) {
        return reject(err);
      }

      var mappings = [];
      groupMappings.forEach(function (m) {
        var connection = _lodash2.default.find(connections, { name: m.connectionName });
        if (connection) {
          var currentMapping = m;
          currentMapping.connectionName = connection.name + ' (' + connection.strategy + ')';
          mappings.push(currentMapping);
        }
      });

      return resolve(mappings);
    });
  });
};

/*
 * Resolve all child groups.
 */
var getChildGroups = exports.getChildGroups = function getChildGroups(groups, selectedGroups) {
  var groupsFlat = [];

  // Recursive method to find roles.
  var findGroups = function findGroups(groupId) {
    // Only process each role once.
    if (groupsFlat.indexOf(groupId) === -1) {
      groupsFlat.push(groupId);

      // Process the child groups.
      var group = _lodash2.default.find(groups, { _id: groupId });
      if (group && group.nested) {
        _lodash2.default.forEach(group.nested, function (nestedId) {
          findGroups(nestedId);
        });
      }
    }
  };

  // Process the user's groups.
  selectedGroups.forEach(function (g) {
    return findGroups(g._id);
  });

  // Return the groups.
  return _lodash2.default.filter(groups, function (g) {
    return groupsFlat.indexOf(g._id) > -1;
  });
};

/*
 * Resolve all parent groups.
 */
var getParentGroups = exports.getParentGroups = function getParentGroups(groups, selectedGroups) {
  var groupsFlat = [];

  // Recursive method to find roles.
  var findGroups = function findGroups(groupId) {
    // Only process each role once.
    if (groupsFlat.indexOf(groupId) === -1) {
      groupsFlat.push(groupId);

      // Process the parent groups.
      var parentGroups = _lodash2.default.filter(groups, function (group) {
        return _lodash2.default.includes(group.nested || [], groupId);
      });
      parentGroups.forEach(function (g) {
        return findGroups(g._id);
      });
    }
  };

  // Process the user's groups.
  selectedGroups.forEach(function (g) {
    return findGroups(g._id);
  });

  // Return the groups.
  return _lodash2.default.filter(groups, function (g) {
    return groupsFlat.indexOf(g._id) > -1;
  });
};

/*
 * Resolve all roles for a list of groups.
 */
var getRolesForGroups = exports.getRolesForGroups = function getRolesForGroups(selectedGroups, selectedRoles) {
  var result = [];
  var groups = {};
  selectedGroups.forEach(function (group) {
    if (group.roles) {
      group.roles.forEach(function (role) {
        if (!groups[role]) {
          groups[role] = group;
        }
      });
    }
  });

  selectedRoles.forEach(function (role) {
    if (groups[role._id]) {
      // eslint-disable-line no-underscore-dangle
      result.push({ role: role, group: groups[role._id] }); // eslint-disable-line no-underscore-dangle
    }
  });

  return result;
};

/*
 * Get all roles for a user.
 */
var getRolesForUser = exports.getRolesForUser = function getRolesForUser(database, userId) {
  return database.getGroups().then(function (groups) {
    // get all groups user belong to
    var userGroups = _lodash2.default.filter(groups, function (group) {
      return _lodash2.default.includes(group.members, userId);
    });
    return getParentGroups(groups, userGroups).filter(function (group) {
      return group.roles && group.roles.length;
    }).map(function (group) {
      return group.roles;
    }); // return roles for user's groups and their parents
  }).then(function (roles) {
    return _lodash2.default.uniq(_lodash2.default.flattenDeep(roles));
  }).then(function (roleIds) {
    return database.getRoles().then(function (roles) {
      var groupRoles = _lodash2.default.filter(roles, function (role) {
        return _lodash2.default.includes(roleIds, role._id);
      });
      var userRoles = _lodash2.default.filter(roles, function (role) {
        return role.users && _lodash2.default.includes(role.users, userId);
      });
      return _lodash2.default.uniq([].concat(_toConsumableArray(groupRoles), _toConsumableArray(userRoles)), '_id');
    });
  });
};

/*
 * Get all permissions for list of roles.
 */
var getPermissionsForRoles = exports.getPermissionsForRoles = function getPermissionsForRoles(database, userRoles) {
  return database.getPermissions().then(function (permissions) {
    var permIds = _lodash2.default.flattenDeep(_lodash2.default.map(userRoles, function (role) {
      return role.permissions;
    }));
    return permissions.filter(function (permission) {
      return _lodash2.default.includes(permIds, permission._id);
    });
  });
};

/*
 * Get all permissions for list of roles, grouped by role.
 */
var getPermissionsByRoles = exports.getPermissionsByRoles = function getPermissionsByRoles(database, roles) {
  return new _bluebird2.default(function (resolve, reject) {
    getPermissionsCached(database, function (err, permissions) {
      if (err) {
        return reject(err);
      }

      var rolesList = [];
      _lodash2.default.forEach(roles, function (role) {
        var rolePermissions = permissions.filter(function (permission) {
          return _lodash2.default.includes(role.permissions, permission._id);
        });

        rolesList.push(_extends({}, role, {
          permissions: _lodash2.default.map(rolePermissions, function (permission) {
            return {
              _id: permission._id,
              name: permission.name,
              description: permission.description
            };
          })
        }));
      });

      return resolve(rolesList);
    });
  });
};

/*
 * Resolve all users for a list of groups.
 */
var getMembers = exports.getMembers = function getMembers(selectedGroups) {
  var users = {};

  // Process the user's groups.
  selectedGroups.forEach(function (g) {
    if (g.members) {
      g.members.forEach(function (m) {
        if (!users[m]) {
          users[m] = g;
        }
      });
    }
  });

  // Return the users.
  return Object.keys(users).map(function (userId) {
    return {
      userId: userId,
      group: users[userId]
    };
  });
};

/*
 * Match a connection/group memberships to a mapping.
 */
var matchMapping = function matchMapping(mapping, connectionName, groupMemberships) {
  return mapping.connectionName === connectionName && groupMemberships.indexOf(mapping.groupName) > -1;
};

/*
 * Match a connection/group memberships to multiple mappings.
 */
var matchMappings = function matchMappings(mappings, connectionName, groupMemberships) {
  return mappings && _lodash2.default.filter(mappings, function (mapping) {
    return matchMapping(mapping, connectionName, groupMemberships);
  }).length > 0;
};

/*
 * Calculate dynamic group memberships.
 */
function getDynamicUserGroups(db, connectionName, groupMemberships, allGroups) {
  return new _bluebird2.default(function (resolve, reject) {
    if (!connectionName) {
      return resolve([]);
    }

    if (!groupMemberships || groupMemberships.length === 0) {
      return resolve([]);
    }

    var getGroups = function getGroups(cb) {
      if (allGroups && allGroups.length) {
        return cb(null, allGroups);
      }

      return getGroupsCached(db, cb);
    };

    return getGroups(function (err, groups) {
      if (err) {
        return reject(err);
      }

      var dynamicGroups = _lodash2.default.filter(groups, function (group) {
        return matchMappings(group.mappings, connectionName, groupMemberships);
      });
      return resolve(dynamicGroups);
    });
  });
}

/*
 * Get the groups a user belongs to.
 */
function getUserGroups(db, userId, connectionName, groupMemberships) {
  if (!Array.isArray(groupMemberships) || groupMemberships === undefined || groupMemberships === null) {
    groupMemberships = [];
  }

  return new _bluebird2.default(function (resolve, reject) {
    getGroupsCached(db, function (err, groups) {
      if (err) {
        return reject(err);
      }

      // Get the direct groups memberships of a user.
      var userGroups = _lodash2.default.filter(groups, function (group) {
        return _lodash2.default.includes(group.members, userId);
      });

      // Calculate the dynamic user groups based on external and internal group memberships.
      return getDynamicUserGroups(db, connectionName, [].concat(_toConsumableArray(groupMemberships), _toConsumableArray(userGroups.map(function (g) {
        return g.name;
      }))), groups).then(function (dynamicGroups) {
        var nestedGroups = getParentGroups(groups, _lodash2.default.union(userGroups, dynamicGroups));
        return resolve(nestedGroups);
      }).catch(reject);
    });
  });
}

/*
 * Get expanded group data
 */
function getGroupExpanded(db, groupId) {
  return new _bluebird2.default(function (resolve, reject) {
    getGroupsCached(db, function (error, groups) {
      if (error) {
        return reject(error);
      }

      return getRolesCached(db, function (err, allRoles) {
        if (err) {
          return reject(err);
        }
        var currentGroup = _lodash2.default.find(groups, { _id: groupId });
        var parentGroups = getParentGroups(groups, [currentGroup]).filter(function (g) {
          return g._id !== currentGroup._id;
        });

        var roles = getRolesForGroups([currentGroup].concat(_toConsumableArray(parentGroups)), allRoles).map(function (r) {
          return r.role;
        });
        var formatRole = function formatRole(r) {
          return {
            _id: r._id,
            name: r.name,
            description: r.description,
            applicationId: r.applicationId,
            applicationType: r.applicationType,
            permissions: r.permissions && r.permissions.map(compact)
          };
        };

        return getPermissionsByRoles(db, roles).then(function (rolesList) {
          return resolve({
            _id: currentGroup._id,
            name: currentGroup.name,
            description: currentGroup.description,
            roles: rolesList.map(formatRole)
          });
        });
      });
    });
  });
}

/*
 * Get expanded group data
 */
function getGroupsExpanded(db, groups) {
  return new _bluebird2.default(function (resolve, reject) {
    getGroupsCached(db, function (error, allGroups) {
      if (error) {
        return reject(error);
      }

      return getRolesCached(db, function (err, allRoles) {
        if (err) {
          return reject(err);
        }

        var groupsWithParents = getParentGroups(allGroups, groups);
        var roles = getRolesForGroups(groupsWithParents, allRoles).map(function (r) {
          return r.role;
        });
        var formatRole = function formatRole(r) {
          return {
            _id: r._id,
            name: r.name,
            description: r.description,
            applicationId: r.applicationId,
            applicationType: r.applicationType,
            permissions: r.permissions && r.permissions.map(compact)
          };
        };

        return getPermissionsByRoles(db, roles).then(function (rolesList) {
          return resolve({
            groups: groupsWithParents.map(compact),
            roles: rolesList.map(formatRole)
          });
        });
      });
    });
  });
}

/*
 * Get all user's groups, roles and permissions
 */
function getUserData(db, userId, clientId, connectionName, groupMemberships) {
  var result = {
    groups: [],
    roles: []
  };

  return db.provider.storageContext.read().then(function (data) {
    var _data$groups = data.groups,
        groups = _data$groups === undefined ? [] : _data$groups,
        _data$roles = data.roles,
        roles = _data$roles === undefined ? [] : _data$roles,
        _data$permissions = data.permissions,
        permissions = _data$permissions === undefined ? [] : _data$permissions;


    var userGroups = _lodash2.default.filter(groups, function (group) {
      return _lodash2.default.includes(group.members, userId);
    });

    if (!Array.isArray(groupMemberships)) {
      groupMemberships = [];
    }

    return avoidBlock(getDynamicUserGroups)(db, connectionName, [].concat(_toConsumableArray(groupMemberships), _toConsumableArray(userGroups.map(function (g) {
      return g.name;
    }))), groups).then(avoidBlock(function (dynamicGroups) {
      var parentGroups = getParentGroups(groups, _lodash2.default.union(userGroups, dynamicGroups));
      result.groups = _lodash2.default.uniq(parentGroups.map(function (group) {
        return group.name;
      }));
      return parentGroups;
    })).then(avoidBlock(function (allUserGroups) {
      var clearRoles = getRolesForGroups(allUserGroups, roles).map(function (record) {
        return record.role;
      });
      var directRoles = roles.filter(function (role) {
        return role.users && role.users.indexOf(userId) > -1;
      });
      var userRoles = [].concat(_toConsumableArray(clearRoles), _toConsumableArray(directRoles));
      var relevantRoles = userRoles.filter(function (role) {
        return role.applicationId === clientId;
      });
      result.roles = _lodash2.default.uniq(relevantRoles.map(function (role) {
        return role.name;
      }));

      return relevantRoles;
    })).then(avoidBlock(function (relevantRoles) {
      var permIds = _lodash2.default.flattenDeep(_lodash2.default.map(relevantRoles, function (role) {
        return role.permissions;
      }));
      var userPermissions = permissions.filter(function (permission) {
        return _lodash2.default.includes(permIds, permission._id);
      });
      result.permissions = _lodash2.default.uniq(userPermissions.map(function (permission) {
        return permission.name;
      }));

      return result;
    }));
  });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var winston = __webpack_require__(186);

winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [new winston.transports.Console({
    timestamp: true,
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  })],
  exitOnError: false
});

module.exports = logger;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules


// Declare internals

const internals = {};


exports.serial = function (array, method, callback) {

    if (!array.length) {
        callback();
    }
    else {
        let i = 0;
        const iterate = function () {

            const done = function (err) {

                if (err) {
                    callback(err);
                }
                else {
                    i = i + 1;
                    if (i < array.length) {
                        iterate();
                    }
                    else {
                        callback();
                    }
                }
            };

            method(array[i], done, i);
        };

        iterate();
    }
};


exports.parallel = function (array, method, callback) {

    if (!array.length) {
        callback();
    }
    else {
        let count = 0;
        let errored = false;

        const done = function (err) {

            if (!errored) {
                if (err) {
                    errored = true;
                    callback(err);
                }
                else {
                    count = count + 1;
                    if (count === array.length) {
                        callback();
                    }
                }
            }
        };

        for (let i = 0; i < array.length; ++i) {
            method(array[i], done, i);
        }
    }
};


exports.parallel.execute = function (fnObj, callback) {

    const result = {};
    if (!fnObj) {
        return callback(null, result);
    }

    const keys = Object.keys(fnObj);
    let count = 0;
    let errored = false;

    if (!keys.length) {
        return callback(null, result);
    }

    const done = function (key) {

        return function (err, val) {

            if (!errored) {
                if (err) {
                    errored = true;
                    callback(err);
                }
                else {
                    result[key] = val;
                    if (++count === keys.length) {
                        callback(null, result);
                    }
                }
            }
        };
    };

    for (let i = 0; i < keys.length; ++i) {
        if (!errored) {
            const key = keys[i];
            fnObj[key](done(key));
        }
    }
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scopes = exports.deleteApi = exports.updateApi = exports.createApi = exports.getApi = undefined;

var _bluebird = __webpack_require__(6);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _superagent = __webpack_require__(185);

var _superagent2 = _interopRequireDefault(_superagent);

var _auth0ExtensionTools = __webpack_require__(12);

var _config = __webpack_require__(4);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiIdentifier = 'urn:auth0-authz-api';
var allScopes = [{ value: 'read:users' }, { value: 'read:applications' }, { value: 'read:connections' }, { value: 'read:configuration' }, { value: 'update:configuration' }, { value: 'read:groups' }, { value: 'create:groups' }, { value: 'update:groups' }, { value: 'delete:groups' }, { value: 'read:roles' }, { value: 'create:roles' }, { value: 'update:roles' }, { value: 'delete:roles' }, { value: 'read:permissions' }, { value: 'create:permissions' }, { value: 'update:permissions' }, { value: 'delete:permissions' }, { value: 'read:resource-server' }, { value: 'create:resource-server' }, { value: 'update:resource-server' }, { value: 'delete:resource-server' }];

var getToken = function getToken(req) {
  var isAdministrator = req.auth && req.auth.credentials && req.auth.credentials.access_token && req.auth.credentials.access_token.length;
  if (isAdministrator) {
    return _bluebird2.default.resolve(req.auth.credentials.access_token);
  }

  return _auth0ExtensionTools.managementApi.getAccessTokenCached((0, _config2.default)('AUTH0_DOMAIN'), (0, _config2.default)('AUTH0_CLIENT_ID'), (0, _config2.default)('AUTH0_CLIENT_SECRET'));
};

var makeRequest = function makeRequest(req, path, method, payload) {
  return new _bluebird2.default(function (resolve, reject) {
    return getToken(req).then(function (token) {
      (0, _superagent2.default)(method, 'https://' + (0, _config2.default)('AUTH0_DOMAIN') + '/api/v2/' + path).send(payload || {}).set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + token).end(function (err, res) {
        if (err) {
          return reject(err);
        }

        return resolve(res.body);
      });
    });
  });
};

var getApi = exports.getApi = function getApi(req) {
  return makeRequest(req, 'resource-servers', 'GET').then(function (apis) {
    var api = apis.filter(function (item) {
      return item.identifier === apiIdentifier;
    });
    return api[0] || {};
  });
};

var createApi = exports.createApi = function createApi(req, lifeTime) {
  var payload = {
    name: 'auth0-authorization-extension-api',
    identifier: apiIdentifier,
    signing_alg: 'RS256',
    scopes: allScopes,
    token_lifetime: lifeTime
  };

  return makeRequest(req, 'resource-servers', 'POST', payload);
};

var updateApi = exports.updateApi = function updateApi(req, lifeTime) {
  return getApi(req).then(function (api) {
    var defaultLifetimeValue = 86400;

    if (!api.id) {
      return createApi(req, lifeTime || defaultLifetimeValue);
    }

    return makeRequest(req, 'resource-servers/' + api.id, 'PATCH', {
      token_lifetime: lifeTime || defaultLifetimeValue
    });
  });
};

var deleteApi = exports.deleteApi = function deleteApi(req, silent) {
  return getApi(req).then(function (api) {
    if (api.id) {
      return makeRequest(req, 'resource-servers/' + api.id, 'DELETE');
    }

    if (!api.id && !silent) {
      return _bluebird2.default.reject(new Error('Unable to disable resource-server. Is it enabled?'));
    }

    return _bluebird2.default.resolve();
  });
};

var scopes = exports.scopes = allScopes;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _bluebird = __webpack_require__(6);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _auth0ExtensionTools = __webpack_require__(12);

var _apiCall = __webpack_require__(43);

var _apiCall2 = _interopRequireDefault(_apiCall);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (client, entity) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var perPage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
  var concurrency = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 3;

  if (client === null || client === undefined) {
    throw new _auth0ExtensionTools.ArgumentError('Must provide a auth0 client object.');
  }

  if (!entity && !client[entity]) {
    throw new _auth0ExtensionTools.ArgumentError('Must provide a valid entity for auth0 client.');
  }

  var getter = client[entity].getAll;
  var options = Object.assign({}, opts, { per_page: perPage });
  var result = [];
  var total = 0;
  var pageCount = 0;

  var getTotals = function getTotals() {
    return (0, _apiCall2.default)(client, getter, [Object.assign({}, options, { include_totals: true, page: 0 })]).then(function (response) {
      total = response.total || 0;
      pageCount = Math.ceil(total / perPage);
      var data = response[entity] || response || [];
      data.forEach(function (item) {
        return result.push(item);
      });
      return null;
    });
  };

  var getPage = function getPage(page) {
    return (0, _apiCall2.default)(client, getter, [Object.assign({}, options, { page: page })]).then(function (data) {
      data.forEach(function (item) {
        return result.push(item);
      });
      return null;
    });
  };

  var getAll = function getAll() {
    return getTotals().then(function () {
      if (total === 0 || result.length >= total) {
        return result;
      }

      var pages = [];
      for (var i = 1; i <= pageCount; i++) {
        pages.push(i);
      }

      return _bluebird2.default.map(pages, getPage, { concurrency: concurrency });
    });
  };

  return getAll().then(function () {
    return result;
  });
};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("auth0-extension-tools@1.3.2");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Joi = __webpack_require__(0);
const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};


exports.apply = function (type, options, message) {

    const result = Joi.validate(options, internals[type]);
    Hoek.assert(!result.error, 'Invalid', type, 'options', message ? '(' + message + ')' : '', result.error && result.error.annotate());
    return result.value;
};


internals.access = Joi.object({
    entity: Joi.string().valid('user', 'app', 'any'),
    scope: [false, Joi.array().items(Joi.string()).single().min(1)]
});


internals.auth = Joi.alternatives([
    Joi.string(),
    internals.access.keys({
        mode: Joi.string().valid('required', 'optional', 'try'),
        strategy: Joi.string(),
        strategies: Joi.array().items(Joi.string()).min(1),
        access: Joi.array().items(internals.access.min(1)).single().min(1),
        payload: [
            Joi.string().valid('required', 'optional'),
            Joi.boolean()
        ]
    })
        .without('strategy', 'strategies')
        .without('access', ['scope', 'entity'])
]);


internals.event = Joi.object({
    method: Joi.array().items(Joi.func()).single(),
    options: Joi.object({
        before: Joi.array().items(Joi.string()).single(),
        after: Joi.array().items(Joi.string()).single(),
        bind: Joi.any(),
        sandbox: Joi.string().valid('connection', 'plugin')
    })
        .default({})
});


internals.exts = Joi.array().items(internals.event.keys({ type: Joi.string().required() })).single();


internals.routeBase = Joi.object({
    app: Joi.object().allow(null),
    auth: internals.auth.allow(false),
    bind: Joi.object().allow(null),
    cache: Joi.object({
        expiresIn: Joi.number(),
        expiresAt: Joi.string(),
        privacy: Joi.string().valid('default', 'public', 'private'),
        statuses: Joi.array().items(Joi.number().integer().min(200)).min(1).single(),
        otherwise: Joi.string().required()
    })
        .allow(false),
    cors: Joi.object({
        origin: Joi.array().min(1),
        maxAge: Joi.number(),
        headers: Joi.array().items(Joi.string()),
        additionalHeaders: Joi.array().items(Joi.string()),
        exposedHeaders: Joi.array().items(Joi.string()),
        additionalExposedHeaders: Joi.array().items(Joi.string()),
        credentials: Joi.boolean()
    })
        .allow(false, true),
    ext: Joi.object({
        onPreAuth: Joi.array().items(internals.event).single(),
        onPostAuth: Joi.array().items(internals.event).single(),
        onPreHandler: Joi.array().items(internals.event).single(),
        onPostHandler: Joi.array().items(internals.event).single(),
        onPreResponse: Joi.array().items(internals.event).single()
    })
        .default({}),
    files: Joi.object({
        relativeTo: Joi.string().regex(/^([\/\.])|([A-Za-z]:\\)|(\\\\)/).required()
    }),
    json: Joi.object({
        replacer: Joi.alternatives(Joi.func(), Joi.array()).allow(null),
        space: Joi.number().allow(null),
        suffix: Joi.string().allow(null)
    }),
    jsonp: Joi.string(),
    payload: Joi.object({
        output: Joi.string().valid('data', 'stream', 'file'),
        parse: Joi.boolean().allow('gunzip'),
        allow: [
            Joi.string(),
            Joi.array()
        ],
        override: Joi.string(),
        maxBytes: Joi.number(),
        uploads: Joi.string(),
        failAction: Joi.string().valid('error', 'log', 'ignore'),
        timeout: Joi.number().integer().positive().allow(false),
        defaultContentType: Joi.string()
    }),
    plugins: Joi.object(),
    response: Joi.object({
        emptyStatusCode: Joi.number().valid(200, 204),
        failAction: Joi.string().valid('error', 'log'),
        modify: Joi.boolean(),
        options: Joi.object(),
        ranges: Joi.boolean(),
        sample: Joi.number().min(0).max(100),
        schema: Joi.alternatives(Joi.object(), Joi.array(), Joi.func()).allow(true, false),
        status: Joi.object().pattern(/\d\d\d/, Joi.alternatives(Joi.object(), Joi.array(), Joi.func()).allow(true, false))
    })
        .without('modify', 'sample')
        .assert('options.stripUnknown', Joi.ref('modify'), 'meet requirement of having peer modify set to true'),
    security: Joi.object({
        hsts: [
            Joi.object({
                maxAge: Joi.number(),
                includeSubdomains: Joi.boolean(),
                includeSubDomains: Joi.boolean(),
                preload: Joi.boolean()
            }),
            Joi.boolean(),
            Joi.number()
        ],
        xframe: [
            Joi.boolean(),
            Joi.string().valid('sameorigin', 'deny'),
            Joi.object({
                rule: Joi.string().valid('sameorigin', 'deny', 'allow-from'),
                source: Joi.string()
            })
        ],
        xss: Joi.boolean(),
        noOpen: Joi.boolean(),
        noSniff: Joi.boolean()
    })
        .allow(null, false, true),
    state: Joi.object({
        parse: Joi.boolean(),
        failAction: Joi.string().valid('error', 'log', 'ignore')
    }),
    timeout: Joi.object({
        socket: Joi.number().integer().positive().allow(false),
        server: Joi.number().integer().positive().allow(false).required()
    }),
    validate: Joi.object({
        headers: Joi.alternatives(Joi.object(), Joi.array(), Joi.func()).allow(null, false, true),
        params: Joi.alternatives(Joi.object(), Joi.array(), Joi.func()).allow(null, false, true),
        query: Joi.alternatives(Joi.object(), Joi.array(), Joi.func()).allow(null, false, true),
        payload: Joi.alternatives(Joi.object(), Joi.array(), Joi.func()).allow(null, false, true),
        failAction: [
            Joi.string().valid('error', 'log', 'ignore'),
            Joi.func()
        ],
        errorFields: Joi.object(),
        options: Joi.object()
    })
});


internals.connectionBase = Joi.object({
    app: Joi.object().allow(null),
    compression: Joi.boolean(),
    load: Joi.object(),
    plugins: Joi.object(),
    router: Joi.object({
        isCaseSensitive: Joi.boolean(),
        stripTrailingSlash: Joi.boolean()
    }),
    routes: internals.routeBase,
    state: Joi.object()                                     // Cookie defaults
});


internals.server = Joi.object({
    app: Joi.object().allow(null),
    cache: Joi.allow(null),                                 // Validated elsewhere
    connections: internals.connectionBase,
    debug: Joi.object({
        request: Joi.array().allow(false),
        log: Joi.array().allow(false)
    }).allow(false),
    load: Joi.object(),
    mime: Joi.object(),
    plugins: Joi.object(),
    useDomains: Joi.boolean()
});


internals.connection = internals.connectionBase.keys({
    autoListen: Joi.boolean(),
    host: Joi.string().hostname(),
    address: Joi.string().hostname(),
    labels: Joi.array().items(Joi.string()).single(),
    listener: Joi.any(),
    port: Joi.alternatives([
        Joi.number().integer().min(0),          // TCP port
        Joi.string().regex(/\//),               // Unix domain socket
        Joi.string().regex(/^\\\\\.\\pipe\\/)   // Windows named pipe
    ])
        .allow(null),
    tls: Joi.alternatives([
        Joi.object().allow(null),
        Joi.boolean()
    ]),
    uri: Joi.string().regex(/[^/]$/)
});


internals.vhost = Joi.alternatives([
    Joi.string().hostname(),
    Joi.array().items(Joi.string().hostname()).min(1)
]);


internals.route = Joi.object({
    method: Joi.string().regex(/^[a-zA-Z0-9!#\$%&'\*\+\-\.^_`\|~]+$/).required(),
    path: Joi.string().required(),
    vhost: internals.vhost,
    handler: Joi.any(),                         // Validated in routeConfig
    config: Joi.object().allow(null)
});


internals.pre = [
    Joi.string(),
    Joi.func(),
    Joi.object({
        method: Joi.alternatives(Joi.string(), Joi.func()).required(),
        assign: Joi.string(),
        mode: Joi.string().valid('serial', 'parallel'),
        failAction: Joi.string().valid('error', 'log', 'ignore')
    })
];


internals.routeConfig = internals.routeBase.keys({
    id: Joi.string(),
    isInternal: Joi.boolean(),
    pre: Joi.array().items(internals.pre.concat(Joi.array().items(internals.pre).min(1))),
    handler: [
        Joi.func(),
        Joi.string(),
        Joi.object().length(1)
    ],
    description: Joi.string(),
    notes: [
        Joi.string(),
        Joi.array().items(Joi.string())
    ],
    tags: [
        Joi.string(),
        Joi.array().items(Joi.string())
    ]
});


internals.cacheConfig = Joi.object({
    name: Joi.string().invalid('_default'),
    partition: Joi.string(),
    shared: Joi.boolean(),
    engine: Joi.alternatives([
        Joi.object(),
        Joi.func()
    ])
        .required()
}).unknown();


internals.cache = Joi.array().items(internals.cacheConfig, Joi.func()).min(1).single();


internals.cachePolicy = Joi.object({
    cache: Joi.string().allow(null).allow(''),
    segment: Joi.string(),
    shared: Joi.boolean()
})
    .options({ allowUnknown: true });               // Catbox validates other keys


internals.method = Joi.object({
    bind: Joi.object().allow(null),
    generateKey: Joi.func(),
    cache: internals.cachePolicy,
    callback: Joi.boolean()
});


internals.methodObject = Joi.object({
    name: Joi.string().required(),
    method: Joi.func().required(),
    options: Joi.object()
});


internals.register = Joi.object({
    once: Joi.boolean(),
    routes: Joi.object({
        prefix: Joi.string().regex(/^\/.+/),
        vhost: internals.vhost
    })
        .default({}),
    select: Joi.array().items(Joi.string()).single()
});


internals.plugin = internals.register.keys({
    register: Joi.func().keys({
        attributes: Joi.object({
            pkg: Joi.object({
                name: Joi.string(),
                version: Joi.string().default('0.0.0')
            })
                .unknown()
                .default({
                    version: '0.0.0'
                }),
            name: Joi.string()
                .when('pkg.name', { is: Joi.exist(), otherwise: Joi.required() }),
            version: Joi.string(),
            multiple: Joi.boolean().default(false),
            dependencies: Joi.array().items(Joi.string()).single(),
            connections: Joi.boolean().default(true),
            once: Joi.boolean().valid(true)
        })
            .required()
            .unknown()
    })
        .required(),
    options: Joi.any()
})
    .without('once', 'options')
    .unknown();


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("auth0-extension-hapi-tools@1.3.1");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(2);
const Hoek = __webpack_require__(1);
const Defaults = __webpack_require__(23);
let Route = null;                           // Delayed load due to circular dependency


// Declare internals

const internals = {};


exports.route = function (options) {

    const settings = Hoek.applyToDefaults(Defaults.cors, options);
    if (!settings) {
        return false;
    }

    settings._headers = settings.headers.concat(settings.additionalHeaders);
    settings._headersString = settings._headers.join(',');
    for (let i = 0; i < settings._headers.length; ++i) {
        settings._headers[i] = settings._headers[i].toLowerCase();
    }

    if (settings._headers.indexOf('origin') === -1) {
        settings._headers.push('origin');
    }

    settings._exposedHeaders = settings.exposedHeaders.concat(settings.additionalExposedHeaders).join(',');

    if (settings.origin.indexOf('*') !== -1) {
        Hoek.assert(settings.origin.length === 1, 'Cannot specify cors.origin * together with other values');
        settings._origin = true;
    }
    else {
        settings._origin = {
            qualified: [],
            wildcards: []
        };

        for (let i = 0; i < settings.origin.length; ++i) {
            const origin = settings.origin[i];
            if (origin.indexOf('*') !== -1) {
                settings._origin.wildcards.push(new RegExp('^' + Hoek.escapeRegex(origin).replace(/\\\*/g, '.*').replace(/\\\?/g, '.') + '$'));
            }
            else {
                settings._origin.qualified.push(origin);
            }
        }
    }

    return settings;
};


exports.options = function (route, connection, server) {

    if (route.method === 'options' ||
        !route.settings.cors) {

        return;
    }

    exports.handler(connection);
};


exports.handler = function (connection) {

    Route = Route || __webpack_require__(31);

    if (connection._router.specials.options) {
        return;
    }

    const route = new Route({ method: '_special', path: '/{p*}', handler: internals.handler }, connection, connection.server, { special: true });
    connection._router.special('options', route);
};


internals.handler = function (request, reply) {

    // Validate CORS preflight request

    const origin = request.headers.origin;
    if (!origin) {
        return reply(Boom.notFound('CORS error: Missing Origin header'));
    }

    const method = request.headers['access-control-request-method'];
    if (!method) {
        return reply(Boom.notFound('CORS error: Missing Access-Control-Request-Method header'));
    }

    // Lookup route

    const route = request.connection.match(method, request.path, request.info.hostname);
    if (!route) {
        return reply(Boom.notFound());
    }

    const settings = route.settings.cors;
    if (!settings) {
        return reply({ message: 'CORS is disabled for this route' });
    }

    // Validate Origin header

    if (!exports.matchOrigin(origin, settings)) {
        return reply({ message: 'CORS error: Origin not allowed' });
    }

    // Validate allowed headers

    let headers = request.headers['access-control-request-headers'];
    if (headers) {
        headers = headers.toLowerCase().split(/\s*,\s*/);
        if (Hoek.intersect(headers, settings._headers).length !== headers.length) {
            return reply({ message: 'CORS error: Some headers are not allowed' });
        }
    }

    // Reply with the route CORS headers

    const response = reply();
    response._header('access-control-allow-origin', request.headers.origin);
    response._header('access-control-allow-methods', method);
    response._header('access-control-allow-headers', settings._headersString);
    response._header('access-control-max-age', settings.maxAge);

    if (settings.credentials) {
        response._header('access-control-allow-credentials', 'true');
    }

    if (settings._exposedHeaders) {
        response._header('access-control-expose-headers', settings._exposedHeaders);
    }
};


exports.headers = function (response) {

    const request = response.request;
    if (request._route._special) {
        return;
    }

    const settings = request.route.settings.cors;
    if (!settings) {
        return;
    }

    response.vary('origin');

    if (!request.info.cors.isOriginMatch) {
        return;
    }

    response._header('access-control-allow-origin', request.headers.origin);

    if (settings.credentials) {
        response._header('access-control-allow-credentials', 'true');
    }

    if (settings._exposedHeaders) {
        response._header('access-control-expose-headers', settings._exposedHeaders, { append: true });
    }
};


exports.matchOrigin = function (origin, settings) {

    if (!origin) {
        return false;
    }

    if (settings._origin === true) {
        return true;
    }

    if (settings._origin.qualified.indexOf(origin) !== -1) {
        return true;
    }

    for (let i = 0; i < settings._origin.wildcards.length; ++i) {
        if (origin.match(settings._origin.wildcards[i])) {
            return true;
        }
    }

    return false;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Topo = __webpack_require__(91);


// Declare internals

const internals = {};


exports = module.exports = internals.Ext = function (server) {

    this._topo = new Topo();
    this._server = server;
    this._routes = [];

    this.nodes = null;
};


internals.Ext.prototype.add = function (event) {

    const methods = [].concat(event.method);
    const options = event.options;

    for (let i = 0; i < methods.length; ++i) {
        const settings = {
            before: options.before,
            after: options.after,
            group: event.plugin.realm.plugin,
            sort: this._server._extensionsSeq++
        };

        const node = {
            func: methods[i],                 // Connection: function (request, next), Server: function (server, next)
            bind: options.bind,
            plugin: event.plugin
        };

        this._topo.add(node, settings);
    }

    this.nodes = this._topo.nodes;

    // Notify routes

    for (let i = 0; i < this._routes.length; ++i) {
        this._routes[i].rebuild(event);
    }
};


internals.Ext.prototype.merge = function (others) {

    const merge = [];
    for (let i = 0; i < others.length; ++i) {
        merge.push(others[i]._topo);
    }

    this._topo.merge(merge);
    this.nodes = (this._topo.nodes.length ? this._topo.nodes : null);
};


internals.Ext.prototype.subscribe = function (route) {

    this._routes.push(route);
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Stream = __webpack_require__(5);
const Events = __webpack_require__(13);
const Boom = __webpack_require__(2);
const Hoek = __webpack_require__(1);
const Peekaboo = __webpack_require__(33);


// Declare internals

const internals = {};


exports = module.exports = internals.Response = function (source, request, options) {

    Events.EventEmitter.call(this);

    options = options || {};

    this.request = request;
    this.statusCode = null;
    this.headers = {};                          // Incomplete as some headers are stored in flags
    this.variety = null;
    this.source = null;
    this.app = {};
    this.plugins = {};
    this.send = null;                           // Set by reply()
    this.hold = null;                           // Set by reply()

    this.settings = {
        encoding: 'utf8',
        charset: 'utf-8',                       // '-' required by IANA
        ttl: null,
        stringify: null,                        // JSON.stringify options
        passThrough: true,
        varyEtag: false
    };

    this._payload = null;                       // Readable stream
    this._takeover = false;
    this._contentEncoding = null;               // Set during transmit
    this._contentType = null;                   // Used if no explicit content-type is set and type is known
    this._error = null;                         // The boom object when created from an error

    this._processors = {
        marshal: options.marshal,
        prepare: options.prepare,
        close: options.close
    };

    this._setSource(source, options.variety);
};

Hoek.inherits(internals.Response, Events.EventEmitter);


internals.Response.wrap = function (result, request) {

    return (result instanceof Error ? Boom.wrap(result)
                                    : (result instanceof internals.Response ? result
                                                                            : new internals.Response(result, request)));
};


internals.Response.prototype._setSource = function (source, variety) {

    // Method must not set any headers or other properties as source can change later

    this.variety = variety || 'plain';

    if (source === null ||
        source === undefined ||
        source === '') {

        source = null;
    }
    else if (Buffer.isBuffer(source)) {
        this.variety = 'buffer';
        this._contentType = 'application/octet-stream';
    }
    else if (source instanceof Stream) {
        this.variety = 'stream';
    }
    else if (typeof source === 'object' &&
        typeof source.then === 'function') {                // Promise object

        this.variety = 'promise';
    }

    this.source = source;

    if (this.variety === 'plain' &&
        this.source !== null) {

        this._contentType = (typeof this.source === 'string' ? 'text/html' : 'application/json');
    }
};


internals.Response.prototype.code = function (statusCode) {

    Hoek.assert(Hoek.isInteger(statusCode), 'Status code must be an integer');

    this.statusCode = statusCode;
    return this;
};


internals.Response.prototype.header = function (key, value, options) {

    key = key.toLowerCase();
    if (key === 'vary') {
        return this.vary(value);
    }

    return this._header(key, value, options);
};


internals.Response.prototype._header = function (key, value, options) {

    options = options || {};
    const append = options.append || false;
    const separator = options.separator || ',';
    const override = options.override !== false;
    const duplicate = options.duplicate !== false;

    // Ensure key and values do not include non-ascii text

    if (value !== undefined &&
        value !== null) {

        const headerValues = [key].concat(value);
        for (let i = 0; i < headerValues.length; ++i) {
            const header = headerValues[i];
            const buffer = Buffer.isBuffer(header) ? header : new Buffer(header.toString());
            for (let j = 0; j < buffer.length; ++j) {
                Hoek.assert((buffer[j] & 0x7f) === buffer[j], 'Header value cannot contain or convert into non-ascii characters:', key);
            }
        }
    }

    if ((!append && override) ||
        !this.headers[key]) {

        this.headers[key] = value;
    }
    else if (override) {
        if (key === 'set-cookie') {
            this.headers[key] = [].concat(this.headers[key], value);
        }
        else {
            const existing = this.headers[key];
            if (!duplicate) {
                const values = existing.split(separator);
                for (let i = 0; i < values.length; ++i) {
                    if (values[i] === value) {
                        return this;
                    }
                }
            }

            this.headers[key] = existing + separator + value;
        }
    }

    return this;
};


internals.Response.prototype.vary = function (value) {

    if (value === '*') {
        this.headers.vary = '*';
    }
    else if (!this.headers.vary) {
        this.headers.vary = value;
    }
    else if (this.headers.vary !== '*') {
        this._header('vary', value, { append: true, duplicate: false });
    }

    return this;
};


internals.Response.prototype.etag = function (tag, options) {

    Hoek.assert(tag !== '*', 'ETag cannot be *');

    options = options || {};
    this._header('etag', (options.weak ? 'W/' : '') + '"' + tag + '"');
    this.settings.varyEtag = options.vary !== false && !options.weak;       // vary defaults to true
    return this;
};


internals.Response.prototype.type = function (type) {

    this._header('content-type', type);
    return this;
};


internals.Response.prototype.bytes = function (bytes) {

    this._header('content-length', bytes);
    return this;
};


internals.Response.prototype.location = function (uri) {

    this._header('location', uri);
    return this;
};


internals.Response.prototype.created = function (location) {

    Hoek.assert(this.request.method === 'post' || this.request.method === 'put', 'Cannot create resource on GET');

    this.statusCode = 201;
    this.location(location);
    return this;
};


internals.Response.prototype.replacer = function (method) {

    this.settings.stringify = this.settings.stringify || {};
    this.settings.stringify.replacer = method;
    return this;
};


internals.Response.prototype.spaces = function (count) {

    this.settings.stringify = this.settings.stringify || {};
    this.settings.stringify.space = count;
    return this;
};


internals.Response.prototype.suffix = function (suffix) {

    this.settings.stringify = this.settings.stringify || {};
    this.settings.stringify.suffix = suffix;
    return this;
};


internals.Response.prototype.passThrough = function (enabled) {

    this.settings.passThrough = (enabled !== false);    // Defaults to true
    return this;
};


internals.Response.prototype.redirect = function (location) {

    this.statusCode = 302;
    this.location(location);
    this.temporary = this._temporary;
    this.permanent = this._permanent;
    this.rewritable = this._rewritable;
    return this;
};


internals.Response.prototype._temporary = function (isTemporary) {

    this._setTemporary(isTemporary !== false);           // Defaults to true
    return this;
};


internals.Response.prototype._permanent = function (isPermanent) {

    this._setTemporary(isPermanent === false);           // Defaults to true
    return this;
};


internals.Response.prototype._rewritable = function (isRewritable) {

    this._setRewritable(isRewritable !== false);         // Defaults to true
    return this;
};


internals.Response.prototype._isTemporary = function () {

    return this.statusCode === 302 || this.statusCode === 307;
};


internals.Response.prototype._isRewritable = function () {

    return this.statusCode === 301 || this.statusCode === 302;
};


internals.Response.prototype._setTemporary = function (isTemporary) {

    if (isTemporary) {
        if (this._isRewritable()) {
            this.statusCode = 302;
        }
        else {
            this.statusCode = 307;
        }
    }
    else {
        if (this._isRewritable()) {
            this.statusCode = 301;
        }
        else {
            this.statusCode = 308;
        }
    }
};


internals.Response.prototype._setRewritable = function (isRewritable) {

    if (isRewritable) {
        if (this._isTemporary()) {
            this.statusCode = 302;
        }
        else {
            this.statusCode = 301;
        }
    }
    else {
        if (this._isTemporary()) {
            this.statusCode = 307;
        }
        else {
            this.statusCode = 308;
        }
    }
};


internals.Response.prototype.encoding = function (encoding) {

    this.settings.encoding = encoding;
    return this;
};


internals.Response.prototype.charset = function (charset) {

    this.settings.charset = charset || null;
    return this;
};


internals.Response.prototype.ttl = function (ttl) {

    this.settings.ttl = ttl;
    return this;
};


internals.Response.prototype.state = function (name, value, options) {          // options: see Defaults.state

    this.request._setState(name, value, options);
    return this;
};


internals.Response.prototype.unstate = function (name, options) {

    this.request._clearState(name, options);
    return this;
};


internals.Response.prototype.takeover = function () {

    this._takeover = true;
    return this;
};


internals.Response.prototype._prepare = function (data, next) {

    this._passThrough();

    if (this.variety !== 'promise') {
        return this._processPrepare(data, next);
    }

    const onDone = (source) => {

        if (source instanceof Error) {
            return next(Boom.wrap(source), data);
        }

        if (source instanceof internals.Response) {
            return source._processPrepare(data, next);
        }

        this._setSource(source);
        this._passThrough();
        this._processPrepare(data, next);
    };

    this.source.then(onDone, onDone);
};


internals.Response.prototype._passThrough = function () {

    if (this.variety === 'stream' &&
        this.settings.passThrough) {

        if (this.source.statusCode &&
            !this.statusCode) {

            this.statusCode = this.source.statusCode;                        // Stream is an HTTP response
        }

        if (this.source.headers) {
            let headerKeys = Object.keys(this.source.headers);

            if (headerKeys.length) {
                const localHeaders = this.headers;
                this.headers = {};

                for (let i = 0; i < headerKeys.length; ++i) {
                    const key = headerKeys[i];
                    this.header(key.toLowerCase(), Hoek.clone(this.source.headers[key]));     // Clone arrays
                }

                headerKeys = Object.keys(localHeaders);
                for (let i = 0; i < headerKeys.length; ++i) {
                    const key = headerKeys[i];
                    this.header(key, localHeaders[key], { append: key === 'set-cookie' });
                }
            }
        }
    }

    this.statusCode = this.statusCode || 200;
};


internals.Response.prototype._processPrepare = function (data, next) {

    if (!this._processors.prepare) {
        return next(this, data);
    }

    this._processors.prepare(this, (prepared) => {

        return next(prepared, data);
    });
};


internals.Response.prototype._marshal = function (next) {

    if (!this._processors.marshal) {
        return this._streamify(this.source, next);
    }

    this._processors.marshal(this, (err, source) => {

        if (err) {
            return next(err);
        }

        return this._streamify(source, next);
    });
};


internals.Response.prototype._streamify = function (source, next) {

    if (source instanceof Stream) {
        if (typeof source._read !== 'function' || typeof source._readableState !== 'object') {
            return next(Boom.badImplementation('Stream must have a streams2 readable interface'));
        }

        if (source._readableState.objectMode) {
            return next(Boom.badImplementation('Cannot reply with stream in object mode'));
        }

        this._payload = source;
        return next();
    }

    let payload = source;
    if (this.variety === 'plain' &&
        source !== null &&
        typeof source !== 'string') {

        const options = this.settings.stringify || {};
        const space = options.space || this.request.route.settings.json.space;
        const replacer = options.replacer || this.request.route.settings.json.replacer;
        const suffix = options.suffix || this.request.route.settings.json.suffix || '';
        try {
            if (replacer || space) {
                payload = JSON.stringify(payload, replacer, space);
            }
            else {
                payload = JSON.stringify(payload);
            }
        }
        catch (err) {
            return next(err);
        }

        if (suffix) {
            payload = payload + suffix;
        }
    }
    else if (this.settings.stringify) {
        return next(Boom.badImplementation('Cannot set formatting options on non object response'));
    }

    this._payload = new internals.Payload(payload, this.settings);
    return next();
};


internals.Response.prototype._tap = function () {

    return (this.listeners('finish').length || this.listeners('peek').length ? new Peekaboo(this) : null);
};


internals.Response.prototype._close = function () {

    if (this._processors.close) {
        this._processors.close(this);
    }

    const stream = this._payload || this.source;
    if (stream instanceof Stream) {
        if (stream.close) {
            stream.close();
        }
        else if (stream.destroy) {
            stream.destroy();
        }
        else {
            const read = () => {

                stream.read();
            };

            const end = () => {

                stream.removeListener('readable', read);
                stream.removeListener('error', end);
                stream.removeListener('end', end);
            };

            stream.on('readable', read);
            stream.once('error', end);
            stream.once('end', end);
        }
    }
};


internals.Response.prototype._isPayloadSupported = function () {

    return (this.request.method !== 'head' && this.statusCode !== 304 && this.statusCode !== 204);
};


internals.Response.Payload = internals.Payload = function (payload, options) {

    Stream.Readable.call(this);
    this._data = payload;
    this._prefix = null;
    this._suffix = null;
    this._sizeOffset = 0;
    this._encoding = options.encoding;
};

Hoek.inherits(internals.Payload, Stream.Readable);


internals.Payload.prototype._read = function (/* size */) {

    if (this._prefix) {
        this.push(this._prefix, this._encoding);
    }

    if (this._data) {
        this.push(this._data, this._encoding);
    }

    if (this._suffix) {
        this.push(this._suffix, this._encoding);
    }

    this.push(null);
};


internals.Payload.prototype.size = function () {

    if (!this._data) {
        return this._sizeOffset;
    }

    return (Buffer.isBuffer(this._data) ? this._data.length : Buffer.byteLength(this._data, this._encoding)) + this._sizeOffset;
};


internals.Payload.prototype.jsonp = function (variable) {

    this._sizeOffset = this._sizeOffset + variable.length + 7;
    this._prefix = '/**/' + variable + '(';                 // '/**/' prefix prevents CVE-2014-4671 security exploit
    this._data = (this._data === null || Buffer.isBuffer(this._data)) ? this._data : this._data.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    this._suffix = ');';
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(2);
const Hoek = __webpack_require__(1);
const Schema = __webpack_require__(15);


// Declare internals

const internals = {};


exports = module.exports = internals.Auth = function (connection) {

    this.connection = connection;
    this._schemes = {};
    this._strategies = {};
    this.settings = {
        default: null           // Strategy used as default if route has no auth settings
    };

    this.api = {};
};


internals.Auth.prototype.scheme = function (name, scheme) {

    Hoek.assert(name, 'Authentication scheme must have a name');
    Hoek.assert(!this._schemes[name], 'Authentication scheme name already exists:', name);
    Hoek.assert(typeof scheme === 'function', 'scheme must be a function:', name);

    this._schemes[name] = scheme;
};


internals.Auth.prototype.strategy = function (name, scheme /*, mode, options */) {

    const hasMode = (typeof arguments[2] === 'string' || typeof arguments[2] === 'boolean');
    const mode = (hasMode ? arguments[2] : false);
    const options = (hasMode ? arguments[3] : arguments[2]) || null;

    Hoek.assert(name, 'Authentication strategy must have a name');
    Hoek.assert(name !== 'bypass', 'Cannot use reserved strategy name: bypass');
    Hoek.assert(!this._strategies[name], 'Authentication strategy name already exists');
    Hoek.assert(scheme, 'Authentication strategy', name, 'missing scheme');
    Hoek.assert(this._schemes[scheme], 'Authentication strategy', name, 'uses unknown scheme:', scheme);

    const server = this.connection.server._clone([this.connection], '');
    const strategy = this._schemes[scheme](server, options);

    Hoek.assert(strategy.authenticate, 'Invalid scheme:', name, 'missing authenticate() method');
    Hoek.assert(typeof strategy.authenticate === 'function', 'Invalid scheme:', name, 'invalid authenticate() method');
    Hoek.assert(!strategy.payload || typeof strategy.payload === 'function', 'Invalid scheme:', name, 'invalid payload() method');
    Hoek.assert(!strategy.response || typeof strategy.response === 'function', 'Invalid scheme:', name, 'invalid response() method');
    strategy.options = strategy.options || {};
    Hoek.assert(strategy.payload || !strategy.options.payload, 'Cannot require payload validation without a payload method');

    this._strategies[name] = {
        methods: strategy,
        realm: server.realm
    };

    if (strategy.api) {
        this.api[name] = strategy.api;
    }

    if (mode) {
        this.default({ strategies: [name], mode: mode === true ? 'required' : mode });
    }
};


internals.Auth.prototype.default = function (options) {

    Hoek.assert(!this.settings.default, 'Cannot set default strategy more than once');
    options = Schema.apply('auth', options, 'default strategy');

    this.settings.default = this._setupRoute(Hoek.clone(options));      // Can change options
};


internals.Auth.prototype.test = function (name, request, next) {

    Hoek.assert(name, 'Missing authentication strategy name');
    const strategy = this._strategies[name];
    Hoek.assert(strategy, 'Unknown authentication strategy:', name);

    const transfer = (response, data) => {

        return next(response, data && data.credentials);
    };

    const reply = request.server._replier.interface(request, strategy.realm, transfer);
    strategy.methods.authenticate(request, reply);
};


internals.Auth.prototype._setupRoute = function (options, path) {

    if (!options) {
        return options;         // Preserve the difference between undefined and false
    }

    if (typeof options === 'string') {
        options = { strategies: [options] };
    }
    else if (options.strategy) {
        options.strategies = [options.strategy];
        delete options.strategy;
    }

    if (path &&
        !options.strategies) {

        Hoek.assert(this.settings.default, 'Route missing authentication strategy and no default defined:', path);
        options = Hoek.applyToDefaults(this.settings.default, options);
    }

    path = path || 'default strategy';
    Hoek.assert(options.strategies && options.strategies.length, 'Missing authentication strategy:', path);

    options.mode = options.mode || 'required';

    if (options.entity !== undefined ||                                             // Backwards compatibility with <= 11.x.x
        options.scope !== undefined) {

        options.access = [{ entity: options.entity, scope: options.scope }];
        delete options.entity;
        delete options.scope;
    }

    if (options.access) {
        for (let i = 0; i < options.access.length; ++i) {
            const access = options.access[i];
            access.scope = internals.scope(access);
        }
    }

    if (options.payload === true) {
        options.payload = 'required';
    }

    let hasAuthenticatePayload = false;
    for (let i = 0; i < options.strategies.length; ++i) {
        const name = options.strategies[i];
        const strategy = this._strategies[name];
        Hoek.assert(strategy, 'Unknown authentication strategy', name, 'in', path);

        Hoek.assert(strategy.methods.payload || options.payload !== 'required', 'Payload validation can only be required when all strategies support it in', path);
        hasAuthenticatePayload = hasAuthenticatePayload || strategy.methods.payload;
        Hoek.assert(!strategy.methods.options.payload || options.payload === undefined || options.payload === 'required', 'Cannot set authentication payload to', options.payload, 'when a strategy requires payload validation in', path);
    }

    Hoek.assert(!options.payload || hasAuthenticatePayload, 'Payload authentication requires at least one strategy with payload support in', path);

    return options;
};


internals.scope = function (access) {

    if (!access.scope) {
        return false;
    }

    const scope = {};
    for (let i = 0; i < access.scope.length; ++i) {
        const value = access.scope[i];
        const prefix = value[0];
        const type = (prefix === '+' ? 'required' : (prefix === '!' ? 'forbidden' : 'selection'));
        const clean = (type === 'selection' ? value : value.slice(1));
        scope[type] = scope[type] || [];
        scope[type].push(clean);

        if ((!scope._parameters || !scope._parameters[type]) &&
            /{([^}]+)}/.test(clean)) {

            scope._parameters = scope._parameters || {};
            scope._parameters[type] = true;
        }
    }

    return scope;
};


internals.Auth.prototype.lookup = function (route) {

    if (route.settings.auth === false) {
        return false;
    }

    return route.settings.auth || this.settings.default;
};


internals.Auth.authenticate = function (request, next) {

    const auth = request.connection.auth;
    return auth._authenticate(request, next);
};


internals.Auth.prototype._authenticate = function (request, next) {

    const config = this.lookup(request.route);
    if (!config) {
        return next();
    }

    const authenticator = new internals.Authenticator(config, request, this);
    authenticator.authenticate(next);
};


internals.Auth.payload = function (request, next) {

    if (!request.auth.isAuthenticated ||
        request.auth.strategy === 'bypass') {

        return next();
    }

    const auth = request.connection.auth;
    const strategy = auth._strategies[request.auth.strategy];

    if (!strategy.methods.payload) {
        return next();
    }

    const config = auth.lookup(request.route);
    const setting = config.payload || (strategy.methods.options.payload ? 'required' : false);
    if (!setting) {
        return next();
    }

    const finalize = (response) => {

        if (response &&
            response.isBoom &&
            response.isMissing) {

            return next(setting === 'optional' ? null : Boom.unauthorized('Missing payload authentication'));
        }

        return next(response);
    };

    request._protect.run(finalize, (exit) => {

        const reply = request.server._replier.interface(request, strategy.realm, exit);
        strategy.methods.payload(request, reply);
    });
};


internals.Auth.response = function (request, next) {

    const auth = request.connection.auth;
    const config = auth.lookup(request.route);
    if (!config ||
        !request.auth.isAuthenticated ||
        request.auth.strategy === 'bypass') {

        return next();
    }

    const strategy = auth._strategies[request.auth.strategy];
    if (!strategy.methods.response) {
        return next();
    }

    request._protect.run(next, (exit) => {

        const reply = request.server._replier.interface(request, strategy.realm, exit);
        strategy.methods.response(request, reply);
    });
};


internals.Authenticator = class {
    constructor(config, request, manager) {

        this.config = config;
        this.request = request;
        this.manager = manager;

        this.errors = [];
        this.current = -1;
    }

    authenticate(next) {

        this.request.auth.mode = this.config.mode;

        // Injection bypass

        if (this.request.auth.credentials) {
            return this.validate(null, { credentials: this.request.auth.credentials, artifacts: this.request.auth.artifacts }, next);
        }

        // Authenticate

        return this.execute(next);
    }

    execute(next) {

        const config = this.config;
        const request = this.request;

        // Find next strategy

        ++this.current;
        if (this.current < config.strategies.length) {
            const name = config.strategies[this.current];
            const after = (err, result) => this.validate(err, result, next);
            request._protect.run(after, (exit) => {

                const strategy = this.manager._strategies[name];
                const reply = request.server._replier.interface(request, strategy.realm, exit);
                strategy.methods.authenticate(request, reply);
            });

            return;
        }

        // No more strategies

        const err = Boom.unauthorized('Missing authentication', this.errors);

        if (config.mode === 'optional' ||
            config.mode === 'try') {

            request.auth.isAuthenticated = false;
            request.auth.credentials = null;
            request.auth.error = err;
            request._log(['auth', 'unauthenticated']);
            return next();
        }

        return next(err);
    }

    validate(err, result, next) {                 // err can be Boom, Error, or a valid response object

        const config = this.config;
        const request = this.request;
        const name = config.strategies[this.current] || 'bypass';

        result = result || {};

        // Invalid

        if (!err &&
            !result.credentials) {

            return next(Boom.badImplementation('Authentication response missing both error and credentials'));
        }

        // Unauthenticated

        if (err) {
            if (err instanceof Error === false) {
                request._log(['auth', 'unauthenticated', 'response', name], err.statusCode);
                return next(err);
            }

            if (err.isMissing) {

                // Try next name

                request._log(['auth', 'unauthenticated', 'missing', name], err);
                this.errors.push(err.output.headers['WWW-Authenticate']);
                return this.execute(next);
            }

            if (config.mode === 'try') {
                request.auth.isAuthenticated = false;
                request.auth.strategy = name;
                request.auth.credentials = result.credentials;
                request.auth.artifacts = result.artifacts;
                request.auth.error = err;
                request._log(['auth', 'unauthenticated', 'try', name], err);
                return next();
            }

            request._log(['auth', 'unauthenticated', 'error', name], err);
            return next(err);
        }

        // Authenticated

        const credentials = result.credentials;
        request.auth.strategy = name;
        request.auth.credentials = credentials;
        request.auth.artifacts = result.artifacts;

        const authenticated = () => {

            request._log(['auth', name]);
            request.auth.isAuthenticated = true;
            return next();
        };

        // Check access rules

        if (!config.access) {
            return authenticated();
        }

        const requestEntity = (credentials.user ? 'user' : 'app');

        const scopeErrors = [];
        for (let i = 0; i < config.access.length; ++i) {
            const access = config.access[i];

            // Check entity

            const entity = access.entity;
            if (entity &&
                entity !== 'any' &&
                entity !== requestEntity) {

                continue;
            }

            // Check scope

            let scope = access.scope;
            if (scope) {
                if (!credentials.scope) {
                    scopeErrors.push(scope);
                    continue;
                }

                scope = internals.expandScope(request, scope);
                if (!internals.validateScope(credentials, scope, 'required') ||
                    !internals.validateScope(credentials, scope, 'selection') ||
                    !internals.validateScope(credentials, scope, 'forbidden')) {

                    scopeErrors.push(scope);
                    continue;
                }
            }

            return authenticated();
        }

        // Scope error

        if (scopeErrors.length) {
            request._log(['auth', 'scope', 'error', name], { got: credentials.scope, need: scopeErrors });
            return next(Boom.forbidden('Insufficient scope'));
        }

        // Entity error

        if (requestEntity === 'app') {
            request._log(['auth', 'entity', 'user', 'error', name]);
            return next(Boom.forbidden('Application credentials cannot be used on a user endpoint'));
        }

        request._log(['auth', 'entity', 'app', 'error', name]);
        return next(Boom.forbidden('User credentials cannot be used on an application endpoint'));
    }
};


internals.expandScope = function (request, scope) {

    if (!scope._parameters) {
        return scope;
    }

    const expanded = {
        required: internals.expandScopeType(request, scope, 'required'),
        selection: internals.expandScopeType(request, scope, 'selection'),
        forbidden: internals.expandScopeType(request, scope, 'forbidden')
    };

    return expanded;
};


internals.expandScopeType = function (request, scope, type) {

    if (!scope[type] ||
        !scope._parameters[type]) {

        return scope[type];
    }

    const expanded = [];
    const context = {
        params: request.params,
        query: request.query
    };

    for (let i = 0; i < scope[type].length; ++i) {
        expanded.push(Hoek.reachTemplate(context, scope[type][i]));
    }

    return expanded;
};


internals.validateScope = function (credentials, scope, type) {

    if (!scope[type]) {
        return true;
    }

    const count = (typeof credentials.scope === 'string' ? (scope[type].indexOf(credentials.scope) !== -1 ? 1 : 0)
                                                         : Hoek.intersect(scope[type], credentials.scope).length);

    if (type === 'forbidden') {
        return count === 0;
    }

    if (type === 'required') {
        return count === scope.required.length;
    }

    return !!count;
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Os = __webpack_require__(26);


// Declare internals

const internals = {};


exports.server = {
    debug: {
        request: ['implementation'],
        log: ['implementation']
    },
    load: {
        sampleInterval: 0
    },
    mime: null,                                     // Mimos options
    useDomains: true
};


exports.connection = {
    compression: true,                              // Enable response compression
    router: {
        isCaseSensitive: true,                      // Case-sensitive paths
        stripTrailingSlash: false                   // Remove trailing slash from incoming paths
    },
    routes: {
        cache: {
            statuses: [200, 204],                   // Array of HTTP status codes for which cache-control header is set
            otherwise: 'no-cache'
        },
        cors: false,                                // CORS headers
        files: {
            relativeTo: '.'                         // Determines what file and directory handlers use to base relative paths off
        },
        json: {
            replacer: null,
            space: null,
            suffix: null
        },
        payload: {
            failAction: 'error',
            maxBytes: 1024 * 1024,
            output: 'data',
            parse: true,
            timeout: 10 * 1000,                     // Determines how long to wait for receiving client payload. Defaults to 10 seconds
            uploads: Os.tmpDir(),
            defaultContentType: 'application/json'
        },
        response: {
            ranges: true,
            emptyStatusCode: 200,                   // HTTP status code when payload is empty (200, 204)
            options: {}                             // Joi validation options
        },
        security: false,                            // Security headers on responses: false -> null, true -> defaults, {} -> override defaults
        state: {
            parse: true,                            // Parse content of req.headers.cookie
            failAction: 'error'                     // Action on bad cookie - 'error': return 400, 'log': log and continue, 'ignore': continue
        },
        timeout: {
            socket: undefined,                      // Determines how long before closing request socket. Defaults to node (2 minutes)
            server: false                           // Determines how long to wait for server request processing. Disabled by default
        },
        validate: {
            options: {}                             // Joi validation options
        }
    }
};


exports.security = {
    hsts: 15768000,
    xframe: 'deny',
    xss: true,
    noOpen: true,
    noSniff: true
};


exports.cors = {
    origin: ['*'],
    maxAge: 86400,                                  // One day
    headers: [
        'Accept',
        'Authorization',
        'Content-Type',
        'If-None-Match'
    ],
    additionalHeaders: [],
    exposedHeaders: [
        'WWW-Authenticate',
        'Server-Authorization'
    ],
    additionalExposedHeaders: [],
    credentials: false
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules


// Declare internals

const internals = {};


exports.wrap = function (bind, method, args) {

    return new Promise((resolve, reject) => {

        const callback = (result) => {

            if (result instanceof Error) {
                return reject(result);
            }

            return resolve(result);
        };

        method.apply(bind, args ? args.concat(callback) : [callback]);
    });
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Client = __webpack_require__(73);
const Policy = __webpack_require__(74);


// Declare internals

const internals = {};


exports.Client = Client;
exports.Policy = exports.policy = Policy;


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Events = __webpack_require__(13);
const Http = __webpack_require__(21);
const Https = __webpack_require__(49);
const Os = __webpack_require__(26);
const Path = __webpack_require__(14);
const Boom = __webpack_require__(2);
const Call = __webpack_require__(69);
const Hoek = __webpack_require__(1);
const Shot = __webpack_require__(34);
const Statehood = __webpack_require__(62);
const Auth = __webpack_require__(22);
const Cors = __webpack_require__(18);
const Ext = __webpack_require__(19);
const Promises = __webpack_require__(24);
const Route = __webpack_require__(31);


// Declare internals

const internals = {
    counter: {
        min: 10000,
        max: 99999
    }
};


exports = module.exports = internals.Connection = function (server, options) {

    const now = Date.now();

    Events.EventEmitter.call(this);

    this.settings = options;                                                        // options cloned in server.connection()
    this.server = server;

    // Normalize settings

    this.settings.labels = Hoek.unique(this.settings.labels || []);                 // Remove duplicates
    if (this.settings.port === undefined) {
        this.settings.port = 0;
    }

    this.type = (typeof this.settings.port === 'string' ? 'socket' : 'tcp');
    if (this.type === 'socket') {
        this.settings.port = (this.settings.port.indexOf('/') !== -1 ? Path.resolve(this.settings.port) : this.settings.port.toLowerCase());
    }

    if (this.settings.autoListen === undefined) {
        this.settings.autoListen = true;
    }

    Hoek.assert(this.settings.autoListen || !this.settings.port, 'Cannot specify port when autoListen is false');
    Hoek.assert(this.settings.autoListen || !this.settings.address, 'Cannot specify address when autoListen is false');

    // Connection facilities

    this._started = false;
    this._connections = {};
    this._onConnection = null;          // Used to remove event listener on stop
    this.registrations = {};            // Tracks plugin for dependency validation { name -> { version } }

    this._extensions = {
        onRequest: new Ext(this.server),
        onPreAuth: new Ext(this.server),
        onPostAuth: new Ext(this.server),
        onPreHandler: new Ext(this.server),
        onPostHandler: new Ext(this.server),
        onPreResponse: new Ext(this.server)
    };

    this._requestCounter = { value: internals.counter.min, min: internals.counter.min, max: internals.counter.max };
    this._load = server._heavy.policy(this.settings.load);
    this.states = new Statehood.Definitions(this.settings.state);
    this.auth = new Auth(this);
    this._router = new Call.Router(this.settings.router);
    this._defaultRoutes();

    this.plugins = {};                  // Registered plugin APIs by plugin name
    this.app = {};                      // Place for application-specific state without conflicts with hapi, should not be used by plugins

    // Create listener

    this.listener = this.settings.listener || (this.settings.tls ? Https.createServer(this.settings.tls) : Http.createServer());
    this.listener.on('request', this._dispatch());
    this._init();

    this.listener.on('clientError', (err, socket) => {

        this.server._log(['connection', 'client', 'error'], err);
    });

    // Connection information

    this.info = {
        created: now,
        started: 0,
        host: this.settings.host || Os.hostname() || 'localhost',
        port: this.settings.port,
        protocol: this.type === 'tcp' ? (this.settings.tls ? 'https' : 'http') : this.type,
        id: Os.hostname() + ':' + process.pid + ':' + now.toString(36)
    };

    this.info.uri = (this.settings.uri || (this.info.protocol + ':' + (this.type === 'tcp' ? '//' + this.info.host + (this.info.port ? ':' + this.info.port : '') : this.info.port)));

    this.on('route', Cors.options);
};

Hoek.inherits(internals.Connection, Events.EventEmitter);


internals.Connection.prototype._init = function () {

    // Setup listener

    this.listener.once('listening', () => {

        // Update the address, port, and uri with active values

        if (this.type === 'tcp') {
            const address = this.listener.address();
            this.info.address = address.address;
            this.info.port = address.port;
            this.info.uri = (this.settings.uri || (this.info.protocol + '://' + this.info.host + ':' + this.info.port));
        }

        this._onConnection = (connection) => {

            const key = connection.remoteAddress + ':' + connection.remotePort;
            this._connections[key] = connection;

            connection.once('close', () => {

                delete this._connections[key];
            });
        };

        this.listener.on('connection', this._onConnection);
    });
};


internals.Connection.prototype._start = function (callback) {

    if (this._started) {
        return process.nextTick(callback);
    }

    this._started = true;
    this.info.started = Date.now();

    if (!this.settings.autoListen) {
        return process.nextTick(callback);
    }

    const onError = (err) => {

        this._started = false;
        return callback(err);
    };

    this.listener.once('error', onError);

    const finalize = () => {

        this.listener.removeListener('error', onError);
        callback();
    };

    if (this.type !== 'tcp') {
        this.listener.listen(this.settings.port, finalize);
    }
    else {
        const address = this.settings.address || this.settings.host || '0.0.0.0';
        this.listener.listen(this.settings.port, address, finalize);
    }
};


internals.Connection.prototype._stop = function (options, callback) {

    if (!this._started) {
        return process.nextTick(callback);
    }

    this._started = false;
    this.info.started = 0;

    const timeoutId = setTimeout(() => {

        Object.keys(this._connections).forEach((key) => {

            this._connections[key].destroy();
        });


        this._connections = {};
    }, options.timeout);

    this.listener.close(() => {

        this.listener.removeListener('connection', this._onConnection);
        clearTimeout(timeoutId);

        this._init();
        return callback();
    });

    // Tell idle keep-alive connections to close

    Object.keys(this._connections).forEach((key) => {

        const connection = this._connections[key];
        if (!connection._isHapiProcessing) {
            connection.end();
        }
    });
};


internals.Connection.prototype._dispatch = function (options) {

    options = options || {};

    return (req, res) => {

        // Track socket request processing state

        if (req.socket) {
            req.socket._isHapiProcessing = true;
            res.on('finish', () => {

                req.socket._isHapiProcessing = false;
                if (!this._started) {
                    req.socket.end();
                }
            });
        }

        // Create request

        const request = this.server._requestor.request(this, req, res, options);

        // Check load

        const overload = this._load.check();
        if (overload) {
            this.server._log(['load'], this.server.load);
            request._reply(overload);
        }
        else {

            // Execute request lifecycle

            request._protect.enter(() => {

                request._execute();
            });
        }
    };
};


internals.Connection.prototype.inject = function (options, callback) {

    if (!callback) {
        return Promises.wrap(this, this.inject, [options]);
    }

    let settings = options;
    if (typeof settings === 'string') {
        settings = { url: settings };
    }

    if (!settings.authority ||
        settings.credentials ||
        settings.app ||
        settings.plugins ||
        settings.allowInternals !== undefined) {        // Can be false

        settings = Hoek.shallow(settings);              // options can be reused
        delete settings.credentials;
        delete settings.artifacts;                      // Cannot appear without credentials
        delete settings.app;
        delete settings.plugins;
        delete settings.allowInternals;

        settings.authority = settings.authority || (this.info.host + ':' + this.info.port);
    }

    const needle = this._dispatch({
        credentials: options.credentials,
        artifacts: options.artifacts,
        allowInternals: options.allowInternals,
        app: options.app,
        plugins: options.plugins
    });

    Shot.inject(needle, settings, (res) => {

        if (res.raw.res._hapi) {
            res.result = res.raw.res._hapi.result;
            res.request = res.raw.res._hapi.request;
            delete res.raw.res._hapi;
        }

        if (res.result === undefined) {
            res.result = res.payload;
        }

        return callback(res);
    });
};


internals.Connection.prototype.table = function (host) {

    return this._router.table(host);
};


internals.Connection.prototype.lookup = function (id) {

    Hoek.assert(id && typeof id === 'string', 'Invalid route id:', id);

    const record = this._router.ids[id];
    if (!record) {
        return null;
    }

    return record.route.public;
};


internals.Connection.prototype.match = function (method, path, host) {

    Hoek.assert(method && typeof method === 'string', 'Invalid method:', method);
    Hoek.assert(path && typeof path === 'string' && path[0] === '/', 'Invalid path:', path);
    Hoek.assert(!host || typeof host === 'string', 'Invalid host:', host);

    const match = this._router.route(method.toLowerCase(), path, host);
    Hoek.assert(match !== this._router.specials.badRequest, 'Invalid path:', path);
    if (match === this._router.specials.notFound) {
        return null;
    }

    return match.route.public;
};


internals.Connection.prototype._ext = function (event) {

    const type = event.type;
    Hoek.assert(this._extensions[type], 'Unknown event type', type);
    this._extensions[type].add(event);
};


internals.Connection.prototype._route = function (configs, plugin) {

    configs = [].concat(configs);
    for (let i = 0; i < configs.length; ++i) {
        const config = configs[i];

        if (Array.isArray(config.method)) {
            for (let j = 0; j < config.method.length; ++j) {
                const method = config.method[j];

                const settings = Hoek.shallow(config);
                settings.method = method;
                this._addRoute(settings, plugin);
            }
        }
        else {
            this._addRoute(config, plugin);
        }
    }
};


internals.Connection.prototype._addRoute = function (config, plugin) {

    const route = new Route(config, this, plugin);                // Do no use config beyond this point, use route members
    const vhosts = [].concat(route.settings.vhost || '*');

    for (let i = 0; i < vhosts.length; ++i) {
        const vhost = vhosts[i];
        const record = this._router.add({ method: route.method, path: route.path, vhost: vhost, analysis: route._analysis, id: route.settings.id }, route);
        route.fingerprint = record.fingerprint;
        route.params = record.params;
    }

    this.emit('route', route.public, this, plugin);
};


internals.Connection.prototype._defaultRoutes = function () {

    this._router.special('notFound', new Route({ method: '_special', path: '/{p*}', handler: internals.notFound }, this, this.server, { special: true }));
    this._router.special('badRequest', new Route({ method: '_special', path: '/{p*}', handler: internals.badRequest }, this, this.server, { special: true }));

    if (this.settings.routes.cors) {
        Cors.handler(this);
    }
};


internals.notFound = function (request, reply) {

    return reply(Boom.notFound());
};


internals.badRequest = function (request, reply) {

    return reply(Boom.badRequest());
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(2);
const Hoek = __webpack_require__(1);
const Schema = __webpack_require__(15);


// Declare internals

const internals = {};


exports = module.exports = internals.Methods = function (server) {

    this.server = server;
    this.methods = {};
    this._normalized = {};
};


internals.Methods.prototype.add = function (name, method, options, realm) {

    if (typeof name !== 'object') {
        return this._add(name, method, options, realm);
    }

    // {} or [{}, {}]

    const items = [].concat(name);
    for (let i = 0; i < items.length; ++i) {
        const item = Schema.apply('methodObject', items[i]);
        this._add(item.name, item.method, item.options, realm);
    }
};


exports.methodNameRx = /^[_$a-zA-Z][$\w]*(?:\.[_$a-zA-Z][$\w]*)*$/;


internals.Methods.prototype._add = function (name, method, options, realm) {

    Hoek.assert(typeof method === 'function', 'method must be a function');
    Hoek.assert(typeof name === 'string', 'name must be a string');
    Hoek.assert(name.match(exports.methodNameRx), 'Invalid name:', name);
    Hoek.assert(!Hoek.reach(this.methods, name, { functions: false }), 'Server method function name already exists:', name);

    options = Schema.apply('method', options || {}, name);

    const settings = Hoek.cloneWithShallow(options, ['bind']);
    settings.generateKey = settings.generateKey || internals.generateKey;
    const bind = settings.bind || realm.settings.bind || null;

    const apply = function () {

        return method.apply(bind, arguments);
    };

    const bound = bind ? apply : method;

    // Normalize methods

    let normalized = bound;
    if (settings.callback === false) {                                          // Defaults to true
        normalized = function (/* arg1, arg2, ..., argn, methodNext */) {

            const args = [];
            for (let i = 0; i < arguments.length - 1; ++i) {
                args.push(arguments[i]);
            }

            const methodNext = arguments[arguments.length - 1];

            let result = null;
            let error = null;

            try {
                result = method.apply(bind, args);
            }
            catch (err) {
                error = err;
            }

            if (result instanceof Error) {
                error = result;
                result = null;
            }

            if (error ||
                typeof result !== 'object' ||
                typeof result.then !== 'function') {

                return methodNext(error, result);
            }

            // Promise object

            const onFulfilled = (outcome) => {

                return methodNext(null, outcome);
            };

            const onRejected = (err) => {

                return methodNext(err);
            };

            result.then(onFulfilled, onRejected);
        };
    }

    // Not cached

    if (!settings.cache) {
        return this._assign(name, bound, normalized);
    }

    // Cached

    Hoek.assert(!settings.cache.generateFunc, 'Cannot set generateFunc with method caching:', name);
    Hoek.assert(settings.cache.generateTimeout !== undefined, 'Method caching requires a timeout value in generateTimeout:', name);

    settings.cache.generateFunc = (id, next) => {

        id.args.push(next);                     // function (err, result, ttl)
        normalized.apply(bind, id.args);
    };

    const cache = this.server.cache(settings.cache, '#' + name);

    const func = function (/* arguments, methodNext */) {

        const args = [];
        for (let i = 0; i < arguments.length - 1; ++i) {
            args.push(arguments[i]);
        }

        const methodNext = arguments[arguments.length - 1];

        const key = settings.generateKey.apply(bind, args);
        if (key === null ||                                 // Value can be ''
            typeof key !== 'string') {                      // When using custom generateKey

            return Hoek.nextTick(methodNext)(Boom.badImplementation('Invalid method key when invoking: ' + name, { name: name, args: args }));
        }

        cache.get({ id: key, args: args }, methodNext);
    };

    func.cache = {
        drop: function (/* arguments, callback */) {

            const args = [];
            for (let i = 0; i < arguments.length - 1; ++i) {
                args.push(arguments[i]);
            }

            const methodNext = arguments[arguments.length - 1];

            const key = settings.generateKey.apply(null, args);
            if (key === null) {                             // Value can be ''
                return Hoek.nextTick(methodNext)(Boom.badImplementation('Invalid method key'));
            }

            return cache.drop(key, methodNext);
        },
        stats: cache.stats
    };

    this._assign(name, func, func);
};


internals.Methods.prototype._assign = function (name, method, normalized) {

    const path = name.split('.');
    let ref = this.methods;
    for (let i = 0; i < path.length; ++i) {
        if (!ref[path[i]]) {
            ref[path[i]] = (i + 1 === path.length ? method : {});
        }

        ref = ref[path[i]];
    }

    this._normalized[name] = normalized;
};


internals.generateKey = function () {

    let key = '';
    for (let i = 0; i < arguments.length; ++i) {
        const arg = arguments[i];
        if (typeof arg !== 'string' &&
            typeof arg !== 'number' &&
            typeof arg !== 'boolean') {

            return null;
        }

        key = key + (i ? ':' : '') + encodeURIComponent(arg.toString());
    }

    return key;
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(2);
const Catbox = __webpack_require__(25);
const Hoek = __webpack_require__(1);
const Subtext = __webpack_require__(83);
const Auth = __webpack_require__(22);
const Cors = __webpack_require__(18);
const Defaults = __webpack_require__(23);
const Ext = __webpack_require__(19);
const Handler = __webpack_require__(53);
const Validation = __webpack_require__(61);
const Schema = __webpack_require__(15);


// Declare internals

const internals = {};


exports = module.exports = internals.Route = function (route, connection, plugin, options) {

    options = options || {};

    // Apply plugin environment (before schema validation)

    const realm = plugin.realm;
    if (realm.modifiers.route.vhost ||
        realm.modifiers.route.prefix) {

        route = Hoek.cloneWithShallow(route, ['config']);       // config is left unchanged
        route.path = (realm.modifiers.route.prefix ? realm.modifiers.route.prefix + (route.path !== '/' ? route.path : '') : route.path);
        route.vhost = realm.modifiers.route.vhost || route.vhost;
    }

    // Setup and validate route configuration

    Hoek.assert(route.path, 'Route missing path');
    const routeDisplay = route.method + ' ' + route.path;
    Hoek.assert(route.handler || (route.config && route.config.handler), 'Missing or undefined handler:', routeDisplay);
    Hoek.assert(!!route.handler ^ !!(route.config && route.config.handler), 'Handler must only appear once:', routeDisplay);            // XOR
    Hoek.assert(route.path === '/' || route.path[route.path.length - 1] !== '/' || !connection.settings.router.stripTrailingSlash, 'Path cannot end with a trailing slash when connection configured to strip:', routeDisplay);

    route = Schema.apply('route', route, routeDisplay);

    const handler = route.handler || route.config.handler;
    const method = route.method.toLowerCase();
    Hoek.assert(method !== 'head', 'Method name not allowed:', routeDisplay);

    // Apply settings in order: {connection} <- {handler} <- {realm} <- {route}

    const handlerDefaults = Handler.defaults(method, handler, connection.server);
    let base = Hoek.applyToDefaultsWithShallow(connection.settings.routes, handlerDefaults, ['bind']);
    base = Hoek.applyToDefaultsWithShallow(base, realm.settings, ['bind']);
    this.settings = Hoek.applyToDefaultsWithShallow(base, route.config || {}, ['bind']);
    this.settings.handler = handler;
    this.settings = Schema.apply('routeConfig', this.settings, routeDisplay);

    const socketTimeout = (this.settings.timeout.socket === undefined ? 2 * 60 * 1000 : this.settings.timeout.socket);
    Hoek.assert(!this.settings.timeout.server || !socketTimeout || this.settings.timeout.server < socketTimeout, 'Server timeout must be shorter than socket timeout:', routeDisplay);
    Hoek.assert(!this.settings.payload.timeout || !socketTimeout || this.settings.payload.timeout < socketTimeout, 'Payload timeout must be shorter than socket timeout:', routeDisplay);

    this.connection = connection;
    this.server = connection.server;
    this.path = route.path;
    this.method = method;
    this.plugin = plugin;

    this.settings.vhost = route.vhost;
    this.settings.plugins = this.settings.plugins || {};            // Route-specific plugins settings, namespaced using plugin name
    this.settings.app = this.settings.app || {};                    // Route-specific application settings

    // Path parsing

    this._special = !!options.special;
    this._analysis = this.connection._router.analyze(this.path);
    this.params = this._analysis.params;
    this.fingerprint = this._analysis.fingerprint;

    this.public = {
        method: this.method,
        path: this.path,
        vhost: this.vhost,
        realm: this.plugin.realm,
        settings: this.settings,
        fingerprint: this.fingerprint
    };

    // Validation

    const validation = this.settings.validate;
    if (this.method === 'get') {

        // Assert on config, not on merged settings

        Hoek.assert(!route.config || !route.config.payload, 'Cannot set payload settings on HEAD or GET request:', routeDisplay);
        Hoek.assert(!route.config || !route.config.validate || !route.config.validate.payload, 'Cannot validate HEAD or GET requests:', routeDisplay);

        validation.payload = null;
    }

    ['headers', 'params', 'query', 'payload'].forEach((type) => {

        validation[type] = Validation.compile(validation[type]);
    });

    if (this.settings.response.schema !== undefined ||
        this.settings.response.status) {

        this.settings.response._validate = true;

        const rule = this.settings.response.schema;
        this.settings.response.status = this.settings.response.status || {};
        const statuses = Object.keys(this.settings.response.status);

        if (rule === true &&
            !statuses.length) {

            this.settings.response._validate = false;
        }
        else {
            this.settings.response.schema = Validation.compile(rule);
            for (let i = 0; i < statuses.length; ++i) {
                const code = statuses[i];
                this.settings.response.status[code] = Validation.compile(this.settings.response.status[code]);
            }
        }
    }

    // Payload parsing

    if (this.method === 'get') {
        this.settings.payload = null;
    }
    else {
        if (this.settings.payload.allow) {
            this.settings.payload.allow = [].concat(this.settings.payload.allow);
        }
    }

    Hoek.assert(!this.settings.validate.payload || this.settings.payload.parse, 'Route payload must be set to \'parse\' when payload validation enabled:', routeDisplay);
    Hoek.assert(!this.settings.jsonp || typeof this.settings.jsonp === 'string', 'Bad route JSONP parameter name:', routeDisplay);

    // Authentication configuration

    this.settings.auth = (this._special ? false : this.connection.auth._setupRoute(this.settings.auth, route.path));

    // Cache

    if (this.method === 'get' &&
        typeof this.settings.cache === 'object' &&
        (this.settings.cache.expiresIn || this.settings.cache.expiresAt)) {

        this.settings.cache._statuses = Hoek.mapToObject(this.settings.cache.statuses);
        this._cache = new Catbox.Policy({ expiresIn: this.settings.cache.expiresIn, expiresAt: this.settings.cache.expiresAt });
    }

    // CORS

    this.settings.cors = Cors.route(this.settings.cors);

    // Security

    if (this.settings.security) {
        this.settings.security = Hoek.applyToDefaults(Defaults.security, this.settings.security);

        const security = this.settings.security;
        if (security.hsts) {
            if (security.hsts === true) {
                security._hsts = 'max-age=15768000';
            }
            else if (typeof security.hsts === 'number') {
                security._hsts = 'max-age=' + security.hsts;
            }
            else {
                security._hsts = 'max-age=' + (security.hsts.maxAge || 15768000);
                if (security.hsts.includeSubdomains || security.hsts.includeSubDomains) {
                    security._hsts = security._hsts + '; includeSubDomains';
                }
                if (security.hsts.preload) {
                    security._hsts = security._hsts + '; preload';
                }
            }
        }

        if (security.xframe) {
            if (security.xframe === true) {
                security._xframe = 'DENY';
            }
            else if (typeof security.xframe === 'string') {
                security._xframe = security.xframe.toUpperCase();
            }
            else if (security.xframe.rule === 'allow-from') {
                if (!security.xframe.source) {
                    security._xframe = 'SAMEORIGIN';
                }
                else {
                    security._xframe = 'ALLOW-FROM ' + security.xframe.source;
                }
            }
            else {
                security._xframe = security.xframe.rule.toUpperCase();
            }
        }
    }

    // Handler

    this.settings.handler = Handler.configure(this.settings.handler, this);
    this._prerequisites = Handler.prerequisitesConfig(this.settings.pre, this.server);

    // Route lifecycle

    this._extensions = {
        onPreResponse: this._combineExtensions('onPreResponse')
    };

    if (this._special) {
        this._cycle = [Handler.execute];
        return;
    }

    this._extensions.onPreAuth = this._combineExtensions('onPreAuth');
    this._extensions.onPostAuth = this._combineExtensions('onPostAuth');
    this._extensions.onPreHandler = this._combineExtensions('onPreHandler');
    this._extensions.onPostHandler = this._combineExtensions('onPostHandler');

    this.rebuild();
};


internals.Route.prototype._combineExtensions = function (type, subscribe) {

    const ext = new Ext(this.server);

    const events = this.settings.ext[type];
    if (events) {
        for (let i = 0; i < events.length; ++i) {
            const event = Hoek.shallow(events[i]);
            Hoek.assert(!event.options.sandbox, 'Cannot specify sandbox option for route extension');
            event.plugin = this.plugin;
            ext.add(event);
        }
    }

    const connection = this.connection._extensions[type];
    const realm = this.plugin.realm._extensions[type];

    ext.merge([connection, realm]);

    connection.subscribe(this);
    realm.subscribe(this);

    return ext;
};


internals.Route.prototype.rebuild = function (event) {

    if (event) {
        this._extensions[event.type].add(event);
        if (event.type === 'onPreResponse') {
            return;
        }
    }

    // Build lifecycle array

    const cycle = [];

    // 'onRequest'

    if (this.settings.jsonp) {
        cycle.push(internals.parseJSONP);
    }

    if (this.settings.state.parse) {
        cycle.push(internals.state);
    }

    if (this._extensions.onPreAuth.nodes) {
        cycle.push(this._extensions.onPreAuth);
    }

    const authenticate = (this.settings.auth !== false);                          // Anything other than 'false' can still require authentication
    if (authenticate) {
        cycle.push(Auth.authenticate);
    }

    if (this.method !== 'get') {
        cycle.push(internals.payload);

        if (authenticate) {
            cycle.push(Auth.payload);
        }
    }

    if (this._extensions.onPostAuth.nodes) {
        cycle.push(this._extensions.onPostAuth);
    }

    if (this.settings.validate.headers) {
        cycle.push(Validation.headers);
    }

    if (this.settings.validate.params) {
        cycle.push(Validation.params);
    }

    if (this.settings.jsonp) {
        cycle.push(internals.cleanupJSONP);
    }

    if (this.settings.validate.query) {
        cycle.push(Validation.query);
    }

    if (this.settings.validate.payload) {
        cycle.push(Validation.payload);
    }

    if (this._extensions.onPreHandler.nodes) {
        cycle.push(this._extensions.onPreHandler);
    }

    cycle.push(Handler.execute);                                     // Must not call next() with an Error

    if (this._extensions.onPostHandler.nodes) {
        cycle.push(this._extensions.onPostHandler);                 // An error from here on will override any result set in handler()
    }

    if (this.settings.response._validate &&
        this.settings.response.sample !== 0) {

        cycle.push(Validation.response);
    }

    this._cycle = cycle;
};


internals.state = function (request, next) {

    request.state = {};

    const req = request.raw.req;
    const cookies = req.headers.cookie;
    if (!cookies) {
        return next();
    }

    request.connection.states.parse(cookies, (err, state, failed) => {

        request.state = state || {};

        // Clear cookies

        for (let i = 0; i < failed.length; ++i) {
            const item = failed[i];

            if (item.settings.clearInvalid) {
                request._clearState(item.name);
            }
        }

        // failAction: 'error', 'log', 'ignore'

        if (!err ||
            request.route.settings.state.failAction === 'ignore') {

            return next();
        }

        request._log(['state', 'error'], { header: cookies, errors: err.data });
        return next(request.route.settings.state.failAction === 'error' ? err : null);
    });
};


internals.payload = function (request, next) {

    if (request.method === 'get' ||
        request.method === 'head') {            // When route.method is '*'

        return next();
    }

    const onParsed = (err, parsed) => {

        request.mime = parsed.mime;
        request.payload = parsed.payload || null;

        if (!err) {
            return next();
        }

        const failAction = request.route.settings.payload.failAction;         // failAction: 'error', 'log', 'ignore'
        if (failAction !== 'ignore') {
            request._log(['payload', 'error'], err);
        }

        if (failAction === 'error') {
            return next(err);
        }

        return next();
    };

    Subtext.parse(request.raw.req, request._tap(), request.route.settings.payload, (err, parsed) => {

        if (!err ||
            !request._isPayloadPending) {

            request._isPayloadPending = false;
            return onParsed(err, parsed);
        }

        // Flush out any pending request payload not consumed due to errors

        const stream = request.raw.req;

        const read = () => {

            stream.read();
        };

        const end = () => {

            stream.removeListener('readable', read);
            stream.removeListener('error', end);
            stream.removeListener('end', end);

            request._isPayloadPending = false;
            return onParsed(err, parsed);
        };

        stream.on('readable', read);
        stream.once('error', end);
        stream.once('end', end);
    });
};


internals.jsonpRegex = /^[\w\$\[\]\.]+$/;


internals.parseJSONP = function (request, next) {

    const jsonp = request.query[request.route.settings.jsonp];
    if (jsonp) {
        if (internals.jsonpRegex.test(jsonp) === false) {
            return next(Boom.badRequest('Invalid JSONP parameter value'));
        }

        request.jsonp = jsonp;
    }

    return next();
};


internals.cleanupJSONP = function (request, next) {

    if (request.jsonp) {
        delete request.query[request.route.settings.jsonp];
    }

    return next();
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Crypto = __webpack_require__(16);
const Boom = __webpack_require__(2);


// Declare internals

const internals = {};


// Generate a cryptographically strong pseudo-random data

exports.randomString = function (size) {

    const buffer = exports.randomBits((size + 1) * 6);
    if (buffer instanceof Error) {
        return buffer;
    }

    const string = buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
    return string.slice(0, size);
};


exports.randomBits = function (bits) {

    if (!bits ||
        bits < 0) {

        return Boom.internal('Invalid random bits count');
    }

    const bytes = Math.ceil(bits / 8);
    try {
        return Crypto.randomBytes(bytes);
    }
    catch (err) {
        return Boom.internal('Failed generating random bits: ' + err.message);
    }
};


// Compare two strings using fixed time algorithm (to prevent time-based analysis of MAC digest match)

exports.fixedTimeComparison = function (a, b) {

    if (typeof a !== 'string' ||
        typeof b !== 'string') {

        return false;
    }

    let mismatch = (a.length === b.length ? 0 : 1);
    if (mismatch) {
        b = a;
    }

    for (let i = 0; i < a.length; ++i) {
        const ac = a.charCodeAt(i);
        const bc = b.charCodeAt(i);
        mismatch |= (ac ^ bc);
    }

    return (mismatch === 0);
};




/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Stream = __webpack_require__(5);
const Util = __webpack_require__(28);


// Declare internals

const internals = {};


exports = module.exports = internals.Peek = function (emitter) {

    Stream.Transform.call(this);
    this._emmiter = emitter;
    this.once('finish', () => {

        emitter.emit('finish');
    });
};

Util.inherits(internals.Peek, Stream.Transform);


internals.Peek.prototype._transform = function (chunk, encoding, callback) {

    this._emmiter.emit('peek', chunk, encoding);
    this.push(chunk, encoding);
    callback();
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);
const Joi = __webpack_require__(0);
const Request = __webpack_require__(81);
const Response = __webpack_require__(82);


// Declare internals

const internals = {};


internals.options = Joi.object().keys({
    url: Joi.alternatives([
        Joi.string(),
        Joi.object().keys({
            protocol: Joi.string(),
            hostname: Joi.string(),
            port: Joi.any(),
            pathname: Joi.string().required(),
            query: Joi.any()
        })
    ])
        .required(),
    headers: Joi.object(),
    payload: Joi.any(),
    simulate: {
        end: Joi.boolean(),
        split: Joi.boolean(),
        error: Joi.boolean(),
        close: Joi.boolean()
    },
    authority: Joi.string(),
    remoteAddress: Joi.string(),
    method: Joi.string(),
    validate: Joi.boolean()
});


exports.inject = function (dispatchFunc, options, callback) {

    options = (typeof options === 'string' ? { url: options } : options);

    if (options.validate !== false) {                                                           // Defaults to true
        Hoek.assert(typeof dispatchFunc === 'function', 'Invalid dispatch function');
        Joi.assert(options, internals.options);
    }

    const req = new Request(options);
    const res = new Response(req, callback);

    return req.prepare(() => dispatchFunc(req, res));
};


exports.isInjection = function (obj) {

    return (obj instanceof Request || obj instanceof Response);
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(2);


// Declare internals

const internals = {};


/*
    RFC 7231 Section 3.1.1.1

    media-type = type "/" subtype *( OWS ";" OWS parameter )
    type       = token
    subtype    = token
    parameter  = token "=" ( token / quoted-string )
*/

//                             1: type/subtype                    2: "b"   3: b
internals.contentTypeRegex = /^([^\/]+\/[^\s;]+)(?:(?:\s*;\s*boundary=(?:"([^"]+)"|([^;"]+)))|(?:\s*;\s*[^=]+=(?:(?:"(?:[^"]+)")|(?:[^;"]+))))*$/i;


exports.type = function (header) {

    const match = header.match(internals.contentTypeRegex);
    if (!match) {
        return Boom.badRequest('Invalid content-type header');
    }

    const mime = match[1].toLowerCase();
    const boundary = match[2] || match[3];
    if (mime.indexOf('multipart/') === 0 &&
        !boundary) {

        return Boom.badRequest('Invalid content-type header: multipart missing boundary');
    }

    return { mime: mime, boundary: boundary };
};


/*
    RFC 6266 Section 4.1 (http://tools.ietf.org/html/rfc6266#section-4.1)

    content-disposition = "Content-Disposition" ":" disposition-type *( ";" disposition-parm )
    disposition-type    = "inline" | "attachment" | token                                           ; case-insensitive
    disposition-parm    = filename-parm | token [ "*" ] "=" ( token | quoted-string | ext-value)    ; ext-value defined in [RFC5987], Section 3.2

    Content-Disposition header field values with multiple instances of the same parameter name are invalid.

    Note that due to the rules for implied linear whitespace (Section 2.1 of [RFC2616]), OPTIONAL whitespace
    can appear between words (token or quoted-string) and separator characters.

    Furthermore, note that the format used for ext-value allows specifying a natural language (e.g., "en"); this is of limited use
    for filenames and is likely to be ignored by recipients.
*/


internals.contentDispositionRegex = /^\s*form-data\s*(?:;\s*(.+))?$/i;

//                                        1: name   2: *            3: ext-value                  4: quoted  5: token
internals.contentDispositionParamRegex = /([^\=\*]+)(\*)?\s*\=\s*(?:([^;']+\'[\w-]*\'[^;\s]+)|(?:\"([^"]*)\")|([^;\s]*))(?:(?:\s*;\s*)|(?:\s*$))/g;

exports.disposition = function (header) {

    if (!header) {
        return Boom.badRequest('Missing content-disposition header');
    }

    const match = header.match(internals.contentDispositionRegex);
    if (!match) {
        return Boom.badRequest('Invalid content-disposition header format');
    }

    const parameters = match[1];
    if (!parameters) {
        return Boom.badRequest('Invalid content-disposition header missing parameters');
    }

    const result = {};
    const leftovers = parameters.replace(internals.contentDispositionParamRegex, ($0, $1, $2, $3, $4, $5) => {

        if ($2) {
            if (!$3) {
                return 'error';         // Generate leftovers
            }

            try {
                result[$1] = decodeURIComponent($3.split('\'')[2]);
            }
            catch (err) {
                return 'error';          // Generate leftover
            }
        }
        else {
            result[$1] = $4 || $5 || '';
        }

        return '';
    });

    if (leftovers) {
        return Boom.badRequest('Invalid content-disposition header format includes invalid parameters');
    }

    if (!result.name) {
        return Boom.badRequest('Invalid content-disposition header missing name parameter');
    }

    return result;
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);
const Stream = __webpack_require__(5);


// Declare internals

const internals = {};


module.exports = internals.Payload = function (payload, encoding) {

    Stream.Readable.call(this);

    const data = [].concat(payload || '');
    let size = 0;
    for (let i = 0; i < data.length; ++i) {
        const chunk = data[i];
        size = size + chunk.length;
        data[i] = Buffer.isBuffer(chunk) ? chunk : new Buffer(chunk);
    }

    this._data = Buffer.concat(data, size);
    this._position = 0;
    this._encoding = encoding || 'utf8';
};

Hoek.inherits(internals.Payload, Stream.Readable);


internals.Payload.prototype._read = function (size) {

    const chunk = this._data.slice(this._position, this._position + size);
    this.push(chunk, this._encoding);
    this._position = this._position + chunk.length;

    if (this._position >= this._data.length) {
        this.push(null);
    }
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _joi2.default.object().keys({
  groupsInToken: _joi2.default.boolean(),
  rolesInToken: _joi2.default.boolean(),
  permissionsInToken: _joi2.default.boolean(),
  persistGroups: _joi2.default.boolean(),
  persistRoles: _joi2.default.boolean(),
  persistPermissions: _joi2.default.boolean(),
  groupsPassthrough: _joi2.default.boolean(),
  rolesPassthrough: _joi2.default.boolean(),
  permissionsPassthrough: _joi2.default.boolean()
});

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _joi2.default.array().items(_joi2.default.string()).required().min(1);

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _joi2.default.array().items(_joi2.default.string().guid()).required().min(1);

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _joi2.default.object().keys({
  name: _joi2.default.string().min(1).max(50).required(),
  description: _joi2.default.string().min(1).max(500).required()
});

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _joi2.default.object().keys({
  name: _joi2.default.string().min(1).max(100).required(),
  description: _joi2.default.string().min(1).max(500).required(),
  applicationType: _joi2.default.string().valid('client', 'resource_server').required(),
  applicationId: _joi2.default.string().min(1).max(500).required()
});

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _joi2.default.object().keys({
  name: _joi2.default.string().min(1).max(50).required(),
  description: _joi2.default.string().min(1).max(500).required(),
  applicationType: _joi2.default.string().valid('client', 'resource_server').required(),
  applicationId: _joi2.default.string().min(1).max(500).required(),
  permissions: _joi2.default.array().items(_joi2.default.string().guid()).default([])
});

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = __webpack_require__(6);

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var idle = function idle(timeout) {
  return new _bluebird2.default(function (resolve) {
    return setTimeout(function () {
      return resolve();
    }, timeout * 1000);
  });
};

exports.default = function (context, promise, args) {
  var retry = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;

  var retriesLeft = retry;

  var tryRequest = function tryRequest() {
    return promise.apply(context, args).then(function (data) {
      return _bluebird2.default.resolve(data);
    }).catch(function (err) {
      var originalError = err.originalError || {};
      var ratelimitReset = originalError.response && originalError.response.header && originalError.response.header['x-ratelimit-reset'] || 0;
      var currentTime = Math.round(new Date().getTime() / 1000);
      var maxTimeout = 10; // wait for 10 seconds max
      var timeout = parseInt(ratelimitReset, 10) - currentTime;

      if (originalError.status === 429 && retriesLeft > 0 && ratelimitReset && timeout <= maxTimeout) {
        retriesLeft--;
        if (timeout <= 0) {
          timeout = 1;
        }

        return idle(timeout).then(tryRequest);
      }

      return _bluebird2.default.reject(err);
    });
  };

  return tryRequest();
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = __webpack_require__(16);

var _crypto2 = _interopRequireDefault(_crypto);

var _config = __webpack_require__(4);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hashApiKey = function hashApiKey(key) {
  return _crypto2.default.createHmac('sha256', key + ' + ' + (0, _config2.default)('AUTH0_CLIENT_SECRET')).update((0, _config2.default)('EXTENSION_SECRET')).digest('hex');
};

exports.default = function (storage, auth0) {
  var key = _crypto2.default.randomBytes(32).toString('hex');
  var hash = hashApiKey(key);

  return auth0.rulesConfigs.set({ key: 'AUTHZ_EXT_API_KEY' }, { value: hash }).then(function () {
    return storage.updateApiKey(key);
  }).then(function () {
    return hash;
  });
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _db = null;

module.exports.init = function (db) {
  _db = db;
};

module.exports.getDb = function () {
  if (!_db) {
    throw new Error('The database has not been initialized.');
  }

  return _db;
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUsersById = getUsersById;

var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _async = __webpack_require__(170);

var _async2 = _interopRequireDefault(_async);

var _bluebird = __webpack_require__(6);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _apiCall = __webpack_require__(43);

var _apiCall2 = _interopRequireDefault(_apiCall);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getUsersById(client, ids, page, limit) {
  return new _bluebird2.default(function (resolve, reject) {
    var users = [];
    var total = ids.length;

    page = page - 1 < 0 ? 0 : page - 1; // eslint-disable-line no-param-reassign
    ids = ids.splice(page * limit, limit); // eslint-disable-line no-param-reassign

    _async2.default.eachLimit(ids, 10, function (userId, cb) {
      (0, _apiCall2.default)(client, client.users.get, [{ id: userId }]).then(function (user) {
        users.push(user);
        cb();
      }).catch(function (err) {
        var errDescription = err && (err.name || err.statusCode);
        users.push({
          user_id: userId,
          name: '<Error: ' + errDescription + '>',
          email: userId,
          identities: [{ connection: 'N/A' }]
        });
        return cb();
      });
    }, function (err) {
      if (err) {
        return reject(err);
      }

      var sorted = _lodash2.default.sortByOrder(users, 'user_id');

      return resolve({ total: total, users: sorted });
    });
  });
}

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = require("ejs@2.3.1");

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = require("querystring");

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _config = __webpack_require__(4);

var _config2 = _interopRequireDefault(_config);

var _database = __webpack_require__(155);

var _database2 = _interopRequireDefault(_database);

var _getdb = __webpack_require__(45);

var _providers = __webpack_require__(156);

var _ = __webpack_require__(152);

var _2 = _interopRequireDefault(_);

var _logger = __webpack_require__(8);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (cfg, storageContext, cb) {
  if (cb == null) {
    cb = function cb(err) {
      if (err) {
        _logger2.default.error('Hapi initialization failed.');
        _logger2.default.error(err);
      } else {
        _logger2.default.info('Hapi initialization completed.');
      }
    };
  }

  // Set configuration provider.
  _config2.default.setProvider(function (key) {
    return cfg(key) || __webpack_require__.i({"WARN_DB_SIZE":409600,"MAX_MULTISELECT_USERS":5,"MULTISELECT_DEBOUNCE_MS":250,"PER_PAGE":10,"NODE_ENV":"production","CLIENT_VERSION":"2.9.1"})[key];
  });

  // Initialize the storage layer.
  (0, _getdb.init)(new _database2.default({
    provider: (0, _providers.createProvider)(storageContext)
  }));

  // Start the server.
  return (0, _2.default)(cb);
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);
const Items = __webpack_require__(9);
const Methods = __webpack_require__(30);
const Response = __webpack_require__(20);


// Declare internals

const internals = {};


exports.execute = function (request, next) {

    const finalize = (err, result) => {

        request._setResponse(err || result);
        return next();                              // Must not include an argument
    };

    request._protect.run(finalize, (exit) => {

        if (request._route._prerequisites) {
            internals.prerequisites(request, Hoek.once(exit));
        }
        else {
            internals.handler(request, exit);
        }
    });
};


internals.prerequisites = function (request, callback) {

    const each = (set, nextSet) => {

        Items.parallel(set, (pre, next) => {

            pre(request, (err, result) => {

                if (err) {
                    return next(err);
                }

                if (!result._takeover) {
                    return next();
                }

                return callback(null, result);
            });
        }, nextSet);
    };

    Items.serial(request._route._prerequisites, each, (err) => {

        if (err) {
            return callback(err);
        }

        return internals.handler(request, callback);
    });
};


internals.handler = function (request, callback) {

    const timer = new Hoek.Bench();
    const finalize = (response, data) => {

        if (response === null) {                            // reply.continue()
            response = Response.wrap(null, request);
            return response._prepare(null, finalize);
        }

        // Check for Error result

        if (response.isBoom) {
            request._log(['handler', 'error'], { msec: timer.elapsed(), error: response.message, data: response });
            return callback(response);
        }

        request._log(['handler'], { msec: timer.elapsed() });
        return callback(null, response);
    };

    // Decorate request

    const reply = request.server._replier.interface(request, request.route.realm, finalize);
    const bind = request.route.settings.bind;

    // Execute handler

    request.route.settings.handler.call(bind, request, reply);
};


exports.defaults = function (method, handler, server) {

    let defaults = null;

    if (typeof handler === 'object') {
        const type = Object.keys(handler)[0];
        const serverHandler = server._handlers[type];

        Hoek.assert(serverHandler, 'Unknown handler:', type);

        if (serverHandler.defaults) {
            defaults = (typeof serverHandler.defaults === 'function' ? serverHandler.defaults(method) : serverHandler.defaults);
        }
    }

    return defaults || {};
};


exports.configure = function (handler, route) {

    if (typeof handler === 'object') {
        const type = Object.keys(handler)[0];
        const serverHandler = route.server._handlers[type];

        Hoek.assert(serverHandler, 'Unknown handler:', type);

        return serverHandler(route.public, handler[type]);
    }

    if (typeof handler === 'string') {
        const parsed = internals.fromString('handler', handler, route.server);
        return parsed.method;
    }

    return handler;
};


exports.prerequisitesConfig = function (config, server) {

    if (!config) {
        return null;
    }

    /*
        [
            [
                function (request, reply) { },
                {
                    method: function (request, reply) { }
                    assign: key1
                },
                {
                    method: function (request, reply) { },
                    assign: key2
                }
            ],
            'user(params.id)'
        ]
    */

    const prerequisites = [];

    for (let i = 0; i < config.length; ++i) {
        const pres = [].concat(config[i]);

        const set = [];
        for (let j = 0; j < pres.length; ++j) {
            let pre = pres[j];
            if (typeof pre !== 'object') {
                pre = { method: pre };
            }

            const item = {
                method: pre.method,
                assign: pre.assign,
                failAction: pre.failAction || 'error'
            };

            if (typeof item.method === 'string') {
                const parsed = internals.fromString('pre', item.method, server);
                item.method = parsed.method;
                item.assign = item.assign || parsed.name;
            }

            set.push(internals.pre(item));
        }

        prerequisites.push(set);
    }

    return prerequisites.length ? prerequisites : null;
};


internals.fromString = function (type, notation, server) {

    //                                  1:name            2:(        3:arguments
    const methodParts = notation.match(/^([\w\.]+)(?:\s*)(?:(\()(?:\s*)(\w+(?:\.\w+)*(?:\s*\,\s*\w+(?:\.\w+)*)*)?(?:\s*)\))?$/);
    Hoek.assert(methodParts, 'Invalid server method string notation:', notation);

    const name = methodParts[1];
    Hoek.assert(name.match(Methods.methodNameRx), 'Invalid server method name:', name);

    const method = server._methods._normalized[name];
    Hoek.assert(method, 'Unknown server method in string notation:', notation);

    const result = { name: name };
    const argsNotation = !!methodParts[2];
    const methodArgs = (argsNotation ? (methodParts[3] || '').split(/\s*\,\s*/) : null);

    result.method = (request, reply) => {

        if (!argsNotation) {
            return method(request, reply);                      // Method is already bound to context
        }

        const finalize = (err, value, cached, report) => {

            if (report) {
                request._log([type, 'method', name], report);
            }

            return reply(err, value);
        };

        const args = [];
        for (let i = 0; i < methodArgs.length; ++i) {
            const arg = methodArgs[i];
            if (arg) {
                args.push(Hoek.reach(request, arg));
            }
        }

        args.push(finalize);
        method.apply(null, args);
    };

    return result;
};


internals.pre = function (pre) {

    /*
        {
            method: function (request, next) { }
            assign:     'key'
            failAction: 'error'* | 'log' | 'ignore'
        }
    */

    return (request, next) => {

        const timer = new Hoek.Bench();
        const finalize = (response, data) => {

            if (response === null) {                            // reply.continue()
                response = Response.wrap(null, request);
                return response._prepare(null, finalize);
            }

            if (response instanceof Error) {
                if (pre.failAction !== 'ignore') {
                    request._log(['pre', 'error'], { msec: timer.elapsed(), assign: pre.assign, error: response });
                }

                if (pre.failAction === 'error') {
                    return next(response);
                }
            }
            else {
                request._log(['pre'], { msec: timer.elapsed(), assign: pre.assign });
            }

            if (pre.assign) {
                request.pre[pre.assign] = response.source;
                request.preResponses[pre.assign] = response;
            }

            return next(null, response);
        };

        // Setup environment

        const reply = request.server._replier.interface(request, request.route.realm, finalize);
        const bind = request.route.settings.bind;

        // Execute handler

        pre.method.call(bind, request, reply);
    };
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Server = __webpack_require__(59);


// Declare internals

const internals = {};


exports.Server = Server;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Catbox = __webpack_require__(25);
const Hoek = __webpack_require__(1);
const Items = __webpack_require__(9);
const Kilt = __webpack_require__(78);
const Connection = __webpack_require__(29);
const Ext = __webpack_require__(19);
const Package = __webpack_require__(168);
const Promises = __webpack_require__(24);
const Schema = __webpack_require__(15);


// Declare internals

const internals = {};


exports = module.exports = internals.Plugin = function (server, connections, env, parent) {         // env can be a realm or plugin name

    Kilt.call(this, connections, server._events);

    this._parent = parent;

    // Public interface

    this.root = server;
    this.app = this.root._app;
    this.connections = connections;
    this.load = this.root._heavy.load;
    this.methods = this.root._methods.methods;
    this.mime = this.root._mime;
    this.plugins = this.root._plugins;
    this.settings = this.root._settings;
    this.version = Package.version;

    this.realm = typeof env !== 'string' ? env : {
        _extensions: {
            onPreAuth: new Ext(this.root),
            onPostAuth: new Ext(this.root),
            onPreHandler: new Ext(this.root),
            onPostHandler: new Ext(this.root),
            onPreResponse: new Ext(this.root)
        },
        modifiers: {
            route: {}
        },
        plugin: env,
        pluginOptions: {},
        plugins: {},
        settings: {
            bind: undefined,
            files: {
                relativeTo: undefined
            }
        }
    };

    this.auth = {
        default: (opts) => this._applyChild('auth.default', 'auth', 'default', [opts]),
        scheme: (name, scheme) => this._applyChild('auth.scheme', 'auth', 'scheme', [name, scheme]),
        strategy: (name, scheme, mode, opts) => this._applyChild('auth.strategy', 'auth', 'strategy', [name, scheme, mode, opts]),
        test: (name, request, next) => request.connection.auth.test(name, request, next)
    };

    this.cache.provision = (opts, callback) => {

        if (!callback) {
            return Promises.wrap(null, this.cache.provision, [opts]);
        }

        return this.root._createCache(opts, callback);
    };

    this._single();

    // Decorations

    const methods = Object.keys(this.root._decorations);
    for (let i = 0; i < methods.length; ++i) {
        const method = methods[i];
        this[method] = this.root._decorations[method];
    }
};

Hoek.inherits(internals.Plugin, Kilt);


internals.Plugin.prototype._single = function () {

    if (this.connections &&
        this.connections.length === 1) {

        this.info = this.connections[0].info;
        this.listener = this.connections[0].listener;
        this.registrations = this.connections[0].registrations;
        this.auth.api = this.connections[0].auth.api;
    }
    else {
        this.info = null;
        this.listener = null;
        this.registrations = null;
        this.auth.api = null;
    }
};


internals.Plugin.prototype.select = function (/* labels */) {

    let labels = [];
    for (let i = 0; i < arguments.length; ++i) {
        labels.push(arguments[i]);
    }

    labels = Hoek.flatten(labels);
    return this._select(labels);
};


internals.Plugin.prototype._select = function (labels, plugin) {

    let connections = this.connections;

    if (labels &&
        labels.length) {            // Captures both empty arrays and empty strings

        Hoek.assert(this.connections, 'Cannot select inside a connectionless plugin');

        connections = [];
        for (let i = 0; i < this.connections.length; ++i) {
            const connection = this.connections[i];
            if (Hoek.intersect(connection.settings.labels, labels).length) {
                connections.push(connection);
            }
        }

        if (!plugin &&
            connections.length === this.connections.length) {

            return this;
        }
    }

    const env = (plugin !== undefined ? plugin : this.realm);                     // Allow empty string
    return new internals.Plugin(this.root, connections, env, this);
};


internals.Plugin.prototype._clone = function (connections, plugin) {

    const env = (plugin !== undefined ? plugin : this.realm);                     // Allow empty string
    return new internals.Plugin(this.root, connections, env, this);
};


internals.Plugin.prototype.register = function (plugins /*, [options], callback */) {

    let options = (typeof arguments[1] === 'object' ? arguments[1] : {});
    const callback = (typeof arguments[1] === 'object' ? arguments[2] : arguments[1]);

    if (!callback) {
        return Promises.wrap(this, this.register, [plugins, options]);
    }

    if (this.realm.modifiers.route.prefix ||
        this.realm.modifiers.route.vhost) {

        options = Hoek.clone(options);
        options.routes = options.routes || {};

        options.routes.prefix = (this.realm.modifiers.route.prefix || '') + (options.routes.prefix || '') || undefined;
        options.routes.vhost = this.realm.modifiers.route.vhost || options.routes.vhost;
    }

    options = Schema.apply('register', options);

    /*
        const register = function (server, options, next) { return next(); };
        register.attributes = {
            pkg: require('../package.json'),
            name: 'plugin',
            version: '1.1.1',
            multiple: false,
            dependencies: [],
            connections: false,
            once: true
        };

        const item = {
            register: register,
            options: options        // -optional--
        };

        - OR -

        const item = function () {}
        item.register = register;
        item.options = options;

        const plugins = register, items, [register, item]
    */

    const registrations = [];
    plugins = [].concat(plugins);
    for (let i = 0; i < plugins.length; ++i) {
        let plugin = plugins[i];

        if (typeof plugin === 'function') {
            if (!plugin.register) {                                 // plugin is register() function
                plugin = { register: plugin };
            }
            else {
                plugin = Hoek.shallow(plugin);                      // Convert function to object
            }
        }

        if (plugin.register.register) {                             // Required plugin
            plugin.register = plugin.register.register;
        }

        plugin = Schema.apply('plugin', plugin);

        const attributes = plugin.register.attributes;
        const registration = {
            register: plugin.register,
            name: attributes.name || attributes.pkg.name,
            version: attributes.version || attributes.pkg.version,
            multiple: attributes.multiple,
            pluginOptions: plugin.options,
            dependencies: attributes.dependencies,
            connections: attributes.connections,
            options: {
                once: attributes.once || (plugin.once !== undefined ? plugin.once : options.once),
                routes: {
                    prefix: plugin.routes.prefix || options.routes.prefix,
                    vhost: plugin.routes.vhost || options.routes.vhost
                },
                select: plugin.select || options.select
            }
        };

        registrations.push(registration);
    }

    this.root._registring = true;

    const each = (item, next) => {

        const selection = this._select(item.options.select, item.name);
        selection.realm.modifiers.route.prefix = item.options.routes.prefix;
        selection.realm.modifiers.route.vhost = item.options.routes.vhost;
        selection.realm.pluginOptions = item.pluginOptions || {};

        const registrationData = {
            version: item.version,
            name: item.name,
            options: item.pluginOptions,
            attributes: item.register.attributes
        };

        // Protect against multiple registrations

        if (!item.connections) {
            if (this.root._registrations[item.name]) {
                if (item.options.once) {
                    return next();
                }

                Hoek.assert(item.multiple, 'Plugin', item.name, 'already registered');
            }
            else {
                this.root._registrations[item.name] = registrationData;
            }
        }

        const connections = [];
        if (selection.connections) {
            for (let i = 0; i < selection.connections.length; ++i) {
                const connection = selection.connections[i];
                if (connection.registrations[item.name]) {
                    if (item.options.once) {
                        continue;
                    }

                    Hoek.assert(item.multiple, 'Plugin', item.name, 'already registered in:', connection.info.uri);
                }
                else {
                    connection.registrations[item.name] = registrationData;
                }

                connections.push(connection);
            }

            if (item.options.once &&
                item.connections &&
                !connections.length) {

                return next();                                              // All the connections already registered
            }
        }

        selection.connections = (item.connections ? connections : null);
        selection._single();

        if (item.dependencies) {
            selection.dependency(item.dependencies);
        }

        if (!item.connections) {
            selection.connection = this.connection;
        }

        // Register

        item.register(selection, item.pluginOptions || {}, next);
    };

    Items.serial(registrations, each, (err) => {

        this.root._registring = false;
        return callback(err);
    });
};


internals.Plugin.prototype.bind = function (context) {

    Hoek.assert(typeof context === 'object', 'bind must be an object');
    this.realm.settings.bind = context;
};


internals.Plugin.prototype.cache = function (options, _segment) {

    options = Schema.apply('cachePolicy', options);

    const segment = options.segment || _segment || (this.realm.plugin ? '!' + this.realm.plugin : '');
    Hoek.assert(segment, 'Missing cache segment name');

    const cacheName = options.cache || '_default';
    const cache = this.root._caches[cacheName];
    Hoek.assert(cache, 'Unknown cache', cacheName);
    Hoek.assert(!cache.segments[segment] || cache.shared || options.shared, 'Cannot provision the same cache segment more than once');
    cache.segments[segment] = true;

    return new Catbox.Policy(options, cache.client, segment);
};


internals.Plugin.prototype.decorate = function (type, property, method, options) {

    Hoek.assert(['reply', 'request', 'server'].indexOf(type) !== -1, 'Unknown decoration type:', type);
    Hoek.assert(property, 'Missing decoration property name');
    Hoek.assert(typeof property === 'string', 'Decoration property must be a string');
    Hoek.assert(property[0] !== '_', 'Property name cannot begin with an underscore:', property);

    // Request

    if (type === 'request') {
        return this.root._requestor.decorate(property, method, options);
    }

    Hoek.assert(!options, 'Cannot specify options for non-request decoration');

    // Reply

    if (type === 'reply') {
        return this.root._replier.decorate(property, method);
    }

    // Server

    Hoek.assert(!this.root._decorations[property], 'Server decoration already defined:', property);
    Hoek.assert(this[property] === undefined && this.root[property] === undefined, 'Cannot override the built-in server interface method:', property);

    this.root._decorations[property] = method;

    this[property] = method;
    let parent = this._parent;
    while (parent) {
        parent[property] = method;
        parent = parent._parent;
    }
};


internals.Plugin.prototype.dependency = function (dependencies, after) {

    Hoek.assert(this.realm.plugin, 'Cannot call dependency() outside of a plugin');
    Hoek.assert(!after || typeof after === 'function', 'Invalid after method');

    dependencies = [].concat(dependencies);
    this.root._dependencies.push({ plugin: this.realm.plugin, connections: this.connections, deps: dependencies });

    if (after) {
        this.ext('onPreStart', after, { after: dependencies });
    }
};


internals.Plugin.prototype.expose = function (key, value) {

    Hoek.assert(this.realm.plugin, 'Cannot call expose() outside of a plugin');

    const plugin = this.realm.plugin;
    this.root.plugins[plugin] = this.root.plugins[plugin] || {};

    if (typeof key === 'string') {
        this.root.plugins[plugin][key] = value;
    }
    else {
        Hoek.merge(this.root.plugins[plugin], key);
    }
};


internals.Plugin.prototype.ext = function (events) {        // (event, method, options) -OR- (events)

    if (typeof events === 'string') {
        events = { type: arguments[0], method: arguments[1], options: arguments[2] };
    }

    events = Schema.apply('exts', events);

    for (let i = 0; i < events.length; ++i) {
        this._ext(events[i]);
    }
};


internals.Plugin.prototype._ext = function (event) {

    event = Hoek.shallow(event);
    event.plugin = this;
    const type = event.type;

    if (!this.root._extensions[type]) {

        // Realm route extensions

        if (event.options.sandbox === 'plugin') {
            Hoek.assert(this.realm._extensions[type], 'Unknown event type', type);
            return this.realm._extensions[type].add(event);
        }

        // Connection route extensions

        return this._apply('ext', Connection.prototype._ext, [event]);
    }

    // Server extensions

    Hoek.assert(!event.options.sandbox, 'Cannot specify sandbox option for server extension');
    Hoek.assert(type !== 'onPreStart' || this.root._state === 'stopped', 'Cannot add onPreStart (after) extension after the server was initialized');
    this.root._extensions[type].add(event);
};


internals.Plugin.prototype.handler = function (name, method) {

    Hoek.assert(typeof name === 'string', 'Invalid handler name');
    Hoek.assert(!this.root._handlers[name], 'Handler name already exists:', name);
    Hoek.assert(typeof method === 'function', 'Handler must be a function:', name);
    Hoek.assert(!method.defaults || typeof method.defaults === 'object' || typeof method.defaults === 'function', 'Handler defaults property must be an object or function');
    this.root._handlers[name] = method;
};


internals.Plugin.prototype.inject = function (options, callback) {

    Hoek.assert(this.connections.length === 1, 'Method not available when the selection has more than one connection or none');
    return this.connections[0].inject(options, callback);
};


internals.Plugin.prototype.log = function (tags, data, timestamp, _internal) {

    tags = (Array.isArray(tags) ? tags : [tags]);
    const now = (timestamp ? (timestamp instanceof Date ? timestamp.getTime() : timestamp) : Date.now());

    const event = {
        timestamp: now,
        tags: tags,
        data: data,
        internal: !!_internal
    };

    const tagsMap = Hoek.mapToObject(event.tags);
    this.root._events.emit('log', event, tagsMap);

    if (this.root._settings.debug &&
        this.root._settings.debug.log &&
        Hoek.intersect(tagsMap, this.root._settings.debug.log, true)) {

        console.error('Debug:', event.tags.join(', '), (data ? '\n    ' + (data.stack || (typeof data === 'object' ? Hoek.stringify(data) : data)) : ''));
    }
};


internals.Plugin.prototype._log = function (tags, data) {

    return this.log(tags, data, null, true);
};


internals.Plugin.prototype.lookup = function (id) {

    Hoek.assert(this.connections.length === 1, 'Method not available when the selection has more than one connection or none');
    return this.connections[0].lookup(id);
};


internals.Plugin.prototype.match = function (method, path, host) {

    Hoek.assert(this.connections.length === 1, 'Method not available when the selection has more than one connection or none');
    return this.connections[0].match(method, path, host);
};


internals.Plugin.prototype.method = function (name, method, options) {

    return this.root._methods.add(name, method, options, this.realm);
};


internals.Plugin.prototype.path = function (relativeTo) {

    Hoek.assert(relativeTo && typeof relativeTo === 'string', 'relativeTo must be a non-empty string');
    this.realm.settings.files.relativeTo = relativeTo;
};


internals.Plugin.prototype.route = function (options) {

    Hoek.assert(arguments.length === 1, 'Method requires a single object argument or a single array of objects');
    Hoek.assert(typeof options === 'object', 'Invalid route options');
    Hoek.assert(this.connections, 'Cannot add route from a connectionless plugin');
    Hoek.assert(this.connections.length, 'Cannot add a route without any connections');

    this._apply('route', Connection.prototype._route, [options, this]);
};


internals.Plugin.prototype.state = function (name, options) {

    this._applyChild('state', 'states', 'add', [name, options]);
};


internals.Plugin.prototype.table = function (host) {

    Hoek.assert(this.connections, 'Cannot request routing table from a connectionless plugin');

    const table = [];
    for (let i = 0; i < this.connections.length; ++i) {
        const connection = this.connections[i];
        table.push({ info: connection.info, labels: connection.settings.labels, table: connection.table(host) });
    }

    return table;
};


internals.Plugin.prototype._apply = function (type, func, args) {

    Hoek.assert(this.connections, 'Cannot add ' + type + ' from a connectionless plugin');
    Hoek.assert(this.connections.length, 'Cannot add ' + type + ' without a connection');

    for (let i = 0; i < this.connections.length; ++i) {
        func.apply(this.connections[i], args);
    }
};


internals.Plugin.prototype._applyChild = function (type, child, func, args) {

    Hoek.assert(this.connections, 'Cannot add ' + type + ' from a connectionless plugin');
    Hoek.assert(this.connections.length, 'Cannot add ' + type + ' without a connection');

    for (let i = 0; i < this.connections.length; ++i) {
        const obj = this.connections[i][child];
        obj[func].apply(obj, args);
    }
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

let Domain = null;                                  // Loaded as needed
const Boom = __webpack_require__(2);
const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};


exports = module.exports = internals.Protect = function (request) {

    this._error = null;
    this.logger = request;                          // Replaced with server when request completes

    if (!request.server.settings.useDomains) {
        this.domain = null;
        return;
    }

    Domain = Domain || __webpack_require__(173);

    this.domain = Domain.create();
    this.domain.on('error', (err) => {

        return this._onError(err);
    });
};


internals.Protect.prototype._onError = function (err) {

    const handler = this._error;
    if (handler) {
        this._error = null;
        return handler(err);
    }

    this.logger._log(['internal', 'implementation', 'error'], err);
};


internals.Protect.prototype.run = function (next, enter) {              // enter: function (exit)

    const finish = Hoek.once((arg0, arg1, arg2) => {

        this._error = null;
        return next(arg0, arg1, arg2);
    });

    if (!this.domain) {
        return enter(finish);
    }

    this._error = (err) => {

        return finish(Boom.badImplementation('Uncaught error', err));
    };

    enter(finish);
};


internals.Protect.prototype.reset = function () {

    this._error = null;
};


internals.Protect.prototype.enter = function (func) {

    if (!this.domain) {
        return func();
    }

    this.domain.run(func);
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);
const Response = __webpack_require__(20);


// Declare internals

const internals = {};


exports = module.exports = internals.Reply = function () {

    this._decorations = null;
};


internals.Reply.prototype.decorate = function (property, method) {

    Hoek.assert(!this._decorations || !this._decorations[property], 'Reply interface decoration already defined:', property);
    Hoek.assert(['request', 'response', 'close', 'state', 'unstate', 'redirect', 'continue'].indexOf(property) === -1, 'Cannot override built-in reply interface decoration:', property);

    this._decorations = this._decorations || {};
    this._decorations[property] = method;
};


/*
    const handler = function (request, reply) {

        reply(error, result, ignore);   -> error || result (continue)
        reply(...).takeover();          -> ... (continue)

        reply.continue(ignore);         -> null (continue)
    };

    const ext = function (request, reply) {

        reply(error, result, ignore);   -> error || result (respond)
        reply(...).takeover();          -> ... (respond)

        reply.continue(ignore);         -> (continue)
    };

    const pre = function (request, reply) {

        reply(error);                   -> error (respond)  // failAction override
        reply(null, result, ignore);    -> result (continue)
        reply(...).takeover();          -> ... (respond)

        reply.continue(ignore);         -> null (continue)
    };

    const auth = function (request, reply) {

        reply(error, result, data);     -> error || result (respond) + data
        reply(...).takeover();          -> ... (respond) + data

        reply.continue(data);           -> (continue) + data
    };
*/

internals.Reply.prototype.interface = function (request, realm, next) {       // next(err || response, data);

    const reply = (err, response, data) => {

        reply._data = data;                 // Held for later
        return reply.response(err !== null && err !== undefined ? err : response);
    };

    reply._replied = false;
    reply._next = Hoek.once(next);

    reply.realm = realm;
    reply.request = request;

    reply.response = internals.response;
    reply.close = internals.close;
    reply.state = internals.state;
    reply.unstate = internals.unstate;
    reply.redirect = internals.redirect;
    reply.continue = internals.continue;

    if (this._decorations) {
        const methods = Object.keys(this._decorations);
        for (let i = 0; i < methods.length; ++i) {
            const method = methods[i];
            reply[method] = this._decorations[method];
        }
    }

    return reply;
};


internals.close = function (options) {

    options = options || {};
    this._next({ closed: true, end: options.end !== false });
};


internals.continue = function (data) {

    this._next(null, data);
    this._next = null;
};


internals.state = function (name, value, options) {

    this.request._setState(name, value, options);
};


internals.unstate = function (name, options) {

    this.request._clearState(name, options);
};


internals.redirect = function (location) {

    return this.response('').redirect(location);
};


internals.response = function (result) {

    Hoek.assert(!this._replied, 'reply interface called twice');
    this._replied = true;

    const response = Response.wrap(result, this.request);
    if (response.isBoom) {
        this._next(response, this._data);
        this._next = null;
        return response;
    }

    response.hold = internals.hold(this);

    process.nextTick(() => {

        response.hold = undefined;

        if (!response.send &&
            this._next) {

            response._prepare(this._data, this._next);
            this._next = null;
        }
    });

    return response;
};


internals.hold = function (reply) {

    return function () {

        this.hold = undefined;
        this.send = () => {

            this.send = undefined;
            this._prepare(reply._data, reply._next);
            this._next = null;
        };

        return this;
    };
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Events = __webpack_require__(13);
const Url = __webpack_require__(27);
const Accept = __webpack_require__(65);
const Boom = __webpack_require__(2);
const Hoek = __webpack_require__(1);
const Items = __webpack_require__(9);
const Peekaboo = __webpack_require__(33);
const Cors = __webpack_require__(18);
const Protect = __webpack_require__(56);
const Response = __webpack_require__(20);
const Transmit = __webpack_require__(60);


// Declare internals

const internals = {
    properties: ['connection', 'server', 'url', 'query', 'path', 'method', 'mime', 'setUrl', 'setMethod', 'headers', 'id', 'app', 'plugins', 'route', 'auth', 'pre', 'preResponses', 'info', 'orig', 'params', 'paramsArray', 'payload', 'state', 'jsonp', 'response', 'raw', 'tail', 'addTail', 'domain', 'log', 'getLog', 'generateResponse']
};


exports = module.exports = internals.Generator = function () {

    this._decorations = null;
};


internals.Generator.prototype.request = function (connection, req, res, options) {

    const request = new internals.Request(connection, req, res, options);

    // Decorate

    if (this._decorations) {
        const properties = Object.keys(this._decorations);
        for (let i = 0; i < properties.length; ++i) {
            const property = properties[i];
            const assignment = this._decorations[property];
            request[property] = (assignment.apply ? assignment.method(request) : assignment.method);
        }
    }

    return request;
};


internals.Generator.prototype.decorate = function (property, method, options) {

    options = options || {};

    Hoek.assert(!this._decorations || this._decorations[property] === undefined, 'Request interface decoration already defined:', property);
    Hoek.assert(internals.properties.indexOf(property) === -1, 'Cannot override built-in request interface decoration:', property);

    this._decorations = this._decorations || {};
    this._decorations[property] = { method, apply: options.apply };
};


internals.Request = function (connection, req, res, options) {

    Events.EventEmitter.call(this);

    // Take measurement as soon as possible

    this._bench = new Hoek.Bench();
    const now = Date.now();

    // Public members

    this.connection = connection;
    this.server = connection.server;

    this.url = null;
    this.query = null;
    this.path = null;
    this.method = null;
    this.mime = null;                       // Set if payload is parsed

    this.setUrl = this._setUrl;             // Decoration removed after 'onRequest'
    this.setMethod = this._setMethod;

    this._setUrl(req.url, this.connection.settings.router.stripTrailingSlash);      // Sets: this.url, this.path, this.query
    this._setMethod(req.method);                                                    // Sets: this.method
    this.headers = req.headers;

    this.id = now + ':' + connection.info.id + ':' + connection._requestCounter.value++;
    if (connection._requestCounter.value > connection._requestCounter.max) {
        connection._requestCounter.value = connection._requestCounter.min;
    }

    this.app = (options.app ? Hoek.shallow(options.app) : {});              // Place for application-specific state without conflicts with hapi, should not be used by plugins
    this.plugins = (options.plugins ? Hoek.shallow(options.plugins) : {});  // Place for plugins to store state without conflicts with hapi, should be namespaced using plugin name

    this._route = this.connection._router.specials.notFound.route;    // Used prior to routing (only settings are used, not the handler)
    this.route = this._route.public;

    this.auth = {
        isAuthenticated: false,
        credentials: options.credentials || null,       // Special keys: 'app', 'user', 'scope'
        artifacts: options.artifacts || null,           // Scheme-specific artifacts
        strategy: null,
        mode: null,
        error: null
    };

    this.pre = {};                          // Pre raw values
    this.preResponses = {};                 // Pre response values

    this.info = {
        received: now,
        responded: 0,
        remoteAddress: req.connection.remoteAddress,
        remotePort: req.connection.remotePort || '',
        referrer: req.headers.referrer || req.headers.referer || '',
        host: req.headers.host ? req.headers.host.replace(/\s/g, '') : '',
        acceptEncoding: Accept.encoding(this.headers['accept-encoding'], ['identity', 'gzip', 'deflate'])
    };

    this.info.hostname = this.info.host.split(':')[0];

    // Assigned elsewhere:

    this.orig = {};
    this.params = {};
    this.paramsArray = [];              // Array of path parameters in path order
    this.payload = null;
    this.state = null;
    this.jsonp = null;
    this.response = null;

    // Semi-public members

    this.raw = {
        req: req,
        res: res
    };

    this.tail = this.addTail = this._addTail;       // Removed once wagging

    // Private members

    this._states = {};
    this._logger = [];
    this._allowInternals = !!options.allowInternals;
    this._isPayloadPending = true;      // false when incoming payload fully processed
    this._isBailed = false;             // true when lifecycle should end
    this._isReplied = false;            // true when response processing started
    this._isFinalized = false;          // true when request completed (may be waiting on tails to complete)
    this._tails = {};                   // tail id -> name (tracks pending tails)
    this._tailIds = 0;                  // Used to generate a unique tail id
    this._protect = new Protect(this);
    this.domain = this._protect.domain;

    // Listen to request state

    this._onEnd = () => {

        this._isPayloadPending = false;
    };

    this.raw.req.once('end', this._onEnd);

    this._onClose = () => {

        this._log(['request', 'closed', 'error']);
        this._isPayloadPending = false;
        this._isBailed = true;
    };

    this.raw.req.once('close', this._onClose);

    this._onError = (err) => {

        this._log(['request', 'error'], err);
        this._isPayloadPending = false;
    };

    this.raw.req.once('error', this._onError);

    // Log request

    const about = {
        method: this.method,
        url: this.url.href,
        agent: this.raw.req.headers['user-agent']
    };

    this._log(['received'], about, now);     // Must be last for object to be fully constructed
};

Hoek.inherits(internals.Request, Events.EventEmitter);


internals.Request.prototype._setUrl = function (url, stripTrailingSlash) {

    this.url = (typeof url === 'string' ? Url.parse(url, true) : url);
    this.query = this.url.query;
    this.path = this.url.pathname || '';                                                            // pathname excludes query

    if (stripTrailingSlash &&
        this.path.length > 1 &&
        this.path[this.path.length - 1] === '/') {

        this.path = this.path.slice(0, -1);
        this.url.pathname = this.path;
    }

    this.path = this.connection._router.normalize(this.path);
};


internals.Request.prototype._setMethod = function (method) {

    Hoek.assert(method && typeof method === 'string', 'Missing method');
    this.method = method.toLowerCase();
};


internals.Request.prototype.log = function (tags, data, timestamp, _internal) {

    tags = (Array.isArray(tags) ? tags : [tags]);
    const now = (timestamp ? (timestamp instanceof Date ? timestamp.getTime() : timestamp) : Date.now());

    const event = {
        request: this.id,
        timestamp: now,
        tags: tags,
        data: data,
        internal: !!_internal
    };

    const tagsMap = Hoek.mapToObject(event.tags);

    // Add to request array

    this._logger.push(event);
    this.connection.emit(_internal ? 'request-internal' : 'request', this, event, tagsMap);

    if (this.server._settings.debug &&
        this.server._settings.debug.request &&
        Hoek.intersect(tagsMap, this.server._settings.debug.request, true)) {

        console.error('Debug:', event.tags.join(', '), (data ? '\n    ' + (data.stack || (typeof data === 'object' ? Hoek.stringify(data) : data)) : ''));
    }
};


internals.Request.prototype._log = function (tags, data) {

    return this.log(tags, data, null, true);
};


internals.Request.prototype.getLog = function (tags, internal) {

    if (typeof tags === 'boolean') {
        internal = tags;
        tags = [];
    }

    tags = [].concat(tags || []);
    if (!tags.length &&
        internal === undefined) {

        return this._logger;
    }

    const filter = tags.length ? Hoek.mapToObject(tags) : null;
    const result = [];

    for (let i = 0; i < this._logger.length; ++i) {
        const event = this._logger[i];
        if (internal === undefined || event.internal === internal) {
            if (filter) {
                for (let j = 0; j < event.tags.length; ++j) {
                    const tag = event.tags[j];
                    if (filter[tag]) {
                        result.push(event);
                        break;
                    }
                }
            }
            else {
                result.push(event);
            }
        }
    }

    return result;
};


internals.Request.prototype._execute = function () {

    // Execute onRequest extensions (can change request method and url)

    if (!this.connection._extensions.onRequest.nodes) {
        return this._lifecycle();
    }

    this._invoke(this.connection._extensions.onRequest, (err) => {

        return this._lifecycle(err);
    });
};


internals.Request.prototype._lifecycle = function (err) {

    // Undecorate request

    this.setUrl = undefined;
    this.setMethod = undefined;

    if (err) {
        return this._reply(err);
    }

    if (!this.path ||
        this.path[0] !== '/') {

        return this._reply(Boom.badRequest('Invalid path'));
    }

    // Lookup route

    const match = this.connection._router.route(this.method, this.path, this.info.hostname);
    if (!match.route.settings.isInternal ||
        this._allowInternals) {

        this._route = match.route;
        this.route = this._route.public;
    }

    this.params = match.params || {};
    this.paramsArray = match.paramsArray || [];

    if (this.route.settings.cors) {
        this.info.cors = {
            isOriginMatch: Cors.matchOrigin(this.headers.origin, this.route.settings.cors)
        };
    }

    // Setup timeout

    if (this.raw.req.socket &&
        this.route.settings.timeout.socket !== undefined) {

        this.raw.req.socket.setTimeout(this.route.settings.timeout.socket || 0);     // Value can be false or positive
    }

    let serverTimeout = this.route.settings.timeout.server;
    if (serverTimeout) {
        serverTimeout = Math.floor(serverTimeout - this._bench.elapsed());      // Calculate the timeout from when the request was constructed
        const timeoutReply = () => {

            this._log(['request', 'server', 'timeout', 'error'], { timeout: serverTimeout, elapsed: this._bench.elapsed() });
            this._reply(Boom.serverTimeout());
        };

        if (serverTimeout <= 0) {
            return timeoutReply();
        }

        this._serverTimeoutId = setTimeout(timeoutReply, serverTimeout);
    }

    const each = (func, next) => {

        if (this._isReplied ||
            this._isBailed) {

            return next(Boom.internal('Already closed'));                       // Error is not used
        }

        if (typeof func !== 'function') {                                       // Extension point
            return this._invoke(func, next);
        }

        return func(this, next);
    };

    Items.serial(this._route._cycle, each, (err) => {

        return this._reply(err);
    });
};


internals.Request.prototype._invoke = function (event, callback) {

    this._protect.run(callback, (exit) => {

        Items.serial(event.nodes, (ext, next) => {

            const reply = this.server._replier.interface(this, ext.plugin.realm, next);
            const bind = (ext.bind || ext.plugin.realm.settings.bind);

            ext.func.call(bind, this, reply);
        }, exit);
    });
};


internals.Request.prototype._reply = function (exit) {

    if (this._isReplied) {                                  // Prevent any future responses to this request
        return;
    }

    this._isReplied = true;

    clearTimeout(this._serverTimeoutId);

    if (this._isBailed) {
        return this._finalize();
    }

    if (this.response &&                                    // Can be null if response coming from exit
        this.response.closed) {

        if (this.response.end) {
            this.raw.res.end();                             // End the response in case it wasn't already closed
        }

        return this._finalize();
    }

    if (exit) {
        this._setResponse(Response.wrap(exit, this));
    }

    this._protect.reset();

    const transmit = (err) => {

        if (err) {                                          // err can be valid response or error
            this._setResponse(Response.wrap(err, this));
        }

        Transmit.send(this, () => {

            return this._finalize();
        });
    };

    if (!this._route._extensions.onPreResponse.nodes) {
        return transmit();
    }

    this._invoke(this._route._extensions.onPreResponse, transmit);
};


internals.Request.prototype._finalize = function () {

    this.info.responded = Date.now();

    if (this.response &&
        this.response.statusCode === 500 &&
        this.response._error) {

        this.connection.emit('request-error', this, this.response._error);
        this._log(this.response._error.isDeveloperError ? ['internal', 'implementation', 'error'] : ['internal', 'error'], this.response._error);
    }

    this.connection.emit('response', this);

    this._isFinalized = true;
    this.addTail = undefined;
    this.tail = undefined;

    if (Object.keys(this._tails).length === 0) {
        this.connection.emit('tail', this);
    }

    // Cleanup

    this.raw.req.removeListener('end', this._onEnd);
    this.raw.req.removeListener('close', this._onClose);
    this.raw.req.removeListener('error', this._onError);

    if (this.response &&
        this.response._close) {

        this.response._close();
    }

    this._protect.logger = this.server;
};


internals.Request.prototype._setResponse = function (response) {

    if (this.response &&
        !this.response.isBoom &&
        this.response !== response &&
        (response.isBoom || this.response.source !== response.source)) {

        this.response._close();
    }

    if (this._isFinalized) {
        if (response._close) {
            response._close();
        }

        return;
    }

    this.response = response;
};


internals.Request.prototype._addTail = function (name) {

    name = name || 'unknown';
    const tailId = this._tailIds++;
    this._tails[tailId] = name;
    this._log(['tail', 'add'], { name: name, id: tailId });

    const drop = () => {

        if (!this._tails[tailId]) {
            this._log(['tail', 'remove', 'error'], { name: name, id: tailId });             // Already removed
            return;
        }

        delete this._tails[tailId];

        if (Object.keys(this._tails).length === 0 &&
            this._isFinalized) {

            this._log(['tail', 'remove', 'last'], { name: name, id: tailId });
            this.connection.emit('tail', this);
        }
        else {
            this._log(['tail', 'remove'], { name: name, id: tailId });
        }
    };

    return drop;
};


internals.Request.prototype._setState = function (name, value, options) {          // options: see Defaults.state

    const state = {
        name: name,
        value: value
    };

    if (options) {
        Hoek.assert(!options.autoValue, 'Cannot set autoValue directly in a response');
        state.options = Hoek.clone(options);
    }

    this._states[name] = state;
};


internals.Request.prototype._clearState = function (name, options) {

    const state = {
        name: name
    };

    state.options = Hoek.clone(options || {});
    state.options.ttl = 0;

    this._states[name] = state;
};


internals.Request.prototype._tap = function () {

    return (this.listeners('finish').length || this.listeners('peek').length ? new Peekaboo(this) : null);
};


internals.Request.prototype.generateResponse = function (source, options) {

    return new Response(source, this, options);
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Events = __webpack_require__(13);
const Catbox = __webpack_require__(25);
const CatboxMemory = __webpack_require__(72);
const Heavy = __webpack_require__(75);
const Hoek = __webpack_require__(1);
const Items = __webpack_require__(9);
const Mimos = __webpack_require__(79);
const Connection = __webpack_require__(29);
const Defaults = __webpack_require__(23);
const Ext = __webpack_require__(19);
const Methods = __webpack_require__(30);
const Plugin = __webpack_require__(55);
const Promises = __webpack_require__(24);
const Reply = __webpack_require__(57);
const Request = __webpack_require__(58);
const Schema = __webpack_require__(15);


// Declare internals

const internals = {};


exports = module.exports = internals.Server = function (options) {

    Hoek.assert(this instanceof internals.Server, 'Server must be instantiated using new');

    options = Schema.apply('server', options || {});

    this._settings = Hoek.applyToDefaultsWithShallow(Defaults.server, options, ['connections.routes.bind']);
    this._settings.connections = Hoek.applyToDefaultsWithShallow(Defaults.connection, this._settings.connections || {}, ['routes.bind']);
    this._settings.connections.routes.cors = Hoek.applyToDefaults(Defaults.cors, this._settings.connections.routes.cors);
    this._settings.connections.routes.security = Hoek.applyToDefaults(Defaults.security, this._settings.connections.routes.security);

    this._caches = {};                                                  // Cache clients
    this._handlers = {};                                                // Registered handlers
    this._methods = new Methods(this);                                  // Server methods

    this._events = new Events.EventEmitter();                           // Server-only events
    this._dependencies = [];                                            // Plugin dependencies
    this._registrations = {};                                           // Tracks plugins registered before connection added
    this._heavy = new Heavy(this._settings.load);
    this._mime = new Mimos(this._settings.mime);
    this._replier = new Reply();
    this._requestor = new Request();
    this._decorations = {};
    this._plugins = {};                                                 // Exposed plugin properties by name
    this._app = {};
    this._registring = false;                                           // true while register() is waiting for plugin callbacks
    this._state = 'stopped';                                            // 'stopped', 'initializing', 'initialized', 'starting', 'started', 'stopping', 'invalid'

    this._extensionsSeq = 0;                                            // Used to keep absolute order of extensions based on the order added across locations
    this._extensions = {
        onPreStart: new Ext(this),
        onPostStart: new Ext(this),
        onPreStop: new Ext(this),
        onPostStop: new Ext(this)
    };

    if (options.cache) {
        this._createCache(options.cache);
    }

    if (!this._caches._default) {
        this._createCache([{ engine: CatboxMemory }]);                  // Defaults to memory-based
    }

    Plugin.call(this, this, [], '', null);
};

Hoek.inherits(internals.Server, Plugin);


internals.Server.prototype._createCache = function (options, _callback) {

    Hoek.assert(this._state !== 'initializing', 'Cannot provision server cache while server is initializing');

    options = Schema.apply('cache', options);

    const added = [];
    for (let i = 0; i < options.length; ++i) {
        let config = options[i];
        if (typeof config === 'function') {
            config = { engine: config };
        }

        const name = config.name || '_default';
        Hoek.assert(!this._caches[name], 'Cannot configure the same cache more than once: ', name === '_default' ? 'default cache' : name);

        let client = null;
        if (typeof config.engine === 'object') {
            client = new Catbox.Client(config.engine);
        }
        else {
            const settings = Hoek.clone(config);
            settings.partition = settings.partition || 'hapi-cache';
            delete settings.name;
            delete settings.engine;
            delete settings.shared;

            client = new Catbox.Client(config.engine, settings);
        }

        this._caches[name] = {
            client: client,
            segments: {},
            shared: config.shared || false
        };

        added.push(client);
    }

    if (!_callback) {
        return;
    }

    // Start cache

    if (['initialized', 'starting', 'started'].indexOf(this._state) !== -1) {
        const each = (client, next) => client.start(next);
        return Items.parallel(added, each, _callback);
    }

    return Hoek.nextTick(_callback)();
};


internals.Server.prototype.connection = function (options) {

    const root = this.root;                                   // Explicitly use the root reference (for plugin invocation)

    let settings = Hoek.applyToDefaultsWithShallow(root._settings.connections, options || {}, ['listener', 'routes.bind']);
    settings.routes.cors = Hoek.applyToDefaults(root._settings.connections.routes.cors || Defaults.cors, settings.routes.cors) || false;
    settings.routes.security = Hoek.applyToDefaults(root._settings.connections.routes.security || Defaults.security, settings.routes.security);

    settings = Schema.apply('connection', settings);       // Applies validation changes (type cast)

    const connection = new Connection(root, settings);
    root.connections.push(connection);
    root.addEmitter(connection);
    root._single();

    const registrations = Object.keys(root._registrations);
    for (let i = 0; i < registrations.length; ++i) {
        const name = registrations[i];
        connection.registrations[name] = root._registrations[name];
    }

    return this._clone([connection]);                       // Use this for active realm
};


internals.Server.prototype.start = function (callback) {

    if (!callback) {
        return Promises.wrap(this, this.start);
    }

    Hoek.assert(typeof callback === 'function', 'Missing required start callback function');

    if (this._state === 'initialized') {
        return this._start(callback);
    }

    if (this._state === 'started') {
        Items.serial(this.connections, (connectionItem, next) => {

            connectionItem._start(next);
        }, callback);

        return;
    }

    if (this._state !== 'stopped') {
        return Hoek.nextTick(callback)(new Error('Cannot start server while it is in ' + this._state + ' state'));
    }

    this.initialize((err) => {

        if (err) {
            return callback(err);
        }

        this._start(callback);
    });
};


internals.Server.prototype.initialize = function (callback) {

    if (!callback) {
        return Promises.wrap(this, this.initialize);
    }

    const nextTickCallback = Hoek.nextTick(callback);
    if (!this.connections.length) {
        return nextTickCallback(new Error('No connections to start'));
    }

    if (this._registring) {
        return nextTickCallback(new Error('Cannot start server before plugins finished registration'));
    }

    if (this._state === 'initialized') {
        return nextTickCallback();
    }

    if (this._state !== 'stopped') {
        return nextTickCallback(new Error('Cannot initialize server while it is in ' + this._state + ' state'));
    }

    // Assert dependencies

    for (let i = 0; i < this._dependencies.length; ++i) {
        const dependency = this._dependencies[i];
        if (dependency.connections) {
            for (let j = 0; j < dependency.connections.length; ++j) {
                const connection = dependency.connections[j];
                for (let k = 0; k < dependency.deps.length; ++k) {
                    const dep = dependency.deps[k];
                    if (!connection.registrations[dep]) {
                        return nextTickCallback(new Error('Plugin ' + dependency.plugin + ' missing dependency ' + dep + ' in connection: ' + connection.info.uri));
                    }
                }
            }
        }
        else {
            for (let j = 0; j < dependency.deps.length; ++j) {
                const dep = dependency.deps[j];
                if (!this._registrations[dep]) {
                    return nextTickCallback(new Error('Plugin ' + dependency.plugin + ' missing dependency ' + dep));
                }
            }
        }
    }

    this._state = 'initializing';

    // Start cache

    const each = (cache, next) => {

        this._caches[cache].client.start(next);
    };

    const caches = Object.keys(this._caches);
    Items.parallel(caches, each, (err) => {

        if (err) {
            this._state = 'invalid';
            return callback(err);
        }

        // After hooks

        this._invoke('onPreStart', (err) => {

            if (err) {
                this._state = 'invalid';
                return callback(err);
            }

            // Load measurements

            this._heavy.start();

            // Listen to connections

            this._state = 'initialized';
            return callback();
        });
    });
};


internals.Server.prototype._start = function (callback) {

    this._state = 'starting';

    const each = (connectionItem, next) => {

        connectionItem._start(next);
    };

    Items.serial(this.connections, each, (err) => {

        if (err) {
            this._state = 'invalid';
            return callback(err);
        }

        this._events.emit('start');
        this._invoke('onPostStart', (err) => {

            if (err) {
                this._state = 'invalid';
                return callback(err);
            }

            this._state = 'started';
            return callback();
        });
    });
};


internals.Server.prototype.stop = function (/* [options], callback */) {

    const args = arguments.length;
    const lastArg = arguments[args - 1];
    const callback = (!args ? null : (typeof lastArg === 'function' ? lastArg : null));
    const options = (!args ? {} : (args === 1 ? (callback ? {} : arguments[0]) : arguments[0]));

    if (!callback) {
        return Promises.wrap(this, this.stop, [options]);
    }

    options.timeout = options.timeout || 5000;                                              // Default timeout to 5 seconds

    if (['stopped', 'initialized', 'started', 'invalid'].indexOf(this._state) === -1) {
        return Hoek.nextTick(callback)(new Error('Cannot stop server while in ' + this._state + ' state'));
    }

    this._state = 'stopping';

    this._invoke('onPreStop', (err) => {

        if (err) {
            this._state = 'invalid';
            return callback(err);
        }

        const each = (connection, next) => {

            connection._stop(options, next);
        };

        Items.serial(this.connections, each, (err) => {

            if (err) {
                this._state = 'invalid';
                return callback(err);
            }

            const caches = Object.keys(this._caches);
            for (let i = 0; i < caches.length; ++i) {
                this._caches[caches[i]].client.stop();
            }

            this._events.emit('stop');
            this._heavy.stop();
            this._invoke('onPostStop', (err) => {

                if (err) {
                    this._state = 'invalid';
                    return callback(err);
                }

                this._state = 'stopped';
                return callback();
            });
        });
    });
};


internals.Server.prototype._invoke = function (type, next) {

    const exts = this._extensions[type];
    if (!exts.nodes) {
        return next();
    }

    Items.serial(exts.nodes, (ext, nextExt) => {

        const bind = (ext.bind || ext.plugin.realm.settings.bind);
        ext.func.call(bind, ext.plugin._select(), nextExt);
    }, next);
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Http = __webpack_require__(21);
const Stream = __webpack_require__(5);
const Zlib = __webpack_require__(51);
const Ammo = __webpack_require__(68);
const Boom = __webpack_require__(2);
const Hoek = __webpack_require__(1);
const Items = __webpack_require__(9);
const Shot = __webpack_require__(34);
const Auth = __webpack_require__(22);
const Cors = __webpack_require__(18);
const Response = __webpack_require__(20);


// Declare internals

const internals = {};


exports.send = function (request, callback) {

    const response = request.response;
    if (response.isBoom) {
        return internals.fail(request, response, callback);
    }

    internals.marshal(request, (err) => {

        if (err) {
            request._setResponse(err);
            return internals.fail(request, err, callback);
        }

        return internals.transmit(response, (err) => {

            if (err) {
                request._setResponse(err);
                return internals.fail(request, err, callback);
            }

            return callback();
        });
    });
};


internals.marshal = function (request, next) {

    const response = request.response;

    Cors.headers(response);
    internals.content(response, false);
    internals.security(response);

    if (response.statusCode !== 304 &&
        (request.method === 'get' || request.method === 'head')) {

        if (response.headers.etag &&
            request.headers['if-none-match']) {

            // Strong verifier

            const ifNoneMatch = request.headers['if-none-match'].split(/\s*,\s*/);
            for (let i = 0; i < ifNoneMatch.length; ++i) {
                const etag = ifNoneMatch[i];
                if (etag === response.headers.etag) {
                    response.code(304);
                    break;
                }
                else if (response.settings.varyEtag) {
                    const etagBase = response.headers.etag.slice(0, -1);
                    if (etag === etagBase + '-gzip"' ||
                        etag === etagBase + '-deflate"') {

                        response.code(304);
                        break;
                    }
                }
            }
        }
        else {
            const ifModifiedSinceHeader = request.headers['if-modified-since'];
            const lastModifiedHeader = response.headers['last-modified'];

            if (ifModifiedSinceHeader &&
                lastModifiedHeader) {

                // Weak verifier

                const ifModifiedSince = internals.parseDate(ifModifiedSinceHeader);
                const lastModified = internals.parseDate(lastModifiedHeader);

                if (ifModifiedSince &&
                    lastModified &&
                    ifModifiedSince >= lastModified) {

                    response.code(304);
                }
            }
        }
    }

    internals.state(response, (err) => {

        if (err) {
            request._log(['state', 'response', 'error'], err);
            request._states = {};                                           // Clear broken state
            return next(err);
        }

        internals.cache(response);

        if (!response._isPayloadSupported()) {

            // Close unused file streams

            response._close();

            // Set empty stream

            response._payload = new internals.Empty();
            if (request.method !== 'head') {
                delete response.headers['content-length'];
            }

            return Auth.response(request, next);               // Must be last in case requires access to headers
        }

        response._marshal((err) => {

            if (err) {
                return next(Boom.wrap(err));
            }

            if (request.jsonp &&
                response._payload.jsonp) {

                response._header('content-type', 'text/javascript' + (response.settings.charset ? '; charset=' + response.settings.charset : ''));
                response._header('x-content-type-options', 'nosniff');
                response._payload.jsonp(request.jsonp);
            }

            if (response._payload.size &&
                typeof response._payload.size === 'function') {

                response._header('content-length', response._payload.size(), { override: false });
            }

            internals.content(response, true);
            return Auth.response(request, next);               // Must be last in case requires access to headers
        });
    });
};


internals.parseDate = function (string) {

    try {
        return Date.parse(string);
    }
    catch (errIgnore) { }
};


internals.fail = function (request, boom, callback) {

    const error = boom.output;
    const response = new Response(error.payload, request);
    response._error = boom;
    response.code(error.statusCode);
    response.headers = error.headers;
    request.response = response;                            // Not using request._setResponse() to avoid double log

    internals.marshal(request, (err) => {

        if (err) {

            // Failed to marshal an error - replace with minimal representation of original error

            const minimal = {
                statusCode: error.statusCode,
                error: Http.STATUS_CODES[error.statusCode],
                message: boom.message
            };

            response._payload = new Response.Payload(JSON.stringify(minimal), {});
        }

        return internals.transmit(response, callback);
    });
};


internals.transmit = function (response, callback) {

    // Setup source

    const request = response.request;
    const source = response._payload;
    const length = parseInt(response.headers['content-length'], 10);      // In case value is a string

    // Empty response

    if (length === 0 &&
        response.statusCode === 200 &&
        request.route.settings.response.emptyStatusCode === 204) {

        response.code(204);
        delete response.headers['content-length'];
    }

    // Compression

    const mime = request.server.mime.type(response.headers['content-type'] || 'application/octet-stream');
    let encoding = (request.connection.settings.compression && mime.compressible && !response.headers['content-encoding'] ? request.info.acceptEncoding : null);
    encoding = (encoding === 'identity' ? null : encoding);

    // Range

    let ranger = null;
    if (request.route.settings.response.ranges &&
        request.method === 'get' &&
        response.statusCode === 200 &&
        length > 0 &&
        !encoding) {

        if (request.headers.range) {

            // Check If-Range

            if (!request.headers['if-range'] ||
                request.headers['if-range'] === response.headers.etag) {            // Ignoring last-modified date (weak)

                // Parse header

                const ranges = Ammo.header(request.headers.range, length);
                if (!ranges) {
                    const error = Boom.rangeNotSatisfiable();
                    error.output.headers['content-range'] = 'bytes */' + length;
                    return internals.fail(request, error, callback);
                }

                // Prepare transform

                if (ranges.length === 1) {                                          // Ignore requests for multiple ranges
                    const range = ranges[0];
                    ranger = new Ammo.Stream(range);
                    response.code(206);
                    response.bytes(range.to - range.from + 1);
                    response._header('content-range', 'bytes ' + range.from + '-' + range.to + '/' + length);
                }
            }
        }

        response._header('accept-ranges', 'bytes');
    }

    // Content-Encoding

    if (request.headers['accept-encoding']) {
        response.vary('accept-encoding');
    }

    let compressor = null;
    if (encoding &&
        length !== 0 &&
        response._isPayloadSupported()) {

        delete response.headers['content-length'];
        response._header('content-encoding', encoding);

        compressor = (encoding === 'gzip' ? Zlib.createGzip() : Zlib.createDeflate());
    }

    if ((response.headers['content-encoding'] || encoding) &&
        response.headers.etag &&
        response.settings.varyEtag) {

        response.headers.etag = response.headers.etag.slice(0, -1) + '-' + (response.headers['content-encoding'] || encoding) + '"';
    }

    // Connection: close

    const isInjection = Shot.isInjection(request.raw.req);
    if (!isInjection && !request.connection._started) {
        response._header('connection', 'close');
    }

    // Write headers

    const error = internals.writeHead(response);
    if (error) {
        return Hoek.nextTick(callback)(error);
    }

    // Write payload

    let hasEnded = false;
    const end = (err, event) => {

        if (hasEnded) {
            return;
        }

        hasEnded = true;

        if (!request.raw.res.finished &&
            event !== 'aborted') {

            request.raw.res.end();
        }

        source.removeListener('error', end);

        request.raw.req.removeListener('aborted', onAborted);
        request.raw.req.removeListener('close', onClose);

        request.raw.res.removeListener('close', onClose);
        request.raw.res.removeListener('error', end);
        request.raw.res.removeListener('finish', end);

        const tags = (err ? ['response', 'error']
                        : (event ? ['response', 'error', event]
                                 : ['response']));

        if (event || err) {
            request.emit('disconnect');
        }

        request._log(tags, err);
        return callback();
    };

    source.once('error', end);

    const onAborted = () => {

        return end(null, 'aborted');
    };

    const onClose = () => {

        return end(null, 'close');
    };

    request.raw.req.once('aborted', onAborted);
    request.raw.req.once('close', onClose);

    request.raw.res.once('close', onClose);
    request.raw.res.once('error', end);
    request.raw.res.once('finish', end);

    const tap = response._tap();
    const preview = (tap ? source.pipe(tap) : source);
    const compressed = (compressor ? preview.pipe(compressor) : preview);
    const ranged = (ranger ? compressed.pipe(ranger) : compressed);
    ranged.pipe(request.raw.res);

    // Injection

    if (isInjection) {
        request.raw.res._hapi = {
            request: request
        };

        if (response.variety === 'plain') {
            request.raw.res._hapi.result = response._isPayloadSupported() ? response.source : null;
        }
    }
};


internals.writeHead = function (response) {

    const res = response.request.raw.res;
    const headers = Object.keys(response.headers);
    let i = 0;

    try {
        for (; i < headers.length; ++i) {
            const header = headers[i];
            const value = response.headers[header];
            if (value !== undefined) {
                res.setHeader(header, value);
            }
        }
    }
    catch (err) {

        for (--i; i >= 0; --i) {
            res.setHeader(headers[i], null);        // Undo headers
        }

        return Boom.wrap(err);
    }

    try {
        res.writeHead(response.statusCode);
    }
    catch (err) {
        return Boom.wrap(err);
    }

    return null;
};


internals.Empty = function () {

    Stream.Readable.call(this);
};

Hoek.inherits(internals.Empty, Stream.Readable);


internals.Empty.prototype._read = function (/* size */) {

    this.push(null);
};


internals.cache = function (response) {

    const request = response.request;

    if (response.headers['cache-control']) {
        return;
    }

    const policy = request.route.settings.cache &&
                   request._route._cache &&
                   (request.route.settings.cache._statuses[response.statusCode] || (response.statusCode === 304 && request.route.settings.cache._statuses['200']));

    if (policy ||
        response.settings.ttl) {

        const ttl = (response.settings.ttl !== null ? response.settings.ttl : request._route._cache.ttl());
        const privacy = (request.auth.isAuthenticated || response.headers['set-cookie'] ? 'private' : request.route.settings.cache.privacy || 'default');
        response._header('cache-control', 'max-age=' + Math.floor(ttl / 1000) + ', must-revalidate' + (privacy !== 'default' ? ', ' + privacy : ''));
    }
    else if (request.route.settings.cache) {
        response._header('cache-control', request.route.settings.cache.otherwise);
    }
};


internals.security = function (response) {

    const request = response.request;

    const security = request.route.settings.security;
    if (security) {
        if (security._hsts) {
            response._header('strict-transport-security', security._hsts, { override: false });
        }

        if (security._xframe) {
            response._header('x-frame-options', security._xframe, { override: false });
        }

        if (security.xss) {
            response._header('x-xss-protection', '1; mode=block', { override: false });
        }

        if (security.noOpen) {
            response._header('x-download-options', 'noopen', { override: false });
        }

        if (security.noSniff) {
            response._header('x-content-type-options', 'nosniff', { override: false });
        }
    }
};


internals.content = function (response, postMarshal) {

    const type = response.headers['content-type'];
    if (!type) {
        if (response._contentType) {
            const charset = (response.settings.charset && response._contentType !== 'application/octet-stream' ? '; charset=' + response.settings.charset : '');
            response.type(response._contentType + charset);
        }
    }
    else if ((!response._contentType || !postMarshal) &&
        response.settings.charset &&
        type.match(/^(?:text\/)|(?:application\/(?:json)|(?:javascript))/)) {

        const hasParams = (type.indexOf(';') !== -1);
        if (!hasParams ||
            !type.match(/[; ]charset=/)) {

            response.type(type + (hasParams ? ', ' : '; ') + 'charset=' + (response.settings.charset));
        }
    }
};


internals.state = function (response, next) {

    const request = response.request;

    const names = {};
    const states = [];

    const requestStates = Object.keys(request._states);
    for (let i = 0; i < requestStates.length; ++i) {
        const stateName = requestStates[i];
        names[stateName] = true;
        states.push(request._states[stateName]);
    }

    const each = (name, nextKey) => {

        const autoValue = request.connection.states.cookies[name].autoValue;
        if (!autoValue || names[name]) {
            return nextKey();
        }

        names[name] = true;

        if (typeof autoValue !== 'function') {
            states.push({ name: name, value: autoValue });
            return nextKey();
        }

        autoValue(request, (err, value) => {

            if (err) {
                return nextKey(err);
            }

            states.push({ name: name, value: value });
            return nextKey();
        });
    };

    const keys = Object.keys(request.connection.states.cookies);
    Items.parallel(keys, each, (err) => {

        if (err) {
            return next(Boom.wrap(err));
        }

        if (!states.length) {
            return next();
        }

        request.connection.states.format(states, (err, header) => {

            if (err) {
                return next(Boom.wrap(err));
            }

            const existing = response.headers['set-cookie'];
            if (existing) {
                header = (Array.isArray(existing) ? existing : [existing]).concat(header);
            }

            response._header('set-cookie', header);
            return next();
        });
    });
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(2);
const Hoek = __webpack_require__(1);
const Joi = __webpack_require__(0);


// Declare internals

const internals = {};


exports.compile = function (rule) {

    // null, undefined, true - anything allowed
    // false - nothing allowed
    // {...} - ... allowed

    return (rule === false ? Joi.object({}).allow(null)
                           : typeof rule === 'function' ? rule
                                                        : !rule || rule === true ? null                     // false tested earlier
                                                                                 : Joi.compile(rule));
};


exports.query = function (request, next) {

    return internals.input('query', request, next);
};


exports.payload = function (request, next) {

    if (request.method === 'get' ||
        request.method === 'head') {                // When route.method is '*'

        return next();
    }

    return internals.input('payload', request, next);
};


exports.params = function (request, next) {

    return internals.input('params', request, next);
};


exports.headers = function (request, next) {

    return internals.input('headers', request, next);
};


internals.input = function (source, request, next) {

    const postValidate = (err, value) => {

        request.orig[source] = request[source];
        if (value !== undefined) {
            request[source] = value;
        }

        if (!err) {
            return next();
        }

        if (err.isDeveloperError) {
            return next(err);
        }

        // failAction: 'error', 'log', 'ignore', function (source, err, next)

        if (request.route.settings.validate.failAction === 'ignore') {
            return next();
        }

        // Prepare error

        const error = (err.isBoom ? err : Boom.badRequest(err.message, err));
        error.output.payload.validation = { source: source, keys: [] };
        if (err.details) {
            for (let i = 0; i < err.details.length; ++i) {
                error.output.payload.validation.keys.push(Hoek.escapeHtml(err.details[i].path));
            }
        }

        if (request.route.settings.validate.errorFields) {
            const fields = Object.keys(request.route.settings.validate.errorFields);
            for (let i = 0; i < fields.length; ++i) {
                const field = fields[i];
                error.output.payload[field] = request.route.settings.validate.errorFields[field];
            }
        }

        request._log(['validation', 'error', source], error);

        // Log only

        if (request.route.settings.validate.failAction === 'log') {
            return next();
        }

        // Return error

        if (typeof request.route.settings.validate.failAction !== 'function') {
            return next(error);
        }

        // Custom handler

        request._protect.run(next, (exit) => {

            const reply = request.server._replier.interface(request, request.route.realm, exit);
            request.route.settings.validate.failAction(request, reply, source, error);
        });
    };

    const localOptions = {
        context: {
            headers: request.headers,
            params: request.params,
            query: request.query,
            payload: request.payload,
            auth: request.auth
        }
    };

    delete localOptions.context[source];
    Hoek.merge(localOptions, request.route.settings.validate.options);

    const schema = request.route.settings.validate[source];
    if (typeof schema !== 'function') {
        return Joi.validate(request[source], schema, localOptions, postValidate);
    }

    request._protect.run(postValidate, (exit) => {

        return schema(request[source], localOptions, exit);
    });
};


exports.response = function (request, next) {

    if (request.route.settings.response.sample) {
        const currentSample = Math.ceil((Math.random() * 100));
        if (currentSample > request.route.settings.response.sample) {
            return next();
        }
    }

    const response = request.response;
    const statusCode = response.isBoom ? response.output.statusCode : response.statusCode;

    const statusSchema = request.route.settings.response.status[statusCode];
    if (statusCode >= 400 &&
        !statusSchema) {

        return next();          // Do not validate errors by default
    }

    const schema = statusSchema || request.route.settings.response.schema;
    if (schema === null) {
        return next();          // No rules
    }

    if (!response.isBoom &&
        request.response.variety !== 'plain') {

        return next(Boom.badImplementation('Cannot validate non-object response'));
    }

    const postValidate = (err, value) => {

        if (!err) {
            if (value !== undefined &&
                request.route.settings.response.modify) {

                if (response.isBoom) {
                    response.output.payload = value;
                }
                else {
                    response.source = value;
                }
            }

            return next();
        }

        // failAction: 'error', 'log'

        if (request.route.settings.response.failAction === 'log') {
            request._log(['validation', 'response', 'error'], err.message);
            return next();
        }

        return next(Boom.badImplementation(err.message));
    };

    const localOptions = {
        context: {
            headers: request.headers,
            params: request.params,
            query: request.query,
            payload: request.payload,
            auth: {
                isAuthenticated: request.auth.isAuthenticated,
                credentials: request.auth.credentials
            }
        }
    };

    const source = response.isBoom ? response.output.payload : response.source;
    Hoek.merge(localOptions, request.route.settings.response.options);

    if (typeof schema !== 'function') {
        return Joi.validate(source, schema, localOptions, postValidate);
    }

    request._protect.run(postValidate, (exit) => {

        return schema(source, localOptions, exit);
    });
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(2);
const Cryptiles = __webpack_require__(32);
const Hoek = __webpack_require__(1);
const Iron = __webpack_require__(77);
const Items = __webpack_require__(9);
const Joi = __webpack_require__(0);
const Querystring = __webpack_require__(50);


// Declare internals

const internals = {};


internals.schema = Joi.object({
    strictHeader: Joi.boolean(),
    ignoreErrors: Joi.boolean(),
    isSecure: Joi.boolean(),
    isHttpOnly: Joi.boolean(),
    isSameSite: Joi.valid('Strict', 'Lax', 'None').allow(false),
    path: Joi.string().allow(null),
    domain: Joi.string().allow(null),
    ttl: Joi.number().allow(null),
    encoding: Joi.string().valid('base64json', 'base64', 'form', 'iron', 'none'),
    sign: Joi.object({
        password: [Joi.string(), Joi.binary(), Joi.object()],
        integrity: Joi.object()
    }),
    iron: Joi.object(),
    password: [Joi.string(), Joi.binary(), Joi.object()],

    // Used by hapi

    clearInvalid: Joi.boolean(),
    autoValue: Joi.any(),
    passThrough: Joi.boolean()
});


internals.defaults = {
    strictHeader: true,                             // Require an RFC 6265 compliant header format
    ignoreErrors: false,
    isSecure: false,
    isHttpOnly: false,
    isSameSite: false,
    path: null,
    domain: null,
    ttl: null,                                      // MSecs, 0 means remove
    encoding: 'none'                                // options: 'base64json', 'base64', 'form', 'iron', 'none'
};


exports.Definitions = internals.Definitions = function (options) {

    this.settings = Hoek.applyToDefaults(internals.defaults, options || {});
    Joi.assert(this.settings, internals.schema, 'Invalid state definition defaults');

    this.cookies = {};
    this.names = [];
};


internals.Definitions.prototype.add = function (name, options) {

    Hoek.assert(name && typeof name === 'string', 'Invalid name');
    Hoek.assert(!this.cookies[name], 'State already defined:', name);

    const settings = Hoek.applyToDefaults(this.settings, options || {}, true);
    Joi.assert(settings, internals.schema, 'Invalid state definition: ' + name);

    this.cookies[name] = settings;
    this.names.push(name);
};


internals.empty = new internals.Definitions();


// Header format

//                      1: name                2: quoted  3: value
internals.parseRx = /\s*([^=\s]*)\s*=\s*(?:(?:"([^\"]*)")|([^\;]*))(?:(?:;\s*)|$)/g;

internals.validateRx = {
    nameRx: {
        strict: /^[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+$/,
        loose: /^[^=\s]*$/
    },
    valueRx: {
        strict: /^[^\x00-\x20\"\,\;\\\x7F]*$/,
        loose: /^(?:"([^\"]*)")|(?:[^\;]*)$/
    },
    domainRx: /^\.?[a-z\d]+(?:(?:[a-z\d]*)|(?:[a-z\d\-]*[a-z\d]))(?:\.[a-z\d]+(?:(?:[a-z\d]*)|(?:[a-z\d\-]*[a-z\d])))*$/,
    domainLabelLenRx: /^\.?[a-z\d\-]{1,63}(?:\.[a-z\d\-]{1,63})*$/,
    pathRx: /^\/[^\x00-\x1F\;]*$/
};

//                      1: name         2: value
internals.pairsRx = /\s*([^=\s]*)\s*=\s*([^\;]*)(?:(?:;\s*)|$)/g;


internals.Definitions.prototype.parse = function (cookies, next) {

    const state = {};
    const names = [];
    const verify = cookies.replace(internals.parseRx, ($0, $1, $2, $3) => {

        const name = $1;
        const value = $2 || $3 || '';

        if (state[name]) {
            if (!Array.isArray(state[name])) {
                state[name] = [state[name]];
            }

            state[name].push(value);
        }
        else {
            state[name] = value;
            names.push(name);
        }

        return '';
    });

    // Validate cookie header syntax

    if (verify !== '') {
        return next(Boom.badRequest('Invalid cookie header'), null, []);
    }

    // Collect errors

    const failed = [];                                                // All errors
    const errored = [];                                               // Unignored errors
    const record = (reason, name, value, definition) => {

        const details = {
            name,
            value,
            settings: definition,
            reason: typeof reason === 'string' ? reason : reason.message
        };

        failed.push(details);
        if (!definition.ignoreErrors) {
            errored.push(details);
        }
    };

    // Parse cookies

    const parsed = {};
    Items.serial(names, (name, nextName) => {

        const value = state[name];
        const definition = this.cookies[name] || this.settings;

        // Validate cookie

        if (definition.strictHeader) {
            if (!name.match(internals.validateRx.nameRx.strict)) {
                record('Invalid cookie name', name, value, definition);
                return nextName();
            }

            const values = [].concat(state[name]);
            for (let i = 0; i < values.length; ++i) {
                if (!values[i].match(internals.validateRx.valueRx.strict)) {
                    record('Invalid cookie value', name, value, definition);
                    return nextName();
                }
            }
        }

        // Check cookie format

        if (definition.encoding === 'none') {
            parsed[name] = value;
            return nextName();
        }

        // Single value

        if (!Array.isArray(value)) {
            internals.unsign(name, value, definition, (err, unsigned) => {

                if (err) {
                    record(err, name, value, definition);
                    return nextName();
                }

                internals.decode(unsigned, definition, (err, result) => {

                    if (err) {
                        record(err, name, value, definition);
                        return nextName();
                    }

                    parsed[name] = result;
                    return nextName();
                });
            });

            return;
        }

        // Array

        const arrayResult = [];
        Items.serial(value, (arrayValue, nextArray) => {

            internals.unsign(name, arrayValue, definition, (err, unsigned) => {

                if (err) {
                    record(err, name, value, definition);
                    return nextName();
                }

                internals.decode(unsigned, definition, (err, result) => {

                    if (err) {
                        record(err, name, value, definition);
                        return nextName();
                    }

                    arrayResult.push(result);
                    nextArray();
                });
            });
        },
        (ignoreErr) => {                // Error not possible

            parsed[name] = arrayResult;
            return nextName();
        });
    },
    (ignoreErr) => {                    // Error not possible

        return next(errored.length ? Boom.badRequest('Invalid cookie value', errored) : null, parsed, failed);
    });
};


internals.macPrefix = 'hapi.signed.cookie.1';


internals.unsign = function (name, value, definition, next) {

    if (!definition.sign) {
        return next(null, value);
    }

    const pos = value.lastIndexOf('.');
    if (pos === -1) {
        return next(Boom.badRequest('Missing signature separator'));
    }

    const unsigned = value.slice(0, pos);
    const sig = value.slice(pos + 1);

    if (!sig) {
        return next(Boom.badRequest('Missing signature'));
    }

    const sigParts = sig.split('*');
    if (sigParts.length !== 2) {
        return next(Boom.badRequest('Invalid signature format'));
    }

    const hmacSalt = sigParts[0];
    const hmac = sigParts[1];

    const macOptions = Hoek.clone(definition.sign.integrity || Iron.defaults.integrity);
    macOptions.salt = hmacSalt;
    Iron.hmacWithPassword(definition.sign.password, macOptions, [internals.macPrefix, name, unsigned].join('\n'), (err, mac) => {

        if (err) {
            return next(err);
        }

        if (!Cryptiles.fixedTimeComparison(mac.digest, hmac)) {
            return next(Boom.badRequest('Invalid hmac value'));
        }

        return next(null, unsigned);
    });
};


internals.decode = function (value, definition, next) {

    if (!value &&
        definition.encoding === 'form') {

        return next(null, {});
    }

    Hoek.assert(typeof value === 'string', 'Invalid string');

    // Encodings: 'base64json', 'base64', 'form', 'iron', 'none'

    if (definition.encoding === 'iron') {
        Iron.unseal(value, definition.password, definition.iron || Iron.defaults, (err, unsealed) => {

            if (err) {
                return next(err);
            }

            return next(null, unsealed);
        });

        return;
    }

    let result = value;

    try {
        if (definition.encoding === 'base64json') {
            const decoded = (new Buffer(value, 'base64')).toString('binary');
            result = JSON.parse(decoded);
        }
        else if (definition.encoding === 'base64') {
            result = (new Buffer(value, 'base64')).toString('binary');
        }
        else {                                                                  // encoding: 'form'
            result = Querystring.parse(value);
        }
    }
    catch (err) {
        return next(err);
    }

    return next(null, result);
};


internals.Definitions.prototype.format = function (cookies, callback) {

    if (!cookies ||
        (Array.isArray(cookies) && !cookies.length)) {

        return Hoek.nextTick(callback)(null, []);
    }

    if (!Array.isArray(cookies)) {
        cookies = [cookies];
    }

    const header = [];
    Items.serial(cookies, (cookie, next) => {

        // Apply definition to local configuration

        const base = this.cookies[cookie.name] || this.settings;
        const definition = cookie.options ? Hoek.applyToDefaults(base, cookie.options, true) : base;

        // Validate name

        const nameRx = (definition.strictHeader ? internals.validateRx.nameRx.strict : internals.validateRx.nameRx.loose);
        if (!nameRx.test(cookie.name)) {
            return callback(Boom.badImplementation('Invalid cookie name: ' + cookie.name));
        }

        // Prepare value (encode, sign)

        exports.prepareValue(cookie.name, cookie.value, definition, (err, value) => {

            if (err) {
                return callback(err);
            }

            // Validate prepared value

            const valueRx = (definition.strictHeader ? internals.validateRx.valueRx.strict : internals.validateRx.valueRx.loose);
            if (value &&
                (typeof value !== 'string' || !value.match(valueRx))) {

                return callback(Boom.badImplementation('Invalid cookie value: ' + cookie.value));
            }

            // Construct cookie

            let segment = cookie.name + '=' + (value || '');

            if (definition.ttl !== null &&
                definition.ttl !== undefined) {            // Can be zero

                const expires = new Date(definition.ttl ? Date.now() + definition.ttl : 0);
                segment = segment + '; Max-Age=' + Math.floor(definition.ttl / 1000) + '; Expires=' + expires.toUTCString();
            }

            if (definition.isSecure) {
                segment = segment + '; Secure';
            }

            if (definition.isHttpOnly) {
                segment = segment + '; HttpOnly';
            }

            if (definition.isSameSite) {
                segment = segment + `; SameSite=${definition.isSameSite}`;
            }

            if (definition.domain) {
                const domain = definition.domain.toLowerCase();
                if (!domain.match(internals.validateRx.domainLabelLenRx)) {
                    return callback(Boom.badImplementation('Cookie domain too long: ' + definition.domain));
                }

                if (!domain.match(internals.validateRx.domainRx)) {
                    return callback(Boom.badImplementation('Invalid cookie domain: ' + definition.domain));
                }

                segment = segment + '; Domain=' + domain;
            }

            if (definition.path) {
                if (!definition.path.match(internals.validateRx.pathRx)) {
                    return callback(Boom.badImplementation('Invalid cookie path: ' + definition.path));
                }

                segment = segment + '; Path=' + definition.path;
            }

            header.push(segment);
            return next();
        });
    },
    (ignoreErr) => {                // Error not possible

        return callback(null, header);
    });
};


exports.prepareValue = function (name, value, options, callback) {

    Hoek.assert(options && typeof options === 'object', 'Missing or invalid options');

    // Encode value

    internals.encode(value, options, (err, encoded) => {

        if (err) {
            return callback(Boom.badImplementation('Failed to encode cookie (' + name + ') value: ' + err.message));
        }

        // Sign cookie

        internals.sign(name, encoded, options.sign, (err, signed) => {

            if (err) {
                return callback(Boom.badImplementation('Failed to sign cookie (' + name + ') value: ' + err.message));
            }

            return callback(null, signed);
        });
    });
};


internals.encode = function (value, options, callback) {

    callback = Hoek.nextTick(callback);

    // Encodings: 'base64json', 'base64', 'form', 'iron', 'none'

    if (value === undefined) {
        return callback(null, value);
    }

    if (options.encoding === 'none') {
        return callback(null, value);
    }

    if (options.encoding === 'iron') {
        Iron.seal(value, options.password, options.iron || Iron.defaults, (err, sealed) => {

            if (err) {
                return callback(err);
            }

            return callback(null, sealed);
        });

        return;
    }

    let result = value;

    try {
        if (options.encoding === 'base64') {
            result = (new Buffer(value, 'binary')).toString('base64');
        }
        else if (options.encoding === 'base64json') {
            const stringified = JSON.stringify(value);
            result = (new Buffer(stringified, 'binary')).toString('base64');
        }
        else {                                                                  // encoding: 'form'
            result = Querystring.stringify(value);
        }
    }
    catch (err) {
        return callback(err);
    }

    return callback(null, result);
};


internals.sign = function (name, value, options, callback) {

    if (value === undefined ||
        !options) {

        return Hoek.nextTick(callback)(null, value);
    }

    Iron.hmacWithPassword(options.password, options.integrity || Iron.defaults.integrity, [internals.macPrefix, name, value].join('\n'), (err, mac) => {

        if (err) {
            return callback(err);
        }

        const signed = value + '.' + mac.salt + '*' + mac.digest;
        return callback(null, signed);
    });
};


internals.Definitions.prototype.passThrough = function (header, fallback) {

    if (!this.names.length) {
        return header;
    }

    const exclude = [];
    for (let i = 0; i < this.names.length; ++i) {
        const name = this.names[i];
        const definition = this.cookies[name];
        const passCookie = definition.passThrough !== undefined ? definition.passThrough : fallback;
        if (!passCookie) {
            exclude.push(name);
        }
    }

    return exports.exclude(header, exclude);
};


exports.exclude = function (cookies, excludes) {

    let result = '';
    const verify = cookies.replace(internals.pairsRx, ($0, $1, $2) => {

        if (excludes.indexOf($1) === -1) {
            result = result + (result ? ';' : '') + $1 + '=' + $2;
        }

        return '';
    });

    return verify === '' ? result : Boom.badRequest('Invalid cookie header');
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};


// From https://tools.ietf.org/html/rfc7231#section-5.3.3
// Accept-Charset: iso-8859-5, unicode-1-1;q=0.8

exports.charset = function (header, preferences) {

    Hoek.assert(!preferences || Array.isArray(preferences), 'Preferences must be an array');
    const charsets = header
        .split(',')
        .map(internals.getParts)
        .filter(internals.removeEmpty)
        .sort(internals.compareByWeight);

    // Tack on a default return

    charsets.push({
        weight: 0.001,
        charset: ''
    });

    // No preferences.  Take the first non-disallowed charset

    if (!preferences || preferences.length === 0) {
        return charsets.filter(internals.removeDisallowed)[0].charset;
    }

    // Lower case all preferences

    preferences = preferences.map(internals.lowerCase);

    // Remove any disallowed preferences

    internals.removeDisallowedPreferences(charsets, preferences);

    // If charsets includes * (that isn't disallowed *;q=0) return first preference

    const splatLocation = internals.findCharsetItem(charsets, '*');
    if (splatLocation !== -1 && charsets[splatLocation].weight > 0) {
        return preferences[0];
    }

    // Try to find the first match in the array of preferences, ignoring case

    for (let i = 0; i < charsets.length; ++i) {
        if (preferences.indexOf(charsets[i].charset.toLowerCase()) !== -1 && charsets[i].weight > 0) {
            return charsets[i].charset;
        }
    }

    return '';
};


exports.charsets = function (header) {

    if (header === undefined || typeof header !== 'string') {
        return [];
    }

    header = header.toLowerCase();

    return header
        .split(',')
        .map(internals.getParts)
        .filter(internals.removeEmptyAndDisallowed)
        .sort(internals.compareByWeight)
        .map(internals.partToCharset);
};


internals.getParts = function (item) {

    const result = {
        weight: 1,
        charset: ''
    };

    const match = item.match(internals.partsRegex);
    if (!match) {
        return result;
    }

    result.charset = match[1];
    if (match[2] && internals.isNumber(match[2])) {
        const weight = parseFloat(match[2]);
        if (weight === 0 || (weight >= 0.001 && weight <= 1)) {
            result.weight = weight;
        }
    }
    return result;
};

//                         1: token               2: qvalue
internals.partsRegex = /\s*([^;]+)(?:\s*;\s*[qQ]\=([01](?:\.\d*)?))?\s*/;


internals.removeEmpty = function (item) {

    return item.charset !== '';
};


internals.removeDisallowed = function (item) {

    return item.weight !== 0;
};


internals.removeEmptyAndDisallowed = function (item) {

    return item.charset !== '' && item.weight !== 0;
};


internals.removeDisallowedPreferences = function (charsets, preferences) {

    for (let i = 0; i < charsets.length; ++i) {
        let location;
        if (charsets[i].weight === 0) {
            location = preferences.indexOf(charsets[i].charset.toLowerCase());
            if (location !== -1) {
                preferences.splice(location, 1);
            }
        }
    }
};


internals.compareByWeight = function (a, b) {

    return a.weight < b.weight;
};


internals.partToCharset = function (item) {

    return item.charset;
};


internals.isNumber = function (n) {

    return !isNaN(parseFloat(n));
};


internals.lowerCase = function (str) {

    return str.toLowerCase();
};


internals.findCharsetItem = function (charsets, charset) {

    for (let i = 0; i < charsets.length; ++i) {
        if (charsets[i].charset === charset) {
            return i;
        }
    }

    return -1;
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(2);
const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};

/*
    RFC 7231 Section 5.3.4 (https://tools.ietf.org/html/rfc7231#section-5.3.4)

    Accept-Encoding  = #( codings [ weight ] )
    codings          = content-coding / "identity" / "*"

    Accept-Encoding: compress, gzip
    Accept-Encoding:
    Accept-Encoding: *
    Accept-Encoding: compress;q=0.5, gzip;q=1.0
    Accept-Encoding: gzip;q=1.0, identity; q=0.5, *;q=0
*/

exports.encoding = function (header, preferences) {

    const encodings = exports.encodings(header, preferences);
    if (encodings.isBoom) {
        return encodings;
    }

    return encodings.length ? encodings[0] : '';
};


exports.encodings = function (header, preferences) {

    Hoek.assert(!preferences || Array.isArray(preferences), 'Preferences must be an array');

    const scores = internals.parse(header, 'encoding');
    if (scores.isBoom) {
        return scores;
    }

    if (!preferences) {
        preferences = Object.keys(scores.accept);
        preferences.push('*');
    }

    return internals.map(preferences, scores);
};


/*
    RFC 7231 Section 5.3.1 (https://tools.ietf.org/html/rfc7231#section-5.3.1)

   The weight is normalized to a real number in the range 0 through 1,
   where 0.001 is the least preferred and 1 is the most preferred; a
   value of 0 means "not acceptable".  If no "q" parameter is present,
   the default weight is 1.

     weight = OWS ";" OWS "q=" qvalue
     qvalue = ( "0" [ "." 0*3DIGIT ] ) / ( "1" [ "." 0*3("0") ] )
*/

//                              1: token               2: qvalue
internals.preferenceRegex = /\s*([^;\,]+)(?:\s*;\s*[qQ]\=([01](?:\.\d{0,3})?))?\s*(?:\,|$)/g;


internals.equivalents = {
    encoding: {
        'x-compress': 'compress',
        'x-gzip': 'gzip'
    }
};

internals.parse = function (header, type) {

    const scores = {
        accept: {},
        reject: {},
        any: 0.0
    };

    if (header) {
        const leftovers = header.replace(internals.preferenceRegex, ($0, $1, $2) => {

            $1 = $1.toLowerCase();
            const key = internals.equivalents[type][$1] || $1;
            const score = $2 ? parseFloat($2) : 1.0;
            if (key === '*') {
                scores.any = score;
            }
            else if (score > 0) {
                scores.accept[key] = score;
            }
            else {
                scores.reject[key] = true;
            }

            return '';
        });

        if (leftovers) {
            return Boom.badRequest('Invalid accept-' + type + ' header');
        }
    }

    // Add identity at the lowest score if not explicitly set

    if (!scores.reject.identity &&
        !scores.accept.identity) {

        scores.accept.identity = scores.any || 0.001;
    }

    return scores;
};


internals.map = function (preferences, scores) {

    const scored = [];
    for (let i = 0; i < preferences.length; ++i) {
        const key = preferences[i].toLowerCase();
        if (!scores.reject[key]) {
            const score = scores.accept[key] || scores.any;
            if (score > 0) {
                scored.push({ key: key, score: score });
            }
        }
    }

    scored.sort(internals.sort);

    const result = [];
    for (let i = 0; i < scored.length; ++i) {
        result.push(scored[i].key);
    }

    return result;
};


internals.sort = function (a, b) {

    return (a.score === b.score ? 0 : (a.score < b.score ? 1 : -1));
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Charset = __webpack_require__(63);
const Encoding = __webpack_require__(64);
const Language = __webpack_require__(66);
const MediaType = __webpack_require__(67);

exports.charset = Charset.charset;
exports.charsets = Charset.charsets;

exports.encoding = Encoding.encoding;
exports.encodings = Encoding.encodings;

exports.language = Language.language;
exports.languages = Language.languages;

exports.mediaTypes = MediaType.mediaTypes;

exports.parseAll = function (requestHeaders) {

    return {
        charsets: Charset.charsets(requestHeaders['accept-charset']),
        encodings: Encoding.encodings(requestHeaders['accept-encoding']),
        languages: Language.languages(requestHeaders['accept-language']),
        mediaTypes: MediaType.mediaTypes(requestHeaders.accept)
    };
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};


// https://tools.ietf.org/html/rfc7231#section-5.3.5
// Accept-Language: da, en-gb;q=0.8, en;q=0.7


exports.language = function (header, preferences) {

    Hoek.assert(!preferences || Array.isArray(preferences), 'Preferences must be an array');
    const languages = exports.languages(header);

    if (languages.length === 0) {
        languages.push('');
    }

    // No preferences.  Take the first charset.

    if (!preferences || preferences.length === 0) {
        return languages[0];
    }

    // If languages includes * return first preference

    if (languages.indexOf('*') !== -1) {
        return preferences[0];
    }

    // Try to find the first match in the array of preferences

    preferences = preferences.map((str) => str.toLowerCase());

    for (let i = 0; i < languages.length; ++i) {
        if (preferences.indexOf(languages[i].toLowerCase()) !== -1) {
            return languages[i];
        }
    }

    return '';
};


exports.languages = function (header) {

    if (header === undefined || typeof header !== 'string') {
        return [];
    }

    return header
        .split(',')
        .map(internals.getParts)
        .filter(internals.removeUnwanted)
        .sort(internals.compareByWeight)
        .map(internals.partToLanguage);
};


internals.getParts = function (item) {

    const result = {
        weight: 1,
        language: ''
    };

    const match = item.match(internals.partsRegex);

    if (!match) {
        return result;
    }

    result.language = match[1];
    if (match[2] && internals.isNumber(match[2])) {
        const weight = parseFloat(match[2]);
        if (weight === 0 || (weight >= 0.001 && weight <= 1)) {
            result.weight = weight;
        }
    }
    return result;
};


//                         1: token               2: qvalue
internals.partsRegex = /\s*([^;]+)(?:\s*;\s*[qQ]\=([01](?:\.\d*)?))?\s*/;


internals.removeUnwanted = function (item) {

    return item.weight !== 0 && item.language !== '';
};


internals.compareByWeight = function (a, b) {

    return a.weight < b.weight;
};


internals.partToLanguage = function (item) {

    return item.language;
};


internals.isNumber = function (n) {

    return !isNaN(parseFloat(n));
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Declare internals

const internals = {};

// Accept: audio/*; q=0.2, audio/basic
// text/plain; q=0.5, text/html, text/x-dvi; q=0.8, text/x-c
// text/plain, application/json;q=0.5, text/html, */*;q=0.1
// text/plain, application/json;q=0.5, text/html, text/drop;q=0
// text/*, text/plain, text/plain;format=flowed, */*
// text/*;q=0.3, text/html;q=0.7, text/html;level=1, text/html;level=2;q=0.4, */*;q=0.5

exports.mediaTypes = function (header) {

    if (header === undefined || typeof header !== 'string') {
        return ['*/*'];
    }

    return header
        .split(',')
        .map(internals.getParts)
        .filter(internals.removeEmptyAndDisallowed)
        .sort(internals.compareByWeightAndSpecificity)
        .map(internals.partToMediaType);
};


internals.getParts = function (item) {

    const result = {
        weight: 1,
        mediaType: ''
    };

    const match = item.match(internals.partsRegex);

    if (!match) {
        return result;
    }

    result.mediaType = match[1];
    if (match[2] && internals.isNumber(match[2])) {
        const weight = parseFloat(match[2]);
        if (weight === 0 || (weight >= 0.001 && weight <= 1)) {
            result.weight = weight;
        }
    }
    return result;
};

//                         1: token              2: qvalue
internals.partsRegex = /\s*(.+\/.+?)(?:\s*;\s*[qQ]\=([01](?:\.\d*)?))?\s*$/;

internals.removeEmptyAndDisallowed = function (item) {

    return item.mediaType !== '' && item.weight !== 0;
};

internals.compareByWeightAndSpecificity = function (a, b) {

    if (a.weight !== b.weight) {
        return a.weight < b.weight;
    }

    // We have the same weight, so now look for specificity
    const aSlashParts = a.mediaType.split('/');
    const bSlashParts = b.mediaType.split('/');

    if (aSlashParts[0] !== bSlashParts[0]) {
        // First part of items are different so no
        // further specificity is implied.
        // Don't change order.
        return 0;
    }

    if (aSlashParts[1] !== '*' && bSlashParts[1] === '*') {
        return -1;
    }
    if (aSlashParts[1] === '*' && bSlashParts[1] !== '*') {
        return 1;
    }

    // look for items with extensions
    const aHasExtension = aSlashParts[1].indexOf(';') !== -1;
    const bHasExtension = bSlashParts[1].indexOf(';') !== -1;
    if (aHasExtension) {
        return -1;
    }
    else if (bHasExtension) {
        return 1;
    }

    return 0;
};

internals.partToMediaType = function (item) {

    return item.mediaType;
};

internals.isNumber = function (n) {

    return !isNaN(parseFloat(n));
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Stream = __webpack_require__(5);
const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};


exports.header = function (header, length) {

    // Parse header

    const parts = header.split('=');
    if (parts.length !== 2 ||
        parts[0] !== 'bytes') {

        return null;
    }

    const lastPos = length - 1;

    const result = [];
    const ranges = parts[1].match(/\d*\-\d*/g);
    for (let i = 0; i < ranges.length; ++i) {
        let range = ranges[i];
        if (range.length === 1) {               // '-'
            return null;
        }

        const set = {};
        range = range.split('-');
        if (range[0]) {
            set.from = parseInt(range[0], 10);
        }

        if (range[1]) {
            set.to = parseInt(range[1], 10);
            if (set.from !== undefined) {      // Can be 0
                // From-To
                if (set.to > lastPos) {
                    set.to = lastPos;
                }
            }
            else {
                // -To
                set.from = length - set.to;
                set.to = lastPos;
            }
        }
        else {
            // From-
            set.to = lastPos;
        }

        if (set.from > set.to) {
            return null;
        }

        result.push(set);
    }

    if (result.length === 1) {
        return result;
    }

    // Sort and consolidate ranges

    result.sort((a, b) => a.from - b.from);

    const consolidated = [];
    for (let i = result.length - 1; i > 0; --i) {
        const current = result[i];
        const before = result[i - 1];
        if (current.from <= before.to + 1) {
            before.to = current.to;
        }
        else {
            consolidated.unshift(current);
        }
    }

    consolidated.unshift(result[0]);

    return consolidated;
};


exports.Stream = internals.Stream = function (range) {

    Stream.Transform.call(this);

    this._range = range;
    this._next = 0;
};

Hoek.inherits(internals.Stream, Stream.Transform);


internals.Stream.prototype._transform = function (chunk, encoding, done) {

    const pos = this._next;
    this._next = this._next + chunk.length;

    if (this._next <= this._range.from ||       // Before range
        pos > this._range.to) {                 // After range

        return done();
    }

    const from = Math.max(0, this._range.from - pos);
    const to = Math.min(chunk.length, this._range.to - pos + 1);

    this.push(chunk.slice(from, to));
    return done();
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);
const Boom = __webpack_require__(2);
const Regex = __webpack_require__(70);
const Segment = __webpack_require__(71);


// Declare internals

const internals = {
    pathRegex: Regex.generate(),
    defaults: {
        isCaseSensitive: true
    }
};


exports.Router = internals.Router = function (options) {

    this.settings = Hoek.applyToDefaults(internals.defaults, options || {});

    this.routes = {};                               // Key: HTTP method or * for catch-all, value: sorted array of routes
    this.ids = {};                                  // Key: route id, value: record
    this.vhosts = null;                             // {} where Key: hostname, value: see this.routes

    this.specials = {
        badRequest: null,
        notFound: null,
        options: null
    };
};


internals.Router.prototype.add = function (config, route) {

    const method = config.method.toLowerCase();

    const vhost = config.vhost || '*';
    if (vhost !== '*') {
        this.vhosts = this.vhosts || {};
        this.vhosts[vhost] = this.vhosts[vhost] || {};
    }

    const table = (vhost === '*' ? this.routes : this.vhosts[vhost]);
    table[method] = table[method] || { routes: [], router: new Segment() };

    const analysis = config.analysis || this.analyze(config.path);
    const record = {
        path: config.path,
        route: route || config.path,
        segments: analysis.segments,
        params: analysis.params,
        fingerprint: analysis.fingerprint,
        settings: this.settings
    };

    // Add route

    table[method].router.add(analysis.segments, record);
    table[method].routes.push(record);
    table[method].routes.sort(internals.sort);

    const last = record.segments[record.segments.length - 1];
    if (last.empty) {
        table[method].router.add(analysis.segments.slice(0, -1), record);
    }

    if (config.id) {
        Hoek.assert(!this.ids[config.id], 'Route id', config.id, 'for path', config.path, 'conflicts with existing path', this.ids[config.id] && this.ids[config.id].path);
        this.ids[config.id] = record;
    }

    return record;
};


internals.Router.prototype.special = function (type, route) {

    Hoek.assert(Object.keys(this.specials).indexOf(type) !== -1, 'Unknown special route type:', type);

    this.specials[type] = { route: route };
};


internals.Router.prototype.route = function (method, path, hostname) {

    const segments = path.split('/').slice(1);

    const vhost = (this.vhosts && hostname && this.vhosts[hostname]);
    const route = (vhost && this._lookup(path, segments, vhost, method)) ||
                this._lookup(path, segments, this.routes, method) ||
                (method === 'head' && vhost && this._lookup(path, segments, vhost, 'get')) ||
                (method === 'head' && this._lookup(path, segments, this.routes, 'get')) ||
                (method === 'options' && this.specials.options) ||
                (vhost && this._lookup(path, segments, vhost, '*')) ||
                this._lookup(path, segments, this.routes, '*') ||
                this.specials.notFound || Boom.notFound();

    return route;
};


internals.Router.prototype._lookup = function (path, segments, table, method) {

    const set = table[method];
    if (!set) {
        return null;
    }

    const match = set.router.lookup(path, segments, this.settings);
    if (!match) {
        return null;
    }

    const assignments = {};
    const array = [];
    for (let i = 0; i < match.array.length; ++i) {
        const name = match.record.params[i];
        let value = match.array[i];
        if (value) {
            value = internals.decode(value);
            if (value.isBoom) {
                return this.specials.badRequest || value;
            }

            if (assignments[name] !== undefined) {
                assignments[name] = assignments[name] + '/' + value;
            }
            else {
                assignments[name] = value;
            }

            if (i + 1 === match.array.length ||
                name !== match.record.params[i + 1]) {

                array.push(assignments[name]);
            }
        }
    }

    return { params: assignments, paramsArray: array, route: match.record.route };
};


internals.decode = function (value) {

    try {
        return decodeURIComponent(value);
    }
    catch (err) {
        return Boom.badRequest('Invalid request path');
    }
};


internals.Router.prototype.normalize = function (path) {

    if (path &&
        path.indexOf('%') !== -1) {

        // Uppercase %encoded values

        const uppercase = path.replace(/%[0-9a-fA-F][0-9a-fA-F]/g, (encoded) => encoded.toUpperCase());

        // Decode non-reserved path characters: a-z A-Z 0-9 _!$&'()*+,;=:@-.~
        // ! (%21) $ (%24) & (%26) ' (%27) ( (%28) ) (%29) * (%2A) + (%2B) , (%2C) - (%2D) . (%2E)
        // 0-9 (%30-39) : (%3A) ; (%3B) = (%3D)
        // @ (%40) A-Z (%41-5A) _ (%5F) a-z (%61-7A) ~ (%7E)

        const decoded = uppercase.replace(/%(?:2[146-9A-E]|3[\dABD]|4[\dA-F]|5[\dAF]|6[1-9A-F]|7[\dAE])/g, (encoded) => String.fromCharCode(parseInt(encoded.substring(1), 16)));

        path = decoded;
    }

    return path;
};


internals.Router.prototype.analyze = function (path) {

    Hoek.assert(internals.pathRegex.validatePath.test(path), 'Invalid path:', path);
    Hoek.assert(!internals.pathRegex.validatePathEncoded.test(path), 'Path cannot contain encoded non-reserved path characters:', path);

    const pathParts = path.split('/');
    const segments = [];
    const params = [];
    const fingers = [];

    for (let i = 1; i < pathParts.length; ++i) {                            // Skip first empty segment
        let segment = pathParts[i];

        // Literal

        if (segment.indexOf('{') === -1) {
            segment = this.settings.isCaseSensitive ? segment : segment.toLowerCase();
            fingers.push(segment);
            segments.push({ literal: segment });
            continue;
        }

        // Parameter

        const parts = internals.parseParams(segment);
        if (parts.length === 1) {

            // Simple parameter

            const item = parts[0];
            Hoek.assert(params.indexOf(item.name) === -1, 'Cannot repeat the same parameter name:', item.name, 'in:', path);
            params.push(item.name);

            if (item.wilcard) {
                if (item.count) {
                    for (let j = 0; j < item.count; ++j) {
                        fingers.push('?');
                        segments.push({});
                        if (j) {
                            params.push(item.name);
                        }
                    }
                }
                else {
                    fingers.push('#');
                    segments.push({ wildcard: true });
                }
            }
            else {
                fingers.push('?');
                segments.push({ empty: item.empty });
            }
        }
        else {

            // Mixed parameter

            const seg = {
                length: parts.length,
                first: typeof parts[0] !== 'string',
                segments: []
            };

            let finger = '';
            let regex = '^';
            for (let j = 0; j < parts.length; ++j) {
                const part = parts[j];
                if (typeof part === 'string') {
                    finger = finger + part;
                    regex = regex + Hoek.escapeRegex(part);
                    seg.segments.push(part);
                }
                else {
                    Hoek.assert(params.indexOf(part.name) === -1, 'Cannot repeat the same parameter name:', part.name, 'in:', path);
                    params.push(part.name);

                    finger = finger + '?';
                    regex = regex + '(.' + (part.empty ? '*' : '+') + ')';
                }
            }

            seg.mixed = new RegExp(regex + '$', (!this.settings.isCaseSensitive ? 'i' : ''));
            fingers.push(finger);
            segments.push(seg);
        }
    }

    return {
        segments: segments,
        fingerprint: '/' + fingers.join('/'),
        params: params
    };
};


internals.parseParams = function (segment) {

    const parts = [];
    segment.replace(internals.pathRegex.parseParam, (match, literal, name, wilcard, count, empty) => {

        if (literal) {
            parts.push(literal);
        }
        else {
            parts.push({
                name: name,
                wilcard: !!wilcard,
                count: count && parseInt(count, 10),
                empty: !!empty
            });
        }

        return '';
    });

    return parts;
};


internals.Router.prototype.table = function (host) {

    const result = [];
    const collect = (table) => {

        if (!table) {
            return;
        }

        Object.keys(table).forEach((method) => {

            table[method].routes.forEach((record) => {

                result.push(record.route);
            });
        });
    };

    if (this.vhosts) {
        const vhosts = host ? [].concat(host) : Object.keys(this.vhosts);
        for (let i = 0; i < vhosts.length; ++i) {
            collect(this.vhosts[vhosts[i]]);
        }
    }

    collect(this.routes);

    return result;
};


internals.sort = function (a, b) {

    const aFirst = -1;
    const bFirst = 1;

    const as = a.segments;
    const bs = b.segments;

    if (as.length !== bs.length) {
        return (as.length > bs.length ? bFirst : aFirst);
    }

    for (let i = 0; ; ++i) {
        if (as[i].literal) {
            if (bs[i].literal) {
                if (as[i].literal === bs[i].literal) {
                    continue;
                }

                return (as[i].literal > bs[i].literal ? bFirst : aFirst);
            }
            return aFirst;
        }
        else if (bs[i].literal) {
            return bFirst;
        }

        return (as[i].wildcard ? bFirst : aFirst);
    }
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules


// Declare internals

const internals = {};


exports.generate = function () {

    /*
        /path/{param}/path/{param?}
        /path/{param*2}/path
        /path/{param*2}
        /path/x{param}x
        /{param*}
    */

    const empty = '(?:^\\/$)';

    const legalChars = '[\\w\\!\\$&\'\\(\\)\\*\\+\\,;\\=\\:@\\-\\.~]';
    const encoded = '%[A-F0-9]{2}';

    const literalChar = '(?:' + legalChars + '|' + encoded + ')';
    const literal = literalChar + '+';
    const literalOptional = literalChar + '*';

    const midParam = '(?:\\{\\w+(?:\\*[1-9]\\d*)?\\})';                               // {p}, {p*2}
    const endParam = '(?:\\/(?:\\{\\w+(?:(?:\\*(?:[1-9]\\d*)?)|(?:\\?))?\\})?)?';     // {p}, {p*2}, {p*}, {p?}

    const partialParam = '(?:\\{\\w+\\??\\})';                                        // {p}, {p?}
    const mixedParam = '(?:(?:' + literal + partialParam + ')+' + literalOptional + ')|(?:' + partialParam + '(?:' + literal + partialParam + ')+' + literalOptional + ')|(?:' + partialParam + literal + ')';

    const segmentContent = '(?:' + literal + '|' + midParam + '|' + mixedParam + ')';
    const segment = '\\/' + segmentContent;
    const segments = '(?:' + segment + ')*';

    const path = '(?:^' + segments + endParam + '$)';

    //                1:literal               2:name   3:*  4:count  5:?
    const parseParam = '(' + literal + ')|(?:\\{(\\w+)(?:(\\*)(\\d+)?)?(\\?)?\\})';

    const expressions = {
        parseParam: new RegExp(parseParam, 'g'),
        validatePath: new RegExp(empty + '|' + path),
        validatePathEncoded: /%(?:2[146-9A-E]|3[\dABD]|4[\dA-F]|5[\dAF]|6[1-9A-F]|7[\dAE])/g
    };

    return expressions;
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};


exports = module.exports = internals.Segment = function () {

    this._edge = null;              // { segment, record }
    this._fulls = null;             // { path: { segment, record }
    this._literals = null;          // { literal: { segment, <node> } }
    this._param = null;             // <node>
    this._mixed = null;             // [{ segment, <node> }]
    this._wildcard = null;          // { segment, record }
};


internals.Segment.prototype.add = function (segments, record) {

    /*
        { literal: 'x' }        -> x
        { empty: false }        -> {p}
        { wildcard: true }      -> {p*}
        { mixed: /regex/ }      -> a{p}b
    */

    const current = segments[0];
    const remaining = segments.slice(1);
    const isEdge = !remaining.length;

    const literals = [];
    let isLiteral = true;
    for (let i = 0; i < segments.length && isLiteral; ++i) {
        isLiteral = segments[i].literal !== undefined;
        literals.push(segments[i].literal);
    }

    if (isLiteral) {
        this._fulls = this._fulls || {};
        let literal = '/' + literals.join('/');
        if (!record.settings.isCaseSensitive) {
            literal = literal.toLowerCase();
        }

        Hoek.assert(!this._fulls[literal], 'New route', record.path, 'conflicts with existing', this._fulls[literal] && this._fulls[literal].record.path);
        this._fulls[literal] = { segment: current, record: record };
    }
    else if (current.literal !== undefined) {               // Can be empty string

        // Literal

        this._literals = this._literals || {};
        const currentLiteral = (record.settings.isCaseSensitive ? current.literal : current.literal.toLowerCase());
        this._literals[currentLiteral] = this._literals[currentLiteral] || new internals.Segment();
        this._literals[currentLiteral].add(remaining, record);
    }
    else if (current.wildcard) {

        // Wildcard

        Hoek.assert(!this._wildcard, 'New route', record.path, 'conflicts with existing', this._wildcard && this._wildcard.record.path);
        Hoek.assert(!this._param || !this._param._wildcard, 'New route', record.path, 'conflicts with existing', this._param && this._param._wildcard && this._param._wildcard.record.path);
        this._wildcard = { segment: current, record: record };
    }
    else if (current.mixed) {

        // Mixed

        this._mixed = this._mixed || [];

        let mixed = this._mixedLookup(current);
        if (!mixed) {
            mixed = { segment: current, node: new internals.Segment() };
            this._mixed.push(mixed);
            this._mixed.sort(internals.mixed);
        }

        if (isEdge) {
            Hoek.assert(!mixed.node._edge, 'New route', record.path, 'conflicts with existing', mixed.node._edge && mixed.node._edge.record.path);
            mixed.node._edge = { segment: current, record: record };
        }
        else {
            mixed.node.add(remaining, record);
        }
    }
    else {

        // Parameter

        this._param = this._param || new internals.Segment();

        if (isEdge) {
            Hoek.assert(!this._param._edge, 'New route', record.path, 'conflicts with existing', this._param._edge && this._param._edge.record.path);
            this._param._edge = { segment: current, record: record };
        }
        else {
            Hoek.assert(!this._wildcard || !remaining[0].wildcard, 'New route', record.path, 'conflicts with existing', this._wildcard && this._wildcard.record.path);
            this._param.add(remaining, record);
        }
    }
};


internals.Segment.prototype._mixedLookup = function (segment) {

    for (let i = 0; i < this._mixed.length; ++i) {
        if (internals.mixed({ segment: segment }, this._mixed[i]) === 0) {
            return this._mixed[i];
        }
    }

    return null;
};


internals.mixed = function (a, b) {

    const aFirst = -1;
    const bFirst = 1;

    const as = a.segment;
    const bs = b.segment;

    if (as.length !== bs.length) {
        return (as.length > bs.length ? aFirst : bFirst);
    }

    if (as.first !== bs.first) {
        return (as.first ? bFirst : aFirst);
    }

    for (let i = 0; i < as.segments.length; ++i) {
        const am = as.segments[i];
        const bm = bs.segments[i];

        if (am === bm) {
            continue;
        }

        if (am.length === bm.length) {
            return (am > bm ? bFirst : aFirst);
        }

        return (am.length < bm.length ? bFirst : aFirst);
    }

    return 0;
};


internals.Segment.prototype.lookup = function (path, segments, options) {

    let match = null;

    // Literal edge

    if (this._fulls) {
        match = this._fulls[options.isCaseSensitive ? path : path.toLowerCase()];
        if (match) {
            return { record: match.record, array: [] };
        }
    }

    // Literal node

    const current = segments[0];
    const nextPath = path.slice(current.length + 1);
    const remainder = (segments.length > 1 ? segments.slice(1) : null);

    if (this._literals) {
        const literal = options.isCaseSensitive ? current : current.toLowerCase();
        match = this._literals.hasOwnProperty(literal) && this._literals[literal];
        if (match) {
            const record = internals.deeper(match, nextPath, remainder, [], options);
            if (record) {
                return record;
            }
        }
    }

    // Mixed

    if (this._mixed) {
        for (let i = 0; i < this._mixed.length; ++i) {
            match = this._mixed[i];
            const params = current.match(match.segment.mixed);
            if (params) {
                const array = [];
                for (let j = 1; j < params.length; ++j) {
                    array.push(params[j]);
                }

                const record = internals.deeper(match.node, nextPath, remainder, array, options);
                if (record) {
                    return record;
                }
            }
        }
    }

    // Param

    if (this._param) {
        if (current ||
            (this._param._edge && this._param._edge.segment.empty)) {

            const record = internals.deeper(this._param, nextPath, remainder, [current], options);
            if (record) {
                return record;
            }
        }
    }

    // Wildcard

    if (this._wildcard) {
        return { record: this._wildcard.record, array: [path.slice(1)] };
    }

    return null;
};


internals.deeper = function (match, path, segments, array, options) {

    if (!segments) {
        if (match._edge) {
            return { record: match._edge.record, array: array };
        }

        if (match._wildcard) {
            return { record: match._wildcard.record, array: array };
        }
    }
    else {
        const result = match.lookup(path, segments, options);
        if (result) {
            return { record: result.record, array: array.concat(result.array) };
        }
    }

    return null;
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};


internals.defaults = {
    maxByteSize: 100 * 1024 * 1024,          // 100MB
    allowMixedContent: false
};

// Provides a named reference for memory debugging
internals.MemoryCacheSegment = function MemoryCacheSegment() {
};

internals.MemoryCacheEntry = function MemoryCacheEntry(key, value, ttl, allowMixedContent) {

    let valueByteSize = 0;

    if (allowMixedContent && Buffer.isBuffer(value)) {
        this.item = new Buffer(value.length);
        // copy buffer to prevent value from changing while in the cache
        value.copy(this.item);
        valueByteSize = this.item.length;
    }
    else {
        // stringify() to prevent value from changing while in the cache
        this.item = JSON.stringify(value);
        valueByteSize = Buffer.byteLength(this.item);
    }

    this.stored = Date.now();
    this.ttl = ttl;

    // Approximate cache entry size without value: 144 bytes
    this.byteSize = 144 + valueByteSize + Buffer.byteLength(key.segment) + Buffer.byteLength(key.id);

    this.timeoutId = null;
};


exports = module.exports = internals.Connection = function MemoryCache(options) {

    Hoek.assert(this.constructor === internals.Connection, 'Memory cache client must be instantiated using new');
    Hoek.assert(!options || options.maxByteSize === undefined || options.maxByteSize >= 0, 'Invalid cache maxByteSize value');
    Hoek.assert(!options || options.allowMixedContent === undefined || typeof options.allowMixedContent === 'boolean', 'Invalid allowMixedContent value');

    this.settings = Hoek.applyToDefaults(internals.defaults, options || {});
    this.cache = null;
};


internals.Connection.prototype.start = function (callback) {

    callback = Hoek.nextTick(callback);

    if (!this.cache) {
        this.cache = {};
        this.byteSize = 0;
    }

    return callback();
};


internals.Connection.prototype.stop = function () {

    // Clean up pending eviction timers.
    if (this.cache) {
        const segments = Object.keys(this.cache);
        for (let i = 0; i < segments.length; ++i) {
            const segment = segments[i];
            const keys = Object.keys(this.cache[segment]);
            for (let j = 0; j < keys.length; ++j) {
                const key = keys[j];
                clearTimeout(this.cache[segment][key].timeoutId);
            }
        }
    }

    this.cache = null;
    this.byteSize = 0;
    return;
};


internals.Connection.prototype.isReady = function () {

    return !!this.cache;
};


internals.Connection.prototype.validateSegmentName = function (name) {

    if (!name) {
        return new Error('Empty string');
    }

    if (name.indexOf('\u0000') !== -1) {
        return new Error('Includes null character');
    }

    return null;
};


internals.Connection.prototype.get = function (key, callback) {

    callback = Hoek.nextTick(callback);

    if (!this.cache) {
        return callback(new Error('Connection not started'));
    }

    const segment = this.cache[key.segment];

    if (!segment) {
        return callback(null, null);
    }

    const envelope = segment[key.id];

    if (!envelope) {
        return callback(null, null);
    }

    let value = null;

    if (Buffer.isBuffer(envelope.item)) {
        value = envelope.item;
    }
    else {
        value = internals.parseJSON(envelope.item);

        if (value instanceof Error) {
            return callback(new Error('Bad value content'));
        }
    }

    const result = {
        item: value,
        stored: envelope.stored,
        ttl: envelope.ttl
    };

    return callback(null, result);
};


internals.Connection.prototype.set = function (key, value, ttl, callback) {

    callback = Hoek.nextTick(callback);

    if (!this.cache) {
        return callback(new Error('Connection not started'));
    }

    if (ttl > 2147483647) {                                                         // Math.pow(2, 31)
        return callback(new Error('Invalid ttl (greater than 2147483647)'));
    }

    let envelope = null;
    try {
        envelope = new internals.MemoryCacheEntry(key, value, ttl, this.settings.allowMixedContent);
    }
    catch (err) {
        return callback(err);
    }

    this.cache[key.segment] = this.cache[key.segment] || new internals.MemoryCacheSegment();
    const segment = this.cache[key.segment];
    const cachedItem = segment[key.id];

    if (cachedItem && cachedItem.timeoutId) {
        clearTimeout(cachedItem.timeoutId);
        this.byteSize -= cachedItem.byteSize;                   // If the item existed, decrement the byteSize as the value could be different
    }

    if (this.settings.maxByteSize) {
        if (this.byteSize + envelope.byteSize > this.settings.maxByteSize) {
            return callback(new Error('Cache size limit reached'));
        }
    }

    const timeoutId = setTimeout(() => {

        this.drop(key, () => {});
    }, ttl);

    envelope.timeoutId = timeoutId;

    segment[key.id] = envelope;
    this.byteSize += envelope.byteSize;

    return callback(null);
};


internals.Connection.prototype.drop = function (key, callback) {

    callback = Hoek.nextTick(callback);

    if (!this.cache) {
        return callback(new Error('Connection not started'));
    }

    const segment = this.cache[key.segment];
    if (segment) {
        const item = segment[key.id];

        if (item) {
            this.byteSize -= item.byteSize;
        }

        delete segment[key.id];
    }

    return callback();
};


internals.parseJSON = function (json) {

    let obj = null;

    try {
        obj = JSON.parse(json);
    }
    catch (err) {
        obj = err;
    }

    return obj;
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);
const Boom = __webpack_require__(2);


// Declare internals

const internals = {};


internals.defaults = {
    partition: 'catbox'
};


module.exports = internals.Client = function (engine, options) {

    Hoek.assert(this instanceof internals.Client, 'Cache client must be instantiated using new');
    Hoek.assert(engine, 'Missing catbox client engine');
    Hoek.assert(typeof engine === 'object' || typeof engine === 'function', 'engine must be an engine object or engine prototype (function)');
    Hoek.assert(typeof engine === 'function' || !options, 'Can only specify options with function engine config');

    const settings = Hoek.applyToDefaults(internals.defaults, options || {});
    Hoek.assert(settings.partition.match(/^[\w\-]+$/), 'Invalid partition name:' + settings.partition);

    this.connection = (typeof engine === 'object' ? engine : new engine(settings));
};


internals.Client.prototype.stop = function () {

    this.connection.stop();
};


internals.Client.prototype.start = function (callback) {

    this.connection.start(callback);
};


internals.Client.prototype.isReady = function () {

    return this.connection.isReady();
};


internals.Client.prototype.validateSegmentName = function (name) {

    return this.connection.validateSegmentName(name);
};


internals.Client.prototype.get = function (key, callback) {

    if (!this.connection.isReady()) {
        // Disconnected
        return callback(Boom.internal('Disconnected'));
    }

    if (!key) {
        // Not found on null
        return callback(null, null);
    }

    if (!internals.validateKey(key)) {
        return callback(Boom.internal('Invalid key'));
    }

    this.connection.get(key, (err, result) => {

        if (err) {
            // Connection error
            return callback(err);
        }

        if (!result ||
            result.item === undefined ||
            result.item === null) {

            // Not found
            return callback(null, null);
        }

        const now = Date.now();
        const expires = result.stored + result.ttl;
        const ttl = expires - now;
        if (ttl <= 0) {
            // Expired
            return callback(null, null);
        }

        // Valid

        const cached = {
            item: result.item,
            stored: result.stored,
            ttl: ttl
        };

        return callback(null, cached);
    });
};


internals.Client.prototype.set = function (key, value, ttl, callback) {

    if (!this.connection.isReady()) {
        // Disconnected
        return callback(Boom.internal('Disconnected'));
    }

    if (!internals.validateKey(key)) {
        return callback(Boom.internal('Invalid key'));
    }

    if (ttl <= 0) {
        // Not cachable (or bad rules)
        return callback();
    }

    this.connection.set(key, value, ttl, callback);
};


internals.Client.prototype.drop = function (key, callback) {

    if (!this.connection.isReady()) {
        // Disconnected
        return callback(Boom.internal('Disconnected'));
    }

    if (!internals.validateKey(key)) {
        return callback(Boom.internal('Invalid key'));
    }

    this.connection.drop(key, callback);           // Always drop, regardless of caching rules
};


internals.validateKey = function (key) {

    return (key && typeof key.id === 'string' && key.segment && typeof key.segment === 'string');
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(2);
const Hoek = __webpack_require__(1);
const Joi = __webpack_require__(0);


// Declare internals

const internals = {
    day: 24 * 60 * 60 * 1000
};


exports = module.exports = internals.Policy = function (options, cache, segment) {

    Hoek.assert(this instanceof internals.Policy, 'Cache Policy must be instantiated using new');

    this._cache = cache;
    this._pendings = {};                                        // id -> [callbacks]
    this._pendingGenerateCall = {};                             // id -> boolean
    this.rules(options);

    this.stats = {
        sets: 0,
        gets: 0,
        hits: 0,
        stales: 0,
        generates: 0,
        errors: 0
    };

    if (cache) {
        const nameErr = cache.validateSegmentName(segment);
        Hoek.assert(nameErr === null, 'Invalid segment name: ' + segment + (nameErr ? ' (' + nameErr.message + ')' : ''));

        this._segment = segment;
    }
};


internals.Policy.prototype.rules = function (options) {

    this.rule = internals.Policy.compile(options, !!this._cache);
};


internals.Policy.prototype.get = function (key, callback) {     // key: string or { id: 'id' }

    ++this.stats.gets;

    // Check if request is already pending

    const id = (key && typeof key === 'object') ? key.id : key;
    const pendingsId = '+' + id;                                  // Prefix to avoid conflicts with JS internals (e.g. __proto__)
    if (this._pendings[pendingsId]) {
        this._pendings[pendingsId].push(process.domain ? process.domain.bind(callback) : callback);     // Explicitly bind callback to its process.domain (_finalize might get called from a different active process.domain)
        return;
    }

    this._pendings[pendingsId] = [callback];

    // Lookup in cache

    const timer = new Hoek.Timer();
    this._get(id, (err, cached) => {

        if (err) {
            ++this.stats.errors;
        }

        // Prepare report

        const report = {
            msec: timer.elapsed(),
            error: err
        };

        if (cached) {
            report.stored = cached.stored;
            report.ttl = cached.ttl;
            const staleIn = typeof this.rule.staleIn === 'function' ? this.rule.staleIn(cached.stored, cached.ttl) : this.rule.staleIn;
            cached.isStale = (staleIn ? (Date.now() - cached.stored) >= staleIn : false);
            report.isStale = cached.isStale;

            if (cached.isStale) {
                ++this.stats.stales;
            }
        }

        // No generate method

        if (!this.rule.generateFunc ||
            (err && !this.rule.generateOnReadError)) {

            return internals.respond(this, id, err, cached ? cached.item : null, cached, report);
        }

        // Check if found and fresh

        if (cached &&
            !cached.isStale) {

            return internals.respond(this, id, null, cached.item, cached, report);
        }

        return this._generate(id, key, cached, report);
    });
};


internals.Policy.prototype._generate = function (id, key, cached, report) {

    const respond = Hoek.once(internals.respond);

    if (cached) {                                       // Must be stale

        // Set stale timeout

        cached.ttl = cached.ttl - this.rule.staleTimeout;       // Adjust TTL for when the timeout is invoked (staleTimeout must be valid if isStale is true)
        if (cached.ttl > 0) {
            setTimeout(() => {

                return respond(this, id, null, cached.item, cached, report);
            }, this.rule.staleTimeout);
        }
    }
    else if (this.rule.generateTimeout) {

        // Set item generation timeout (when not in cache)

        setTimeout(() => {

            return respond(this, id, Boom.serverTimeout(), null, null, report);
        }, this.rule.generateTimeout);
    }

    // Generate new value

    const pendingId = ('+' + id);
    if (!this._pendingGenerateCall[pendingId]) {                // Check if a generate call is already in progress
        ++this.stats.generates;                                 // Record generation before call in case it times out

        if (this.rule.pendingGenerateTimeout) {
            this._pendingGenerateCall[pendingId] = true;
            setTimeout(() => {

                delete this._pendingGenerateCall[pendingId];
            }, this.rule.pendingGenerateTimeout);
        }

        try {
            this._callGenerateFunc(id, key, cached, report, respond);
        }
        catch (err) {
            delete this._pendingGenerateCall[pendingId];
            return respond(this, id, err, null, null, report);
        }
    }
};


internals.Policy.prototype._callGenerateFunc = function (id, key, cached, report, respond) {

    this.rule.generateFunc.call(null, key, (generateError, value, ttl) => {

        delete this._pendingGenerateCall['+' + id];

        const finalize = (err) => {

            const error = generateError || (this.rule.generateIgnoreWriteError ? null : err);
            if (cached &&
                error &&
                !this.rule.dropOnError) {

                return respond(this, id, error, cached.item, cached, report);
            }

            return respond(this, id, error, value, null, report);       // Ignored if stale value already returned
        };

        // Error (if dropOnError is not set to false) or not cached

        if ((generateError && this.rule.dropOnError) || ttl === 0) {                                    // null or undefined means use policy
            return this.drop(id, finalize);                 // Invalidate cache
        }

        if (!generateError) {
            return this.set(id, value, ttl, finalize);      // Lazy save (replaces stale cache copy with late-coming fresh copy)
        }

        return finalize();
    });
};


internals.Policy.prototype._get = function (id, callback) {

    if (!this._cache) {
        return Hoek.nextTick(callback)(null, null);
    }

    this._cache.get({ segment: this._segment, id: id }, callback);
};


internals.respond = function (policy, id, err, value, cached, report) {

    id = '+' + id;
    const pendings = policy._pendings[id];
    delete policy._pendings[id];

    const length = pendings.length;
    for (let i = 0; i < length; ++i) {
        Hoek.nextTick(pendings[i])(err, value, cached, report);
    }

    if (report.isStale !== undefined) {
        policy.stats.hits = policy.stats.hits + length;
    }
};


internals.Policy.prototype.set = function (key, value, ttl, callback) {

    callback = callback || Hoek.ignore;

    ++this.stats.sets;

    if (!this._cache) {
        return callback(null);
    }

    ttl = ttl || internals.Policy.ttl(this.rule);
    const id = (key && typeof key === 'object') ? key.id : key;
    this._cache.set({ segment: this._segment, id: id }, value, ttl, (err) => {

        if (err) {
            ++this.stats.errors;
        }

        return callback(err);
    });
};


internals.Policy.prototype.drop = function (key, callback) {

    callback = callback || Hoek.ignore;

    if (!this._cache) {
        return callback(null);
    }

    const id = (key && typeof key === 'object') ? key.id : key;
    if (!id) {
        return callback(new Error('Invalid key'));
    }

    this._cache.drop({ segment: this._segment, id: id }, (err) => {

        if (err) {
            ++this.stats.errors;
        }

        return callback(err);
    });
};


internals.Policy.prototype.ttl = function (created) {

    return internals.Policy.ttl(this.rule, created);
};


internals.schema = Joi.object({
    expiresIn: Joi.number().integer().min(1),
    expiresAt: Joi.string().regex(/^\d\d?\:\d\d$/),
    staleIn: [Joi.number().integer().min(1).max(86400000 - 1), Joi.func()],               // One day - 1 (max is inclusive)
    staleTimeout: Joi.number().integer().min(1),
    generateFunc: Joi.func(),
    generateTimeout: Joi.number().integer().min(1).allow(false),
    generateOnReadError: Joi.boolean(),
    generateIgnoreWriteError: Joi.boolean(),
    dropOnError: Joi.boolean(),
    pendingGenerateTimeout: Joi.number().integer().min(1),

    // Ignored external keys (hapi)

    privacy: Joi.any(),
    cache: Joi.any(),
    segment: Joi.any(),
    shared: Joi.any()
})
    .without('expiresIn', 'expiresAt')
    .with('staleIn', 'generateFunc')
    .with('generateOnReadError', 'generateFunc')
    .with('generateIgnoreWriteError', 'generateFunc')
    .with('dropOnError', 'generateFunc')
    .and('generateFunc', 'generateTimeout')
    .and('staleIn', 'staleTimeout');


internals.Policy.compile = function (options, serverSide) {

    /*
        {
            expiresIn: 30000,
            expiresAt: '13:00',

            generateFunc: function (id, next) { next(err, result, ttl); }
            generateTimeout: 500,
            generateOnReadError: true,
            generateIgnoreWriteError: true,
            staleIn: 20000,
            staleTimeout: 500,
            dropOnError: true
        }
     */

    const rule = {};

    if (!options ||
        !Object.keys(options).length) {

        return rule;
    }

    // Validate rule

    Joi.assert(options, internals.schema, 'Invalid cache policy configuration');

    const hasExpiresIn = options.expiresIn !== undefined && options.expiresIn !== null;
    const hasExpiresAt = options.expiresAt !== undefined && options.expiresAt !== null;

    Hoek.assert(!hasExpiresAt || typeof options.expiresAt === 'string', 'expiresAt must be a string', options);
    Hoek.assert(!hasExpiresIn || Hoek.isInteger(options.expiresIn), 'expiresIn must be an integer', options);
    Hoek.assert(!hasExpiresIn || !options.staleIn || typeof options.staleIn === 'function' || options.staleIn < options.expiresIn, 'staleIn must be less than expiresIn');
    Hoek.assert(!options.staleIn || serverSide, 'Cannot use stale options without server-side caching');
    Hoek.assert(!options.staleTimeout || !hasExpiresIn || options.staleTimeout < options.expiresIn, 'staleTimeout must be less than expiresIn');
    Hoek.assert(!options.staleTimeout || !hasExpiresIn || typeof options.staleIn === 'function' || options.staleTimeout < (options.expiresIn - options.staleIn), 'staleTimeout must be less than the delta between expiresIn and staleIn');
    Hoek.assert(!options.staleTimeout || !options.pendingGenerateTimeout || options.staleTimeout < options.pendingGenerateTimeout, 'pendingGenerateTimeout must be greater than staleTimeout if specified');

    // Expiration

    if (hasExpiresAt) {

        // expiresAt

        const time = /^(\d\d?):(\d\d)$/.exec(options.expiresAt);
        rule.expiresAt = {
            hours: parseInt(time[1], 10),
            minutes: parseInt(time[2], 10)
        };
    }
    else {

        // expiresIn

        rule.expiresIn = options.expiresIn || 0;
    }

    // generateTimeout

    if (options.generateFunc) {
        rule.generateFunc = options.generateFunc;
        rule.generateTimeout = options.generateTimeout;

        // Stale

        if (options.staleIn) {
            rule.staleIn = options.staleIn;
            rule.staleTimeout = options.staleTimeout;
        }

        rule.dropOnError = options.dropOnError !== undefined ? options.dropOnError : true;                                          // Defaults to true
        rule.pendingGenerateTimeout = options.pendingGenerateTimeout !== undefined ? options.pendingGenerateTimeout : 0;            // Defaults to zero
    }

    rule.generateOnReadError = options.generateOnReadError !== undefined ? options.generateOnReadError : true;                      // Defaults to true
    rule.generateIgnoreWriteError = options.generateIgnoreWriteError !== undefined ? options.generateIgnoreWriteError : true;       // Defaults to true

    return rule;
};


internals.Policy.ttl = function (rule, created, now) {

    now = now || Date.now();
    created = created || now;
    const age = now - created;

    if (age < 0) {
        return 0;                                                                   // Created in the future, assume expired/bad
    }

    if (rule.expiresIn) {
        return Math.max(rule.expiresIn - age, 0);
    }

    if (rule.expiresAt) {
        if (age > internals.day) {                                                  // If the item was created more than a 24 hours ago
            return 0;
        }

        const expiresAt = new Date(created);                                        // Compare expiration time on the same day
        expiresAt.setHours(rule.expiresAt.hours);
        expiresAt.setMinutes(rule.expiresAt.minutes);
        expiresAt.setSeconds(0);
        expiresAt.setMilliseconds(0);
        let expires = expiresAt.getTime();

        if (expires <= created) {
            expires = expires + internals.day;                                     // Move to tomorrow
        }

        if (now >= expires) {                                                      // Expired
            return 0;
        }

        return expires - now;
    }

    return 0;                                                                       // No rule
};


internals.Policy.prototype.isReady = function () {

    if (!this._cache) {
        return false;
    }

    return this._cache.connection.isReady();
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(2);
const Hoek = __webpack_require__(1);
const Joi = __webpack_require__(0);


// Declare internals

const internals = {};


internals.schema = {
    process: Joi.object({
        sampleInterval: Joi.number().min(0)
    }),
    policy: Joi.object({
        maxHeapUsedBytes: Joi.number().min(0),
        maxEventLoopDelay: Joi.number().min(0),
        maxRssBytes: Joi.number().min(0)
    })
};


internals.defaults = {
    process: {
        sampleInterval: 0                           // Frequency of load sampling in milliseconds (zero is no sampling)
    },
    policy: {
        maxHeapUsedBytes: 0,                        // Reject requests when V8 heap is over size in bytes (zero is no max)
        maxRssBytes: 0,                             // Reject requests when process RSS is over size in bytes (zero is no max)
        maxEventLoopDelay: 0                        // Milliseconds of delay after which requests are rejected (zero is no max)
    }
};


exports = module.exports = internals.Heavy = function (options) {

    options = options || {};

    Joi.assert(options, internals.schema.process, 'Invalid load monitoring options');
    this.settings = Hoek.applyToDefaults(internals.defaults, options);

    this._eventLoopTimer = null;
    this._loadBench = new Hoek.Bench();
    this.load = {
        eventLoopDelay: 0,
        heapUsed: 0,
        rss: 0
    };
};


internals.Heavy.prototype.start = function () {

    if (!this.settings.sampleInterval) {
        return;
    }

    const loopSample = () => {

        this._loadBench.reset();
        const measure = () => {

            const mem = process.memoryUsage();

            // Retain the same this.load object to keep external references valid

            this.load.eventLoopDelay = (this._loadBench.elapsed() - this.settings.sampleInterval);
            this.load.heapUsed = mem.heapUsed;
            this.load.rss = mem.rss;

            loopSample();
        };

        this._eventLoopTimer = setTimeout(measure, this.settings.sampleInterval);
    };

    loopSample();
};


internals.Heavy.prototype.stop = function () {

    clearTimeout(this._eventLoopTimer);
    this._eventLoopTimer = null;
};


internals.Heavy.prototype.policy = function (options) {

    return new internals.Policy(this, options);
};


internals.Policy = function (process, options) {

    options = options || {};

    Joi.assert(options, internals.schema.policy, 'Invalid load monitoring options');
    Hoek.assert(process.settings.sampleInterval || (!options.maxEventLoopDelay && !options.maxHeapUsedBytes && !options.maxRssBytes), 'Load sample interval must be set to enable load limits');

    this._process = process;
    this.settings = Hoek.applyToDefaults(internals.defaults.policy, options);
};


internals.Policy.prototype.check = function () {

    if (!this._process.settings.sampleInterval) {
        return null;
    }

    Hoek.assert(this._process._eventLoopTimer, 'Cannot check load when sampler is not started');

    const elapsed = this._process._loadBench.elapsed();
    const load = this._process.load;

    if (elapsed > this._process.settings.sampleInterval) {
        load.eventLoopDelay = Math.max(load.eventLoopDelay, elapsed - this._process.settings.sampleInterval);
    }

    if (this.settings.maxEventLoopDelay &&
        load.eventLoopDelay > this.settings.maxEventLoopDelay) {

        return Boom.serverTimeout('Server under heavy load (event loop)', load);
    }

    if (this.settings.maxHeapUsedBytes &&
        load.heapUsed > this.settings.maxHeapUsedBytes) {

        return Boom.serverTimeout('Server under heavy load (heap)', load);
    }

    if (this.settings.maxRssBytes &&
        load.rss > this.settings.maxRssBytes) {

        return Boom.serverTimeout('Server under heavy load (rss)', load);
    }

    return null;
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Declare internals

const internals = {};


exports.escapeJavaScript = function (input) {

    if (!input) {
        return '';
    }

    let escaped = '';

    for (let i = 0; i < input.length; ++i) {

        const charCode = input.charCodeAt(i);

        if (internals.isSafe(charCode)) {
            escaped += input[i];
        }
        else {
            escaped += internals.escapeJavaScriptChar(charCode);
        }
    }

    return escaped;
};


exports.escapeHtml = function (input) {

    if (!input) {
        return '';
    }

    let escaped = '';

    for (let i = 0; i < input.length; ++i) {

        const charCode = input.charCodeAt(i);

        if (internals.isSafe(charCode)) {
            escaped += input[i];
        }
        else {
            escaped += internals.escapeHtmlChar(charCode);
        }
    }

    return escaped;
};


internals.escapeJavaScriptChar = function (charCode) {

    if (charCode >= 256) {
        return '\\u' + internals.padLeft('' + charCode, 4);
    }

    const hexValue = new Buffer(String.fromCharCode(charCode), 'ascii').toString('hex');
    return '\\x' + internals.padLeft(hexValue, 2);
};


internals.escapeHtmlChar = function (charCode) {

    const namedEscape = internals.namedHtml[charCode];
    if (typeof namedEscape !== 'undefined') {
        return namedEscape;
    }

    if (charCode >= 256) {
        return '&#' + charCode + ';';
    }

    const hexValue = new Buffer(String.fromCharCode(charCode), 'ascii').toString('hex');
    return '&#x' + internals.padLeft(hexValue, 2) + ';';
};


internals.padLeft = function (str, len) {

    while (str.length < len) {
        str = '0' + str;
    }

    return str;
};


internals.isSafe = function (charCode) {

    return (typeof internals.safeCharCodes[charCode] !== 'undefined');
};


internals.namedHtml = {
    '38': '&amp;',
    '60': '&lt;',
    '62': '&gt;',
    '34': '&quot;',
    '160': '&nbsp;',
    '162': '&cent;',
    '163': '&pound;',
    '164': '&curren;',
    '169': '&copy;',
    '174': '&reg;'
};


internals.safeCharCodes = (function () {

    const safe = {};

    for (let i = 32; i < 123; ++i) {

        if ((i >= 97) ||                    // a-z
            (i >= 65 && i <= 90) ||         // A-Z
            (i >= 48 && i <= 57) ||         // 0-9
            i === 32 ||                     // space
            i === 46 ||                     // .
            i === 44 ||                     // ,
            i === 45 ||                     // -
            i === 58 ||                     // :
            i === 95) {                     // _

            safe[i] = null;
        }
    }

    return safe;
}());


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Crypto = __webpack_require__(16);
const Boom = __webpack_require__(2);
const Hoek = __webpack_require__(1);
const Cryptiles = __webpack_require__(32);


// Declare internals

const internals = {};


// Common defaults

exports.defaults = {
    encryption: {
        saltBits: 256,
        algorithm: 'aes-256-cbc',
        iterations: 1,
        minPasswordlength: 32
    },

    integrity: {
        saltBits: 256,
        algorithm: 'sha256',
        iterations: 1,
        minPasswordlength: 32
    },

    ttl: 0,                                             // Milliseconds, 0 means forever
    timestampSkewSec: 60,                               // Seconds of permitted clock skew for incoming expirations
    localtimeOffsetMsec: 0                              // Local clock time offset express in a number of milliseconds (positive or negative)
};


// Algorithm configuration

exports.algorithms = {
    'aes-128-ctr': { keyBits: 128, ivBits: 128 },       // Requires node 0.10.x
    'aes-256-cbc': { keyBits: 256, ivBits: 128 },
    'sha256': { keyBits: 256 }
};


// MAC normalization format version

exports.macFormatVersion = '2';                         // Prevent comparison of mac values generated with different normalized string formats
exports.macPrefix = 'Fe26.' + exports.macFormatVersion;


// Generate a unique encryption key

/*
    const options =  {
        saltBits: 256,                                  // Ignored if salt is set
        salt: '4d8nr9q384nr9q384nr93q8nruq9348run',
        algorithm: 'aes-128-ctr',
        iterations: 10000,
        iv: 'sdfsdfsdfsdfscdrgercgesrcgsercg',          // Optional
        minPasswordlength: 32
    };
*/

exports.generateKey = function (password, options, callback) {

    const callbackTick = Hoek.nextTick(callback);

    if (!password) {
        return callbackTick(Boom.internal('Empty password'));
    }

    if (!options ||
        typeof options !== 'object') {

        return callbackTick(Boom.internal('Bad options'));
    }

    const algorithm = exports.algorithms[options.algorithm];
    if (!algorithm) {
        return callbackTick(Boom.internal('Unknown algorithm: ' + options.algorithm));
    }

    const generate = () => {

        if (Buffer.isBuffer(password)) {
            if (password.length < algorithm.keyBits / 8) {
                return callbackTick(Boom.internal('Key buffer (password) too small'));
            }

            const result = {
                key: password,
                salt: ''
            };

            return generateIv(result);
        }

        if (password.length < options.minPasswordlength) {
            return callbackTick(Boom.internal('Password string too short (min ' + options.minPasswordlength + ' characters required)'));
        }

        if (options.salt) {
            return generateKey(options.salt);
        }

        if (options.saltBits) {
            return generateSalt();
        }

        return callbackTick(Boom.internal('Missing salt or saltBits options'));
    };

    const generateSalt = () => {

        const randomSalt = Cryptiles.randomBits(options.saltBits);
        if (randomSalt instanceof Error) {
            return callbackTick(randomSalt);
        }

        const salt = randomSalt.toString('hex');
        return generateKey(salt);
    };

    const generateKey = (salt) => {

        Crypto.pbkdf2(password, salt, options.iterations, algorithm.keyBits / 8, 'sha1', (err, derivedKey) => {

            if (err) {
                return callback(err);
            }

            const result = {
                key: derivedKey,
                salt: salt
            };

            return generateIv(result);
        });
    };

    const generateIv = (result) => {

        if (algorithm.ivBits &&
            !options.iv) {

            const randomIv = Cryptiles.randomBits(algorithm.ivBits);
            if (randomIv instanceof Error) {
                return callbackTick(randomIv);
            }

            result.iv = randomIv;
            return callbackTick(null, result);
        }

        if (options.iv) {
            result.iv = options.iv;
        }

        return callbackTick(null, result);
    };

    generate();
};


// Encrypt data
// options: see exports.generateKey()

exports.encrypt = function (password, options, data, callback) {

    exports.generateKey(password, options, (err, key) => {

        if (err) {
            return callback(err);
        }

        const cipher = Crypto.createCipheriv(options.algorithm, key.key, key.iv);
        const enc = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);

        callback(null, enc, key);
    });
};


// Decrypt data
// options: see exports.generateKey()

exports.decrypt = function (password, options, data, callback) {

    exports.generateKey(password, options, (err, key) => {

        if (err) {
            return callback(err);
        }

        const decipher = Crypto.createDecipheriv(options.algorithm, key.key, key.iv);
        let dec = decipher.update(data, null, 'utf8');
        dec = dec + decipher.final('utf8');

        callback(null, dec);
    });
};


// HMAC using a password
// options: see exports.generateKey()

exports.hmacWithPassword = function (password, options, data, callback) {

    exports.generateKey(password, options, (err, key) => {

        if (err) {
            return callback(err);
        }

        const hmac = Crypto.createHmac(options.algorithm, key.key).update(data);
        const digest = hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');

        const result = {
            digest: digest,
            salt: key.salt
        };

        return callback(null, result);
    });
};


// Normalizes a password parameter into a { id, encryption, integrity } object
// password: string, buffer or object with { id, secret } or { id, encryption, integrity }

internals.normalizePassword = function (password) {

    const obj = {};

    if (password instanceof Object &&
        !Buffer.isBuffer(password)) {

        obj.id = password.id;
        obj.encryption = password.secret || password.encryption;
        obj.integrity = password.secret || password.integrity;
    }
    else {
        obj.encryption = password;
        obj.integrity = password;
    }

    return obj;
};


// Encrypt and HMAC an object
// password: string, buffer or object with { id, secret } or { id, encryption, integrity }
// options: see exports.defaults

exports.seal = function (object, password, options, callback) {

    const now = Date.now() + (options.localtimeOffsetMsec || 0);                 // Measure now before any other processing

    const callbackTick = Hoek.nextTick(callback);

    // Serialize object

    const objectString = JSON.stringify(object);

    // Obtain password

    let passwordId = '';
    password = internals.normalizePassword(password);
    if (password.id) {
        if (!/^\w+$/.test(password.id)) {
            return callbackTick(Boom.internal('Invalid password id'));
        }

        passwordId = password.id;
    }

    // Encrypt object string

    exports.encrypt(password.encryption, options.encryption, objectString, (err, encrypted, key) => {

        if (err) {
            return callback(err);
        }

        // Base64url the encrypted value

        const encryptedB64 = Hoek.base64urlEncode(encrypted);
        const iv = Hoek.base64urlEncode(key.iv);
        const expiration = (options.ttl ? now + options.ttl : '');
        const macBaseString = exports.macPrefix + '*' + passwordId + '*' + key.salt + '*' + iv + '*' + encryptedB64 + '*' + expiration;

        // Mac the combined values

        exports.hmacWithPassword(password.integrity, options.integrity, macBaseString, (err, mac) => {

            if (err) {
                return callback(err);
            }

            // Put it all together

            // prefix*[password-id]*encryption-salt*encryption-iv*encrypted*[expiration]*hmac-salt*hmac
            // Allowed URI query name/value characters: *-. \d \w

            const sealed = macBaseString + '*' + mac.salt + '*' + mac.digest;
            return callback(null, sealed);
        });
    });
};


// Decrypt and validate sealed string
// password: string, buffer or object with { id: secret } or { id: { encryption, integrity } }
// options: see exports.defaults

exports.unseal = function (sealed, password, options, callback) {

    const now = Date.now() + (options.localtimeOffsetMsec || 0);                 // Measure now before any other processing

    const callbackTick = Hoek.nextTick(callback);

    // Break string into components

    const parts = sealed.split('*');
    if (parts.length !== 8) {
        return callbackTick(Boom.internal('Incorrect number of sealed components'));
    }

    const macPrefix = parts[0];
    const passwordId = parts[1];
    const encryptionSalt = parts[2];
    const encryptionIv = parts[3];
    const encryptedB64 = parts[4];
    const expiration = parts[5];
    const hmacSalt = parts[6];
    const hmac = parts[7];
    const macBaseString = macPrefix + '*' + passwordId + '*' + encryptionSalt + '*' + encryptionIv + '*' + encryptedB64 + '*' + expiration;

    // Check prefix

    if (macPrefix !== exports.macPrefix) {
        return callbackTick(Boom.internal('Wrong mac prefix'));
    }

    // Check expiration

    if (expiration) {
        if (!expiration.match(/^\d+$/)) {
            return callbackTick(Boom.internal('Invalid expiration'));
        }

        const exp = parseInt(expiration, 10);
        if (exp <= (now - (options.timestampSkewSec * 1000))) {
            return callbackTick(Boom.internal('Expired seal'));
        }
    }

    // Obtain password

    if (password instanceof Object &&
        !(Buffer.isBuffer(password))) {

        password = password[passwordId || 'default'];
        if (!password) {
            return callbackTick(Boom.internal('Cannot find password: ' + passwordId));
        }
    }
    password = internals.normalizePassword(password);

    // Check hmac

    const macOptions = Hoek.clone(options.integrity);
    macOptions.salt = hmacSalt;
    exports.hmacWithPassword(password.integrity, macOptions, macBaseString, (err, mac) => {

        if (err) {
            return callback(err);
        }

        if (!Cryptiles.fixedTimeComparison(mac.digest, hmac)) {
            return callback(Boom.internal('Bad hmac value'));
        }

        // Decrypt

        const encrypted = Hoek.base64urlDecode(encryptedB64, 'buffer');
        if (encrypted instanceof Error) {
            return callback(encrypted);
        }

        const decryptOptions = Hoek.clone(options.encryption);
        decryptOptions.salt = encryptionSalt;

        decryptOptions.iv = Hoek.base64urlDecode(encryptionIv, 'buffer');
        if (decryptOptions.iv instanceof Error) {
            return callback(decryptOptions.iv);
        }

        exports.decrypt(password.encryption, decryptOptions, encrypted, (ignoreErr, decrypted) => {         // Cannot fail since all errors covered by hmacWithPassword()

            // Parse JSON

            let object = null;
            try {
                object = JSON.parse(decrypted);
            }
            catch (err) {
                return callback(Boom.internal('Failed parsing sealed object JSON: ' + err.message));
            }

            return callback(null, object);
        });
    });
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Events = __webpack_require__(13);
const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};


exports = module.exports = internals.Kilt = function () {

    Events.EventEmitter.call(this);

    this._sources = [];
    this._handlers = {};

    let emitters = Hoek.flatten(Array.prototype.slice.call(arguments));
    if (emitters.length) {
        emitters = [].concat(emitters);
        for (let i = 0; i < emitters.length; ++i) {
            this.addEmitter(emitters[i]);
        }
    }
};

Hoek.inherits(internals.Kilt, Events.EventEmitter);


internals.Kilt.prototype.addEmitter = function (emitter) {

    this._sources.push(emitter);
    const types = Object.keys(this._events);
    for (let i = 0; i < types.length; ++i) {
        const type = types[i];
        emitter.on(type, this._handler(type));
    }
};


internals.Kilt.prototype._handler = function (type) {

    const self = this;

    if (this._handlers[type]) {
        return this._handlers[type];
    }

    const handler = function () {

        const args = Array.prototype.slice.call(arguments);
        args.unshift(type);
        Events.EventEmitter.prototype.emit.apply(self, args);
        self._unsubscribe(type);
    };

    this._handlers[type] = handler;
    return handler;
};


internals.Kilt.prototype.on = internals.Kilt.prototype.addListener = function (type, listener) {

    this._subscribe(type);
    return Events.EventEmitter.prototype.on.call(this, type, listener);
};


internals.Kilt.prototype._subscribe = function (type) {

    if (!this._events[type]) {
        for (let i = 0; i < this._sources.length; ++i) {
            this._sources[i].on(type, this._handler(type));
        }
    }
};


internals.Kilt.prototype.removeListener = function (type, listener) {

    Events.EventEmitter.prototype.removeListener.call(this, type, listener);
    this._unsubscribe(type);
    return this;
};


internals.Kilt.prototype.removeAllListeners = function (type) {

    Events.EventEmitter.prototype.removeAllListeners.apply(this, arguments);
    this._unsubscribe(type);
    return this;
};


internals.Kilt.prototype._unsubscribe = function (type) {

    if (type === undefined) {
        for (let i = 0; i < this._sources.length; ++i) {
            this._sources[i].removeAllListeners();
        }
    }
    else if (!this._events[type]) {
        for (let i = 0; i < this._sources.length; ++i) {
            this._sources[i].removeListener(type, this._handler(type));
        }
    }
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Path = __webpack_require__(14);
const Hoek = __webpack_require__(1);
const MimeDb = __webpack_require__(80);


// Declare internals

const internals = {};


internals.compressibleRx = /^text\/|\+json$|\+text$|\+xml$/;


module.exports = internals.Mimos = function (options) {

    options = options || {};

    Hoek.assert(this && this.constructor === internals.Mimos, 'Mimos must be created with new');

    const result = options.override ? internals.compile(options.override) : internals.base;
    this._byType = result.byType;
    this._byExtension = result.byExtension;
};


internals.compile = function (override) {

    const db = Hoek.clone(MimeDb);
    Hoek.merge(db, override, true, false);

    const result = {
        byType: db,
        byExtension: {}
    };

    const keys = Object.keys(result.byType);
    for (let i = 0; i < keys.length; ++i) {
        const type = keys[i];
        const mime = result.byType[type];
        mime.type = mime.type || type;
        mime.source = mime.source || 'mime-db';
        mime.extensions = mime.extensions || [];
        mime.compressible = (mime.compressible !== undefined ? mime.compressible : internals.compressibleRx.test(type));

        Hoek.assert(!mime.predicate || typeof mime.predicate === 'function', 'predicate option must be a function');

        for (let j = 0; j < mime.extensions.length; ++j) {
            const ext = mime.extensions[j];
            result.byExtension[ext] = mime;
        }
    }

    return result;
};


internals.base = internals.compile();       // Prevents an expensive copy on each constructor when no customization is needed


internals.Mimos.prototype.path = function (path) {

    const extension = Path.extname(path).slice(1).toLowerCase();
    const mime = this._byExtension[extension] || {};

    if (mime.predicate) {
        return mime.predicate(Hoek.clone(mime));
    }

    return mime;
};


internals.Mimos.prototype.type = function (type) {

    type = type.split(';', 1)[0].trim().toLowerCase();
    let mime = this._byType[type];
    if (!mime) {
        mime = {
            type: type,
            source: 'mimos',
            extensions: [],
            compressible: internals.compressibleRx.test(type)
        };

        this._byType[type] = mime;
        return mime;
    }

    if (mime.predicate) {
        return mime.predicate(Hoek.clone(mime));
    }

    return mime;
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */

/**
 * Module exports.
 */

module.exports = __webpack_require__(167)


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Stream = __webpack_require__(5);
const Url = __webpack_require__(27);
const Util = __webpack_require__(28);


// Declare internals

const internals = {};


exports = module.exports = internals.Request = function (options) {

    Stream.Readable.call(this);

    // options: method, url, payload, headers, remoteAddress

    let url = options.url;
    if (typeof url === 'object') {
        url = Url.format(url);
    }

    const uri = Url.parse(url);
    this.url = uri.path;

    this.httpVersion = '1.1';
    this.method = (options.method ? options.method.toUpperCase() : 'GET');

    this.headers = {};
    const headers = options.headers || {};
    const fields = Object.keys(headers);
    fields.forEach((field) => {

        this.headers[field.toLowerCase()] = headers[field];
    });

    this.headers['user-agent'] = this.headers['user-agent'] || 'shot';

    const hostHeaderFromUri = function () {

        if (uri.port) {
            return uri.host;
        }

        if (uri.protocol) {
            return uri.hostname + (uri.protocol === 'https:' ? ':443' : ':80');
        }

        return null;
    };
    this.headers.host = this.headers.host || hostHeaderFromUri() || options.authority || 'localhost:80';

    this.connection = {
        remoteAddress: options.remoteAddress || '127.0.0.1'
    };

    let payload = options.payload || null;
    if (payload &&
        typeof payload !== 'string' &&
        !(payload instanceof Stream) &&
        !Buffer.isBuffer(payload)) {

        payload = JSON.stringify(payload);
        this.headers['content-type'] = this.headers['content-type'] || 'application/json';
    }

    // Set the content-length for the corresponding payload if none set

    if (payload &&
        !(payload instanceof Stream) &&
        !this.headers.hasOwnProperty('content-length')) {

        this.headers['content-length'] = (Buffer.isBuffer(payload) ? payload.length : Buffer.byteLength(payload)).toString();
    }

    // Use _shot namespace to avoid collision with Node

    this._shot = {
        payload,
        isDone: false,
        simulate: options.simulate || {}
    };

    return this;
};

Util.inherits(internals.Request, Stream.Readable);


internals.Request.prototype.prepare = function (next) {

    if (this._shot.payload instanceof Stream === false) {
        return next();
    }

    const chunks = [];

    this._shot.payload.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

    this._shot.payload.on('end', () => {

        const payload = Buffer.concat(chunks);
        this.headers['content-length'] = this.headers['content-length'] || payload.length;
        this._shot.payload = payload;
        return next();
    });
};


internals.Request.prototype._read = function (size) {

    setImmediate(() => {

        if (this._shot.isDone) {
            if (this._shot.simulate.end !== false) {        // 'end' defaults to true
                this.push(null);
            }

            return;
        }

        this._shot.isDone = true;

        if (this._shot.payload) {
            if (this._shot.simulate.split) {
                this.push(this._shot.payload.slice(0, 1));
                this.push(this._shot.payload.slice(1));
            }
            else {
                this.push(this._shot.payload);
            }
        }

        if (this._shot.simulate.error) {
            this.emit('error', new Error('Simulated'));
        }

        if (this._shot.simulate.close) {
            this.emit('close');
        }

        if (this._shot.simulate.end !== false) {        // 'end' defaults to true
            this.push(null);
        }
    });
};


internals.Request.prototype.destroy = function () {

};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Http = __webpack_require__(21);
const Stream = __webpack_require__(5);


// Declare internals

const internals = {};


exports = module.exports = class Response extends Http.ServerResponse {

    constructor(req, onEnd) {

        super({ method: req.method, httpVersionMajor: 1, httpVersionMinor: 1 });
        this._shot = { headers: null, trailers: {}, payloadChunks: [] };
        this._headers = {};      // This forces node@8 to always render the headers
        this.assignSocket(internals.nullSocket());

        this.once('finish', () => {

            const res = internals.payload(this);
            res.raw.req = req;
            process.nextTick(() => onEnd(res));
        });
    }

    writeHead() {

        const result = super.writeHead.apply(this, arguments);

        this._shot.headers = Object.assign({}, this._headers);       // Should be .getHeaders() since node v7.7

        // Add raw headers

        ['Date', 'Connection', 'Transfer-Encoding'].forEach((name) => {

            const regex = new RegExp('\\r\\n' + name + ': ([^\\r]*)\\r\\n');
            const field = this._header.match(regex);
            if (field) {
                this._shot.headers[name.toLowerCase()] = field[1];
            }
        });

        return result;
    }

    write(data, encoding, callback) {

        super.write(data, encoding, callback);
        this._shot.payloadChunks.push(new Buffer(data, encoding));
        return true;                                                    // Write always returns false when disconnected
    }

    end(data, encoding, callback) {

        if (data) {
            this.write(data, encoding);
        }

        super.end(callback);
        this.emit('finish');
    }

    destroy() {

    }

    addTrailers(trailers) {

        for (const key in trailers) {
            this._shot.trailers[key.toLowerCase().trim()] = trailers[key].toString().trim();
        }
    }
};


internals.payload = function (response) {

    // Prepare response object

    const res = {
        raw: {
            res: response
        },
        headers: response._shot.headers,
        statusCode: response.statusCode,
        statusMessage: response.statusMessage,
        trailers: {}
    };

    // Prepare payload and trailers

    const rawBuffer = Buffer.concat(response._shot.payloadChunks);
    res.rawPayload = rawBuffer;
    res.payload = rawBuffer.toString();
    res.trailers = response._shot.trailers;

    return res;
};


// Throws away all written data to prevent response from buffering payload

internals.nullSocket = function () {

    return new Stream.Writable({
        write(chunk, encoding, callback) {

            setImmediate(callback);
        }
    });
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Fs = __webpack_require__(48);
const Os = __webpack_require__(26);
const Querystring = __webpack_require__(50);
const Stream = __webpack_require__(5);
const Zlib = __webpack_require__(51);
const Boom = __webpack_require__(2);
const Content = __webpack_require__(35);
const Hoek = __webpack_require__(1);
const Pez = __webpack_require__(84);
const Wreck = __webpack_require__(88);


// Declare internals

const internals = {};


exports.parse = function (req, tap, options, next) {

    Hoek.assert(options, 'Missing options');
    Hoek.assert(options.parse !== undefined, 'Missing parse option setting');
    Hoek.assert(options.output !== undefined, 'Missing output option setting');

    const parser = new internals.Parser(req, tap, options, next);
    return parser.read();
};


internals.Parser = function (req, tap, options, next) {

    this.req = req;
    this.settings = options;
    this.tap = tap;

    this.result = {};

    this.next = (err) => {

        return next(err, this.result);
    };
};


internals.Parser.prototype.read = function () {

    const next = this.next;

    // Content size

    const req = this.req;
    const contentLength = req.headers['content-length'];
    if (this.settings.maxBytes !== undefined &&
        contentLength &&
        parseInt(contentLength, 10) > this.settings.maxBytes) {

        return next(Boom.badRequest('Payload content length greater than maximum allowed: ' + this.settings.maxBytes));
    }

    // Content type

    const contentType = Content.type(this.settings.override || req.headers['content-type'] || this.settings.defaultContentType || 'application/octet-stream');
    if (contentType.isBoom) {
        return next(contentType);
    }

    this.result.contentType = contentType;
    this.result.mime = contentType.mime;

    if (this.settings.allow &&
        this.settings.allow.indexOf(contentType.mime) === -1) {

        return next(Boom.unsupportedMediaType());
    }

    // Parse: true

    if (this.settings.parse === true) {
        return this.parse(contentType);
    }

    // Parse: false, 'gunzip'

    return this.raw();
};


internals.Parser.prototype.parse = function (contentType) {

    let next = this.next;

    const output = this.settings.output;      // Output: 'data', 'stream', 'file'
    let source = this.req;

    // Content-encoding

    const contentEncoding = source.headers['content-encoding'];
    if (contentEncoding === 'gzip' || contentEncoding === 'deflate') {
        const decoder = (contentEncoding === 'gzip' ? Zlib.createGunzip() : Zlib.createInflate());
        next = Hoek.once(next);                                                                     // Modify next() for async events
        this.next = next;
        decoder.once('error', (err) => {

            return next(Boom.badRequest('Invalid compressed payload', err));
        });

        source = source.pipe(decoder);
    }

    // Tap request

    if (this.tap) {
        source = source.pipe(this.tap);
    }

    // Multipart

    if (this.result.contentType.mime === 'multipart/form-data') {
        return this.multipart(source, contentType);
    }

    // Output: 'stream'

    if (output === 'stream') {
        this.result.payload = source;
        return next();
    }

    // Output: 'file'

    if (output === 'file') {
        this.writeFile(source, (err, path, bytes) => {

            if (err) {
                return next(err);
            }

            this.result.payload = { path: path, bytes: bytes };
            return next();
        });

        return;
    }

    // Output: 'data'

    return Wreck.read(source, { timeout: this.settings.timeout, maxBytes: this.settings.maxBytes }, (err, payload) => {

        if (err) {
            return next(err);
        }

        internals.object(payload, this.result.contentType.mime, this.settings, (err, result) => {

            if (err) {
                this.result.payload = null;
                return next(err);
            }

            this.result.payload = result;
            return next();
        });
    });
};


internals.Parser.prototype.raw = function () {

    let next = this.next;

    const output = this.settings.output;      // Output: 'data', 'stream', 'file'
    let source = this.req;

    // Content-encoding

    if (this.settings.parse === 'gunzip') {
        const contentEncoding = source.headers['content-encoding'];
        if (contentEncoding === 'gzip' || contentEncoding === 'deflate') {
            const decoder = (contentEncoding === 'gzip' ? Zlib.createGunzip() : Zlib.createInflate());
            next = Hoek.once(next);                                                                     // Modify next() for async events

            decoder.once('error', (err) => {

                return next(Boom.badRequest('Invalid compressed payload', err));
            });

            source = source.pipe(decoder);
        }
    }

    // Setup source

    if (this.tap) {
        source = source.pipe(this.tap);
    }

    // Output: 'stream'

    if (output === 'stream') {
        this.result.payload = source;
        return next();
    }

    // Output: 'file'

    if (output === 'file') {
        this.writeFile(source, (err, path, bytes) => {

            if (err) {
                return next(err);
            }

            this.result.payload = { path: path, bytes: bytes };
            return next();
        });

        return;
    }

    // Output: 'data'

    return Wreck.read(source, { timeout: this.settings.timeout, maxBytes: this.settings.maxBytes }, (err, payload) => {

        if (err) {
            return next(err);
        }

        this.result.payload = payload;
        return next();
    });
};


internals.object = function (payload, mime, options, next) {

    // Binary

    if (mime === 'application/octet-stream') {
        return next(null, payload.length ? payload : null);
    }

    // Text

    if (mime.match(/^text\/.+$/)) {
        return next(null, payload.toString('utf8'));
    }

    // JSON

    if (/^application\/(?:.+\+)?json$/.test(mime)) {
        return internals.jsonParse(payload, next);                      // Isolate try...catch for V8 optimization
    }

    // Form-encoded

    if (mime === 'application/x-www-form-urlencoded') {
        return next(null, payload.length ? Querystring.parse(payload.toString('utf8')) : {});
    }

    return next(Boom.unsupportedMediaType());
};


internals.jsonParse = function (payload, next) {

    if (!payload.length) {
        return next(null, null);
    }

    let parsed;
    try {
        parsed = JSON.parse(payload.toString('utf8'));
    }
    catch (err) {
        return next(Boom.badRequest('Invalid request payload JSON format', err));
    }

    return next(null, parsed);
};


internals.Parser.prototype.multipart = function (source, contentType) {

    let next = this.next;
    next = Hoek.once(next);                                            // Modify next() for async events
    this.next = next;

    // Set stream timeout

    const clientTimeout = this.settings.timeout;
    let clientTimeoutId = null;

    const dispenserOptions = Hoek.applyToDefaults(contentType, { maxBytes: this.settings.maxBytes });
    const dispenser = new Pez.Dispenser(dispenserOptions);

    const onError = (err) => {

        return next(Boom.badRequest('Invalid multipart payload format', err));
    };

    dispenser.once('error', onError);

    const data = {};
    const finalize = () => {

        clearTimeout(clientTimeoutId);
        dispenser.removeListener('error', onError);
        dispenser.removeListener('part', onPart);
        dispenser.removeListener('field', onField);
        dispenser.removeListener('close', onClose);

        this.result.payload = data;
        return next();
    };

    if (clientTimeout &&
        clientTimeout > 0) {

        clientTimeoutId = setTimeout(() => {

            return next(Boom.clientTimeout());
        }, clientTimeout);
    }

    const set = (name, value) => {

        if (!data.hasOwnProperty(name)) {
            data[name] = value;
        }
        else if (Array.isArray(data[name])) {
            data[name].push(value);
        }
        else {
            data[name] = [data[name], value];
        }
    };

    const pendingFiles = {};
    let nextId = 0;
    let closed = false;

    const onPart = (part) => {

        if (this.settings.output === 'file') {                                                  // Output: 'file'
            const id = nextId++;
            pendingFiles[id] = true;
            this.writeFile(part, (err, path, bytes) => {

                delete pendingFiles[id];

                if (err) {
                    return next(err);
                }

                const item = {
                    filename: part.filename,
                    path: path,
                    headers: part.headers,
                    bytes: bytes
                };

                set(part.name, item);

                if (closed &&
                    !Object.keys(pendingFiles).length) {

                    return finalize(data);
                }
            });
        }
        else {                                                                                  // Output: 'data'
            Wreck.read(part, {}, (ignoreErr, payload) => {

                // Error handled by dispenser.once('error')

                if (this.settings.output === 'stream') {                                        // Output: 'stream'
                    const item = Wreck.toReadableStream(payload);

                    item.hapi = {
                        filename: part.filename,
                        headers: part.headers
                    };

                    return set(part.name, item);
                }

                const ct = part.headers['content-type'] || '';
                const mime = ct.split(';')[0].trim().toLowerCase();

                if (!mime) {
                    return set(part.name, payload);
                }

                if (!payload.length) {
                    return set(part.name, {});
                }

                internals.object(payload, mime, this.settings, (err, result) => {

                    return set(part.name, err ? payload : result);
                });
            });
        }
    };

    dispenser.on('part', onPart);

    const onField = (name, value) => {

        set(name, value);
    };

    dispenser.on('field', onField);

    const onClose = () => {

        if (Object.keys(pendingFiles).length) {
            closed = true;
            return;
        }

        return finalize(data);
    };

    dispenser.once('close', onClose);

    source.pipe(dispenser);
};


internals.Parser.prototype.writeFile = function (stream, callback) {

    const path = Hoek.uniqueFilename(this.settings.uploads || Os.tmpDir());
    const file = Fs.createWriteStream(path, { flags: 'wx' });
    const counter = new internals.Counter();

    const finalize = Hoek.once((err) => {

        this.req.removeListener('aborted', onAbort);
        file.removeListener('close', finalize);
        file.removeListener('error', finalize);

        if (!err) {
            return callback(null, path, counter.bytes);
        }

        file.destroy();
        Fs.unlink(path, (/* fsErr */) => {      // Ignore unlink errors

            return callback(err);
        });
    });

    file.once('close', finalize);
    file.once('error', finalize);

    const onAbort = () => {

        return finalize(Boom.badRequest('Client connection aborted'));
    };

    this.req.once('aborted', onAbort);

    stream.pipe(counter).pipe(file);
};


internals.Counter = function () {

    Stream.Transform.call(this);
    this.bytes = 0;
};

Hoek.inherits(internals.Counter, Stream.Transform);


internals.Counter.prototype._transform = function (chunk, encoding, next) {

    this.bytes = this.bytes + chunk.length;
    return next(null, chunk);
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Stream = __webpack_require__(5);
const B64 = __webpack_require__(85);
const Boom = __webpack_require__(2);
const Content = __webpack_require__(35);
const Hoek = __webpack_require__(1);
const Nigel = __webpack_require__(86);


// Declare internals

const internals = {};


/*
    RFC 2046 (http://tools.ietf.org/html/rfc2046)

    multipart-body = [preamble CRLF]
                    dash-boundary *( SPACE / HTAB ) CRLF body-part
                    *( CRLF dash-boundary *( SPACE / HTAB ) CRLF body-part )
                    CRLF dash-boundary "--" *( SPACE / HTAB )
                    [CRLF epilogue]

    boundary       = 0*69<bchars> bcharsnospace
    bchars         = bcharsnospace / " "
    bcharsnospace  = DIGIT / ALPHA / "'" / "(" / ")" / "+" / "_" / "," / "-" / "." / "/" / ":" / "=" / "?"
    dash-boundary  = "--" boundary

    preamble       = discard-text
    epilogue       = discard-text
    discard-text   = *(*text CRLF) *text

    body-part      = MIME-part-headers [CRLF *OCTET]
    OCTET          = <any 0-255 octet value>

    SPACE          = 32
    HTAB           = 9
    CRLF           = 13 10
*/


internals.state = {
    preamble: 0,                // Until the first boundary is received
    boundary: 1,                // After a boundary, waiting for first line with optional linear-whitespace
    header: 2,                  // Receiving part headers
    payload: 3,                 // Receiving part payload
    epilogue: 4
};


internals.defaults = {
    maxBytes: Infinity
};


exports.Dispenser = internals.Dispenser = function (options) {

    Stream.Writable.call(this);

    Hoek.assert(options !== null && typeof options === 'object',
                'options must be an object');
    const settings = Hoek.applyToDefaults(internals.defaults, options);

    this._boundary = settings.boundary;
    this._state = internals.state.preamble;
    this._held = '';

    this._stream = null;
    this._headers = {};
    this._name = '';
    this._pendingHeader = '';
    this._error = null;
    this._bytes = 0;
    this._maxBytes = settings.maxBytes;

    this._parts = new Nigel.Stream(new Buffer('--' + settings.boundary));
    this._lines = new Nigel.Stream(new Buffer('\r\n'));

    this._parts.on('needle', () => {

        this._onPartEnd();
    });

    this._parts.on('haystack', (chunk) => {

        this._onPart(chunk);
    });

    this._lines.on('needle', () => {

        this._onLineEnd();
    });

    this._lines.on('haystack', (chunk) => {

        this._onLine(chunk);
    });

    this.once('finish', () => {

        this._parts.end();
    });

    this._parts.once('close', () => {

        this._lines.end();
    });

    let piper = null;
    let finish = (err) => {

        if (piper) {
            piper.removeListener('data', onReqData);
            piper.removeListener('error', finish);
            piper.removeListener('aborted', onReqAborted);
        }

        if (err) {
            return this._abort(err);
        }

        this._emit('close');
    };

    finish = Hoek.once(finish);

    this._lines.once('close', () => {

        if (this._state === internals.state.epilogue) {
            if (this._held) {
                this._emit('epilogue', this._held);
                this._held = '';
            }
        }
        else if (this._state === internals.state.boundary) {
            if (!this._held) {
                this._abort(Boom.badRequest('Missing end boundary'));
            }
            else if (this._held !== '--') {
                this._abort(Boom.badRequest('Only white space allowed after boundary at end'));
            }
        }
        else {
            this._abort(Boom.badRequest('Incomplete multipart payload'));
        }

        setImmediate(finish);                  // Give pending events a chance to fire
    });

    const onReqAborted = () => {

        finish(Boom.badRequest('Client request aborted'));
    };

    const onReqData = (data) => {

        this._bytes += Buffer.byteLength(data);

        if (this._bytes > this._maxBytes) {
            finish(Boom.badRequest('Maximum size exceeded'));
        }
    };

    this.once('pipe', (req) => {

        piper = req;
        req.on('data', onReqData);
        req.once('error', finish);
        req.once('aborted', onReqAborted);
    });
};

Hoek.inherits(internals.Dispenser, Stream.Writable);


internals.Dispenser.prototype._write = function (buffer, encoding, next) {

    if (this._error) {
        return next();
    }

    this._parts.write(buffer);
    return next();
};


internals.Dispenser.prototype._emit = function () {

    if (this._error) {
        return;
    }

    this.emit.apply(this, arguments);
};


internals.Dispenser.prototype._abort = function (err) {

    this._emit('error', err);
    this._error = err;
};


internals.Dispenser.prototype._onPartEnd = function () {

    this._lines.flush();

    if (this._state === internals.state.preamble) {
        if (this._held) {
            const last = this._held.length - 1;

            if (this._held[last] !== '\n' ||
                this._held[last - 1] !== '\r') {

                return this._abort(Boom.badRequest('Preamble missing CRLF terminator'));
            }

            this._emit('preamble', this._held.slice(0, -2));
            this._held = '';
        }

        this._parts.needle(new Buffer('\r\n--' + this._boundary));                      // CRLF no longer optional
    }

    this._state = internals.state.boundary;

    if (this._stream) {
        this._stream.end();
        this._stream = null;
    }
    else if (this._name) {
        this._emit('field', this._name, this._held);
        this._name = '';
        this._held = '';
    }
};


internals.Dispenser.prototype._onPart = function (chunk) {

    if (this._state === internals.state.preamble) {
        this._held = this._held + chunk.toString();
    }
    else if (this._state === internals.state.payload) {
        if (this._stream) {
            this._stream.write(chunk);                                                 // Stream payload
        }
        else {
            this._held = this._held + chunk.toString();
        }
    }
    else {
        this._lines.write(chunk);                                                       // Look for boundary
    }
};


internals.Dispenser.prototype._onLineEnd = function () {

    // Boundary whitespace

    if (this._state === internals.state.boundary) {
        if (this._held) {
            this._held = this._held.replace(/[\t ]/g, '');                                // trim() removes new lines
            if (this._held) {
                if (this._held === '--') {
                    this._state = internals.state.epilogue;
                    this._held = '';

                    return;
                }

                return this._abort(Boom.badRequest('Only white space allowed after boundary'));
            }
        }

        this._state = internals.state.header;

        return;
    }

    // Part headers

    if (this._state === internals.state.header) {

        // Header

        if (this._held) {

            // Header continuation

            if (this._held[0] === ' ' ||
                this._held[0] === '\t') {

                if (!this._pendingHeader) {
                    return this._abort(Boom.badRequest('Invalid header continuation without valid declaration on previous line'));
                }

                this._pendingHeader = this._pendingHeader + ' ' + this._held.slice(1);                       // Drop tab
                this._held = '';
                return;
            }

            // Start of new header

            this._flushHeader();
            this._pendingHeader = this._held;
            this._held = '';

            return;
        }

        // End of headers

        this._flushHeader();

        this._state = internals.state.payload;

        const disposition = Content.disposition(this._headers['content-disposition']);

        if (disposition.isBoom) {
            return this._abort(disposition);
        }

        if (disposition.filename !== undefined) {
            const stream = new Stream.PassThrough();
            const transferEncoding = this._headers['content-transfer-encoding'];

            if (transferEncoding &&
                transferEncoding.toLowerCase() === 'base64') {

                this._stream = new B64.Decoder();
                this._stream.pipe(stream);
            }
            else {
                this._stream = stream;
            }

            stream.name = disposition.name;
            stream.filename = disposition.filename;
            stream.headers = this._headers;
            this._headers = {};
            this._emit('part', stream);
        }
        else {
            this._name = disposition.name;
        }

        this._lines.flush();
        return;
    }

    // Epilogue

    this._held = this._held + '\r\n';                               // Put the new line back
};


internals.Dispenser.prototype._onLine = function (chunk) {

    if (this._stream) {
        this._stream.write(chunk);                      // Stream payload
    }
    else {
        this._held = this._held + chunk.toString();                 // Reading header or field
    }
};


internals.Dispenser.prototype._flushHeader = function () {

    if (!this._pendingHeader) {
        return;
    }

    const sep = this._pendingHeader.indexOf(':');

    if (sep === -1) {
        return this._abort(Boom.badRequest('Invalid header missing colon separator'));
    }

    if (!sep) {
        return this._abort(Boom.badRequest('Invalid header missing field name'));
    }

    this._headers[this._pendingHeader.slice(0, sep).toLowerCase()] = this._pendingHeader.slice(sep + 1).trim();
    this._pendingHeader = '';
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
    Encode and decode functions adapted from:
    Version 1.0 12/25/99 Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
    http://www.onicos.com/staff/iz/amuse/javascript/expert/base64.txt
*/

// Load modules

const Stream = __webpack_require__(5);
const Hoek = __webpack_require__(1);


// Declare internals

const internals = {
    blank: new Buffer(''),
    decodeChars: [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
    ]
};


exports.encode = function (buffer) {

    return new Buffer(buffer.toString('base64'));
};


exports.decode = function (buffer) {

    const decodeChars = internals.decodeChars;
    const len = buffer.length;
    const allocated = Math.ceil(len / 4) * 3;
    const result = new Buffer(allocated);

    let c1;
    let c2;
    let c3;
    let c4;
    let j = 0;

    for (let i = 0; i < len; ) {
        do {
            c1 = decodeChars[buffer[i++] & 0xff];
        }
        while (i < len && c1 === -1);

        if (c1 === -1) {
            break;
        }

        do {
            c2 = decodeChars[buffer[i++] & 0xff];
        }
        while (i < len && c2 === -1);

        if (c2 === -1) {
            break;
        }

        result[j++] = (c1 << 2) | ((c2 & 0x30) >> 4);

        do {
            c3 = buffer[i++] & 0xff;
            if (c3 === 61) {                        // =
                return result.slice(0, j);
            }

            c3 = decodeChars[c3];
        }
        while (i < len && c3 === -1);

        if (c3 === -1) {
            break;
        }

        result[j++] = ((c2 & 0x0f) << 4) | ((c3 & 0x3c) >> 2);

        do {
            c4 = buffer[i++] & 0xff;
            if (c4 === 61) {                        // =
                return result.slice(0, j);
            }

            c4 = decodeChars[c4];
        }
        while (i < len && c4 === -1);

        if (c4 !== -1) {
            result[j++] = ((c3 & 0x03) << 6) | c4;
        }
    }

    return (j === allocated ? result : result.slice(0, j));
};


exports.Encoder = internals.Encoder = function () {

    Stream.Transform.call(this);

    this._reminder = null;
};

Hoek.inherits(internals.Encoder, Stream.Transform);


internals.Encoder.prototype._transform = function (chunk, encoding, callback) {

    let part = this._reminder ? Buffer.concat([this._reminder, chunk]) : chunk;
    const remaining = part.length % 3;
    if (remaining) {
        this._reminder = part.slice(part.length - remaining);
        part = part.slice(0, part.length - remaining);
    }
    else {
        this._reminder = null;
    }

    this.push(exports.encode(part));
    return callback();
};


internals.Encoder.prototype._flush = function (callback) {

    if (this._reminder) {
        this.push(exports.encode(this._reminder));
    }

    return callback();
};


exports.Decoder = internals.Decoder = function () {

    Stream.Transform.call(this);

    this._reminder = null;
};

Hoek.inherits(internals.Decoder, Stream.Transform);


internals.Decoder.prototype._transform = function (chunk, encoding, callback) {

    let part = this._reminder ? Buffer.concat([this._reminder, chunk]) : chunk;
    const remaining = part.length % 4;
    if (remaining) {
        this._reminder = part.slice(part.length - remaining);
        part = part.slice(0, part.length - remaining);
    }
    else {
        this._reminder = null;
    }

    this.push(exports.decode(part));
    return callback();
};


internals.Decoder.prototype._flush = function (callback) {

    if (this._reminder) {
        this.push(exports.decode(this._reminder));
    }

    return callback();
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Stream = __webpack_require__(5);
const Hoek = __webpack_require__(1);
const Vise = __webpack_require__(87);


// Declare internals

const internals = {};


exports.compile = function (needle) {

    Hoek.assert(needle && needle.length, 'Missing needle');
    Hoek.assert(Buffer.isBuffer(needle), 'Needle must be a buffer');

    const profile = {
        value: needle,
        lastPos: needle.length - 1,
        last: needle[needle.length - 1],
        length: needle.length,
        badCharShift: new Buffer(256)                  // Lookup table of how many characters can be skipped for each match
    };

    for (let i = 0; i < 256; ++i) {
        profile.badCharShift[i] = profile.length;       // Defaults to the full length of the needle
    }

    const last = profile.length - 1;
    for (let i = 0; i < last; ++i) {                    // For each character in the needle (skip last since its position is already the default)
        profile.badCharShift[profile.value[i]] = last - i;
    }

    return profile;
};


exports.horspool = function (haystack, needle, start) {

    Hoek.assert(haystack, 'Missing haystack');

    needle = (needle.badCharShift ? needle : exports.compile(needle));
    start = start || 0;

    for (let i = start; i <= haystack.length - needle.length;) {       // Has enough room to fit the entire needle
        const lastChar = haystack.readUInt8(i + needle.lastPos, true);
        if (lastChar === needle.last &&
            internals.startsWith(haystack, needle, i)) {

            return i;
        }

        i += needle.badCharShift[lastChar];           // Jump to the next possible position based on last character location in needle
    }

    return -1;
};


internals.startsWith = function (haystack, needle, pos) {

    if (haystack.startsWith) {
        return haystack.startsWith(needle.value, pos, needle.lastPos);
    }

    for (let i = 0; i < needle.lastPos; ++i) {
        if (needle.value[i] !== haystack.readUInt8(pos + i, true)) {
            return false;
        }
    }

    return true;
};


exports.all = function (haystack, needle, start) {

    needle = exports.compile(needle);
    start = start || 0;

    const matches = [];
    for (let i = start; i !== -1 && i < haystack.length;) {

        i = exports.horspool(haystack, needle, i);
        if (i !== -1) {
            matches.push(i);
            i += needle.length;
        }
    }

    return matches;
};


internals._indexOf = function (haystack, needle) {

    Hoek.assert(haystack, 'Missing haystack');

    for (let i = 0; i <= haystack.length - needle.length; ++i) {       // Has enough room to fit the entire needle
        if (haystack.startsWith(needle.value, i)) {
            return i;
        }
    }

    return -1;
};


exports.Stream = internals.Stream = function (needle) {

    const self = this;

    Stream.Writable.call(this);

    this.needle(needle);
    this._haystack = new Vise();
    this._indexOf = this._needle.length > 2 ? exports.horspool : internals._indexOf;

    this.on('finish', () => {

        // Flush out the remainder

        const chunks = self._haystack.chunks();
        for (let i = 0; i < chunks.length; ++i) {
            self.emit('haystack', chunks[i]);
        }

        setImmediate(() => {                  // Give pending events a chance to fire

            self.emit('close');
        });
    });
};

Hoek.inherits(internals.Stream, Stream.Writable);


internals.Stream.prototype.needle = function (needle) {

    this._needle = exports.compile(needle);
};


internals.Stream.prototype._write = function (chunk, encoding, next) {

    this._haystack.push(chunk);

    let match = this._indexOf(this._haystack, this._needle);
    if (match === -1 &&
        chunk.length >= this._needle.length) {

        this._flush(this._haystack.length - chunk.length);
    }

    while (match !== -1) {
        this._flush(match);
        this._haystack.shift(this._needle.length);
        this.emit('needle');

        match = this._indexOf(this._haystack, this._needle);
    }

    if (this._haystack.length) {
        const notChecked = this._haystack.length - this._needle.length + 1;       // Not enough space for Horspool
        let i = notChecked;
        for (; i < this._haystack.length; ++i) {
            if (this._haystack.startsWith(this._needle.value, i, this._haystack.length - i)) {
                break;
            }
        }

        this._flush(i);
    }

    return next();
};


internals.Stream.prototype._flush = function (pos) {

    const chunks = this._haystack.shift(pos);
    for (let i = 0; i < chunks.length; ++i) {
        this.emit('haystack', chunks[i]);
    }
};


internals.Stream.prototype.flush = function () {

    const chunks = this._haystack.shift(this._haystack.length);
    for (let i = 0; i < chunks.length; ++i) {
        this.emit('haystack', chunks[i]);
    }
};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};


exports = module.exports = internals.Vise = function (chunks) {

    this.length = 0;
    this._chunks = [];
    this._offset = 0;

    if (chunks) {
        chunks = [].concat(chunks);
        for (let i = 0; i < chunks.length; ++i) {
            this.push(chunks[i]);
        }
    }
};


internals.Vise.prototype.push = function (chunk) {

    Hoek.assert(Buffer.isBuffer(chunk), 'Chunk must be a buffer');

    const item = {
        data: chunk,
        length: chunk.length,
        offset: this.length + this._offset,
        index: this._chunks.length
    };

    this._chunks.push(item);
    this.length += chunk.length;
};


internals.Vise.prototype.shift = function (length) {

    if (!length) {
        return [];
    }

    const prevOffset = this._offset;
    const item = this._chunkAt(length);

    let dropTo = this._chunks.length;
    this._offset = 0;

    if (item) {
        dropTo = item.chunk.index;
        this._offset = item.offset;
    }

    // Drop lower chunks

    const chunks = [];
    for (let i = 0; i < dropTo; ++i) {
        const chunk = this._chunks.shift();
        if (i === 0 &&
            prevOffset) {

            chunks.push(chunk.data.slice(prevOffset));
        }
        else {
            chunks.push(chunk.data);
        }
    }

    if (this._offset) {
        chunks.push(item.chunk.data.slice(dropTo ? 0 : prevOffset, this._offset));
    }

    // Recalculate existing chunks

    this.length = 0;
    for (let i = 0; i < this._chunks.length; ++i) {
        const chunk = this._chunks[i];
        chunk.offset = this.length,
        chunk.index = i;

        this.length += chunk.length;
    }

    this.length -= this._offset;

    return chunks;
};


internals.Vise.prototype.at = internals.Vise.prototype.readUInt8 = function (pos) {

    const item = this._chunkAt(pos);
    return item ? item.chunk.data[item.offset] : undefined;
};


internals.Vise.prototype._chunkAt = function (pos) {

    if (pos < 0) {
        return null;
    }

    pos = pos + this._offset;

    for (let i = 0; i < this._chunks.length; ++i) {
        const chunk = this._chunks[i];
        const offset = pos - chunk.offset;
        if (offset < chunk.length) {
            return { chunk: chunk, offset: offset };
        }
    }

    return null;
};


internals.Vise.prototype.chunks = function () {

    const chunks = [];

    for (let i = 0; i < this._chunks.length; ++i) {
        const chunk = this._chunks[i];
        if (i === 0 &&
            this._offset) {

            chunks.push(chunk.data.slice(this._offset));
        }
        else {
            chunks.push(chunk.data);
        }
    }

    return chunks;
};


internals.Vise.prototype.startsWith = function (value, pos, length) {

    pos = pos || 0;

    length = length ? Math.min(value.length, length) : value.length;
    if (pos + length > this.length) {                                   // Not enough length to fit value
        return false;
    }

    const start = this._chunkAt(pos);
    if (!start) {
        return false;
    }

    let j = start.chunk.index;
    for (let i = 0; j < this._chunks.length && i < length; ++j) {
        const chunk = this._chunks[j];

        let k = (j === start.chunk.index ? start.offset : 0);
        for (; k < chunk.length && i < length; ++k, ++i) {
            if (chunk.data[k] !== value[i]) {
                return false;
            }
        }
    }

    return true;
};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Events = __webpack_require__(13);
const Url = __webpack_require__(27);
const Http = __webpack_require__(21);
const Https = __webpack_require__(49);
const Stream = __webpack_require__(5);
const Hoek = __webpack_require__(1);
const Boom = __webpack_require__(2);
const Payload = __webpack_require__(36);
const Recorder = __webpack_require__(89);
const Tap = __webpack_require__(90);


// Declare internals

const internals = {
    jsonRegex: /^application\/[a-z.+-]*json$/,
    shallowOptions: ['agent', 'payload', 'downstreamRes', 'beforeRedirect', 'redirected'],
    emitSymbol: Symbol.for('wreck')
};

process[internals.emitSymbol] = process[internals.emitSymbol] || new Events.EventEmitter();


// new instance is exported as module.exports

internals.Client = function (defaults) {

    // Use a single emitter instance for events
    Object.assign(this, process[internals.emitSymbol]);

    this.agents = {
        https: new Https.Agent({ maxSockets: Infinity }),
        http: new Http.Agent({ maxSockets: Infinity }),
        httpsAllowUnauthorized: new Https.Agent({ maxSockets: Infinity, rejectUnauthorized: false })
    };

    this._defaults = defaults || {};
};

Hoek.inherits(internals.Client, Events.EventEmitter);


internals.Client.prototype.defaults = function (options) {

    options = Hoek.applyToDefaultsWithShallow(options, this._defaults, internals.shallowOptions);
    return new internals.Client(options);
};


internals.resolveUrl = function (baseUrl, path) {

    if (!path) {
        return baseUrl;
    }

    const parsedBase = Url.parse(baseUrl);
    const parsedPath = Url.parse(path);

    parsedBase.pathname = parsedBase.pathname + parsedPath.pathname;
    parsedBase.pathname = parsedBase.pathname.replace(/[/]{2,}/g, '/');
    parsedBase.search = parsedPath.search;      // Always use the querystring from the path argument

    return Url.format(parsedBase);
};


internals.Client.prototype.request = function (method, url, options, callback, _trace) {

    options = Hoek.applyToDefaultsWithShallow(this._defaults, options || {}, internals.shallowOptions);

    Hoek.assert(options.payload === null || options.payload === undefined || typeof options.payload === 'string' ||
        options.payload instanceof Stream || Buffer.isBuffer(options.payload),
        'options.payload must be a string, a Buffer, or a Stream');

    Hoek.assert((options.agent === undefined || options.agent === null) || (typeof options.rejectUnauthorized !== 'boolean'),
        'options.agent cannot be set to an Agent at the same time as options.rejectUnauthorized is set');

    Hoek.assert(options.beforeRedirect === undefined || options.beforeRedirect === null || typeof options.beforeRedirect === 'function',
        'options.beforeRedirect must be a function');

    Hoek.assert(options.redirected === undefined || options.redirected === null || typeof options.redirected === 'function',
        'options.redirected must be a function');

    if (options.baseUrl) {
        url = internals.resolveUrl(options.baseUrl, url);
        delete options.baseUrl;
    }

    const uri = Url.parse(url);

    if (options.socketPath) {
        uri.socketPath = options.socketPath;
        delete options.socketPath;
    }

    uri.method = method.toUpperCase();
    uri.headers = options.headers || {};
    const hasContentLength = Object.keys(uri.headers).some((key) => {

        return key.toLowerCase() === 'content-length';
    });

    const payloadSupported = (uri.method !== 'GET' && uri.method !== 'HEAD' && options.payload !== null && options.payload !== undefined);
    if (payloadSupported &&
        (typeof options.payload === 'string' || Buffer.isBuffer(options.payload)) &&
        (!hasContentLength)) {

        uri.headers = Hoek.clone(uri.headers);
        uri.headers['content-length'] = Buffer.isBuffer(options.payload) ? options.payload.length : Buffer.byteLength(options.payload);
    }

    let redirects = (options.hasOwnProperty('redirects') ? options.redirects : false);      // Needed to allow 0 as valid value when passed recursively

    _trace = (_trace || []);
    _trace.push({ method: uri.method, url: url });

    const client = (uri.protocol === 'https:' ? Https : Http);

    if (options.rejectUnauthorized !== undefined && uri.protocol === 'https:') {
        uri.agent = options.rejectUnauthorized ? this.agents.https : this.agents.httpsAllowUnauthorized;
    }
    else if (options.agent || options.agent === false) {
        uri.agent = options.agent;
    }
    else {
        uri.agent = uri.protocol === 'https:' ? this.agents.https : this.agents.http;
    }

    if (options.secureProtocol !== undefined) {
        uri.secureProtocol = options.secureProtocol;
    }

    this.emit('request', uri, options);

    const start = Date.now();
    const req = client.request(uri);

    let shadow = null;                                                                      // A copy of the streamed request payload when redirects are enabled
    let timeoutId;

    const onError = (err) => {

        err.trace = _trace;
        return finishOnce(Boom.badGateway('Client request error', err));
    };
    req.once('error', onError);

    const onResponse = (res) => {

        // Pass-through response

        const statusCode = res.statusCode;

        if (redirects === false ||
            [301, 302, 307, 308].indexOf(statusCode) === -1) {

            return finishOnce(null, res);
        }

        // Redirection

        const redirectMethod = (statusCode === 301 || statusCode === 302 ? 'GET' : uri.method);
        let location = res.headers.location;

        res.destroy();

        if (redirects === 0) {
            return finishOnce(Boom.badGateway('Maximum redirections reached', _trace));
        }

        if (!location) {
            return finishOnce(Boom.badGateway('Received redirection without location', _trace));
        }

        if (!/^https?:/i.test(location)) {
            location = Url.resolve(uri.href, location);
        }

        const redirectOptions = Hoek.cloneWithShallow(options, internals.shallowOptions);

        redirectOptions.payload = shadow || options.payload;         // shadow must be ready at this point if set
        redirectOptions.redirects = --redirects;

        if (options.beforeRedirect) {
            options.beforeRedirect(redirectMethod, statusCode, location, redirectOptions);
        }

        const redirectReq = this.request(redirectMethod, location, redirectOptions, finishOnce, _trace);

        if (options.redirected) {
            options.redirected(statusCode, location, redirectReq);
        }
    };

    // Register handlers

    const finish = (err, res) => {

        if (err) {
            req.abort();
        }

        req.removeListener('response', onResponse);
        req.removeListener('error', onError);
        req.on('error', Hoek.ignore);
        clearTimeout(timeoutId);
        this.emit('response', err, req, res, start, uri);

        if (callback) {
            return callback(err, res);
        }
    };

    const finishOnce = Hoek.once(finish);

    req.once('response', onResponse);

    if (options.timeout) {
        timeoutId = setTimeout(() => {

            return finishOnce(Boom.gatewayTimeout('Client request timeout'));
        }, options.timeout);
        delete options.timeout;
    }

    // Custom abort method to detect early aborts

    const _abort = req.abort;
    let aborted = false;
    req.abort = () => {

        if (!aborted && !req.res && !req.socket) {
            process.nextTick(() => {

                // Fake an ECONNRESET error

                const error = new Error('socket hang up');
                error.code = 'ECONNRESET';
                finishOnce(error);
            });
        }

        aborted = true;
        return _abort.call(req);
    };

    // Write payload

    if (payloadSupported) {
        if (options.payload instanceof Stream) {
            let stream = options.payload;

            if (redirects) {
                const collector = new Tap();
                collector.once('finish', () => {

                    shadow = collector.collect();
                });

                stream = options.payload.pipe(collector);
            }

            stream.pipe(req);
            return req;
        }

        req.write(options.payload);
    }

    // Finalize request

    req.end();

    return req;
};


// read()

internals.Client.prototype.read = function (res, options, callback) {

    options = Hoek.applyToDefaultsWithShallow(options || {}, this._defaults, internals.shallowOptions);

    // Set stream timeout

    const clientTimeout = options.timeout;
    let clientTimeoutId = null;

    // Finish once

    const finish = (err, buffer) => {

        clearTimeout(clientTimeoutId);
        reader.removeListener('error', onReaderError);
        reader.removeListener('finish', onReaderFinish);
        res.removeListener('error', onResError);
        res.removeListener('close', onResClose);
        res.on('error', Hoek.ignore);

        if (err ||
            !options.json) {

            return callback(err, buffer);
        }

        // Parse JSON

        let result;
        if (buffer.length === 0) {
            return callback(null, null);
        }

        if (options.json === 'force') {
            result = internals.tryParseBuffer(buffer);
            return callback(result.err, result.json);
        }

        // mode is "smart" or true

        const contentType = (res.headers && res.headers['content-type']) || '';
        const mime = contentType.split(';')[0].trim().toLowerCase();

        if (!internals.jsonRegex.test(mime)) {
            return callback(null, buffer);
        }

        result = internals.tryParseBuffer(buffer);
        return callback(result.err, result.json);
    };

    const finishOnce = Hoek.once(finish);

    if (clientTimeout &&
        clientTimeout > 0) {

        clientTimeoutId = setTimeout(() => {

            finishOnce(Boom.clientTimeout());
        }, clientTimeout);
    }

    // Hander errors

    const onResError = (err) => {

        return finishOnce(Boom.internal('Payload stream error', err));
    };

    const onResClose = () => {

        return finishOnce(Boom.internal('Payload stream closed prematurely'));
    };

    res.once('error', onResError);
    res.once('close', onResClose);

    // Read payload

    const reader = new Recorder({ maxBytes: options.maxBytes });

    const onReaderError = (err) => {

        if (res.destroy) {                          // GZip stream has no destroy() method
            res.destroy();
        }

        return finishOnce(err);
    };

    reader.once('error', onReaderError);

    const onReaderFinish = () => {

        return finishOnce(null, reader.collect());
    };

    reader.once('finish', onReaderFinish);

    res.pipe(reader);
};


// toReadableStream()

internals.Client.prototype.toReadableStream = function (payload, encoding) {

    return new Payload(payload, encoding);
};


// parseCacheControl()

internals.Client.prototype.parseCacheControl = function (field) {

    /*
        Cache-Control   = 1#cache-directive
        cache-directive = token [ "=" ( token / quoted-string ) ]
        token           = [^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+
        quoted-string   = "(?:[^"\\]|\\.)*"
    */

    //                             1: directive                                        =   2: token                                              3: quoted-string
    const regex = /(?:^|(?:\s*\,\s*))([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)(?:\=(?:([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)|(?:\"((?:[^"\\]|\\.)*)\")))?/g;

    const header = {};
    const error = field.replace(regex, ($0, $1, $2, $3) => {

        const value = $2 || $3;
        header[$1] = value ? value.toLowerCase() : true;
        return '';
    });

    if (header['max-age']) {
        try {
            const maxAge = parseInt(header['max-age'], 10);
            if (isNaN(maxAge)) {
                return null;
            }

            header['max-age'] = maxAge;
        }
        catch (err) { }
    }

    return (error ? null : header);
};


// Shortcuts

internals.Client.prototype.get = function (uri, options, callback) {

    return this._shortcutWrap('GET', uri, options, callback);
};


internals.Client.prototype.post = function (uri, options, callback) {

    return this._shortcutWrap('POST', uri, options, callback);
};


internals.Client.prototype.patch = function (uri, options, callback) {

    return this._shortcutWrap('PATCH', uri, options, callback);
};


internals.Client.prototype.put = function (uri, options, callback) {

    return this._shortcutWrap('PUT', uri, options, callback);
};


internals.Client.prototype.delete = function (uri, options, callback) {

    return this._shortcutWrap('DELETE', uri, options, callback);
};


// Wrapper so that shortcut can be optimized with required params

internals.Client.prototype._shortcutWrap = function (method, uri /* [options], callback */) {

    const options = (typeof arguments[2] === 'function' ? {} : arguments[2]);
    const callback = (typeof arguments[2] === 'function' ? arguments[2] : arguments[3]);

    return this._shortcut(method, uri, options, callback);
};


internals.Client.prototype._shortcut = function (method, uri, options, callback) {

    return this.request(method, uri, options, (err, res) => {

        if (err) {
            return callback(err);
        }

        this.read(res, options, (err, payload) => {

            return callback(err, res, payload);
        });
    });
};


internals.tryParseBuffer = function (buffer) {

    const result = {
        json: null,
        err: null
    };
    try {
        const json = JSON.parse(buffer.toString());
        result.json = json;
    }
    catch (err) {
        result.err = err;
    }
    return result;
};


module.exports = new internals.Client();


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(2);
const Hoek = __webpack_require__(1);
const Stream = __webpack_require__(5);


// Declare internals

const internals = {};


module.exports = internals.Recorder = function (options) {

    Stream.Writable.call(this);

    this.settings = options;                // No need to clone since called internally with new object
    this.buffers = [];
    this.length = 0;
};

Hoek.inherits(internals.Recorder, Stream.Writable);


internals.Recorder.prototype._write = function (chunk, encoding, next) {

    if (this.settings.maxBytes &&
        this.length + chunk.length > this.settings.maxBytes) {

        return this.emit('error', Boom.badRequest('Payload content length greater than maximum allowed: ' + this.settings.maxBytes));
    }

    this.length = this.length + chunk.length;
    this.buffers.push(chunk);
    next();
};


internals.Recorder.prototype.collect = function () {

    const buffer = (this.buffers.length === 0 ? new Buffer(0) : (this.buffers.length === 1 ? this.buffers[0] : Buffer.concat(this.buffers, this.length)));
    return buffer;
};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);
const Stream = __webpack_require__(5);
const Payload = __webpack_require__(36);


// Declare internals

const internals = {};


module.exports = internals.Tap = function () {

    Stream.Transform.call(this);
    this.buffers = [];
};

Hoek.inherits(internals.Tap, Stream.Transform);


internals.Tap.prototype._transform = function (chunk, encoding, next) {

    this.buffers.push(chunk);
    next(null, chunk);
};


internals.Tap.prototype.collect = function () {

    return new Payload(this.buffers);
};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};


exports = module.exports = internals.Topo = function () {

    this._items = [];
    this.nodes = [];
};


internals.Topo.prototype.add = function (nodes, options) {

    options = options || {};

    // Validate rules

    const before = [].concat(options.before || []);
    const after = [].concat(options.after || []);
    const group = options.group || '?';
    const sort = options.sort || 0;                   // Used for merging only

    Hoek.assert(before.indexOf(group) === -1, 'Item cannot come before itself:', group);
    Hoek.assert(before.indexOf('?') === -1, 'Item cannot come before unassociated items');
    Hoek.assert(after.indexOf(group) === -1, 'Item cannot come after itself:', group);
    Hoek.assert(after.indexOf('?') === -1, 'Item cannot come after unassociated items');

    ([].concat(nodes)).forEach((node, i) => {

        const item = {
            seq: this._items.length,
            sort: sort,
            before: before,
            after: after,
            group: group,
            node: node
        };

        this._items.push(item);
    });

    // Insert event

    const error = this._sort();
    Hoek.assert(!error, 'item', (group !== '?' ? 'added into group ' + group : ''), 'created a dependencies error');

    return this.nodes;
};


internals.Topo.prototype.merge = function (others) {

    others = [].concat(others);
    for (let i = 0; i < others.length; ++i) {
        const other = others[i];
        if (other) {
            for (let j = 0; j < other._items.length; ++j) {
                const item = Hoek.shallow(other._items[j]);
                this._items.push(item);
            }
        }
    }

    // Sort items

    this._items.sort(internals.mergeSort);
    for (let i = 0; i < this._items.length; ++i) {
        this._items[i].seq = i;
    }

    const error = this._sort();
    Hoek.assert(!error, 'merge created a dependencies error');

    return this.nodes;
};


internals.mergeSort = function (a, b) {

    return a.sort === b.sort ? 0 : (a.sort < b.sort ? -1 : 1);
};


internals.Topo.prototype._sort = function () {

    // Construct graph

    const groups = {};
    const graph = {};
    const graphAfters = {};

    for (let i = 0; i < this._items.length; ++i) {
        const item = this._items[i];
        const seq = item.seq;                         // Unique across all items
        const group = item.group;

        // Determine Groups

        groups[group] = groups[group] || [];
        groups[group].push(seq);

        // Build intermediary graph using 'before'

        graph[seq] = item.before;

        // Build second intermediary graph with 'after'

        const after = item.after;
        for (let j = 0; j < after.length; ++j) {
            graphAfters[after[j]] = (graphAfters[after[j]] || []).concat(seq);
        }
    }

    // Expand intermediary graph

    let graphNodes = Object.keys(graph);
    for (let i = 0; i < graphNodes.length; ++i) {
        const node = graphNodes[i];
        const expandedGroups = [];

        const graphNodeItems = Object.keys(graph[node]);
        for (let j = 0; j < graphNodeItems.length; ++j) {
            const group = graph[node][graphNodeItems[j]];
            groups[group] = groups[group] || [];

            for (let k = 0; k < groups[group].length; ++k) {

                expandedGroups.push(groups[group][k]);
            }
        }
        graph[node] = expandedGroups;
    }

    // Merge intermediary graph using graphAfters into final graph

    const afterNodes = Object.keys(graphAfters);
    for (let i = 0; i < afterNodes.length; ++i) {
        const group = afterNodes[i];

        if (groups[group]) {
            for (let j = 0; j < groups[group].length; ++j) {
                const node = groups[group][j];
                graph[node] = graph[node].concat(graphAfters[group]);
            }
        }
    }

    // Compile ancestors

    let children;
    const ancestors = {};
    graphNodes = Object.keys(graph);
    for (let i = 0; i < graphNodes.length; ++i) {
        const node = graphNodes[i];
        children = graph[node];

        for (let j = 0; j < children.length; ++j) {
            ancestors[children[j]] = (ancestors[children[j]] || []).concat(node);
        }
    }

    // Topo sort

    const visited = {};
    const sorted = [];

    for (let i = 0; i < this._items.length; ++i) {
        let next = i;

        if (ancestors[i]) {
            next = null;
            for (let j = 0; j < this._items.length; ++j) {
                if (visited[j] === true) {
                    continue;
                }

                if (!ancestors[j]) {
                    ancestors[j] = [];
                }

                const shouldSeeCount = ancestors[j].length;
                let seenCount = 0;
                for (let k = 0; k < shouldSeeCount; ++k) {
                    if (sorted.indexOf(ancestors[j][k]) >= 0) {
                        ++seenCount;
                    }
                }

                if (seenCount === shouldSeeCount) {
                    next = j;
                    break;
                }
            }
        }

        if (next !== null) {
            next = next.toString();         // Normalize to string TODO: replace with seq
            visited[next] = true;
            sorted.push(next);
        }
    }

    if (sorted.length !== this._items.length) {
        return new Error('Invalid dependencies');
    }

    const seqIndex = {};
    for (let i = 0; i < this._items.length; ++i) {
        const item = this._items[i];
        seqIndex[item.seq] = item;
    }

    const sortedNodes = [];
    this._items = sorted.map((value) => {

        const sortedItem = seqIndex[value];
        sortedNodes.push(sortedItem.node);
        return sortedItem;
    });

    this.nodes = sortedNodes;
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (server) {
  return {
    method: 'GET',
    path: '/api/applications/{clientId}',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:applications']
      },
      description: 'Get a single application based on its Client ID.',
      validate: {
        params: {
          clientId: _joi2.default.string().required()
        }
      },
      pre: [server.handlers.managementClient]
    },
    handler: function handler(req, reply) {
      return req.pre.auth0.clients.get({ client_id: req.params.clientId }).then(function (client) {
        return reply(client);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _multipartRequest = __webpack_require__(11);

var _multipartRequest2 = _interopRequireDefault(_multipartRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (server) {
  return {
    method: 'GET',
    path: '/api/applications',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:applications']
      },
      pre: [server.handlers.managementClient]
    },
    handler: function handler(req, reply) {
      return (0, _multipartRequest2.default)(req.pre.auth0, 'clients', { is_global: false, fields: 'client_id,name,callbacks,app_type' }).then(function (clients) {
        return _lodash2.default.chain(clients).filter(function (client) {
          return client.app_type === 'spa' || client.app_type === 'native' || client.app_type === 'regular_web';
        }).sortBy(function (client) {
          return client.name.toLowerCase();
        }).value();
      }).then(function (applications) {
        return reply(applications);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _apiaccess = __webpack_require__(10);

module.exports = function () {
  return {
    method: 'DELETE',
    path: '/api/configuration/resource-server',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['delete:resource-server']
      }
    },
    handler: function handler(req, reply) {
      return (0, _apiaccess.deleteApi)(req).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _apiaccess = __webpack_require__(10);

module.exports = function () {
  return {
    method: 'GET',
    path: '/api/configuration/resource-server',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:resource-server']
      }
    },
    handler: function handler(req, reply) {
      return (0, _apiaccess.getApi)(req).then(function (api) {
        return reply({ apiAccess: !!api.identifier, token_lifetime: api.token_lifetime });
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  return {
    method: 'GET',
    path: '/api/configuration',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:configuration']
      }
    },
    handler: function handler(req, reply) {
      return req.storage.getConfiguration().then(function (config) {
        return reply(config);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _multipartRequest = __webpack_require__(11);

var _multipartRequest2 = _interopRequireDefault(_multipartRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (server) {
  return {
    method: 'GET',
    path: '/api/configuration/status',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:configuration']
      },
      pre: [server.handlers.managementClient]
    },
    handler: function handler(req, reply) {
      return (0, _multipartRequest2.default)(req.pre.auth0, 'rules', { fields: 'name,enabled' }).then(function (rules) {
        var rule = _lodash2.default.find(rules, { name: 'auth0-authorization-extension' });
        return {
          exists: !!rule,
          enabled: rule ? rule.enabled : false
        };
      }).then(function (rule) {
        req.storage.getStatus().then(function (database) {
          return reply({ rule: rule, database: database });
        }).catch(function () {
          return reply({ rule: rule, database: { size: 0, type: 'unknown' } });
        });
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  return {
    method: 'GET',
    path: '/api/configuration/export',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:configuration']
      }
    },
    handler: function handler(req, reply) {
      if (!req.storage.provider || !req.storage.provider.storageContext || typeof req.storage.provider.storageContext.read !== 'function') {
        return reply.error(new Error('Unable to use "export" without proper storage'));
      }

      return req.storage.provider.storageContext.read().then(function (result) {
        return reply(result);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _apiaccess = __webpack_require__(10);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'PATCH',
    path: '/api/configuration/resource-server',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:resource-server']
      },
      validate: {
        payload: {
          apiAccess: _joi2.default.boolean().required(),
          token_lifetime: _joi2.default.number().integer()
        }
      }
    },
    handler: function handler(req, reply) {
      if (!req.payload.apiAccess) {
        return (0, _apiaccess.deleteApi)(req).then(function () {
          return reply().code(204);
        }).catch(function (err) {
          return reply.error(err);
        });
      }

      return (0, _apiaccess.getApi)(req).then(function (resourceServer) {
        if (resourceServer) {
          return (0, _apiaccess.updateApi)(req, req.payload.token_lifetime);
        }

        return (0, _apiaccess.createApi)(req, req.payload.token_lifetime);
      }).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _generateApiKey = __webpack_require__(44);

var _generateApiKey2 = _interopRequireDefault(_generateApiKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (server) {
  return {
    method: 'PATCH',
    path: '/api/configuration/rotate-apikey',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:configuration']
      },
      pre: [server.handlers.managementClient]
    },
    handler: function handler(req, reply) {
      return (0, _generateApiKey2.default)(req.storage, req.pre.auth0).then(function (hash) {
        return reply({ hash: hash });
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _configuration = __webpack_require__(37);

var _configuration2 = _interopRequireDefault(_configuration);

var _compileRule = __webpack_require__(153);

var _compileRule2 = _interopRequireDefault(_compileRule);

var _multipartRequest = __webpack_require__(11);

var _multipartRequest2 = _interopRequireDefault(_multipartRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (server) {
  return {
    method: 'PATCH',
    path: '/api/configuration',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:configuration']
      },
      pre: [server.handlers.managementClient],
      validate: {
        options: {
          allowUnknown: false
        },
        payload: _configuration2.default
      }
    },
    handler: function handler(req, reply) {
      var config = req.payload;

      (0, _compileRule2.default)(req.storage, req.pre.auth0, config, req.auth.credentials.email || 'unknown').then(function (script) {
        (0, _multipartRequest2.default)(req.pre.auth0, 'rules', { fields: 'name,id' }).then(function (rules) {
          var payload = {
            name: 'auth0-authorization-extension',
            enabled: true,
            script: script
          };

          var rule = _lodash2.default.find(rules, { name: payload.name });
          if (!rule) {
            return req.pre.auth0.rules.create(_extends({ stage: 'login_success' }, payload));
          }

          return req.pre.auth0.rules.update({ id: rule.id }, payload);
        });
      }).then(function () {
        return req.storage.updateConfiguration(config);
      }).then(function (updated) {
        return reply(updated);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _apiaccess = __webpack_require__(10);

module.exports = function () {
  return {
    method: 'POST',
    path: '/api/configuration/resource-server',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['create:resource-server']
      }
    },
    handler: function handler(req, reply) {
      return (0, _apiaccess.createApi)(req).then(function (api) {
        return reply(api);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _storage = __webpack_require__(104);

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'POST',
    path: '/api/configuration/import',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:configuration']
      },
      validate: {
        payload: _storage2.default
      }
    },
    handler: function handler(req, reply) {
      if (!req.storage.provider || !req.storage.provider.storageContext || typeof req.storage.provider.storageContext.write !== 'function') {
        return reply.error(new Error('Unable to use "import" without proper storage'));
      }

      if (req.storage.provider.storageContext.storage && req.storage.provider.storageContext.storage.set) {
        return req.storage.provider.storageContext.storage.set(req.payload, { force: true }, function (err) {
          if (err) {
            return reply.error(err);
          }

          return reply().code(204);
        });
      }

      return req.storage.provider.storageContext.write(req.payload).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _configuration = __webpack_require__(37);

var _configuration2 = _interopRequireDefault(_configuration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extend = function extend(schema) {
  return schema.keys({ _id: _joi2.default.string().required() });
};

exports.default = _joi2.default.object().keys({
  configuration: _joi2.default.array().items(extend(_configuration2.default)),
  groups: _joi2.default.array().items(_joi2.default.object()),
  roles: _joi2.default.array().items(_joi2.default.object()),
  permissions: _joi2.default.array().items(_joi2.default.object()),
  applications: _joi2.default.array().items(_joi2.default.object()),
  rules: _joi2.default.array().items(_joi2.default.object())
});

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _multipartRequest = __webpack_require__(11);

var _multipartRequest2 = _interopRequireDefault(_multipartRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (server) {
  return {
    method: 'GET',
    path: '/api/connections',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:connections']
      },
      pre: [server.handlers.managementClient]
    },
    handler: function handler(req, reply) {
      return (0, _multipartRequest2.default)(req.pre.auth0, 'connections', { fields: 'id,name,strategy' }).then(function (connections) {
        return _lodash2.default.chain(connections).sortBy(function (conn) {
          return conn.name.toLowerCase();
        }).value();
      }).then(function (connections) {
        return reply(connections);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _config = __webpack_require__(4);

var _config2 = _interopRequireDefault(_config);

var _apiaccess = __webpack_require__(10);

var _multipartRequest = __webpack_require__(11);

var _multipartRequest2 = _interopRequireDefault(_multipartRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (server) {
  return {
    method: 'DELETE',
    path: '/.extensions/on-uninstall',
    config: {
      auth: false,
      pre: [server.handlers.validateHookToken('/.extensions/on-uninstall'), server.handlers.managementClient]
    },
    handler: function handler(req, reply) {
      (0, _multipartRequest2.default)(req.pre.auth0, 'rules', { fields: 'name,id' }).then(function (rules) {
        var rule = _lodash2.default.find(rules, { name: 'auth0-authorization-extension' });
        if (rule) {
          return req.pre.auth0.rules.delete({ id: rule.id });
        }

        return Promise.resolve();
      }).then(function () {
        return (0, _apiaccess.deleteApi)(req, true);
      }).then(function () {
        return req.pre.auth0.clients.delete({ client_id: (0, _config2.default)('AUTH0_CLIENT_ID') });
      }).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (server) {
  return {
    method: 'PUT',
    path: '/.extensions/on-update',
    config: {
      auth: false,
      pre: [server.handlers.validateHookToken('/.extensions/on-update'), server.handlers.managementClient]
    },
    handler: function handler(req, reply) {
      reply().code(204);
    }
  };
};

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _mapping_ids = __webpack_require__(112);

var _mapping_ids2 = _interopRequireDefault(_mapping_ids);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'DELETE',
    path: '/api/groups/{id}/mappings',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:groups']
      },
      description: 'Delete one or more group mappings from a group.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        params: {
          id: _joi2.default.string().guid().required()
        },
        payload: _mapping_ids2.default
      }
    },
    handler: function handler(req, reply) {
      var mappings = req.payload;

      req.storage.getGroup(req.params.id).then(function (group) {
        mappings.forEach(function (mappingId) {
          var groupMapping = _lodash2.default.find(group.mappings, { _id: mappingId });
          if (groupMapping) {
            group.mappings.splice(group.mappings.indexOf(groupMapping), 1);
          }
        });

        return req.storage.updateGroup(req.params.id, group);
      }).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _queries = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (server) {
  return {
    method: 'GET',
    path: '/api/groups/{id}/mappings',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:groups']
      },
      description: 'Get the mappings for a group.',
      tags: ['api'],
      pre: [server.handlers.managementClient],
      validate: {
        params: {
          id: _joi2.default.string().guid().required()
        }
      }
    },
    handler: function handler(req, reply) {
      return req.storage.getGroup(req.params.id).then(function (group) {
        return group.mappings || [];
      }).then(function (mappings) {
        return (0, _queries.getMappingsWithNames)(req.pre.auth0, mappings);
      }).then(function (mappings) {
        return reply(mappings);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _nodeUuid = __webpack_require__(183);

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _mappings = __webpack_require__(113);

var _mappings2 = _interopRequireDefault(_mappings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'PATCH',
    path: '/api/groups/{id}/mappings',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:groups']
      },
      description: 'Create one or more mappings in a group.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        payload: _mappings2.default
      }
    },
    handler: function handler(req, reply) {
      var mappings = req.payload;

      req.storage.getGroup(req.params.id).then(function (group) {
        if (!group.mappings) {
          group.mappings = [];
        }

        mappings.forEach(function (mapping) {
          group.mappings.push({
            _id: _nodeUuid2.default.v4(),
            groupName: mapping.groupName,
            connectionName: mapping.connectionName
          });
        });

        return req.storage.updateGroup(req.params.id, group);
      }).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _joi2.default.object().keys({
  groupName: _joi2.default.string().min(1).max(50).required(),
  connectionName: _joi2.default.string().min(1).max(50).required()
});

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _joi2.default.array().items(_joi2.default.string().guid()).required().min(1);

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _mapping = __webpack_require__(111);

var _mapping2 = _interopRequireDefault(_mapping);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _joi2.default.array().items(_mapping2.default).required().min(1);

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _user_ids = __webpack_require__(38);

var _user_ids2 = _interopRequireDefault(_user_ids);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'DELETE',
    path: '/api/groups/{id}/members',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:groups']
      },
      description: 'Delete one or more members from a group.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        params: {
          id: _joi2.default.string().guid().required()
        },
        payload: _user_ids2.default
      }
    },
    handler: function handler(req, reply) {
      var members = req.payload;

      req.storage.getGroup(req.params.id).then(function (group) {
        members.forEach(function (userId) {
          var index = group.members.indexOf(userId);
          if (index > -1) {
            group.members.splice(index, 1);
          }
        });

        return req.storage.updateGroup(req.params.id, group);
      }).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _users = __webpack_require__(46);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (server) {
  return {
    method: 'GET',
    path: '/api/groups/{id}/members',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:groups']
      },
      description: 'Get the members for a group.',
      tags: ['api'],
      pre: [server.handlers.managementClient],
      validate: {
        params: {
          id: _joi2.default.string().guid().required()
        },
        query: {
          per_page: _joi2.default.number().integer().min(1).max(25).default(25), // eslint-disable-line newline-per-chained-call
          page: _joi2.default.number().integer().min(0).default(0)
        }
      }
    },
    handler: function handler(req, reply) {
      return req.storage.getGroup(req.params.id).then(function (group) {
        return (0, _users.getUsersById)(req.pre.auth0, group.members || [], req.query.page, req.query.per_page);
      }).then(function (users) {
        return reply(users);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _users = __webpack_require__(46);

var _queries = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (server) {
  return {
    method: 'GET',
    path: '/api/groups/{id}/members/nested',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:groups']
      },
      description: 'Get the nested members for a group.',
      tags: ['api'],
      pre: [server.handlers.managementClient],
      validate: {
        params: {
          id: _joi2.default.string().guid().required()
        },
        query: {
          per_page: _joi2.default.number().integer().min(1).max(25).default(25), // eslint-disable-line newline-per-chained-call
          page: _joi2.default.number().integer().min(0).default(0)
        }
      }
    },
    handler: function handler(req, reply) {
      return req.storage.getGroups().then(function (groups) {
        var group = _lodash2.default.find(groups, { _id: req.params.id });
        var currentAndChildGroups = (0, _queries.getChildGroups)(groups, [group]);
        return (0, _queries.getMembers)(currentAndChildGroups);
      }).then(function (members) {
        var userIds = members ? members.map(function (member) {
          return member.userId;
        }) : [];

        return (0, _users.getUsersById)(req.pre.auth0, userIds, req.query.page, req.query.per_page).then(function (data) {
          var total = members.length;
          var users = data.users.map(function (u) {
            var userGroup = _lodash2.default.find(members, { userId: u.user_id });
            if (userGroup) {
              userGroup = { _id: userGroup.group._id, name: userGroup.group.name, description: userGroup.group.description };
            }

            return {
              user: {
                user_id: u.user_id,
                name: u.name,
                nickname: u.nickname,
                email: u.email
              },
              group: userGroup
            };
          });

          return { total: total, nested: _lodash2.default.sortByOrder(users, ['user.name'], [true]) };
        });
      }).then(function (users) {
        return reply(users);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _user_ids = __webpack_require__(38);

var _user_ids2 = _interopRequireDefault(_user_ids);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'PATCH',
    path: '/api/groups/{id}/members',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:groups']
      },
      description: 'Add one or more members in a group.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        params: {
          id: _joi2.default.string().guid().required()
        },
        payload: _user_ids2.default
      }
    },
    handler: function handler(req, reply) {
      var members = req.payload;

      req.storage.getGroup(req.params.id).then(function (group) {
        if (!group.members) {
          group.members = [];
        }

        members.forEach(function (userId) {
          if (group.members.indexOf(userId) === -1) {
            group.members.push(userId);
          }
        });

        return req.storage.updateGroup(req.params.id, group);
      }).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _group_ids = __webpack_require__(39);

var _group_ids2 = _interopRequireDefault(_group_ids);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'DELETE',
    path: '/api/groups/{id}/nested',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:groups']
      },
      description: 'Delete one or more nested groups from a group.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        params: {
          id: _joi2.default.string().guid().required()
        },
        payload: _group_ids2.default
      }
    },
    handler: function handler(req, reply) {
      var nested = req.payload;

      req.storage.getGroup(req.params.id).then(function (group) {
        nested.forEach(function (nestedGroupId) {
          var index = group.nested.indexOf(nestedGroupId);
          if (index > -1) {
            group.nested.splice(index, 1);
          }
        });

        return req.storage.updateGroup(req.params.id, group);
      }).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'GET',
    path: '/api/groups/{id}/nested',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:groups']
      },
      description: 'Get the nested groups for a group.',
      tags: ['api'],
      validate: {
        params: {
          id: _joi2.default.string().guid().required()
        }
      }
    },
    handler: function handler(req, reply) {
      return req.storage.getGroups().then(function (groups) {
        var group = _lodash2.default.find(groups, { _id: req.params.id });
        if (!group.nested) {
          group.nested = [];
        }
        return _lodash2.default.filter(groups, function (g) {
          return group.nested.indexOf(g._id) > -1;
        });
      }).then(function (nested) {
        return _lodash2.default.sortByOrder(nested, ['name'], [true]);
      }).then(function (nested) {
        return reply(nested);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _group_ids = __webpack_require__(39);

var _group_ids2 = _interopRequireDefault(_group_ids);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'PATCH',
    path: '/api/groups/{id}/nested',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:groups']
      },
      description: 'Add one or more nested groups in a group.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        params: {
          id: _joi2.default.string().guid().required()
        },
        payload: _group_ids2.default
      }
    },
    handler: function handler(req, reply) {
      var nested = req.payload;

      req.storage.getGroup(req.params.id).then(function (group) {
        if (!group.nested) {
          group.nested = [];
        }

        nested.forEach(function (nestedGroupId) {
          if (group.nested.indexOf(nestedGroupId) === -1 && nestedGroupId !== req.params.id) {
            group.nested.push(nestedGroupId);
          }
        });

        return req.storage.updateGroup(req.params.id, group);
      }).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'DELETE',
    path: '/api/groups/{id}/roles',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:groups']
      },
      description: 'Delete one or more roles from a group.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        params: {
          id: _joi2.default.string().guid().required()
        },
        payload: _joi2.default.array().items(_joi2.default.string().guid()).required().min(1)
      }
    },
    handler: function handler(req, reply) {
      var members = req.payload;

      req.storage.getGroup(req.params.id).then(function (group) {
        members.forEach(function (userId) {
          var index = group.roles.indexOf(userId);
          if (index > -1) {
            group.roles.splice(index, 1);
          }
        });

        return req.storage.updateGroup(req.params.id, group);
      }).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _queries = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (server) {
  return {
    method: 'GET',
    path: '/api/groups/{id}/roles/nested',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:groups']
      },
      description: 'Get the nested roles for a group.',
      tags: ['api'],
      pre: [server.handlers.managementClient],
      validate: {
        params: {
          id: _joi2.default.string().guid().required()
        }
      }
    },
    handler: function handler(req, reply) {
      return req.storage.getGroups().then(function (groups) {
        var group = _lodash2.default.find(groups, { _id: req.params.id });
        return (0, _queries.getParentGroups)(groups, [group]);
      }).then(function (groups) {
        return req.storage.getRoles().then(function (roles) {
          return (0, _queries.getRolesForGroups)(groups, roles);
        });
      }).then(function (roles) {
        return reply(roles);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (server) {
  return {
    method: 'GET',
    path: '/api/groups/{id}/roles',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:groups']
      },
      description: 'Get the roles for a group.',
      tags: ['api'],
      pre: [server.handlers.managementClient],
      validate: {
        params: {
          id: _joi2.default.string().guid().required()
        }
      }
    },
    handler: function handler(req, reply) {
      return req.storage.getGroup(req.params.id).then(function (group) {
        return group.roles || [];
      }).then(function (roleIds) {
        return req.storage.getRoles().then(function (roles) {
          return roles.filter(function (role) {
            return roleIds.indexOf(role._id) > -1;
          });
        });
      } // eslint-disable-line no-underscore-dangle
      ).then(function (roles) {
        return reply(roles);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'PATCH',
    path: '/api/groups/{id}/roles',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:groups']
      },
      description: 'Add one or more roles to a group.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        params: {
          id: _joi2.default.string().guid().required()
        },
        payload: _joi2.default.array().items(_joi2.default.string().guid()).required().min(1)
      }
    },
    handler: function handler(req, reply) {
      var roles = req.payload;

      req.storage.getGroup(req.params.id).then(function (group) {
        if (!group.roles) {
          group.roles = [];
        }

        roles.forEach(function (roleId) {
          if (group.roles.indexOf(roleId) === -1) {
            group.roles.push(roleId);
          }
        });

        return req.storage.updateGroup(req.params.id, group);
      }).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'DELETE',
    path: '/api/groups/{id}',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['delete:groups']
      },
      description: 'Delete a group.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        params: {
          id: _joi2.default.string().guid().required()
        }
      }
    },
    handler: function handler(req, reply) {
      req.storage.deleteGroup(req.params.id).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _queries = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'GET',
    path: '/api/groups/{id}',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:groups']
      },
      description: 'Get a single group based on its unique identifier. Add "?expand" to also load all roles and permissions for this group.',
      tags: ['api'],
      validate: {
        query: {
          expand: _joi2.default.boolean()
        },
        params: {
          id: _joi2.default.string().guid().required()
        }
      }
    },
    handler: function handler(req, reply) {
      if (req.query.expand) {
        return (0, _queries.getGroupExpanded)(req.storage, req.params.id).then(function (group) {
          return reply(group);
        }).catch(function (err) {
          return reply.error(err);
        });
      }

      return req.storage.getGroup(req.params.id).then(function (group) {
        return reply({ _id: group._id, name: group.name, description: group.description });
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'GET',
    path: '/api/groups',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:groups']
      },
      description: 'Get all groups in the system.',
      tags: ['api'],
      validate: {
        query: {
          q: _joi2.default.string().max(1000).allow('').default(''),
          field: _joi2.default.string().max(1000).allow('').default('')
        }
      }
    },
    handler: function handler(req, reply) {
      return req.storage.getGroups().then(function (groups) {
        return groups.map(function (group) {
          var currentGroup = group;
          currentGroup.mappings = currentGroup.mappings || [];
          currentGroup.members = currentGroup.members || [];
          return currentGroup;
        });
      }).then(function (groups) {
        return {
          groups: _lodash2.default.filter(groups, function (item) {
            // if exists, filter by search value
            var searchQuery = req.query.q;
            if (!searchQuery) return true;

            var field = req.query.field;
            return _lodash2.default.includes(item[field].toLowerCase(), searchQuery.toLowerCase());
          }),
          total: groups.length
        };
      }).then(function (groups) {
        return reply(groups);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _group = __webpack_require__(40);

var _group2 = _interopRequireDefault(_group);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'POST',
    path: '/api/groups',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['create:groups']
      },
      description: 'Create a new group.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        payload: _group2.default
      }
    },
    handler: function handler(req, reply) {
      var group = req.payload;
      return req.storage.createGroup(group).then(function (created) {
        return reply(created);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _group = __webpack_require__(40);

var _group2 = _interopRequireDefault(_group);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'PUT',
    path: '/api/groups/{id}',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:groups']
      },
      description: 'Update a group.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        params: {
          id: _joi2.default.string().guid().required()
        },
        payload: _group2.default
      }
    },
    handler: function handler(req, reply) {
      var group = req.payload;
      return req.storage.updateGroup(req.params.id, group).then(function (updated) {
        return reply(updated);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _webtask = __webpack_require__(169);

var _webtask2 = _interopRequireDefault(_webtask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'GET',
    path: '/meta',
    config: {
      auth: false
    },
    handler: function handler(request, reply) {
      return reply(_webtask2.default);
    }
  };
};

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'DELETE',
    path: '/api/permissions/{id}',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['delete:permissions']
      },
      description: 'Delete a permission.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        params: {
          id: _joi2.default.string().guid().required()
        }
      }
    },
    handler: function handler(req, reply) {
      req.storage.deletePermission(req.params.id).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'GET',
    path: '/api/permissions/{id}',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:permissions']
      },
      description: 'Get a single permission based on its unique identifier.',
      tags: ['api'],
      validate: {
        params: {
          id: _joi2.default.string().guid().required()
        }
      }
    },
    handler: function handler(req, reply) {
      return req.storage.getPermission(req.params.id).then(function (permission) {
        return reply({
          _id: permission._id,
          name: permission.name,
          description: permission.description
        });
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'GET',
    path: '/api/permissions',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:permissions']
      },
      description: 'Get all permissions in the system.',
      tags: ['api'],
      validate: {
        query: {
          q: _joi2.default.string().max(1000).allow('').default(''),
          field: _joi2.default.string().max(1000).allow('').default('')
        }
      }
    },
    handler: function handler(req, reply) {
      return req.storage.getPermissions().then(function (permissions) {
        return {
          permissions: _lodash2.default.filter(permissions, function (item) {
            // if exists, filter by search value
            var searchQuery = req.query.q;
            if (!searchQuery) return true;

            var field = req.query.field;
            return _lodash2.default.includes(item[field].toLowerCase(), searchQuery.toLowerCase());
          }),
          total: permissions.length
        };
      }).then(function (permissions) {
        return reply(permissions);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _permission = __webpack_require__(41);

var _permission2 = _interopRequireDefault(_permission);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'POST',
    path: '/api/permissions',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['create:permissions']
      },
      description: 'Create a new permission.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        payload: _permission2.default
      }
    },
    handler: function handler(req, reply) {
      var permission = req.payload;
      return req.storage.createPermission(permission).then(function (created) {
        return reply(created);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _permission = __webpack_require__(41);

var _permission2 = _interopRequireDefault(_permission);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'PUT',
    path: '/api/permissions/{id}',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:permissions']
      },
      description: 'Update a permission.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        params: {
          id: _joi2.default.string().guid().required()
        },
        payload: _permission2.default
      }
    },
    handler: function handler(req, reply) {
      var permission = req.payload;
      return req.storage.updatePermission(req.params.id, permission).then(function (updated) {
        return reply(updated);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _policy_request = __webpack_require__(137);

var _policy_request2 = _interopRequireDefault(_policy_request);

var _queries = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'POST',
    path: '/api/users/{userId}/policy/{clientId}',
    config: {
      auth: {
        strategies: ['jwt', 'extension-secret']
      },
      description: "Execute the authorization policy for a user in the context of a client. This will return the user's groups but also roles and permissions that apply to the current client.",
      tags: ['api'],
      validate: {
        params: {
          userId: _joi2.default.string().required(),
          clientId: _joi2.default.string().required()
        },
        payload: _policy_request2.default
      }
    },
    handler: function handler(req, reply) {
      var _req$params = req.params,
          userId = _req$params.userId,
          clientId = _req$params.clientId;
      var _req$payload = req.payload,
          connectionName = _req$payload.connectionName,
          groups = _req$payload.groups;


      if (req.storage.provider && req.storage.provider.storageContext && req.storage.provider.storageContext.read) {
        return (0, _queries.getUserData)(req.storage, userId, clientId, connectionName, groups).then(function (data) {
          return reply(data);
        }).catch(function (err) {
          return reply.error(err);
        });
      }

      return reply.error(new Error('Storage error.'));
    }
  };
};

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _joi2.default.object().keys({
  connectionName: _joi2.default.string().required(),
  groups: _joi2.default.array().items(_joi2.default.string())
});

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'DELETE',
    path: '/api/roles/{id}',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['delete:roles']
      },
      description: 'Delete a role.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        params: {
          id: _joi2.default.string().guid().required()
        }
      }
    },
    handler: function handler(req, reply) {
      req.storage.deleteRole(req.params.id).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'GET',
    path: '/api/roles/{id}',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:roles']
      },
      description: 'Get a single role based on its unique identifier.',
      tags: ['api'],
      validate: {
        params: {
          id: _joi2.default.string().guid().required()
        }
      }
    },
    handler: function handler(req, reply) {
      return req.storage.getRole(req.params.id).then(function (role) {
        return reply({
          _id: role._id,
          name: role.name,
          description: role.description
        });
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'GET',
    path: '/api/roles',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:roles']
      },
      description: 'Get all roles in the system.',
      tags: ['api'],
      validate: {
        query: {
          q: _joi2.default.string().max(1000).allow('').default(''),
          field: _joi2.default.string().max(1000).allow('').default('')
        }
      }
    },
    handler: function handler(req, reply) {
      return req.storage.getRoles().then(function (roles) {
        return {
          roles: _lodash2.default.filter(roles, function (item) {
            // if exists, filter by search value
            var searchQuery = req.query.q;
            if (!searchQuery) return true;

            var field = req.query.field;
            return _lodash2.default.includes(item[field].toLowerCase(), searchQuery.toLowerCase());
          }),
          total: roles.length
        };
      }).then(function (roles) {
        return reply(roles);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _role = __webpack_require__(42);

var _role2 = _interopRequireDefault(_role);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'POST',
    path: '/api/roles',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['create:roles']
      },
      description: 'Create a new role.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        payload: _role2.default
      }
    },
    handler: function handler(req, reply) {
      var role = req.payload;
      return req.storage.getPermissions().then(function (permissions) {
        role.permissions.forEach(function (permissionId) {
          var permission = _lodash2.default.find(permissions, { _id: permissionId });
          if (permission && permission.applicationId !== role.applicationId) {
            throw new Error('The permission \'' + permission.name + '\' is linked to a different application.');
          }
        });

        return req.storage.createRole(role).then(function (created) {
          return reply(created);
        });
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _role = __webpack_require__(42);

var _role2 = _interopRequireDefault(_role);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'PUT',
    path: '/api/roles/{id}',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:roles']
      },
      description: 'Update a role.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: false
        },
        params: {
          id: _joi2.default.string().guid().required()
        },
        payload: _role2.default
      }
    },
    handler: function handler(req, reply) {
      var role = req.payload;
      return req.storage.getPermissions().then(function (permissions) {
        role.permissions.forEach(function (permissionId) {
          var permission = _lodash2.default.find(permissions, { _id: permissionId });
          if (permission && permission.applicationId !== role.applicationId) {
            throw new Error('The permission \'' + permission.name + '\' is linked to a different application.');
          }
        });
      }).then(function () {
        return req.storage.getRole(req.params.id);
      }).then(function (existingRole) {
        if (existingRole.applicationId !== role.applicationId) {
          throw new Error('The \'applicationId\' of a role cannot be changed.');
        }

        return req.storage.updateRole(req.params.id, role).then(function (created) {
          return reply(created);
        });
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _queries = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'GET',
    path: '/api/users/{id}/groups',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:groups']
      },
      description: 'Get the groups for a user. Add "?expand" to also load all roles and permissions for these groups.',
      tags: ['api'],
      validate: {
        params: {
          id: _joi2.default.string().required()
        }
      }
    },
    handler: function handler(req, reply) {
      if (req.query.expand) {
        return req.storage.getGroups().then(function (groups) {
          return _lodash2.default.filter(groups, function (group) {
            return _lodash2.default.includes(group.members, req.params.id);
          });
        }).then(function (groups) {
          return (0, _queries.getGroupsExpanded)(req.storage, groups);
        }).then(function (groups) {
          return reply(groups);
        }).catch(function (err) {
          return reply.error(err);
        });
      }

      return req.storage.getGroups().then(function (groups) {
        return _lodash2.default.filter(groups, function (group) {
          return _lodash2.default.includes(group.members, req.params.id);
        });
      }).then(function (groups) {
        return groups.map(function (group) {
          return {
            _id: group._id,
            name: group.name,
            description: group.description
          };
        });
      }).then(function (groups) {
        return reply(groups);
      }).catch(function (err) {
        return reply.error(err);
      });
    }

  };
};

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _queries = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'GET',
    path: '/api/users/{id}/groups/calculate',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:groups']
      },
      description: 'Calculate the group memberships for a user (including nested groups).',
      tags: ['api'],
      validate: {
        params: {
          id: _joi2.default.string().required()
        }
      }
    },
    handler: function handler(req, reply) {
      return req.storage.getGroups().then(function (groups) {
        return (0, _queries.getParentGroups)(groups, _lodash2.default.filter(groups, function (group) {
          return _lodash2.default.includes(group.members, req.params.id);
        }));
      }).then(function (groups) {
        return groups.map(function (group) {
          return {
            _id: group._id,
            name: group.name,
            description: group.description
          };
        });
      }).then(function (groups) {
        return reply(groups);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _bluebird = __webpack_require__(6);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'PATCH',
    path: '/api/users/{id}/groups',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:groups']
      },
      description: 'Add a single user to groups.',
      tags: ['api'],
      validate: {
        params: {
          id: _joi2.default.string().required()
        },
        payload: _joi2.default.array().items(_joi2.default.string()).required().min(1)
      }
    },
    handler: function handler(req, reply) {
      var groupIds = req.payload;
      var pattern = /^(\{{0,1}([0-9a-fA-F]){8}-?([0-9a-fA-F]){4}-?([0-9a-fA-F]){4}-?([0-9a-fA-F]){4}-?([0-9a-fA-F]){12}\}{0,1})$/;
      var searchBy = pattern.test(groupIds[0]) ? '_id' : 'name';

      req.storage.getGroups().then(function (groups) {
        return _lodash2.default.filter(groups, function (group) {
          return _lodash2.default.includes(groupIds, group[searchBy]);
        });
      }).then(function (filtered) {
        return _bluebird2.default.each(filtered, function (group) {
          if (!group.members) {
            group.members = []; // eslint-disable-line no-param-reassign
          }
          if (group.members.indexOf(req.params.id) === -1) {
            group.members.push(req.params.id);
          }

          return req.storage.updateGroup(group._id, group);
        });
      }).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _bluebird = __webpack_require__(6);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'DELETE',
    path: '/api/users/{id}/roles',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:roles']
      },
      description: 'Remove a single user from roles.',
      tags: ['api'],
      validate: {
        params: {
          id: _joi2.default.string().required()
        },
        payload: _joi2.default.array().items(_joi2.default.string().guid()).required().min(1)
      }
    },
    handler: function handler(req, reply) {
      var roleIds = req.payload;

      return _bluebird2.default.each(roleIds, function (id) {
        return req.storage.getRole(id).then(function (role) {
          if (!role.users) {
            role.users = []; // eslint-disable-line no-param-reassign
          }
          var index = role.users.indexOf(req.params.id);
          if (index > -1) {
            role.users.splice(index, 1);
          }

          return req.storage.updateRole(id, role);
        });
      }).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'GET',
    path: '/api/users/{id}/roles',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:roles']
      },
      description: 'Get the roles for a user.',
      tags: ['api'],
      validate: {
        params: {
          id: _joi2.default.string().required()
        }
      }
    },
    handler: function handler(req, reply) {
      return req.storage.getRoles().then(function (roles) {
        return _lodash2.default.filter(roles, function (role) {
          return _lodash2.default.includes(role.users, req.params.id);
        });
      }).then(function (roles) {
        return roles.map(function (role) {
          return {
            _id: role._id,
            name: role.name,
            applicationId: role.applicationId,
            description: role.description
          };
        });
      }).then(function (roles) {
        return reply(roles);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _queries = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'GET',
    path: '/api/users/{id}/roles/calculate',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:roles']
      },
      description: 'Calculate the roles assigned to the user (including through group memberships).',
      tags: ['api'],
      validate: {
        params: {
          id: _joi2.default.string().required()
        }
      }
    },
    handler: function handler(req, reply) {
      return (0, _queries.getRolesForUser)(req.storage, req.params.id).then(function (roles) {
        return roles.map(function (role) {
          return {
            _id: role._id,
            name: role.name,
            applicationId: role.applicationId,
            description: role.description
          };
        });
      }).then(function (roles) {
        return reply(roles);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = __webpack_require__(6);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    method: 'PATCH',
    path: '/api/users/{id}/roles',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['update:roles']
      },
      description: 'Add a single user to roles.',
      tags: ['api'],
      validate: {
        params: {
          id: _joi2.default.string().required()
        },
        payload: _joi2.default.array().items(_joi2.default.string()).required().min(1)
      }
    },
    handler: function handler(req, reply) {
      var roleIds = req.payload;
      var pattern = /^(\{{0,1}([0-9a-fA-F]){8}-?([0-9a-fA-F]){4}-?([0-9a-fA-F]){4}-?([0-9a-fA-F]){4}-?([0-9a-fA-F]){12}\}{0,1})$/;
      var searchBy = pattern.test(roleIds[0]) ? '_id' : 'name';
      req.storage.getRoles().then(function (roles) {
        return _lodash2.default.filter(roles, function (role) {
          return _lodash2.default.includes(roleIds, role[searchBy]);
        });
      }).then(function (filtered) {
        return _bluebird2.default.each(filtered, function (role) {
          if (!role.users) {
            role.users = []; // eslint-disable-line no-param-reassign
          }
          if (role.users.indexOf(req.params.id) === -1) {
            role.users.push(req.params.id);
          }

          return req.storage.updateRole(role._id, role);
        });
      }).then(function () {
        return reply().code(204);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (server) {
  return {
    method: 'GET',
    path: '/api/users/{id}',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:users']
      },
      description: 'Get a single user based on its unique identifier.',
      validate: {
        params: {
          id: _joi2.default.string().required()
        }
      },
      pre: [server.handlers.managementClient]
    },
    handler: function handler(req, reply) {
      return req.pre.auth0.users.get({ id: req.params.id }).then(function (user) {
        return reply(user);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _joi = __webpack_require__(0);

var _joi2 = _interopRequireDefault(_joi);

var _config = __webpack_require__(4);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (server) {
  return {
    method: 'GET',
    path: '/api/users',
    config: {
      auth: {
        strategies: ['jwt'],
        scope: ['read:users']
      },
      description: 'Get all users.',
      validate: {
        query: {
          q: _joi2.default.string().max(1000).allow('').default(''),
          field: _joi2.default.string().max(1000).allow('').default(''),
          per_page: _joi2.default.number().integer().min(1).max(100).default(100), // eslint-disable-line newline-per-chained-call
          page: _joi2.default.number().integer().min(0).default(0)
        }
      },
      pre: [server.handlers.managementClient]
    },
    handler: function handler(req, reply) {
      var page = req.query.page - 1 < 0 ? 0 : req.query.page - 1;
      var options = {
        sort: 'last_login:-1',
        q: req.query.field ? req.query.field + ':' + req.query.q : req.query.q,
        per_page: req.query.per_page || 100,
        page: page || 0,
        include_totals: true,
        fields: 'user_id,name,email,identities,picture,last_login,logins_count,multifactor,blocked',
        search_engine: (0, _config2.default)('USER_SEARCH_ENGINE') || 'v3'
      };

      req.pre.auth0.users.getAll(options).then(function (users) {
        return reply(users);
      }).catch(function (err) {
        return reply.error(err);
      });
    }
  };
};

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hapi = __webpack_require__(54);

var _hapi2 = _interopRequireDefault(_hapi);

var _good = __webpack_require__(175);

var _good2 = _interopRequireDefault(_good);

var _inert = __webpack_require__(178);

var _inert2 = _interopRequireDefault(_inert);

var _relish = __webpack_require__(184);

var _relish2 = _interopRequireDefault(_relish);

var _blipp = __webpack_require__(172);

var _blipp2 = _interopRequireDefault(_blipp);

var _hapiAuthJwt = __webpack_require__(176);

var _hapiAuthJwt2 = _interopRequireDefault(_hapiAuthJwt);

var _goodConsole = __webpack_require__(174);

var _goodConsole2 = _interopRequireDefault(_goodConsole);

var _hapiSwagger = __webpack_require__(177);

var _hapiSwagger2 = _interopRequireDefault(_hapiSwagger);

var _config = __webpack_require__(4);

var _config2 = _interopRequireDefault(_config);

var _logger = __webpack_require__(8);

var _logger2 = _interopRequireDefault(_logger);

var _plugins = __webpack_require__(161);

var _plugins2 = _interopRequireDefault(_plugins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (cb) {
  var goodPlugin = {
    register: _good2.default,
    options: {
      ops: {
        interval: 30000
      },
      reporters: {
        console: []
      }
    }
  };

  var hapiSwaggerPlugin = {
    register: _hapiSwagger2.default,
    options: {
      documentationPage: false,
      swaggerUI: false
    }
  };

  if (true) {
    goodPlugin.options.reporters.console.push(new _goodConsole2.default({ color: !!(0, _config2.default)('LOG_COLOR') }));
    goodPlugin.options.reporters.console.push('stdout');
  }

  var relishPlugin = (0, _relish2.default)({});

  var server = new _hapi2.default.Server();
  server.connection({
    host: 'localhost',
    port: 3000,
    routes: {
      cors: true,
      validate: {
        failAction: relishPlugin.failAction
      }
    }
  });
  server.register([goodPlugin, _inert2.default, _blipp2.default, _hapiAuthJwt2.default, hapiSwaggerPlugin].concat(_toConsumableArray(_plugins2.default)), function (err) {
    if (err) {
      return cb(err, null);
    }

    // Use the server logger.
    _logger2.default.debug = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      server.log(['debug'], args.join(' '));
    };
    _logger2.default.info = function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      server.log(['info'], args.join(' '));
    };
    _logger2.default.error = function () {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      server.log(['error'], args.join(' '));
    };

    return cb(null, server);
  });

  server.ext('onPreResponse', function (request, reply) {
    if (request.response && request.response.isBoom && request.response.output) {
      server.log(['error'], 'Request: ' + request.method.toUpperCase() + ' ' + request.url.path);
      server.log(['error'], 'Response: ' + JSON.stringify(request.response, null, 2));
    }

    return reply.continue();
  });

  return server;
};

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ejs = __webpack_require__(47);

var _ejs2 = _interopRequireDefault(_ejs);

var _config = __webpack_require__(4);

var _config2 = _interopRequireDefault(_config);

var _generateApiKey = __webpack_require__(44);

var _generateApiKey2 = _interopRequireDefault(_generateApiKey);

var _authorize = __webpack_require__(154);

var _authorize2 = _interopRequireDefault(_authorize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (storage, auth0) {
  var configuration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var userName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  return storage.getApiKey().then(function (key) {
    if (!key) {
      return (0, _generateApiKey2.default)(storage, auth0);
    }

    return null;
  }).then(function () {
    return _ejs2.default.render(_authorize2.default, {
      extensionUrl: (0, _config2.default)('PUBLIC_WT_URL').replace(/\/$/g, ''),
      updateTime: function updateTime() {
        return new Date().toISOString();
      },
      config: configuration,
      userName: userName
    });
  });
};

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = "/*\n*  This rule been automatically generated by auth0-authz-extension\n*  Updated by <%= userName %>, <%= updateTime() %>\n */\nfunction (user, context, callback) {\n  var _ = require('lodash');\n  var EXTENSION_URL = \"<%= extensionUrl %>\";\n\n  var audience = '';\n  audience = audience || (context.request && context.request.query && context.request.query.audience);\n  if (audience === 'urn:auth0-authz-api') {\n    return callback(new UnauthorizedError('no_end_users'));\n  }\n\n  audience = audience || (context.request && context.request.body && context.request.body.audience);\n  if (audience === 'urn:auth0-authz-api') {\n    return callback(new UnauthorizedError('no_end_users'));\n  }\n\n  getPolicy(user, context, function(err, res, data) {\n    if (err) {\n      console.log('Error from Authorization Extension:', err);\n      return callback(new UnauthorizedError('Authorization Extension: ' + err.message));\n    }\n\n    if (res.statusCode !== 200) {\n      console.log('Error from Authorization Extension:', res.body || res.statusCode);\n      return callback(\n        new UnauthorizedError('Authorization Extension: ' + ((res.body && (res.body.message || res.body) || res.statusCode)))\n      );\n    }\n\n    // Update the user object.<% if (config.groupsInToken && !config.groupsPassthrough) { %>\n    user.groups = data.groups;<% } %><% if (config.groupsInToken && config.groupsPassthrough) { %>\n    user.groups = mergeRecords(user.groups, data.groups);<% } %><% if (config.rolesInToken && !config.rolesPassthrough) { %>\n    user.roles = data.roles;<% } %><% if (config.rolesInToken && config.rolesPassthrough) { %>\n    user.roles = mergeRecords(user.roles, data.roles);<% } %><% if (config.permissionsInToken && !config.permissionsPassthrough) { %>\n    user.permissions = data.permissions;<% } %><% if (config.permissionsInToken && config.permissionsPassthrough) { %>\n    user.permissions = mergeRecords(user.permissions, data.permissions);<% } %>\n<% if (config.persistGroups || config.persistRoles || config.persistPermissions) { %>\n    // Store this in the user profile (app_metadata).\n    saveToMetadata(user, data.groups, data.roles, data.permissions, function(err) {\n      return callback(err, user, context);\n    });\n<% } else { %>\n    return callback(null, user, context);\n<% } %>  });\n  \n  // Convert groups to array\n  function parseGroups(data) {\n    if (typeof data === 'string') {\n      // split groups represented as string by spaces and/or comma\n      return data.replace(/,/g, ' ').replace(/\\s+/g, ' ').split(' ');\n    }\n    return data;\n  }\n\n  // Get the policy for the user.\n  function getPolicy(user, context, cb) {\n    request.post({\n      url: EXTENSION_URL + \"/api/users/\" + user.user_id + \"/policy/\" + context.clientID,\n      headers: {\n        \"x-api-key\": configuration.AUTHZ_EXT_API_KEY\n      },\n      json: {\n        connectionName: context.connection || user.identities[0].connection,\n        groups: parseGroups(user.groups)\n      },\n      timeout: 5000\n    }, cb);\n  }<% if (config.persistGroups || config.persistRoles || config.persistPermissions) { %>\n\n  // Store authorization data in the user profile so we can query it later.\n  function saveToMetadata(user, groups, roles, permissions, cb) {\n    user.app_metadata = user.app_metadata || {};\n    user.app_metadata.authorization = {<% if (config.persistGroups && !config.groupsPassthrough) { %>\n      groups: groups,<% } %><% if (config.persistGroups && config.groupsPassthrough) { %>\n      groups: mergeRecords(user.groups, groups),<% } %><% if (config.persistRoles && !config.rolesPassthrough) { %>\n      roles: roles,<% } %><% if (config.persistRoles && config.rolesPassthrough) { %>\n      roles: mergeRecords(user.roles, roles),<% } %><% if (config.persistPermissions && !config.permissionsPassthrough) { %>\n      permissions: permissions<% } %><% if (config.persistPermissions && config.permissionsPassthrough) { %>\n      permissions: mergeRecords(user.permissions, permissions)<% } %>\n    };\n\n    auth0.users.updateAppMetadata(user.user_id, user.app_metadata)\n    .then(function() {\n      cb();\n    })\n    .catch(function(err){\n      cb(err);\n    });\n  }<% } %><% if (config.groupsPassthrough || config.rolesPassthrough || config.permissionsPassthrough) { %>\n\n  // Merge the IdP records with the records of the extension.\n  function mergeRecords(idpRecords, extensionRecords) {\n    idpRecords = idpRecords || [ ];\n    extensionRecords = extensionRecords || [ ];\n\n    if (!Array.isArray(idpRecords)) {\n      idpRecords = idpRecords.replace(/,/g, ' ').replace(/\\s+/g, ' ').split(' ');\n    }\n\n    return _.uniq(_.union(idpRecords, extensionRecords));\n  }<% } %>\n}";

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = __webpack_require__(6);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _auth0ExtensionTools = __webpack_require__(12);

var _config = __webpack_require__(4);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var checkUnique = function checkUnique() {
  var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var errorMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Record with that identifier is already exists.';
  var id = arguments[2];

  if (items.length === 0) {
    return null;
  }

  if (id && items.length === 1 && items[0]._id === id) {
    // eslint-disable-line no-underscore-dangle
    return null;
  }

  return _bluebird2.default.reject(new _auth0ExtensionTools.ValidationError(errorMessage));
};

var Database = function () {
  function Database() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Database);

    if (!options.provider) {
      throw new _auth0ExtensionTools.ArgumentError("The 'provider' has to be set when initializing the database.");
    }

    this.provider = options.provider;
  }

  _createClass(Database, [{
    key: 'getStatus',
    value: function getStatus() {
      if (!(0, _config2.default)('STORAGE_TYPE') || (0, _config2.default)('STORAGE_TYPE') === 'webtask') {
        return this.provider.storageContext.read().then(function (data) {
          return {
            size: Buffer.byteLength(JSON.stringify(data), 'utf8'),
            type: 'default'
          };
        });
      }

      return _bluebird2.default.resolve({ size: null, type: (0, _config2.default)('STORAGE_TYPE') });
    }
  }, {
    key: 'canChange',
    value: function canChange(type, checkFor, id) {
      return this.provider.getAll(type).then(function (items) {
        return _lodash2.default.filter(items, function (item) {
          return item[checkFor] && _lodash2.default.includes(item[checkFor], id);
        });
      }).then(function (items) {
        if (items.length) {
          var names = items.map(function (item) {
            return item.name;
          }).join(', ');
          var message = 'Unable to touch ' + checkFor + ' while used in ' + type + ': ' + names;
          return _bluebird2.default.reject(new _auth0ExtensionTools.ValidationError(message));
        }
        return _bluebird2.default.resolve();
      });
    }
  }, {
    key: 'getApiKey',
    value: function getApiKey() {
      return this.provider.getAll('configuration').then(function (records) {
        return records.length ? records[0].apikey : null;
      });
    }
  }, {
    key: 'updateApiKey',
    value: function updateApiKey(apikey) {
      var _this = this;

      return this.provider.getAll('configuration').then(function (records) {
        return records.length ? records[0] : {};
      }).then(function (data) {
        return _this.provider.update('configuration', 'v1', _extends({}, data, { apikey: apikey }), true);
      });
    }
  }, {
    key: 'getConfiguration',
    value: function getConfiguration() {
      return this.provider.getAll('configuration').then(function (records) {
        return records.length ? records[0] : null;
      });
    }
  }, {
    key: 'updateConfiguration',
    value: function updateConfiguration(data) {
      return this.provider.update('configuration', 'v1', data, true);
    }
  }, {
    key: 'getRules',
    value: function getRules() {
      return this.provider.getAll('rules');
    }
  }, {
    key: 'createRule',
    value: function createRule(rule) {
      return this.provider.create('rules', rule);
    }
  }, {
    key: 'getPermissions',
    value: function getPermissions() {
      return this.provider.getAll('permissions');
    }
  }, {
    key: 'getPermission',
    value: function getPermission(id) {
      return this.provider.get('permissions', id);
    }
  }, {
    key: 'createPermission',
    value: function createPermission(permission) {
      var _this2 = this;

      return this.getPermissions().then(function (permissions) {
        return checkUnique(permissions.filter(function (item) {
          return item.name.toLowerCase() === permission.name.toLowerCase() && item.applicationId === permission.applicationId;
        }), 'Permission with name "' + permission.name + '" already exists for this application');
      }).then(function () {
        return _this2.provider.create('permissions', permission);
      });
    }
  }, {
    key: 'updatePermission',
    value: function updatePermission(id, permission) {
      var _this3 = this;

      return this.getPermissions().then(function (permissions) {
        return checkUnique(permissions.filter(function (item) {
          return item.name.toLowerCase() === permission.name.toLowerCase() && item.applicationId === permission.applicationId;
        }), 'Permission with name "' + permission.name + '" already exists for this application', id);
      }).then(function () {
        return _this3.canChange('roles', 'permissions', id);
      }).then(function () {
        return _this3.canChange('groups', 'permissions', id);
      }).then(function () {
        return _this3.provider.update('permissions', id, permission);
      });
    }
  }, {
    key: 'deletePermission',
    value: function deletePermission(id) {
      var _this4 = this;

      return this.canChange('roles', 'permissions', id).then(function () {
        return _this4.provider.delete('permissions', id);
      });
    }
  }, {
    key: 'getRoles',
    value: function getRoles() {
      return this.provider.getAll('roles');
    }
  }, {
    key: 'getRole',
    value: function getRole(id) {
      return this.provider.get('roles', id);
    }
  }, {
    key: 'createRole',
    value: function createRole(role) {
      var _this5 = this;

      return this.getRoles().then(function (roles) {
        return checkUnique(roles.filter(function (item) {
          return item.name.toLowerCase() === role.name.toLowerCase() && item.applicationId === role.applicationId;
        }), 'Role with name "' + role.name + '" already exists for this application');
      }).then(function () {
        return _this5.provider.create('roles', role);
      });
    }
  }, {
    key: 'updateRole',
    value: function updateRole(id, role) {
      var _this6 = this;

      return this.getRoles().then(function (roles) {
        return checkUnique(roles.filter(function (item) {
          return item.name.toLowerCase() === role.name.toLowerCase() && item.applicationId === role.applicationId;
        }), 'Role with name "' + role.name + '" already exists for this application', id);
      }).then(function () {
        return _this6.provider.update('roles', id, role);
      });
    }
  }, {
    key: 'deleteRole',
    value: function deleteRole(id) {
      var _this7 = this;

      return this.canChange('groups', 'roles', id).then(function () {
        return _this7.provider.delete('roles', id);
      });
    }
  }, {
    key: 'getGroups',
    value: function getGroups() {
      return this.provider.getAll('groups');
    }
  }, {
    key: 'getGroup',
    value: function getGroup(id) {
      return this.provider.get('groups', id);
    }
  }, {
    key: 'createGroup',
    value: function createGroup(group) {
      var _this8 = this;

      return this.getGroups().then(function (groups) {
        return checkUnique(groups.filter(function (item) {
          return item.name.toLowerCase() === group.name.toLowerCase();
        }), 'Group with name "' + group.name + '" already exists');
      }).then(function () {
        return _this8.provider.create('groups', group);
      });
    }
  }, {
    key: 'updateGroup',
    value: function updateGroup(id, group) {
      var _this9 = this;

      return this.getGroups().then(function (groups) {
        return checkUnique(groups.filter(function (item) {
          return item.name.toLowerCase() === group.name.toLowerCase();
        }), 'Group with name "' + group.name + '" already exists', id);
      }).then(function () {
        return _this9.provider.update('groups', id, group);
      });
    }
  }, {
    key: 'deleteGroup',
    value: function deleteGroup(id) {
      var _this10 = this;

      return this.canChange('groups', 'nested', id).then(function () {
        return _this10.provider.delete('groups', id);
      });
    }
  }, {
    key: 'getApplications',
    value: function getApplications() {
      return this.provider.getAll('applications');
    }
  }, {
    key: 'getApplication',
    value: function getApplication(clientId) {
      return this.provider.get('applications', clientId);
    }
  }, {
    key: 'updateApplication',
    value: function updateApplication(clientId, application) {
      return this.provider.update('applications', clientId, application, true);
    }
  }]);

  return Database;
}();

exports.default = Database;

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProvider = createProvider;

var _path = __webpack_require__(14);

var _path2 = _interopRequireDefault(_path);

var _auth0ExtensionS3Tools = __webpack_require__(171);

var _auth0ExtensionTools = __webpack_require__(12);

var _config = __webpack_require__(4);

var _config2 = _interopRequireDefault(_config);

var _logger = __webpack_require__(8);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createProvider(storageContext) {
  switch ((0, _config2.default)('STORAGE_TYPE')) {
    case 's3':
      {
        _logger2.default.info('Initializing the S3 Storage Context.');

        var context = new _auth0ExtensionS3Tools.S3StorageContext({
          path: (0, _config2.default)('S3_PATH'),
          bucket: (0, _config2.default)('S3_BUCKET'),
          keyId: (0, _config2.default)('S3_KEY'),
          keySecret: (0, _config2.default)('S3_SECRET'),
          defaultData: {}
        });
        return new _auth0ExtensionTools.BlobRecordProvider(context, { concurrentWrites: false });
      }
    case 'webtask':
    default:
      {
        _logger2.default.info('Initializing the Webtask Storage Context.');

        var _context = storageContext ? new _auth0ExtensionTools.WebtaskStorageContext(storageContext, { force: 0 }) : new _auth0ExtensionTools.FileStorageContext(_path2.default.join(__dirname, '../../data.json'), { mergeWrites: true });
        return new _auth0ExtensionTools.BlobRecordProvider(_context, { concurrentWrites: false });
      }
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

var _path = __webpack_require__(14);

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/app/{param*}',
    config: {
      auth: false
    },
    handler: {
      directory: {
        path: _path2.default.join(__dirname, '../../dist'),
        redirectToSlash: true
      }
    }
  });

  next();
};

module.exports.register.attributes = {
  name: 'assets'
};
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _boom = __webpack_require__(2);

var _boom2 = _interopRequireDefault(_boom);

var _crypto = __webpack_require__(16);

var _crypto2 = _interopRequireDefault(_crypto);

var _jwksRsa = __webpack_require__(180);

var _jwksRsa2 = _interopRequireDefault(_jwksRsa);

var _jsonwebtoken = __webpack_require__(179);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _auth0ExtensionHapiTools = __webpack_require__(17);

var tools = _interopRequireWildcard(_auth0ExtensionHapiTools);

var _config = __webpack_require__(4);

var _config2 = _interopRequireDefault(_config);

var _apiaccess = __webpack_require__(10);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hashApiKey = function hashApiKey(key) {
  return _crypto2.default.createHmac('sha256', key + ' + ' + (0, _config2.default)('AUTH0_CLIENT_SECRET')).update((0, _config2.default)('EXTENSION_SECRET')).digest('hex');
};

module.exports.register = function (server, options, next) {
  server.auth.scheme('extension-secret', function () {
    return {
      authenticate: function authenticate(request, reply) {
        var apiKey = request.headers['x-api-key'];
        return request.storage.getApiKey().then(function (key) {
          if (apiKey && apiKey === hashApiKey(key)) {
            return reply.continue({
              credentials: {
                user: 'rule'
              }
            });
          }

          return reply(_boom2.default.unauthorized('Invalid API Key'));
        });
      }
    };
  });
  server.auth.strategy('extension-secret', 'extension-secret');

  var jwtOptions = {
    dashboardAdmin: {
      key: (0, _config2.default)('EXTENSION_SECRET'),
      verifyOptions: {
        audience: 'urn:api-authz',
        issuer: (0, _config2.default)('PUBLIC_WT_URL'),
        algorithms: ['HS256']
      }
    },
    resourceServer: {
      key: _jwksRsa2.default.hapiJwt2Key({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 2,
        jwksUri: 'https://' + (0, _config2.default)('AUTH0_DOMAIN') + '/.well-known/jwks.json'
      }),
      verifyOptions: {
        audience: 'urn:auth0-authz-api',
        issuer: 'https://' + (0, _config2.default)('AUTH0_DOMAIN') + '/',
        algorithms: ['RS256']
      }
    }
  };

  server.auth.strategy('jwt', 'jwt', {
    // Get the complete decoded token, because we need info from the header (the kid)
    complete: true,

    verifyFunc: function verifyFunc(decoded, req, callback) {
      if (!decoded) {
        return callback(null, false);
      }

      var header = req.headers.authorization;
      if (header && header.indexOf('Bearer ') === 0) {
        var token = header.split(' ')[1];
        if (decoded && decoded.payload && decoded.payload.iss === 'https://' + (0, _config2.default)('AUTH0_DOMAIN') + '/') {
          return jwtOptions.resourceServer.key(decoded, function (keyErr, key) {
            if (keyErr) {
              return callback(_boom2.default.wrap(keyErr), null, null);
            }

            return _jsonwebtoken2.default.verify(token, key, jwtOptions.resourceServer.verifyOptions, function (err) {
              if (err) {
                return callback(_boom2.default.unauthorized('Invalid token', 'Token'), null, null);
              }

              if (decoded.payload.gty && decoded.payload.gty !== 'client-credentials') {
                return callback(_boom2.default.unauthorized('Invalid token', 'Token'), null, null);
              }

              if (!decoded.payload.sub.endsWith('@clients')) {
                return callback(_boom2.default.unauthorized('Invalid token', 'Token'), null, null);
              }

              if (decoded.payload.scope && typeof decoded.payload.scope === 'string') {
                decoded.payload.scope = decoded.payload.scope.split(' '); // eslint-disable-line no-param-reassign
              }

              return callback(null, true, decoded.payload);
            });
          });
        } else if (decoded && decoded.payload && decoded.payload.iss === (0, _config2.default)('PUBLIC_WT_URL')) {
          return _jsonwebtoken2.default.verify(token, jwtOptions.dashboardAdmin.key, jwtOptions.dashboardAdmin.verifyOptions, function (err) {
            if (err) {
              return callback(_boom2.default.unauthorized('Invalid token', 'Token'), null, null);
            }

            if (!decoded.payload.access_token || !decoded.payload.access_token.length) {
              return callback(_boom2.default.unauthorized('Invalid token', 'Token'), null, null);
            }

            decoded.payload.scope = _apiaccess.scopes.map(function (scope) {
              return scope.value;
            }); // eslint-disable-line no-param-reassign
            return callback(null, true, decoded.payload);
          });
        }
      }

      return callback(null, false);
    }
  });
  server.auth.default('jwt');
  var session = {
    register: tools.plugins.dashboardAdminSession,
    options: {
      stateKey: 'authz-state',
      nonceKey: 'authz-nonce',
      sessionStorageKey: 'authz:apiToken',
      rta: (0, _config2.default)('AUTH0_RTA').replace('https://', ''),
      domain: (0, _config2.default)('AUTH0_DOMAIN'),
      scopes: 'read:resource_servers create:resource_servers update:resource_servers delete:resource_servers read:clients read:connections read:rules create:rules update:rules update:rules_configs read:users',
      baseUrl: (0, _config2.default)('PUBLIC_WT_URL'),
      audience: 'urn:api-authz',
      secret: (0, _config2.default)('EXTENSION_SECRET'),
      clientName: 'Authorization Extension',
      onLoginSuccess: function onLoginSuccess(decoded, req, callback) {
        if (decoded) {
          decoded.scope = _apiaccess.scopes.map(function (scope) {
            return scope.value;
          }); // eslint-disable-line no-param-reassign
          return callback(null, true, decoded);
        }

        return callback(null, false);
      }
    }
  };
  server.register(session, function (err) {
    if (err) {
      next(err);
    }

    next();
  });
};

module.exports.register.attributes = {
  name: 'auth'
};

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _auth0ExtensionHapiTools = __webpack_require__(17);

var _config = __webpack_require__(4);

var _config2 = _interopRequireDefault(_config);

var _logger = __webpack_require__(8);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tools = __webpack_require__(12);
var Boom = __webpack_require__(2);

var validateHookToken = function validateHookToken(domain, webtaskUrl, extensionSecret) {
  if (domain === null || domain === undefined) {
    throw new tools.ArgumentError('Must provide the domain');
  }

  if (typeof domain !== 'string' || domain.length === 0) {
    throw new tools.ArgumentError('The provided domain is invalid: ' + domain);
  }

  if (webtaskUrl === null || webtaskUrl === undefined) {
    throw new tools.ArgumentError('Must provide the webtaskUrl');
  }

  if (typeof webtaskUrl !== 'string' || webtaskUrl.length === 0) {
    throw new tools.ArgumentError('The provided webtaskUrl is invalid: ' + webtaskUrl);
  }

  if (extensionSecret === null || extensionSecret === undefined) {
    throw new tools.ArgumentError('Must provide the extensionSecret');
  }

  if (typeof extensionSecret !== 'string' || extensionSecret.length === 0) {
    throw new tools.ArgumentError('The provided extensionSecret is invalid: ' + extensionSecret);
  }

  return function (hookPath) {
    if (hookPath === null || hookPath === undefined) {
      throw new tools.ArgumentError('Must provide the hookPath');
    }

    if (typeof hookPath !== 'string' || hookPath.length === 0) {
      throw new tools.ArgumentError('The provided hookPath is invalid: ' + hookPath);
    }

    return {
      method: function method(req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          var token = req.headers.authorization.split(' ')[1];

          try {
            _logger2.default.info('Validating hook token with signature: ' + extensionSecret.substr(0, 4) + '...');
            if (tools.validateHookToken(domain, webtaskUrl, hookPath, extensionSecret, token)) {
              return res();
            }
          } catch (e) {
            _logger2.default.error('Invalid token:', token);
            return res(Boom.wrap(e, 401, e.message));
          }
        }

        var err = new tools.HookTokenError('Hook token missing for the call to: ' + hookPath);
        return res(Boom.unauthorized(err, 401, err.message));
      }
    };
  };
};

module.exports.register = function (server, options, next) {
  server.decorate('server', 'handlers', {
    managementClient: _auth0ExtensionHapiTools.handlers.managementApiClient({
      domain: (0, _config2.default)('AUTH0_DOMAIN'),
      clientId: (0, _config2.default)('AUTH0_CLIENT_ID'),
      clientSecret: (0, _config2.default)('AUTH0_CLIENT_SECRET'),
      logger: _logger2.default.error
    }),
    validateHookToken: validateHookToken((0, _config2.default)('AUTH0_DOMAIN'), (0, _config2.default)('WT_URL'), (0, _config2.default)('EXTENSION_SECRET'))
  });

  next();
};

module.exports.register.attributes = {
  name: 'handlers'
};

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = __webpack_require__(48);

var _fs2 = _interopRequireDefault(_fs);

var _ejs = __webpack_require__(47);

var _ejs2 = _interopRequireDefault(_ejs);

var _path = __webpack_require__(14);

var _path2 = _interopRequireDefault(_path);

var _auth0ExtensionHapiTools = __webpack_require__(17);

var _config = __webpack_require__(4);

var _config2 = _interopRequireDefault(_config);

var _index = __webpack_require__(165);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assembleHtmlRoute = function assembleHtmlRoute(link) {
  return {
    method: 'GET',
    path: link,
    config: {
      description: 'Render HTML',
      auth: false
    },
    handler: function handler(req, reply) {
      var cfg = {
        AUTH0_DOMAIN: (0, _config2.default)('AUTH0_DOMAIN'),
        AUTH0_CLIENT_ID: (0, _config2.default)('AUTH0_CLIENT_ID'),
        BASE_URL: _auth0ExtensionHapiTools.urlHelpers.getBaseUrl(req),
        API_BASE: _auth0ExtensionHapiTools.urlHelpers.getBaseUrl(req),
        BASE_PATH: _auth0ExtensionHapiTools.urlHelpers.getBasePath(req),
        SEARCH_ENGINE: (0, _config2.default)('AUTH0_RTA').replace('https://', '') !== 'auth0.auth0.com' ? 'v2' : 'v3'
      };

      // Development.
      if (false) {
        return reply(_ejs2.default.render(_index2.default, {
          config: _extends({}, cfg, {
            API_BASE: 'http://localhost:3000/'
          }),
          assets: {
            app: '/app/bundle.js'
          }
        }));
      }

      // Render from CDN.
      var clientVersion = (0, _config2.default)('CLIENT_VERSION');
      if (clientVersion) {
        return reply(_ejs2.default.render(_index2.default, {
          config: cfg,
          assets: { version: clientVersion }
        }));
      }

      // Render locally.
      return _fs2.default.readFile(_path2.default.join(__dirname, '../../dist/manifest.json'), 'utf8', function (err, data) {
        var locals = {
          config: cfg,
          assets: {
            app: '/app/bundle.js'
          }
        };

        if (!err && data) {
          locals.assets = JSON.parse(data);

          if (locals.assets.app) {
            locals.assets.app = '/app/' + locals.assets.app;
          }

          if (locals.assets.vendors) {
            locals.assets.vendors = '/app/' + locals.assets.vendors;
          }

          if (locals.assets.style) {
            locals.assets.style = '/app/' + locals.assets.style;
          }
        }

        // Render the HTML page.
        reply(_ejs2.default.render(_index2.default, locals));
      });
    }
  };
};

var clientRoutes = ['/', '/api', '/configuration', '/configuration/rule', '/configuration/api', '/roles', '/roles/{id}', '/groups', '/groups/{id}', '/permissions', '/permissions/{id}', '/users', '/users/{id}', '/import-export'];

module.exports.register = function (server, options, next) {
  clientRoutes.map(function (link) {
    return server.route(assembleHtmlRoute(link));
  });

  next();
};

module.exports.register.attributes = {
  name: 'html'
};
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = [{ register: __webpack_require__(158) }, { register: __webpack_require__(157) }, { register: __webpack_require__(159) }, { register: __webpack_require__(160) }, { register: __webpack_require__(163) }, { register: __webpack_require__(162) }, { register: __webpack_require__(164) }];

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _boom = __webpack_require__(2);

var _boom2 = _interopRequireDefault(_boom);

var _logger = __webpack_require__(8);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function notFound(message) {
  return this.response(_boom2.default.notFound(message));
}

function error(err) {
  _logger2.default.error(err);
  var errorMessage = err.message && err.message.error || err.message || err.code || err.name || err.text || err.description || err;

  if (err.message && err.message.statusCode === 429) {
    return this.response(_boom2.default.tooManyRequests(errorMessage));
  }

  return this.response(_boom2.default.badRequest(errorMessage));
}

function unauthorized(message) {
  return this.response(_boom2.default.unauthorized(message));
}

module.exports.register = function (server, options, next) {
  server.decorate('reply', 'notFound', notFound);
  server.decorate('reply', 'error', error);
  server.decorate('reply', 'unauthorized', unauthorized);

  next();
};

module.exports.register.attributes = {
  name: 'reply-decorators'
};

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _config = __webpack_require__(4);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports.register = function (server, options, next) {
  server.route(__webpack_require__(136)(server));
  server.route(__webpack_require__(92)(server));
  server.route(__webpack_require__(93)(server));
  server.route(__webpack_require__(97)(server));
  server.route(__webpack_require__(96)(server));
  server.route(__webpack_require__(98)(server));
  server.route(__webpack_require__(103)(server));
  server.route(__webpack_require__(101)(server));
  server.route(__webpack_require__(100)(server));
  server.route(__webpack_require__(95)(server));
  server.route(__webpack_require__(99)(server));
  server.route(__webpack_require__(102)(server));
  server.route(__webpack_require__(94)(server));
  server.route(__webpack_require__(105)(server));
  server.route(__webpack_require__(106)(server));
  server.route(__webpack_require__(107)(server));
  server.route(__webpack_require__(131)(server));
  server.route(__webpack_require__(132)(server));
  server.route(__webpack_require__(133)(server));
  server.route(__webpack_require__(134)(server));
  server.route(__webpack_require__(135)(server));
  server.route(__webpack_require__(138)(server));
  server.route(__webpack_require__(139)(server));
  server.route(__webpack_require__(140)(server));
  server.route(__webpack_require__(141)(server));
  server.route(__webpack_require__(142)(server));
  server.route(__webpack_require__(125)(server));
  server.route(__webpack_require__(126)(server));
  server.route(__webpack_require__(127)(server));
  server.route(__webpack_require__(128)(server));
  server.route(__webpack_require__(129)(server));
  server.route(__webpack_require__(121)(server));
  server.route(__webpack_require__(123)(server));
  server.route(__webpack_require__(122)(server));
  server.route(__webpack_require__(124)(server));
  server.route(__webpack_require__(118)(server));
  server.route(__webpack_require__(119)(server));
  server.route(__webpack_require__(120)(server));
  server.route(__webpack_require__(109)(server));
  server.route(__webpack_require__(108)(server));
  server.route(__webpack_require__(110)(server));
  server.route(__webpack_require__(114)(server));
  server.route(__webpack_require__(115)(server));
  server.route(__webpack_require__(116)(server));
  server.route(__webpack_require__(117)(server));
  server.route(__webpack_require__(130)(server));
  server.route(__webpack_require__(150)(server));
  server.route(__webpack_require__(151)(server));
  server.route(__webpack_require__(143)(server));
  server.route(__webpack_require__(144)(server));
  server.route(__webpack_require__(145)(server));
  server.route(__webpack_require__(147)(server));
  server.route(__webpack_require__(148)(server));
  server.route(__webpack_require__(146)(server));
  server.route(__webpack_require__(149)(server));

  server.route({
    method: 'GET',
    path: '/admins/login',
    config: { auth: false },
    handler: function handler(request, reply) {
      return reply('Redirecting to login page...').redirect((0, _config2.default)('PUBLIC_WT_URL') + '/login');
    }
  });
  next();
};

module.exports.register.attributes = {
  name: 'routes'
};

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _getdb = __webpack_require__(45);

module.exports.register = function (server, options, next) {
  var db = (0, _getdb.getDb)();
  server.decorate('server', 'storage', db);
  server.decorate('request', 'storage', db);

  next();
};

module.exports.register.attributes = {
  name: 'storage'
};

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <title>Auth0 - Authorization</title>\n  <meta charset=\"UTF-8\" />\n  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <link rel=\"shortcut icon\" href=\"https://cdn.auth0.com/styleguide/4.8.10/lib/logos/img/favicon.png\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.auth0.com/styles/zocial.min.css\">\n  <link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.auth0.com/styleguide/4.8.10/index.min.css\" />\n  <link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.auth0.com/manage/v0.3.1672/css/index.min.css\">\n  <% if (assets.style) { %><link rel=\"stylesheet\" type=\"text/css\" href=\"<%= assets.style %>\"><% } %>\n  <% if (assets.version) { %><link rel=\"stylesheet\" type=\"text/css\" href=\"//cdn.auth0.com/extensions/auth0-authz/assets/auth0-authz.ui.<%= assets.version %>.css\"><% } %>\n</head>\n<body>\n  <div id=\"app\"></div>\n  <script type=\"text/javascript\" src=\"//cdn.auth0.com/manage/v0.3.1672/js/bundle.js\"></script>\n  <script type=\"text/javascript\">window.config = <%- JSON.stringify(config) %>;</script>\n  <% if (assets.vendors) { %><script type=\"text/javascript\" src=\"<%= assets.vendors %>\"></script><% } %>\n  <% if (assets.app) { %><script type=\"text/javascript\" src=\"<%= assets.app %>\"></script><% } %>\n  <% if (assets.version) { %>\n  <script type=\"text/javascript\" src=\"//cdn.auth0.com/extensions/auth0-authz/assets/auth0-authz.ui.vendors.<%= assets.version %>.js\"></script>\n  <script type=\"text/javascript\" src=\"//cdn.auth0.com/extensions/auth0-authz/assets/auth0-authz.ui.<%= assets.version %>.js\"></script>\n  <% } %>\n</body>\n</html>";

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tools = __webpack_require__(17);
var config = __webpack_require__(4);
var logger = __webpack_require__(8);

var factory = function factory(wtConfig, wtStorage) {
  logger.info('Starting Authorization Extension - Version:', "2.9.1");
  logger.info(' > WT_URL:', wtConfig('WT_URL'));
  logger.info(' > PUBLIC_WT_URL:', wtConfig('PUBLIC_WT_URL'));
  // Require in place to load the dependency only when needed
  // and avoid Blocked event loop errors
  return __webpack_require__(52)(wtConfig, wtStorage);
};

// Loading all modules at the beginning takes too much time
// that causes "Blocked event loop errors"
// This function is a helper to avoid this type of errors
var _createServer = function createServer(context, req, res) {
  // To avoid the  "Blocked event loop" error we delay loading the application module
  setImmediate(function () {
    var publicUrl = req.x_wt && req.x_wt.ectx && req.x_wt.ectx.PUBLIC_WT_URL || false;
    if (!publicUrl) {
      config.setValue('PUBLIC_WT_URL', tools.urlHelpers.getWebtaskUrl(req));
    }
    // After the application has been initialized we remove the
    // artificial delay in processing
    _createServer = tools.createServer(factory);
    _createServer(context, req, res);
  });
};

module.exports = function (context, req, res) {
  _createServer(context, req, res);
};

/***/ }),
/* 167 */
/***/ (function(module, exports) {

module.exports = {"application/1d-interleaved-parityfec":{"source":"iana"},"application/3gpdash-qoe-report+xml":{"source":"iana"},"application/3gpp-ims+xml":{"source":"iana"},"application/a2l":{"source":"iana"},"application/activemessage":{"source":"iana"},"application/alto-costmap+json":{"source":"iana","compressible":true},"application/alto-costmapfilter+json":{"source":"iana","compressible":true},"application/alto-directory+json":{"source":"iana","compressible":true},"application/alto-endpointcost+json":{"source":"iana","compressible":true},"application/alto-endpointcostparams+json":{"source":"iana","compressible":true},"application/alto-endpointprop+json":{"source":"iana","compressible":true},"application/alto-endpointpropparams+json":{"source":"iana","compressible":true},"application/alto-error+json":{"source":"iana","compressible":true},"application/alto-networkmap+json":{"source":"iana","compressible":true},"application/alto-networkmapfilter+json":{"source":"iana","compressible":true},"application/aml":{"source":"iana"},"application/andrew-inset":{"source":"iana","extensions":["ez"]},"application/applefile":{"source":"iana"},"application/applixware":{"source":"apache","extensions":["aw"]},"application/atf":{"source":"iana"},"application/atfx":{"source":"iana"},"application/atom+xml":{"source":"iana","compressible":true,"extensions":["atom"]},"application/atomcat+xml":{"source":"iana","extensions":["atomcat"]},"application/atomdeleted+xml":{"source":"iana"},"application/atomicmail":{"source":"iana"},"application/atomsvc+xml":{"source":"iana","extensions":["atomsvc"]},"application/atxml":{"source":"iana"},"application/auth-policy+xml":{"source":"iana"},"application/bacnet-xdd+zip":{"source":"iana"},"application/batch-smtp":{"source":"iana"},"application/bdoc":{"compressible":false,"extensions":["bdoc"]},"application/beep+xml":{"source":"iana"},"application/calendar+json":{"source":"iana","compressible":true},"application/calendar+xml":{"source":"iana"},"application/call-completion":{"source":"iana"},"application/cals-1840":{"source":"iana"},"application/cbor":{"source":"iana"},"application/ccmp+xml":{"source":"iana"},"application/ccxml+xml":{"source":"iana","extensions":["ccxml"]},"application/cdfx+xml":{"source":"iana"},"application/cdmi-capability":{"source":"iana","extensions":["cdmia"]},"application/cdmi-container":{"source":"iana","extensions":["cdmic"]},"application/cdmi-domain":{"source":"iana","extensions":["cdmid"]},"application/cdmi-object":{"source":"iana","extensions":["cdmio"]},"application/cdmi-queue":{"source":"iana","extensions":["cdmiq"]},"application/cdni":{"source":"iana"},"application/cea":{"source":"iana"},"application/cea-2018+xml":{"source":"iana"},"application/cellml+xml":{"source":"iana"},"application/cfw":{"source":"iana"},"application/cms":{"source":"iana"},"application/cnrp+xml":{"source":"iana"},"application/coap-group+json":{"source":"iana","compressible":true},"application/commonground":{"source":"iana"},"application/conference-info+xml":{"source":"iana"},"application/cpl+xml":{"source":"iana"},"application/csrattrs":{"source":"iana"},"application/csta+xml":{"source":"iana"},"application/cstadata+xml":{"source":"iana"},"application/csvm+json":{"source":"iana","compressible":true},"application/cu-seeme":{"source":"apache","extensions":["cu"]},"application/cybercash":{"source":"iana"},"application/dart":{"compressible":true},"application/dash+xml":{"source":"iana","extensions":["mpd"]},"application/dashdelta":{"source":"iana"},"application/davmount+xml":{"source":"iana","extensions":["davmount"]},"application/dca-rft":{"source":"iana"},"application/dcd":{"source":"iana"},"application/dec-dx":{"source":"iana"},"application/dialog-info+xml":{"source":"iana"},"application/dicom":{"source":"iana"},"application/dii":{"source":"iana"},"application/dit":{"source":"iana"},"application/dns":{"source":"iana"},"application/docbook+xml":{"source":"apache","extensions":["dbk"]},"application/dskpp+xml":{"source":"iana"},"application/dssc+der":{"source":"iana","extensions":["dssc"]},"application/dssc+xml":{"source":"iana","extensions":["xdssc"]},"application/dvcs":{"source":"iana"},"application/ecmascript":{"source":"iana","compressible":true,"extensions":["ecma"]},"application/edi-consent":{"source":"iana"},"application/edi-x12":{"source":"iana","compressible":false},"application/edifact":{"source":"iana","compressible":false},"application/efi":{"source":"iana"},"application/emergencycalldata.comment+xml":{"source":"iana"},"application/emergencycalldata.deviceinfo+xml":{"source":"iana"},"application/emergencycalldata.providerinfo+xml":{"source":"iana"},"application/emergencycalldata.serviceinfo+xml":{"source":"iana"},"application/emergencycalldata.subscriberinfo+xml":{"source":"iana"},"application/emma+xml":{"source":"iana","extensions":["emma"]},"application/emotionml+xml":{"source":"iana"},"application/encaprtp":{"source":"iana"},"application/epp+xml":{"source":"iana"},"application/epub+zip":{"source":"iana","extensions":["epub"]},"application/eshop":{"source":"iana"},"application/exi":{"source":"iana","extensions":["exi"]},"application/fastinfoset":{"source":"iana"},"application/fastsoap":{"source":"iana"},"application/fdt+xml":{"source":"iana"},"application/fits":{"source":"iana"},"application/font-sfnt":{"source":"iana"},"application/font-tdpfr":{"source":"iana","extensions":["pfr"]},"application/font-woff":{"source":"iana","compressible":false,"extensions":["woff"]},"application/font-woff2":{"compressible":false,"extensions":["woff2"]},"application/framework-attributes+xml":{"source":"iana"},"application/gml+xml":{"source":"apache","extensions":["gml"]},"application/gpx+xml":{"source":"apache","extensions":["gpx"]},"application/gxf":{"source":"apache","extensions":["gxf"]},"application/gzip":{"source":"iana","compressible":false},"application/h224":{"source":"iana"},"application/held+xml":{"source":"iana"},"application/http":{"source":"iana"},"application/hyperstudio":{"source":"iana","extensions":["stk"]},"application/ibe-key-request+xml":{"source":"iana"},"application/ibe-pkg-reply+xml":{"source":"iana"},"application/ibe-pp-data":{"source":"iana"},"application/iges":{"source":"iana"},"application/im-iscomposing+xml":{"source":"iana"},"application/index":{"source":"iana"},"application/index.cmd":{"source":"iana"},"application/index.obj":{"source":"iana"},"application/index.response":{"source":"iana"},"application/index.vnd":{"source":"iana"},"application/inkml+xml":{"source":"iana","extensions":["ink","inkml"]},"application/iotp":{"source":"iana"},"application/ipfix":{"source":"iana","extensions":["ipfix"]},"application/ipp":{"source":"iana"},"application/isup":{"source":"iana"},"application/its+xml":{"source":"iana"},"application/java-archive":{"source":"apache","compressible":false,"extensions":["jar","war","ear"]},"application/java-serialized-object":{"source":"apache","compressible":false,"extensions":["ser"]},"application/java-vm":{"source":"apache","compressible":false,"extensions":["class"]},"application/javascript":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["js"]},"application/jose":{"source":"iana"},"application/jose+json":{"source":"iana","compressible":true},"application/jrd+json":{"source":"iana","compressible":true},"application/json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["json","map"]},"application/json-patch+json":{"source":"iana","compressible":true},"application/json-seq":{"source":"iana"},"application/json5":{"extensions":["json5"]},"application/jsonml+json":{"source":"apache","compressible":true,"extensions":["jsonml"]},"application/jwk+json":{"source":"iana","compressible":true},"application/jwk-set+json":{"source":"iana","compressible":true},"application/jwt":{"source":"iana"},"application/kpml-request+xml":{"source":"iana"},"application/kpml-response+xml":{"source":"iana"},"application/ld+json":{"source":"iana","compressible":true,"extensions":["jsonld"]},"application/link-format":{"source":"iana"},"application/load-control+xml":{"source":"iana"},"application/lost+xml":{"source":"iana","extensions":["lostxml"]},"application/lostsync+xml":{"source":"iana"},"application/lxf":{"source":"iana"},"application/mac-binhex40":{"source":"iana","extensions":["hqx"]},"application/mac-compactpro":{"source":"apache","extensions":["cpt"]},"application/macwriteii":{"source":"iana"},"application/mads+xml":{"source":"iana","extensions":["mads"]},"application/manifest+json":{"charset":"UTF-8","compressible":true,"extensions":["webmanifest"]},"application/marc":{"source":"iana","extensions":["mrc"]},"application/marcxml+xml":{"source":"iana","extensions":["mrcx"]},"application/mathematica":{"source":"iana","extensions":["ma","nb","mb"]},"application/mathml+xml":{"source":"iana","extensions":["mathml"]},"application/mathml-content+xml":{"source":"iana"},"application/mathml-presentation+xml":{"source":"iana"},"application/mbms-associated-procedure-description+xml":{"source":"iana"},"application/mbms-deregister+xml":{"source":"iana"},"application/mbms-envelope+xml":{"source":"iana"},"application/mbms-msk+xml":{"source":"iana"},"application/mbms-msk-response+xml":{"source":"iana"},"application/mbms-protection-description+xml":{"source":"iana"},"application/mbms-reception-report+xml":{"source":"iana"},"application/mbms-register+xml":{"source":"iana"},"application/mbms-register-response+xml":{"source":"iana"},"application/mbms-schedule+xml":{"source":"iana"},"application/mbms-user-service-description+xml":{"source":"iana"},"application/mbox":{"source":"iana","extensions":["mbox"]},"application/media-policy-dataset+xml":{"source":"iana"},"application/media_control+xml":{"source":"iana"},"application/mediaservercontrol+xml":{"source":"iana","extensions":["mscml"]},"application/merge-patch+json":{"source":"iana","compressible":true},"application/metalink+xml":{"source":"apache","extensions":["metalink"]},"application/metalink4+xml":{"source":"iana","extensions":["meta4"]},"application/mets+xml":{"source":"iana","extensions":["mets"]},"application/mf4":{"source":"iana"},"application/mikey":{"source":"iana"},"application/mods+xml":{"source":"iana","extensions":["mods"]},"application/moss-keys":{"source":"iana"},"application/moss-signature":{"source":"iana"},"application/mosskey-data":{"source":"iana"},"application/mosskey-request":{"source":"iana"},"application/mp21":{"source":"iana","extensions":["m21","mp21"]},"application/mp4":{"source":"iana","extensions":["mp4s","m4p"]},"application/mpeg4-generic":{"source":"iana"},"application/mpeg4-iod":{"source":"iana"},"application/mpeg4-iod-xmt":{"source":"iana"},"application/mrb-consumer+xml":{"source":"iana"},"application/mrb-publish+xml":{"source":"iana"},"application/msc-ivr+xml":{"source":"iana"},"application/msc-mixer+xml":{"source":"iana"},"application/msword":{"source":"iana","compressible":false,"extensions":["doc","dot"]},"application/mxf":{"source":"iana","extensions":["mxf"]},"application/nasdata":{"source":"iana"},"application/news-checkgroups":{"source":"iana"},"application/news-groupinfo":{"source":"iana"},"application/news-transmission":{"source":"iana"},"application/nlsml+xml":{"source":"iana"},"application/nss":{"source":"iana"},"application/ocsp-request":{"source":"iana"},"application/ocsp-response":{"source":"iana"},"application/octet-stream":{"source":"iana","compressible":false,"extensions":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]},"application/oda":{"source":"iana","extensions":["oda"]},"application/odx":{"source":"iana"},"application/oebps-package+xml":{"source":"iana","extensions":["opf"]},"application/ogg":{"source":"iana","compressible":false,"extensions":["ogx"]},"application/omdoc+xml":{"source":"apache","extensions":["omdoc"]},"application/onenote":{"source":"apache","extensions":["onetoc","onetoc2","onetmp","onepkg"]},"application/oxps":{"source":"iana","extensions":["oxps"]},"application/p2p-overlay+xml":{"source":"iana"},"application/parityfec":{"source":"iana"},"application/patch-ops-error+xml":{"source":"iana","extensions":["xer"]},"application/pdf":{"source":"iana","compressible":false,"extensions":["pdf"]},"application/pdx":{"source":"iana"},"application/pgp-encrypted":{"source":"iana","compressible":false,"extensions":["pgp"]},"application/pgp-keys":{"source":"iana"},"application/pgp-signature":{"source":"iana","extensions":["asc","sig"]},"application/pics-rules":{"source":"apache","extensions":["prf"]},"application/pidf+xml":{"source":"iana"},"application/pidf-diff+xml":{"source":"iana"},"application/pkcs10":{"source":"iana","extensions":["p10"]},"application/pkcs12":{"source":"iana"},"application/pkcs7-mime":{"source":"iana","extensions":["p7m","p7c"]},"application/pkcs7-signature":{"source":"iana","extensions":["p7s"]},"application/pkcs8":{"source":"iana","extensions":["p8"]},"application/pkix-attr-cert":{"source":"iana","extensions":["ac"]},"application/pkix-cert":{"source":"iana","extensions":["cer"]},"application/pkix-crl":{"source":"iana","extensions":["crl"]},"application/pkix-pkipath":{"source":"iana","extensions":["pkipath"]},"application/pkixcmp":{"source":"iana","extensions":["pki"]},"application/pls+xml":{"source":"iana","extensions":["pls"]},"application/poc-settings+xml":{"source":"iana"},"application/postscript":{"source":"iana","compressible":true,"extensions":["ai","eps","ps"]},"application/ppsp-tracker+json":{"source":"iana","compressible":true},"application/problem+json":{"source":"iana","compressible":true},"application/problem+xml":{"source":"iana"},"application/provenance+xml":{"source":"iana"},"application/prs.alvestrand.titrax-sheet":{"source":"iana"},"application/prs.cww":{"source":"iana","extensions":["cww"]},"application/prs.hpub+zip":{"source":"iana"},"application/prs.nprend":{"source":"iana"},"application/prs.plucker":{"source":"iana"},"application/prs.rdf-xml-crypt":{"source":"iana"},"application/prs.xsf+xml":{"source":"iana"},"application/pskc+xml":{"source":"iana","extensions":["pskcxml"]},"application/qsig":{"source":"iana"},"application/raptorfec":{"source":"iana"},"application/rdap+json":{"source":"iana","compressible":true},"application/rdf+xml":{"source":"iana","compressible":true,"extensions":["rdf"]},"application/reginfo+xml":{"source":"iana","extensions":["rif"]},"application/relax-ng-compact-syntax":{"source":"iana","extensions":["rnc"]},"application/remote-printing":{"source":"iana"},"application/reputon+json":{"source":"iana","compressible":true},"application/resource-lists+xml":{"source":"iana","extensions":["rl"]},"application/resource-lists-diff+xml":{"source":"iana","extensions":["rld"]},"application/rfc+xml":{"source":"iana"},"application/riscos":{"source":"iana"},"application/rlmi+xml":{"source":"iana"},"application/rls-services+xml":{"source":"iana","extensions":["rs"]},"application/rpki-ghostbusters":{"source":"iana","extensions":["gbr"]},"application/rpki-manifest":{"source":"iana","extensions":["mft"]},"application/rpki-roa":{"source":"iana","extensions":["roa"]},"application/rpki-updown":{"source":"iana"},"application/rsd+xml":{"source":"apache","extensions":["rsd"]},"application/rss+xml":{"source":"apache","compressible":true,"extensions":["rss"]},"application/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"application/rtploopback":{"source":"iana"},"application/rtx":{"source":"iana"},"application/samlassertion+xml":{"source":"iana"},"application/samlmetadata+xml":{"source":"iana"},"application/sbml+xml":{"source":"iana","extensions":["sbml"]},"application/scaip+xml":{"source":"iana"},"application/scim+json":{"source":"iana","compressible":true},"application/scvp-cv-request":{"source":"iana","extensions":["scq"]},"application/scvp-cv-response":{"source":"iana","extensions":["scs"]},"application/scvp-vp-request":{"source":"iana","extensions":["spq"]},"application/scvp-vp-response":{"source":"iana","extensions":["spp"]},"application/sdp":{"source":"iana","extensions":["sdp"]},"application/sep+xml":{"source":"iana"},"application/sep-exi":{"source":"iana"},"application/session-info":{"source":"iana"},"application/set-payment":{"source":"iana"},"application/set-payment-initiation":{"source":"iana","extensions":["setpay"]},"application/set-registration":{"source":"iana"},"application/set-registration-initiation":{"source":"iana","extensions":["setreg"]},"application/sgml":{"source":"iana"},"application/sgml-open-catalog":{"source":"iana"},"application/shf+xml":{"source":"iana","extensions":["shf"]},"application/sieve":{"source":"iana"},"application/simple-filter+xml":{"source":"iana"},"application/simple-message-summary":{"source":"iana"},"application/simplesymbolcontainer":{"source":"iana"},"application/slate":{"source":"iana"},"application/smil":{"source":"iana"},"application/smil+xml":{"source":"iana","extensions":["smi","smil"]},"application/smpte336m":{"source":"iana"},"application/soap+fastinfoset":{"source":"iana"},"application/soap+xml":{"source":"iana","compressible":true},"application/sparql-query":{"source":"iana","extensions":["rq"]},"application/sparql-results+xml":{"source":"iana","extensions":["srx"]},"application/spirits-event+xml":{"source":"iana"},"application/sql":{"source":"iana"},"application/srgs":{"source":"iana","extensions":["gram"]},"application/srgs+xml":{"source":"iana","extensions":["grxml"]},"application/sru+xml":{"source":"iana","extensions":["sru"]},"application/ssdl+xml":{"source":"apache","extensions":["ssdl"]},"application/ssml+xml":{"source":"iana","extensions":["ssml"]},"application/tamp-apex-update":{"source":"iana"},"application/tamp-apex-update-confirm":{"source":"iana"},"application/tamp-community-update":{"source":"iana"},"application/tamp-community-update-confirm":{"source":"iana"},"application/tamp-error":{"source":"iana"},"application/tamp-sequence-adjust":{"source":"iana"},"application/tamp-sequence-adjust-confirm":{"source":"iana"},"application/tamp-status-query":{"source":"iana"},"application/tamp-status-response":{"source":"iana"},"application/tamp-update":{"source":"iana"},"application/tamp-update-confirm":{"source":"iana"},"application/tar":{"compressible":true},"application/tei+xml":{"source":"iana","extensions":["tei","teicorpus"]},"application/thraud+xml":{"source":"iana","extensions":["tfi"]},"application/timestamp-query":{"source":"iana"},"application/timestamp-reply":{"source":"iana"},"application/timestamped-data":{"source":"iana","extensions":["tsd"]},"application/ttml+xml":{"source":"iana"},"application/tve-trigger":{"source":"iana"},"application/ulpfec":{"source":"iana"},"application/urc-grpsheet+xml":{"source":"iana"},"application/urc-ressheet+xml":{"source":"iana"},"application/urc-targetdesc+xml":{"source":"iana"},"application/urc-uisocketdesc+xml":{"source":"iana"},"application/vcard+json":{"source":"iana","compressible":true},"application/vcard+xml":{"source":"iana"},"application/vemmi":{"source":"iana"},"application/vividence.scriptfile":{"source":"apache"},"application/vnd.3gpp-prose+xml":{"source":"iana"},"application/vnd.3gpp-prose-pc3ch+xml":{"source":"iana"},"application/vnd.3gpp.access-transfer-events+xml":{"source":"iana"},"application/vnd.3gpp.bsf+xml":{"source":"iana"},"application/vnd.3gpp.mid-call+xml":{"source":"iana"},"application/vnd.3gpp.pic-bw-large":{"source":"iana","extensions":["plb"]},"application/vnd.3gpp.pic-bw-small":{"source":"iana","extensions":["psb"]},"application/vnd.3gpp.pic-bw-var":{"source":"iana","extensions":["pvb"]},"application/vnd.3gpp.sms":{"source":"iana"},"application/vnd.3gpp.sms+xml":{"source":"iana"},"application/vnd.3gpp.srvcc-ext+xml":{"source":"iana"},"application/vnd.3gpp.srvcc-info+xml":{"source":"iana"},"application/vnd.3gpp.state-and-event-info+xml":{"source":"iana"},"application/vnd.3gpp.ussd+xml":{"source":"iana"},"application/vnd.3gpp2.bcmcsinfo+xml":{"source":"iana"},"application/vnd.3gpp2.sms":{"source":"iana"},"application/vnd.3gpp2.tcap":{"source":"iana","extensions":["tcap"]},"application/vnd.3lightssoftware.imagescal":{"source":"iana"},"application/vnd.3m.post-it-notes":{"source":"iana","extensions":["pwn"]},"application/vnd.accpac.simply.aso":{"source":"iana","extensions":["aso"]},"application/vnd.accpac.simply.imp":{"source":"iana","extensions":["imp"]},"application/vnd.acucobol":{"source":"iana","extensions":["acu"]},"application/vnd.acucorp":{"source":"iana","extensions":["atc","acutc"]},"application/vnd.adobe.air-application-installer-package+zip":{"source":"apache","extensions":["air"]},"application/vnd.adobe.flash.movie":{"source":"iana"},"application/vnd.adobe.formscentral.fcdt":{"source":"iana","extensions":["fcdt"]},"application/vnd.adobe.fxp":{"source":"iana","extensions":["fxp","fxpl"]},"application/vnd.adobe.partial-upload":{"source":"iana"},"application/vnd.adobe.xdp+xml":{"source":"iana","extensions":["xdp"]},"application/vnd.adobe.xfdf":{"source":"iana","extensions":["xfdf"]},"application/vnd.aether.imp":{"source":"iana"},"application/vnd.ah-barcode":{"source":"iana"},"application/vnd.ahead.space":{"source":"iana","extensions":["ahead"]},"application/vnd.airzip.filesecure.azf":{"source":"iana","extensions":["azf"]},"application/vnd.airzip.filesecure.azs":{"source":"iana","extensions":["azs"]},"application/vnd.amazon.ebook":{"source":"apache","extensions":["azw"]},"application/vnd.americandynamics.acc":{"source":"iana","extensions":["acc"]},"application/vnd.amiga.ami":{"source":"iana","extensions":["ami"]},"application/vnd.amundsen.maze+xml":{"source":"iana"},"application/vnd.android.package-archive":{"source":"apache","compressible":false,"extensions":["apk"]},"application/vnd.anki":{"source":"iana"},"application/vnd.anser-web-certificate-issue-initiation":{"source":"iana","extensions":["cii"]},"application/vnd.anser-web-funds-transfer-initiation":{"source":"apache","extensions":["fti"]},"application/vnd.antix.game-component":{"source":"iana","extensions":["atx"]},"application/vnd.apache.thrift.binary":{"source":"iana"},"application/vnd.apache.thrift.compact":{"source":"iana"},"application/vnd.apache.thrift.json":{"source":"iana"},"application/vnd.api+json":{"source":"iana","compressible":true},"application/vnd.apple.installer+xml":{"source":"iana","extensions":["mpkg"]},"application/vnd.apple.mpegurl":{"source":"iana","extensions":["m3u8"]},"application/vnd.apple.pkpass":{"compressible":false,"extensions":["pkpass"]},"application/vnd.arastra.swi":{"source":"iana"},"application/vnd.aristanetworks.swi":{"source":"iana","extensions":["swi"]},"application/vnd.artsquare":{"source":"iana"},"application/vnd.astraea-software.iota":{"source":"iana","extensions":["iota"]},"application/vnd.audiograph":{"source":"iana","extensions":["aep"]},"application/vnd.autopackage":{"source":"iana"},"application/vnd.avistar+xml":{"source":"iana"},"application/vnd.balsamiq.bmml+xml":{"source":"iana"},"application/vnd.balsamiq.bmpr":{"source":"iana"},"application/vnd.bekitzur-stech+json":{"source":"iana","compressible":true},"application/vnd.biopax.rdf+xml":{"source":"iana"},"application/vnd.blueice.multipass":{"source":"iana","extensions":["mpm"]},"application/vnd.bluetooth.ep.oob":{"source":"iana"},"application/vnd.bluetooth.le.oob":{"source":"iana"},"application/vnd.bmi":{"source":"iana","extensions":["bmi"]},"application/vnd.businessobjects":{"source":"iana","extensions":["rep"]},"application/vnd.cab-jscript":{"source":"iana"},"application/vnd.canon-cpdl":{"source":"iana"},"application/vnd.canon-lips":{"source":"iana"},"application/vnd.cendio.thinlinc.clientconf":{"source":"iana"},"application/vnd.century-systems.tcp_stream":{"source":"iana"},"application/vnd.chemdraw+xml":{"source":"iana","extensions":["cdxml"]},"application/vnd.chipnuts.karaoke-mmd":{"source":"iana","extensions":["mmd"]},"application/vnd.cinderella":{"source":"iana","extensions":["cdy"]},"application/vnd.cirpack.isdn-ext":{"source":"iana"},"application/vnd.citationstyles.style+xml":{"source":"iana"},"application/vnd.claymore":{"source":"iana","extensions":["cla"]},"application/vnd.cloanto.rp9":{"source":"iana","extensions":["rp9"]},"application/vnd.clonk.c4group":{"source":"iana","extensions":["c4g","c4d","c4f","c4p","c4u"]},"application/vnd.cluetrust.cartomobile-config":{"source":"iana","extensions":["c11amc"]},"application/vnd.cluetrust.cartomobile-config-pkg":{"source":"iana","extensions":["c11amz"]},"application/vnd.coffeescript":{"source":"iana"},"application/vnd.collection+json":{"source":"iana","compressible":true},"application/vnd.collection.doc+json":{"source":"iana","compressible":true},"application/vnd.collection.next+json":{"source":"iana","compressible":true},"application/vnd.commerce-battelle":{"source":"iana"},"application/vnd.commonspace":{"source":"iana","extensions":["csp"]},"application/vnd.contact.cmsg":{"source":"iana","extensions":["cdbcmsg"]},"application/vnd.coreos.ignition+json":{"source":"iana","compressible":true},"application/vnd.cosmocaller":{"source":"iana","extensions":["cmc"]},"application/vnd.crick.clicker":{"source":"iana","extensions":["clkx"]},"application/vnd.crick.clicker.keyboard":{"source":"iana","extensions":["clkk"]},"application/vnd.crick.clicker.palette":{"source":"iana","extensions":["clkp"]},"application/vnd.crick.clicker.template":{"source":"iana","extensions":["clkt"]},"application/vnd.crick.clicker.wordbank":{"source":"iana","extensions":["clkw"]},"application/vnd.criticaltools.wbs+xml":{"source":"iana","extensions":["wbs"]},"application/vnd.ctc-posml":{"source":"iana","extensions":["pml"]},"application/vnd.ctct.ws+xml":{"source":"iana"},"application/vnd.cups-pdf":{"source":"iana"},"application/vnd.cups-postscript":{"source":"iana"},"application/vnd.cups-ppd":{"source":"iana","extensions":["ppd"]},"application/vnd.cups-raster":{"source":"iana"},"application/vnd.cups-raw":{"source":"iana"},"application/vnd.curl":{"source":"iana"},"application/vnd.curl.car":{"source":"apache","extensions":["car"]},"application/vnd.curl.pcurl":{"source":"apache","extensions":["pcurl"]},"application/vnd.cyan.dean.root+xml":{"source":"iana"},"application/vnd.cybank":{"source":"iana"},"application/vnd.dart":{"source":"iana","compressible":true,"extensions":["dart"]},"application/vnd.data-vision.rdz":{"source":"iana","extensions":["rdz"]},"application/vnd.debian.binary-package":{"source":"iana"},"application/vnd.dece.data":{"source":"iana","extensions":["uvf","uvvf","uvd","uvvd"]},"application/vnd.dece.ttml+xml":{"source":"iana","extensions":["uvt","uvvt"]},"application/vnd.dece.unspecified":{"source":"iana","extensions":["uvx","uvvx"]},"application/vnd.dece.zip":{"source":"iana","extensions":["uvz","uvvz"]},"application/vnd.denovo.fcselayout-link":{"source":"iana","extensions":["fe_launch"]},"application/vnd.desmume-movie":{"source":"iana"},"application/vnd.desmume.movie":{"source":"apache"},"application/vnd.dir-bi.plate-dl-nosuffix":{"source":"iana"},"application/vnd.dm.delegation+xml":{"source":"iana"},"application/vnd.dna":{"source":"iana","extensions":["dna"]},"application/vnd.document+json":{"source":"iana","compressible":true},"application/vnd.dolby.mlp":{"source":"apache","extensions":["mlp"]},"application/vnd.dolby.mobile.1":{"source":"iana"},"application/vnd.dolby.mobile.2":{"source":"iana"},"application/vnd.doremir.scorecloud-binary-document":{"source":"iana"},"application/vnd.dpgraph":{"source":"iana","extensions":["dpg"]},"application/vnd.dreamfactory":{"source":"iana","extensions":["dfac"]},"application/vnd.drive+json":{"source":"iana","compressible":true},"application/vnd.ds-keypoint":{"source":"apache","extensions":["kpxx"]},"application/vnd.dtg.local":{"source":"iana"},"application/vnd.dtg.local.flash":{"source":"iana"},"application/vnd.dtg.local.html":{"source":"iana"},"application/vnd.dvb.ait":{"source":"iana","extensions":["ait"]},"application/vnd.dvb.dvbj":{"source":"iana"},"application/vnd.dvb.esgcontainer":{"source":"iana"},"application/vnd.dvb.ipdcdftnotifaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess2":{"source":"iana"},"application/vnd.dvb.ipdcesgpdd":{"source":"iana"},"application/vnd.dvb.ipdcroaming":{"source":"iana"},"application/vnd.dvb.iptv.alfec-base":{"source":"iana"},"application/vnd.dvb.iptv.alfec-enhancement":{"source":"iana"},"application/vnd.dvb.notif-aggregate-root+xml":{"source":"iana"},"application/vnd.dvb.notif-container+xml":{"source":"iana"},"application/vnd.dvb.notif-generic+xml":{"source":"iana"},"application/vnd.dvb.notif-ia-msglist+xml":{"source":"iana"},"application/vnd.dvb.notif-ia-registration-request+xml":{"source":"iana"},"application/vnd.dvb.notif-ia-registration-response+xml":{"source":"iana"},"application/vnd.dvb.notif-init+xml":{"source":"iana"},"application/vnd.dvb.pfr":{"source":"iana"},"application/vnd.dvb.service":{"source":"iana","extensions":["svc"]},"application/vnd.dxr":{"source":"iana"},"application/vnd.dynageo":{"source":"iana","extensions":["geo"]},"application/vnd.dzr":{"source":"iana"},"application/vnd.easykaraoke.cdgdownload":{"source":"iana"},"application/vnd.ecdis-update":{"source":"iana"},"application/vnd.ecowin.chart":{"source":"iana","extensions":["mag"]},"application/vnd.ecowin.filerequest":{"source":"iana"},"application/vnd.ecowin.fileupdate":{"source":"iana"},"application/vnd.ecowin.series":{"source":"iana"},"application/vnd.ecowin.seriesrequest":{"source":"iana"},"application/vnd.ecowin.seriesupdate":{"source":"iana"},"application/vnd.emclient.accessrequest+xml":{"source":"iana"},"application/vnd.enliven":{"source":"iana","extensions":["nml"]},"application/vnd.enphase.envoy":{"source":"iana"},"application/vnd.eprints.data+xml":{"source":"iana"},"application/vnd.epson.esf":{"source":"iana","extensions":["esf"]},"application/vnd.epson.msf":{"source":"iana","extensions":["msf"]},"application/vnd.epson.quickanime":{"source":"iana","extensions":["qam"]},"application/vnd.epson.salt":{"source":"iana","extensions":["slt"]},"application/vnd.epson.ssf":{"source":"iana","extensions":["ssf"]},"application/vnd.ericsson.quickcall":{"source":"iana"},"application/vnd.eszigno3+xml":{"source":"iana","extensions":["es3","et3"]},"application/vnd.etsi.aoc+xml":{"source":"iana"},"application/vnd.etsi.asic-e+zip":{"source":"iana"},"application/vnd.etsi.asic-s+zip":{"source":"iana"},"application/vnd.etsi.cug+xml":{"source":"iana"},"application/vnd.etsi.iptvcommand+xml":{"source":"iana"},"application/vnd.etsi.iptvdiscovery+xml":{"source":"iana"},"application/vnd.etsi.iptvprofile+xml":{"source":"iana"},"application/vnd.etsi.iptvsad-bc+xml":{"source":"iana"},"application/vnd.etsi.iptvsad-cod+xml":{"source":"iana"},"application/vnd.etsi.iptvsad-npvr+xml":{"source":"iana"},"application/vnd.etsi.iptvservice+xml":{"source":"iana"},"application/vnd.etsi.iptvsync+xml":{"source":"iana"},"application/vnd.etsi.iptvueprofile+xml":{"source":"iana"},"application/vnd.etsi.mcid+xml":{"source":"iana"},"application/vnd.etsi.mheg5":{"source":"iana"},"application/vnd.etsi.overload-control-policy-dataset+xml":{"source":"iana"},"application/vnd.etsi.pstn+xml":{"source":"iana"},"application/vnd.etsi.sci+xml":{"source":"iana"},"application/vnd.etsi.simservs+xml":{"source":"iana"},"application/vnd.etsi.timestamp-token":{"source":"iana"},"application/vnd.etsi.tsl+xml":{"source":"iana"},"application/vnd.etsi.tsl.der":{"source":"iana"},"application/vnd.eudora.data":{"source":"iana"},"application/vnd.ezpix-album":{"source":"iana","extensions":["ez2"]},"application/vnd.ezpix-package":{"source":"iana","extensions":["ez3"]},"application/vnd.f-secure.mobile":{"source":"iana"},"application/vnd.fastcopy-disk-image":{"source":"iana"},"application/vnd.fdf":{"source":"iana","extensions":["fdf"]},"application/vnd.fdsn.mseed":{"source":"iana","extensions":["mseed"]},"application/vnd.fdsn.seed":{"source":"iana","extensions":["seed","dataless"]},"application/vnd.ffsns":{"source":"iana"},"application/vnd.filmit.zfc":{"source":"iana"},"application/vnd.fints":{"source":"iana"},"application/vnd.firemonkeys.cloudcell":{"source":"iana"},"application/vnd.flographit":{"source":"iana","extensions":["gph"]},"application/vnd.fluxtime.clip":{"source":"iana","extensions":["ftc"]},"application/vnd.font-fontforge-sfd":{"source":"iana"},"application/vnd.framemaker":{"source":"iana","extensions":["fm","frame","maker","book"]},"application/vnd.frogans.fnc":{"source":"iana","extensions":["fnc"]},"application/vnd.frogans.ltf":{"source":"iana","extensions":["ltf"]},"application/vnd.fsc.weblaunch":{"source":"iana","extensions":["fsc"]},"application/vnd.fujitsu.oasys":{"source":"iana","extensions":["oas"]},"application/vnd.fujitsu.oasys2":{"source":"iana","extensions":["oa2"]},"application/vnd.fujitsu.oasys3":{"source":"iana","extensions":["oa3"]},"application/vnd.fujitsu.oasysgp":{"source":"iana","extensions":["fg5"]},"application/vnd.fujitsu.oasysprs":{"source":"iana","extensions":["bh2"]},"application/vnd.fujixerox.art-ex":{"source":"iana"},"application/vnd.fujixerox.art4":{"source":"iana"},"application/vnd.fujixerox.ddd":{"source":"iana","extensions":["ddd"]},"application/vnd.fujixerox.docuworks":{"source":"iana","extensions":["xdw"]},"application/vnd.fujixerox.docuworks.binder":{"source":"iana","extensions":["xbd"]},"application/vnd.fujixerox.docuworks.container":{"source":"iana"},"application/vnd.fujixerox.hbpl":{"source":"iana"},"application/vnd.fut-misnet":{"source":"iana"},"application/vnd.fuzzysheet":{"source":"iana","extensions":["fzs"]},"application/vnd.genomatix.tuxedo":{"source":"iana","extensions":["txd"]},"application/vnd.geo+json":{"source":"iana","compressible":true},"application/vnd.geocube+xml":{"source":"iana"},"application/vnd.geogebra.file":{"source":"iana","extensions":["ggb"]},"application/vnd.geogebra.tool":{"source":"iana","extensions":["ggt"]},"application/vnd.geometry-explorer":{"source":"iana","extensions":["gex","gre"]},"application/vnd.geonext":{"source":"iana","extensions":["gxt"]},"application/vnd.geoplan":{"source":"iana","extensions":["g2w"]},"application/vnd.geospace":{"source":"iana","extensions":["g3w"]},"application/vnd.gerber":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt-response":{"source":"iana"},"application/vnd.gmx":{"source":"iana","extensions":["gmx"]},"application/vnd.google-apps.document":{"compressible":false,"extensions":["gdoc"]},"application/vnd.google-apps.presentation":{"compressible":false,"extensions":["gslides"]},"application/vnd.google-apps.spreadsheet":{"compressible":false,"extensions":["gsheet"]},"application/vnd.google-earth.kml+xml":{"source":"iana","compressible":true,"extensions":["kml"]},"application/vnd.google-earth.kmz":{"source":"iana","compressible":false,"extensions":["kmz"]},"application/vnd.gov.sk.e-form+xml":{"source":"iana"},"application/vnd.gov.sk.e-form+zip":{"source":"iana"},"application/vnd.gov.sk.xmldatacontainer+xml":{"source":"iana"},"application/vnd.grafeq":{"source":"iana","extensions":["gqf","gqs"]},"application/vnd.gridmp":{"source":"iana"},"application/vnd.groove-account":{"source":"iana","extensions":["gac"]},"application/vnd.groove-help":{"source":"iana","extensions":["ghf"]},"application/vnd.groove-identity-message":{"source":"iana","extensions":["gim"]},"application/vnd.groove-injector":{"source":"iana","extensions":["grv"]},"application/vnd.groove-tool-message":{"source":"iana","extensions":["gtm"]},"application/vnd.groove-tool-template":{"source":"iana","extensions":["tpl"]},"application/vnd.groove-vcard":{"source":"iana","extensions":["vcg"]},"application/vnd.hal+json":{"source":"iana","compressible":true},"application/vnd.hal+xml":{"source":"iana","extensions":["hal"]},"application/vnd.handheld-entertainment+xml":{"source":"iana","extensions":["zmm"]},"application/vnd.hbci":{"source":"iana","extensions":["hbci"]},"application/vnd.hcl-bireports":{"source":"iana"},"application/vnd.hdt":{"source":"iana"},"application/vnd.heroku+json":{"source":"iana","compressible":true},"application/vnd.hhe.lesson-player":{"source":"iana","extensions":["les"]},"application/vnd.hp-hpgl":{"source":"iana","extensions":["hpgl"]},"application/vnd.hp-hpid":{"source":"iana","extensions":["hpid"]},"application/vnd.hp-hps":{"source":"iana","extensions":["hps"]},"application/vnd.hp-jlyt":{"source":"iana","extensions":["jlt"]},"application/vnd.hp-pcl":{"source":"iana","extensions":["pcl"]},"application/vnd.hp-pclxl":{"source":"iana","extensions":["pclxl"]},"application/vnd.httphone":{"source":"iana"},"application/vnd.hydrostatix.sof-data":{"source":"iana","extensions":["sfd-hdstx"]},"application/vnd.hyperdrive+json":{"source":"iana","compressible":true},"application/vnd.hzn-3d-crossword":{"source":"iana"},"application/vnd.ibm.afplinedata":{"source":"iana"},"application/vnd.ibm.electronic-media":{"source":"iana"},"application/vnd.ibm.minipay":{"source":"iana","extensions":["mpy"]},"application/vnd.ibm.modcap":{"source":"iana","extensions":["afp","listafp","list3820"]},"application/vnd.ibm.rights-management":{"source":"iana","extensions":["irm"]},"application/vnd.ibm.secure-container":{"source":"iana","extensions":["sc"]},"application/vnd.iccprofile":{"source":"iana","extensions":["icc","icm"]},"application/vnd.ieee.1905":{"source":"iana"},"application/vnd.igloader":{"source":"iana","extensions":["igl"]},"application/vnd.immervision-ivp":{"source":"iana","extensions":["ivp"]},"application/vnd.immervision-ivu":{"source":"iana","extensions":["ivu"]},"application/vnd.ims.imsccv1p1":{"source":"iana"},"application/vnd.ims.imsccv1p2":{"source":"iana"},"application/vnd.ims.imsccv1p3":{"source":"iana"},"application/vnd.ims.lis.v2.result+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolconsumerprofile+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy.id+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings.simple+json":{"source":"iana","compressible":true},"application/vnd.informedcontrol.rms+xml":{"source":"iana"},"application/vnd.informix-visionary":{"source":"iana"},"application/vnd.infotech.project":{"source":"iana"},"application/vnd.infotech.project+xml":{"source":"iana"},"application/vnd.innopath.wamp.notification":{"source":"iana"},"application/vnd.insors.igm":{"source":"iana","extensions":["igm"]},"application/vnd.intercon.formnet":{"source":"iana","extensions":["xpw","xpx"]},"application/vnd.intergeo":{"source":"iana","extensions":["i2g"]},"application/vnd.intertrust.digibox":{"source":"iana"},"application/vnd.intertrust.nncp":{"source":"iana"},"application/vnd.intu.qbo":{"source":"iana","extensions":["qbo"]},"application/vnd.intu.qfx":{"source":"iana","extensions":["qfx"]},"application/vnd.iptc.g2.catalogitem+xml":{"source":"iana"},"application/vnd.iptc.g2.conceptitem+xml":{"source":"iana"},"application/vnd.iptc.g2.knowledgeitem+xml":{"source":"iana"},"application/vnd.iptc.g2.newsitem+xml":{"source":"iana"},"application/vnd.iptc.g2.newsmessage+xml":{"source":"iana"},"application/vnd.iptc.g2.packageitem+xml":{"source":"iana"},"application/vnd.iptc.g2.planningitem+xml":{"source":"iana"},"application/vnd.ipunplugged.rcprofile":{"source":"iana","extensions":["rcprofile"]},"application/vnd.irepository.package+xml":{"source":"iana","extensions":["irp"]},"application/vnd.is-xpr":{"source":"iana","extensions":["xpr"]},"application/vnd.isac.fcs":{"source":"iana","extensions":["fcs"]},"application/vnd.jam":{"source":"iana","extensions":["jam"]},"application/vnd.japannet-directory-service":{"source":"iana"},"application/vnd.japannet-jpnstore-wakeup":{"source":"iana"},"application/vnd.japannet-payment-wakeup":{"source":"iana"},"application/vnd.japannet-registration":{"source":"iana"},"application/vnd.japannet-registration-wakeup":{"source":"iana"},"application/vnd.japannet-setstore-wakeup":{"source":"iana"},"application/vnd.japannet-verification":{"source":"iana"},"application/vnd.japannet-verification-wakeup":{"source":"iana"},"application/vnd.jcp.javame.midlet-rms":{"source":"iana","extensions":["rms"]},"application/vnd.jisp":{"source":"iana","extensions":["jisp"]},"application/vnd.joost.joda-archive":{"source":"iana","extensions":["joda"]},"application/vnd.jsk.isdn-ngn":{"source":"iana"},"application/vnd.kahootz":{"source":"iana","extensions":["ktz","ktr"]},"application/vnd.kde.karbon":{"source":"iana","extensions":["karbon"]},"application/vnd.kde.kchart":{"source":"iana","extensions":["chrt"]},"application/vnd.kde.kformula":{"source":"iana","extensions":["kfo"]},"application/vnd.kde.kivio":{"source":"iana","extensions":["flw"]},"application/vnd.kde.kontour":{"source":"iana","extensions":["kon"]},"application/vnd.kde.kpresenter":{"source":"iana","extensions":["kpr","kpt"]},"application/vnd.kde.kspread":{"source":"iana","extensions":["ksp"]},"application/vnd.kde.kword":{"source":"iana","extensions":["kwd","kwt"]},"application/vnd.kenameaapp":{"source":"iana","extensions":["htke"]},"application/vnd.kidspiration":{"source":"iana","extensions":["kia"]},"application/vnd.kinar":{"source":"iana","extensions":["kne","knp"]},"application/vnd.koan":{"source":"iana","extensions":["skp","skd","skt","skm"]},"application/vnd.kodak-descriptor":{"source":"iana","extensions":["sse"]},"application/vnd.las.las+xml":{"source":"iana","extensions":["lasxml"]},"application/vnd.liberty-request+xml":{"source":"iana"},"application/vnd.llamagraphics.life-balance.desktop":{"source":"iana","extensions":["lbd"]},"application/vnd.llamagraphics.life-balance.exchange+xml":{"source":"iana","extensions":["lbe"]},"application/vnd.lotus-1-2-3":{"source":"iana","extensions":["123"]},"application/vnd.lotus-approach":{"source":"iana","extensions":["apr"]},"application/vnd.lotus-freelance":{"source":"iana","extensions":["pre"]},"application/vnd.lotus-notes":{"source":"iana","extensions":["nsf"]},"application/vnd.lotus-organizer":{"source":"iana","extensions":["org"]},"application/vnd.lotus-screencam":{"source":"iana","extensions":["scm"]},"application/vnd.lotus-wordpro":{"source":"iana","extensions":["lwp"]},"application/vnd.macports.portpkg":{"source":"iana","extensions":["portpkg"]},"application/vnd.mapbox-vector-tile":{"source":"iana"},"application/vnd.marlin.drm.actiontoken+xml":{"source":"iana"},"application/vnd.marlin.drm.conftoken+xml":{"source":"iana"},"application/vnd.marlin.drm.license+xml":{"source":"iana"},"application/vnd.marlin.drm.mdcf":{"source":"iana"},"application/vnd.mason+json":{"source":"iana","compressible":true},"application/vnd.maxmind.maxmind-db":{"source":"iana"},"application/vnd.mcd":{"source":"iana","extensions":["mcd"]},"application/vnd.medcalcdata":{"source":"iana","extensions":["mc1"]},"application/vnd.mediastation.cdkey":{"source":"iana","extensions":["cdkey"]},"application/vnd.meridian-slingshot":{"source":"iana"},"application/vnd.mfer":{"source":"iana","extensions":["mwf"]},"application/vnd.mfmp":{"source":"iana","extensions":["mfm"]},"application/vnd.micro+json":{"source":"iana","compressible":true},"application/vnd.micrografx.flo":{"source":"iana","extensions":["flo"]},"application/vnd.micrografx.igx":{"source":"iana","extensions":["igx"]},"application/vnd.microsoft.portable-executable":{"source":"iana"},"application/vnd.miele+json":{"source":"iana","compressible":true},"application/vnd.mif":{"source":"iana","extensions":["mif"]},"application/vnd.minisoft-hp3000-save":{"source":"iana"},"application/vnd.mitsubishi.misty-guard.trustweb":{"source":"iana"},"application/vnd.mobius.daf":{"source":"iana","extensions":["daf"]},"application/vnd.mobius.dis":{"source":"iana","extensions":["dis"]},"application/vnd.mobius.mbk":{"source":"iana","extensions":["mbk"]},"application/vnd.mobius.mqy":{"source":"iana","extensions":["mqy"]},"application/vnd.mobius.msl":{"source":"iana","extensions":["msl"]},"application/vnd.mobius.plc":{"source":"iana","extensions":["plc"]},"application/vnd.mobius.txf":{"source":"iana","extensions":["txf"]},"application/vnd.mophun.application":{"source":"iana","extensions":["mpn"]},"application/vnd.mophun.certificate":{"source":"iana","extensions":["mpc"]},"application/vnd.motorola.flexsuite":{"source":"iana"},"application/vnd.motorola.flexsuite.adsi":{"source":"iana"},"application/vnd.motorola.flexsuite.fis":{"source":"iana"},"application/vnd.motorola.flexsuite.gotap":{"source":"iana"},"application/vnd.motorola.flexsuite.kmr":{"source":"iana"},"application/vnd.motorola.flexsuite.ttc":{"source":"iana"},"application/vnd.motorola.flexsuite.wem":{"source":"iana"},"application/vnd.motorola.iprm":{"source":"iana"},"application/vnd.mozilla.xul+xml":{"source":"iana","compressible":true,"extensions":["xul"]},"application/vnd.ms-3mfdocument":{"source":"iana"},"application/vnd.ms-artgalry":{"source":"iana","extensions":["cil"]},"application/vnd.ms-asf":{"source":"iana"},"application/vnd.ms-cab-compressed":{"source":"iana","extensions":["cab"]},"application/vnd.ms-color.iccprofile":{"source":"apache"},"application/vnd.ms-excel":{"source":"iana","compressible":false,"extensions":["xls","xlm","xla","xlc","xlt","xlw"]},"application/vnd.ms-excel.addin.macroenabled.12":{"source":"iana","extensions":["xlam"]},"application/vnd.ms-excel.sheet.binary.macroenabled.12":{"source":"iana","extensions":["xlsb"]},"application/vnd.ms-excel.sheet.macroenabled.12":{"source":"iana","extensions":["xlsm"]},"application/vnd.ms-excel.template.macroenabled.12":{"source":"iana","extensions":["xltm"]},"application/vnd.ms-fontobject":{"source":"iana","compressible":true,"extensions":["eot"]},"application/vnd.ms-htmlhelp":{"source":"iana","extensions":["chm"]},"application/vnd.ms-ims":{"source":"iana","extensions":["ims"]},"application/vnd.ms-lrm":{"source":"iana","extensions":["lrm"]},"application/vnd.ms-office.activex+xml":{"source":"iana"},"application/vnd.ms-officetheme":{"source":"iana","extensions":["thmx"]},"application/vnd.ms-opentype":{"source":"apache","compressible":true},"application/vnd.ms-package.obfuscated-opentype":{"source":"apache"},"application/vnd.ms-pki.seccat":{"source":"apache","extensions":["cat"]},"application/vnd.ms-pki.stl":{"source":"apache","extensions":["stl"]},"application/vnd.ms-playready.initiator+xml":{"source":"iana"},"application/vnd.ms-powerpoint":{"source":"iana","compressible":false,"extensions":["ppt","pps","pot"]},"application/vnd.ms-powerpoint.addin.macroenabled.12":{"source":"iana","extensions":["ppam"]},"application/vnd.ms-powerpoint.presentation.macroenabled.12":{"source":"iana","extensions":["pptm"]},"application/vnd.ms-powerpoint.slide.macroenabled.12":{"source":"iana","extensions":["sldm"]},"application/vnd.ms-powerpoint.slideshow.macroenabled.12":{"source":"iana","extensions":["ppsm"]},"application/vnd.ms-powerpoint.template.macroenabled.12":{"source":"iana","extensions":["potm"]},"application/vnd.ms-printdevicecapabilities+xml":{"source":"iana"},"application/vnd.ms-printing.printticket+xml":{"source":"apache"},"application/vnd.ms-printschematicket+xml":{"source":"iana"},"application/vnd.ms-project":{"source":"iana","extensions":["mpp","mpt"]},"application/vnd.ms-tnef":{"source":"iana"},"application/vnd.ms-windows.devicepairing":{"source":"iana"},"application/vnd.ms-windows.nwprinting.oob":{"source":"iana"},"application/vnd.ms-windows.printerpairing":{"source":"iana"},"application/vnd.ms-windows.wsd.oob":{"source":"iana"},"application/vnd.ms-wmdrm.lic-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.lic-resp":{"source":"iana"},"application/vnd.ms-wmdrm.meter-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.meter-resp":{"source":"iana"},"application/vnd.ms-word.document.macroenabled.12":{"source":"iana","extensions":["docm"]},"application/vnd.ms-word.template.macroenabled.12":{"source":"iana","extensions":["dotm"]},"application/vnd.ms-works":{"source":"iana","extensions":["wps","wks","wcm","wdb"]},"application/vnd.ms-wpl":{"source":"iana","extensions":["wpl"]},"application/vnd.ms-xpsdocument":{"source":"iana","compressible":false,"extensions":["xps"]},"application/vnd.msa-disk-image":{"source":"iana"},"application/vnd.mseq":{"source":"iana","extensions":["mseq"]},"application/vnd.msign":{"source":"iana"},"application/vnd.multiad.creator":{"source":"iana"},"application/vnd.multiad.creator.cif":{"source":"iana"},"application/vnd.music-niff":{"source":"iana"},"application/vnd.musician":{"source":"iana","extensions":["mus"]},"application/vnd.muvee.style":{"source":"iana","extensions":["msty"]},"application/vnd.mynfc":{"source":"iana","extensions":["taglet"]},"application/vnd.ncd.control":{"source":"iana"},"application/vnd.ncd.reference":{"source":"iana"},"application/vnd.nervana":{"source":"iana"},"application/vnd.netfpx":{"source":"iana"},"application/vnd.neurolanguage.nlu":{"source":"iana","extensions":["nlu"]},"application/vnd.nintendo.nitro.rom":{"source":"iana"},"application/vnd.nintendo.snes.rom":{"source":"iana"},"application/vnd.nitf":{"source":"iana","extensions":["ntf","nitf"]},"application/vnd.noblenet-directory":{"source":"iana","extensions":["nnd"]},"application/vnd.noblenet-sealer":{"source":"iana","extensions":["nns"]},"application/vnd.noblenet-web":{"source":"iana","extensions":["nnw"]},"application/vnd.nokia.catalogs":{"source":"iana"},"application/vnd.nokia.conml+wbxml":{"source":"iana"},"application/vnd.nokia.conml+xml":{"source":"iana"},"application/vnd.nokia.iptv.config+xml":{"source":"iana"},"application/vnd.nokia.isds-radio-presets":{"source":"iana"},"application/vnd.nokia.landmark+wbxml":{"source":"iana"},"application/vnd.nokia.landmark+xml":{"source":"iana"},"application/vnd.nokia.landmarkcollection+xml":{"source":"iana"},"application/vnd.nokia.n-gage.ac+xml":{"source":"iana"},"application/vnd.nokia.n-gage.data":{"source":"iana","extensions":["ngdat"]},"application/vnd.nokia.n-gage.symbian.install":{"source":"iana","extensions":["n-gage"]},"application/vnd.nokia.ncd":{"source":"iana"},"application/vnd.nokia.pcd+wbxml":{"source":"iana"},"application/vnd.nokia.pcd+xml":{"source":"iana"},"application/vnd.nokia.radio-preset":{"source":"iana","extensions":["rpst"]},"application/vnd.nokia.radio-presets":{"source":"iana","extensions":["rpss"]},"application/vnd.novadigm.edm":{"source":"iana","extensions":["edm"]},"application/vnd.novadigm.edx":{"source":"iana","extensions":["edx"]},"application/vnd.novadigm.ext":{"source":"iana","extensions":["ext"]},"application/vnd.ntt-local.content-share":{"source":"iana"},"application/vnd.ntt-local.file-transfer":{"source":"iana"},"application/vnd.ntt-local.ogw_remote-access":{"source":"iana"},"application/vnd.ntt-local.sip-ta_remote":{"source":"iana"},"application/vnd.ntt-local.sip-ta_tcp_stream":{"source":"iana"},"application/vnd.oasis.opendocument.chart":{"source":"iana","extensions":["odc"]},"application/vnd.oasis.opendocument.chart-template":{"source":"iana","extensions":["otc"]},"application/vnd.oasis.opendocument.database":{"source":"iana","extensions":["odb"]},"application/vnd.oasis.opendocument.formula":{"source":"iana","extensions":["odf"]},"application/vnd.oasis.opendocument.formula-template":{"source":"iana","extensions":["odft"]},"application/vnd.oasis.opendocument.graphics":{"source":"iana","compressible":false,"extensions":["odg"]},"application/vnd.oasis.opendocument.graphics-template":{"source":"iana","extensions":["otg"]},"application/vnd.oasis.opendocument.image":{"source":"iana","extensions":["odi"]},"application/vnd.oasis.opendocument.image-template":{"source":"iana","extensions":["oti"]},"application/vnd.oasis.opendocument.presentation":{"source":"iana","compressible":false,"extensions":["odp"]},"application/vnd.oasis.opendocument.presentation-template":{"source":"iana","extensions":["otp"]},"application/vnd.oasis.opendocument.spreadsheet":{"source":"iana","compressible":false,"extensions":["ods"]},"application/vnd.oasis.opendocument.spreadsheet-template":{"source":"iana","extensions":["ots"]},"application/vnd.oasis.opendocument.text":{"source":"iana","compressible":false,"extensions":["odt"]},"application/vnd.oasis.opendocument.text-master":{"source":"iana","extensions":["odm"]},"application/vnd.oasis.opendocument.text-template":{"source":"iana","extensions":["ott"]},"application/vnd.oasis.opendocument.text-web":{"source":"iana","extensions":["oth"]},"application/vnd.obn":{"source":"iana"},"application/vnd.oftn.l10n+json":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessdownload+xml":{"source":"iana"},"application/vnd.oipf.contentaccessstreaming+xml":{"source":"iana"},"application/vnd.oipf.cspg-hexbinary":{"source":"iana"},"application/vnd.oipf.dae.svg+xml":{"source":"iana"},"application/vnd.oipf.dae.xhtml+xml":{"source":"iana"},"application/vnd.oipf.mippvcontrolmessage+xml":{"source":"iana"},"application/vnd.oipf.pae.gem":{"source":"iana"},"application/vnd.oipf.spdiscovery+xml":{"source":"iana"},"application/vnd.oipf.spdlist+xml":{"source":"iana"},"application/vnd.oipf.ueprofile+xml":{"source":"iana"},"application/vnd.oipf.userprofile+xml":{"source":"iana"},"application/vnd.olpc-sugar":{"source":"iana","extensions":["xo"]},"application/vnd.oma-scws-config":{"source":"iana"},"application/vnd.oma-scws-http-request":{"source":"iana"},"application/vnd.oma-scws-http-response":{"source":"iana"},"application/vnd.oma.bcast.associated-procedure-parameter+xml":{"source":"iana"},"application/vnd.oma.bcast.drm-trigger+xml":{"source":"iana"},"application/vnd.oma.bcast.imd+xml":{"source":"iana"},"application/vnd.oma.bcast.ltkm":{"source":"iana"},"application/vnd.oma.bcast.notification+xml":{"source":"iana"},"application/vnd.oma.bcast.provisioningtrigger":{"source":"iana"},"application/vnd.oma.bcast.sgboot":{"source":"iana"},"application/vnd.oma.bcast.sgdd+xml":{"source":"iana"},"application/vnd.oma.bcast.sgdu":{"source":"iana"},"application/vnd.oma.bcast.simple-symbol-container":{"source":"iana"},"application/vnd.oma.bcast.smartcard-trigger+xml":{"source":"iana"},"application/vnd.oma.bcast.sprov+xml":{"source":"iana"},"application/vnd.oma.bcast.stkm":{"source":"iana"},"application/vnd.oma.cab-address-book+xml":{"source":"iana"},"application/vnd.oma.cab-feature-handler+xml":{"source":"iana"},"application/vnd.oma.cab-pcc+xml":{"source":"iana"},"application/vnd.oma.cab-subs-invite+xml":{"source":"iana"},"application/vnd.oma.cab-user-prefs+xml":{"source":"iana"},"application/vnd.oma.dcd":{"source":"iana"},"application/vnd.oma.dcdc":{"source":"iana"},"application/vnd.oma.dd2+xml":{"source":"iana","extensions":["dd2"]},"application/vnd.oma.drm.risd+xml":{"source":"iana"},"application/vnd.oma.group-usage-list+xml":{"source":"iana"},"application/vnd.oma.pal+xml":{"source":"iana"},"application/vnd.oma.poc.detailed-progress-report+xml":{"source":"iana"},"application/vnd.oma.poc.final-report+xml":{"source":"iana"},"application/vnd.oma.poc.groups+xml":{"source":"iana"},"application/vnd.oma.poc.invocation-descriptor+xml":{"source":"iana"},"application/vnd.oma.poc.optimized-progress-report+xml":{"source":"iana"},"application/vnd.oma.push":{"source":"iana"},"application/vnd.oma.scidm.messages+xml":{"source":"iana"},"application/vnd.oma.xcap-directory+xml":{"source":"iana"},"application/vnd.omads-email+xml":{"source":"iana"},"application/vnd.omads-file+xml":{"source":"iana"},"application/vnd.omads-folder+xml":{"source":"iana"},"application/vnd.omaloc-supl-init":{"source":"iana"},"application/vnd.onepager":{"source":"iana"},"application/vnd.openblox.game+xml":{"source":"iana"},"application/vnd.openblox.game-binary":{"source":"iana"},"application/vnd.openeye.oeb":{"source":"iana"},"application/vnd.openofficeorg.extension":{"source":"apache","extensions":["oxt"]},"application/vnd.openxmlformats-officedocument.custom-properties+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.customxmlproperties+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.drawing+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.drawingml.chart+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.extended-properties+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml-template":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.comments+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.presentation":{"source":"iana","compressible":false,"extensions":["pptx"]},"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.slide":{"source":"iana","extensions":["sldx"]},"application/vnd.openxmlformats-officedocument.presentationml.slide+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.slideshow":{"source":"iana","extensions":["ppsx"]},"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.tags+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.template":{"source":"apache","extensions":["potx"]},"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml-template":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":{"source":"iana","compressible":false,"extensions":["xlsx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.template":{"source":"apache","extensions":["xltx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.theme+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.themeoverride+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.vmldrawing":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml-template":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.document":{"source":"iana","compressible":false,"extensions":["docx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.template":{"source":"apache","extensions":["dotx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml":{"source":"iana"},"application/vnd.openxmlformats-package.core-properties+xml":{"source":"iana"},"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml":{"source":"iana"},"application/vnd.openxmlformats-package.relationships+xml":{"source":"iana"},"application/vnd.oracle.resource+json":{"source":"iana","compressible":true},"application/vnd.orange.indata":{"source":"iana"},"application/vnd.osa.netdeploy":{"source":"iana"},"application/vnd.osgeo.mapguide.package":{"source":"iana","extensions":["mgp"]},"application/vnd.osgi.bundle":{"source":"iana"},"application/vnd.osgi.dp":{"source":"iana","extensions":["dp"]},"application/vnd.osgi.subsystem":{"source":"iana","extensions":["esa"]},"application/vnd.otps.ct-kip+xml":{"source":"iana"},"application/vnd.oxli.countgraph":{"source":"iana"},"application/vnd.pagerduty+json":{"source":"iana","compressible":true},"application/vnd.palm":{"source":"iana","extensions":["pdb","pqa","oprc"]},"application/vnd.panoply":{"source":"iana"},"application/vnd.paos+xml":{"source":"iana"},"application/vnd.paos.xml":{"source":"apache"},"application/vnd.pawaafile":{"source":"iana","extensions":["paw"]},"application/vnd.pcos":{"source":"iana"},"application/vnd.pg.format":{"source":"iana","extensions":["str"]},"application/vnd.pg.osasli":{"source":"iana","extensions":["ei6"]},"application/vnd.piaccess.application-licence":{"source":"iana"},"application/vnd.picsel":{"source":"iana","extensions":["efif"]},"application/vnd.pmi.widget":{"source":"iana","extensions":["wg"]},"application/vnd.poc.group-advertisement+xml":{"source":"iana"},"application/vnd.pocketlearn":{"source":"iana","extensions":["plf"]},"application/vnd.powerbuilder6":{"source":"iana","extensions":["pbd"]},"application/vnd.powerbuilder6-s":{"source":"iana"},"application/vnd.powerbuilder7":{"source":"iana"},"application/vnd.powerbuilder7-s":{"source":"iana"},"application/vnd.powerbuilder75":{"source":"iana"},"application/vnd.powerbuilder75-s":{"source":"iana"},"application/vnd.preminet":{"source":"iana"},"application/vnd.previewsystems.box":{"source":"iana","extensions":["box"]},"application/vnd.proteus.magazine":{"source":"iana","extensions":["mgz"]},"application/vnd.publishare-delta-tree":{"source":"iana","extensions":["qps"]},"application/vnd.pvi.ptid1":{"source":"iana","extensions":["ptid"]},"application/vnd.pwg-multiplexed":{"source":"iana"},"application/vnd.pwg-xhtml-print+xml":{"source":"iana"},"application/vnd.qualcomm.brew-app-res":{"source":"iana"},"application/vnd.quark.quarkxpress":{"source":"iana","extensions":["qxd","qxt","qwd","qwt","qxl","qxb"]},"application/vnd.quobject-quoxdocument":{"source":"iana"},"application/vnd.radisys.moml+xml":{"source":"iana"},"application/vnd.radisys.msml+xml":{"source":"iana"},"application/vnd.radisys.msml-audit+xml":{"source":"iana"},"application/vnd.radisys.msml-audit-conf+xml":{"source":"iana"},"application/vnd.radisys.msml-audit-conn+xml":{"source":"iana"},"application/vnd.radisys.msml-audit-dialog+xml":{"source":"iana"},"application/vnd.radisys.msml-audit-stream+xml":{"source":"iana"},"application/vnd.radisys.msml-conf+xml":{"source":"iana"},"application/vnd.radisys.msml-dialog+xml":{"source":"iana"},"application/vnd.radisys.msml-dialog-base+xml":{"source":"iana"},"application/vnd.radisys.msml-dialog-fax-detect+xml":{"source":"iana"},"application/vnd.radisys.msml-dialog-fax-sendrecv+xml":{"source":"iana"},"application/vnd.radisys.msml-dialog-group+xml":{"source":"iana"},"application/vnd.radisys.msml-dialog-speech+xml":{"source":"iana"},"application/vnd.radisys.msml-dialog-transform+xml":{"source":"iana"},"application/vnd.rainstor.data":{"source":"iana"},"application/vnd.rapid":{"source":"iana"},"application/vnd.realvnc.bed":{"source":"iana","extensions":["bed"]},"application/vnd.recordare.musicxml":{"source":"iana","extensions":["mxl"]},"application/vnd.recordare.musicxml+xml":{"source":"iana","extensions":["musicxml"]},"application/vnd.renlearn.rlprint":{"source":"iana"},"application/vnd.rig.cryptonote":{"source":"iana","extensions":["cryptonote"]},"application/vnd.rim.cod":{"source":"apache","extensions":["cod"]},"application/vnd.rn-realmedia":{"source":"apache","extensions":["rm"]},"application/vnd.rn-realmedia-vbr":{"source":"apache","extensions":["rmvb"]},"application/vnd.route66.link66+xml":{"source":"iana","extensions":["link66"]},"application/vnd.rs-274x":{"source":"iana"},"application/vnd.ruckus.download":{"source":"iana"},"application/vnd.s3sms":{"source":"iana"},"application/vnd.sailingtracker.track":{"source":"iana","extensions":["st"]},"application/vnd.sbm.cid":{"source":"iana"},"application/vnd.sbm.mid2":{"source":"iana"},"application/vnd.scribus":{"source":"iana"},"application/vnd.sealed.3df":{"source":"iana"},"application/vnd.sealed.csf":{"source":"iana"},"application/vnd.sealed.doc":{"source":"iana"},"application/vnd.sealed.eml":{"source":"iana"},"application/vnd.sealed.mht":{"source":"iana"},"application/vnd.sealed.net":{"source":"iana"},"application/vnd.sealed.ppt":{"source":"iana"},"application/vnd.sealed.tiff":{"source":"iana"},"application/vnd.sealed.xls":{"source":"iana"},"application/vnd.sealedmedia.softseal.html":{"source":"iana"},"application/vnd.sealedmedia.softseal.pdf":{"source":"iana"},"application/vnd.seemail":{"source":"iana","extensions":["see"]},"application/vnd.sema":{"source":"iana","extensions":["sema"]},"application/vnd.semd":{"source":"iana","extensions":["semd"]},"application/vnd.semf":{"source":"iana","extensions":["semf"]},"application/vnd.shana.informed.formdata":{"source":"iana","extensions":["ifm"]},"application/vnd.shana.informed.formtemplate":{"source":"iana","extensions":["itp"]},"application/vnd.shana.informed.interchange":{"source":"iana","extensions":["iif"]},"application/vnd.shana.informed.package":{"source":"iana","extensions":["ipk"]},"application/vnd.simtech-mindmapper":{"source":"iana","extensions":["twd","twds"]},"application/vnd.siren+json":{"source":"iana","compressible":true},"application/vnd.smaf":{"source":"iana","extensions":["mmf"]},"application/vnd.smart.notebook":{"source":"iana"},"application/vnd.smart.teacher":{"source":"iana","extensions":["teacher"]},"application/vnd.software602.filler.form+xml":{"source":"iana"},"application/vnd.software602.filler.form-xml-zip":{"source":"iana"},"application/vnd.solent.sdkm+xml":{"source":"iana","extensions":["sdkm","sdkd"]},"application/vnd.spotfire.dxp":{"source":"iana","extensions":["dxp"]},"application/vnd.spotfire.sfs":{"source":"iana","extensions":["sfs"]},"application/vnd.sss-cod":{"source":"iana"},"application/vnd.sss-dtf":{"source":"iana"},"application/vnd.sss-ntf":{"source":"iana"},"application/vnd.stardivision.calc":{"source":"apache","extensions":["sdc"]},"application/vnd.stardivision.draw":{"source":"apache","extensions":["sda"]},"application/vnd.stardivision.impress":{"source":"apache","extensions":["sdd"]},"application/vnd.stardivision.math":{"source":"apache","extensions":["smf"]},"application/vnd.stardivision.writer":{"source":"apache","extensions":["sdw","vor"]},"application/vnd.stardivision.writer-global":{"source":"apache","extensions":["sgl"]},"application/vnd.stepmania.package":{"source":"iana","extensions":["smzip"]},"application/vnd.stepmania.stepchart":{"source":"iana","extensions":["sm"]},"application/vnd.street-stream":{"source":"iana"},"application/vnd.sun.wadl+xml":{"source":"iana"},"application/vnd.sun.xml.calc":{"source":"apache","extensions":["sxc"]},"application/vnd.sun.xml.calc.template":{"source":"apache","extensions":["stc"]},"application/vnd.sun.xml.draw":{"source":"apache","extensions":["sxd"]},"application/vnd.sun.xml.draw.template":{"source":"apache","extensions":["std"]},"application/vnd.sun.xml.impress":{"source":"apache","extensions":["sxi"]},"application/vnd.sun.xml.impress.template":{"source":"apache","extensions":["sti"]},"application/vnd.sun.xml.math":{"source":"apache","extensions":["sxm"]},"application/vnd.sun.xml.writer":{"source":"apache","extensions":["sxw"]},"application/vnd.sun.xml.writer.global":{"source":"apache","extensions":["sxg"]},"application/vnd.sun.xml.writer.template":{"source":"apache","extensions":["stw"]},"application/vnd.sus-calendar":{"source":"iana","extensions":["sus","susp"]},"application/vnd.svd":{"source":"iana","extensions":["svd"]},"application/vnd.swiftview-ics":{"source":"iana"},"application/vnd.symbian.install":{"source":"apache","extensions":["sis","sisx"]},"application/vnd.syncml+xml":{"source":"iana","extensions":["xsm"]},"application/vnd.syncml.dm+wbxml":{"source":"iana","extensions":["bdm"]},"application/vnd.syncml.dm+xml":{"source":"iana","extensions":["xdm"]},"application/vnd.syncml.dm.notification":{"source":"iana"},"application/vnd.syncml.dmddf+wbxml":{"source":"iana"},"application/vnd.syncml.dmddf+xml":{"source":"iana"},"application/vnd.syncml.dmtnds+wbxml":{"source":"iana"},"application/vnd.syncml.dmtnds+xml":{"source":"iana"},"application/vnd.syncml.ds.notification":{"source":"iana"},"application/vnd.tao.intent-module-archive":{"source":"iana","extensions":["tao"]},"application/vnd.tcpdump.pcap":{"source":"iana","extensions":["pcap","cap","dmp"]},"application/vnd.tmd.mediaflex.api+xml":{"source":"iana"},"application/vnd.tml":{"source":"iana"},"application/vnd.tmobile-livetv":{"source":"iana","extensions":["tmo"]},"application/vnd.trid.tpt":{"source":"iana","extensions":["tpt"]},"application/vnd.triscape.mxs":{"source":"iana","extensions":["mxs"]},"application/vnd.trueapp":{"source":"iana","extensions":["tra"]},"application/vnd.truedoc":{"source":"iana"},"application/vnd.ubisoft.webplayer":{"source":"iana"},"application/vnd.ufdl":{"source":"iana","extensions":["ufd","ufdl"]},"application/vnd.uiq.theme":{"source":"iana","extensions":["utz"]},"application/vnd.umajin":{"source":"iana","extensions":["umj"]},"application/vnd.unity":{"source":"iana","extensions":["unityweb"]},"application/vnd.uoml+xml":{"source":"iana","extensions":["uoml"]},"application/vnd.uplanet.alert":{"source":"iana"},"application/vnd.uplanet.alert-wbxml":{"source":"iana"},"application/vnd.uplanet.bearer-choice":{"source":"iana"},"application/vnd.uplanet.bearer-choice-wbxml":{"source":"iana"},"application/vnd.uplanet.cacheop":{"source":"iana"},"application/vnd.uplanet.cacheop-wbxml":{"source":"iana"},"application/vnd.uplanet.channel":{"source":"iana"},"application/vnd.uplanet.channel-wbxml":{"source":"iana"},"application/vnd.uplanet.list":{"source":"iana"},"application/vnd.uplanet.list-wbxml":{"source":"iana"},"application/vnd.uplanet.listcmd":{"source":"iana"},"application/vnd.uplanet.listcmd-wbxml":{"source":"iana"},"application/vnd.uplanet.signal":{"source":"iana"},"application/vnd.uri-map":{"source":"iana"},"application/vnd.valve.source.material":{"source":"iana"},"application/vnd.vcx":{"source":"iana","extensions":["vcx"]},"application/vnd.vd-study":{"source":"iana"},"application/vnd.vectorworks":{"source":"iana"},"application/vnd.vel+json":{"source":"iana","compressible":true},"application/vnd.verimatrix.vcas":{"source":"iana"},"application/vnd.vidsoft.vidconference":{"source":"iana"},"application/vnd.visio":{"source":"iana","extensions":["vsd","vst","vss","vsw"]},"application/vnd.visionary":{"source":"iana","extensions":["vis"]},"application/vnd.vividence.scriptfile":{"source":"iana"},"application/vnd.vsf":{"source":"iana","extensions":["vsf"]},"application/vnd.wap.sic":{"source":"iana"},"application/vnd.wap.slc":{"source":"iana"},"application/vnd.wap.wbxml":{"source":"iana","extensions":["wbxml"]},"application/vnd.wap.wmlc":{"source":"iana","extensions":["wmlc"]},"application/vnd.wap.wmlscriptc":{"source":"iana","extensions":["wmlsc"]},"application/vnd.webturbo":{"source":"iana","extensions":["wtb"]},"application/vnd.wfa.p2p":{"source":"iana"},"application/vnd.wfa.wsc":{"source":"iana"},"application/vnd.windows.devicepairing":{"source":"iana"},"application/vnd.wmc":{"source":"iana"},"application/vnd.wmf.bootstrap":{"source":"iana"},"application/vnd.wolfram.mathematica":{"source":"iana"},"application/vnd.wolfram.mathematica.package":{"source":"iana"},"application/vnd.wolfram.player":{"source":"iana","extensions":["nbp"]},"application/vnd.wordperfect":{"source":"iana","extensions":["wpd"]},"application/vnd.wqd":{"source":"iana","extensions":["wqd"]},"application/vnd.wrq-hp3000-labelled":{"source":"iana"},"application/vnd.wt.stf":{"source":"iana","extensions":["stf"]},"application/vnd.wv.csp+wbxml":{"source":"iana"},"application/vnd.wv.csp+xml":{"source":"iana"},"application/vnd.wv.ssp+xml":{"source":"iana"},"application/vnd.xacml+json":{"source":"iana","compressible":true},"application/vnd.xara":{"source":"iana","extensions":["xar"]},"application/vnd.xfdl":{"source":"iana","extensions":["xfdl"]},"application/vnd.xfdl.webform":{"source":"iana"},"application/vnd.xmi+xml":{"source":"iana"},"application/vnd.xmpie.cpkg":{"source":"iana"},"application/vnd.xmpie.dpkg":{"source":"iana"},"application/vnd.xmpie.plan":{"source":"iana"},"application/vnd.xmpie.ppkg":{"source":"iana"},"application/vnd.xmpie.xlim":{"source":"iana"},"application/vnd.yamaha.hv-dic":{"source":"iana","extensions":["hvd"]},"application/vnd.yamaha.hv-script":{"source":"iana","extensions":["hvs"]},"application/vnd.yamaha.hv-voice":{"source":"iana","extensions":["hvp"]},"application/vnd.yamaha.openscoreformat":{"source":"iana","extensions":["osf"]},"application/vnd.yamaha.openscoreformat.osfpvg+xml":{"source":"iana","extensions":["osfpvg"]},"application/vnd.yamaha.remote-setup":{"source":"iana"},"application/vnd.yamaha.smaf-audio":{"source":"iana","extensions":["saf"]},"application/vnd.yamaha.smaf-phrase":{"source":"iana","extensions":["spf"]},"application/vnd.yamaha.through-ngn":{"source":"iana"},"application/vnd.yamaha.tunnel-udpencap":{"source":"iana"},"application/vnd.yaoweme":{"source":"iana"},"application/vnd.yellowriver-custom-menu":{"source":"iana","extensions":["cmp"]},"application/vnd.zul":{"source":"iana","extensions":["zir","zirz"]},"application/vnd.zzazz.deck+xml":{"source":"iana","extensions":["zaz"]},"application/voicexml+xml":{"source":"iana","extensions":["vxml"]},"application/vq-rtcpxr":{"source":"iana"},"application/watcherinfo+xml":{"source":"iana"},"application/whoispp-query":{"source":"iana"},"application/whoispp-response":{"source":"iana"},"application/widget":{"source":"iana","extensions":["wgt"]},"application/winhlp":{"source":"apache","extensions":["hlp"]},"application/wita":{"source":"iana"},"application/wordperfect5.1":{"source":"iana"},"application/wsdl+xml":{"source":"iana","extensions":["wsdl"]},"application/wspolicy+xml":{"source":"iana","extensions":["wspolicy"]},"application/x-7z-compressed":{"source":"apache","compressible":false,"extensions":["7z"]},"application/x-abiword":{"source":"apache","extensions":["abw"]},"application/x-ace-compressed":{"source":"apache","extensions":["ace"]},"application/x-amf":{"source":"apache"},"application/x-apple-diskimage":{"source":"apache","extensions":["dmg"]},"application/x-authorware-bin":{"source":"apache","extensions":["aab","x32","u32","vox"]},"application/x-authorware-map":{"source":"apache","extensions":["aam"]},"application/x-authorware-seg":{"source":"apache","extensions":["aas"]},"application/x-bcpio":{"source":"apache","extensions":["bcpio"]},"application/x-bdoc":{"compressible":false,"extensions":["bdoc"]},"application/x-bittorrent":{"source":"apache","extensions":["torrent"]},"application/x-blorb":{"source":"apache","extensions":["blb","blorb"]},"application/x-bzip":{"source":"apache","compressible":false,"extensions":["bz"]},"application/x-bzip2":{"source":"apache","compressible":false,"extensions":["bz2","boz"]},"application/x-cbr":{"source":"apache","extensions":["cbr","cba","cbt","cbz","cb7"]},"application/x-cdlink":{"source":"apache","extensions":["vcd"]},"application/x-cfs-compressed":{"source":"apache","extensions":["cfs"]},"application/x-chat":{"source":"apache","extensions":["chat"]},"application/x-chess-pgn":{"source":"apache","extensions":["pgn"]},"application/x-chrome-extension":{"extensions":["crx"]},"application/x-cocoa":{"source":"nginx","extensions":["cco"]},"application/x-compress":{"source":"apache"},"application/x-conference":{"source":"apache","extensions":["nsc"]},"application/x-cpio":{"source":"apache","extensions":["cpio"]},"application/x-csh":{"source":"apache","extensions":["csh"]},"application/x-deb":{"compressible":false},"application/x-debian-package":{"source":"apache","extensions":["deb","udeb"]},"application/x-dgc-compressed":{"source":"apache","extensions":["dgc"]},"application/x-director":{"source":"apache","extensions":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]},"application/x-doom":{"source":"apache","extensions":["wad"]},"application/x-dtbncx+xml":{"source":"apache","extensions":["ncx"]},"application/x-dtbook+xml":{"source":"apache","extensions":["dtb"]},"application/x-dtbresource+xml":{"source":"apache","extensions":["res"]},"application/x-dvi":{"source":"apache","compressible":false,"extensions":["dvi"]},"application/x-envoy":{"source":"apache","extensions":["evy"]},"application/x-eva":{"source":"apache","extensions":["eva"]},"application/x-font-bdf":{"source":"apache","extensions":["bdf"]},"application/x-font-dos":{"source":"apache"},"application/x-font-framemaker":{"source":"apache"},"application/x-font-ghostscript":{"source":"apache","extensions":["gsf"]},"application/x-font-libgrx":{"source":"apache"},"application/x-font-linux-psf":{"source":"apache","extensions":["psf"]},"application/x-font-otf":{"source":"apache","compressible":true,"extensions":["otf"]},"application/x-font-pcf":{"source":"apache","extensions":["pcf"]},"application/x-font-snf":{"source":"apache","extensions":["snf"]},"application/x-font-speedo":{"source":"apache"},"application/x-font-sunos-news":{"source":"apache"},"application/x-font-ttf":{"source":"apache","compressible":true,"extensions":["ttf","ttc"]},"application/x-font-type1":{"source":"apache","extensions":["pfa","pfb","pfm","afm"]},"application/x-font-vfont":{"source":"apache"},"application/x-freearc":{"source":"apache","extensions":["arc"]},"application/x-futuresplash":{"source":"apache","extensions":["spl"]},"application/x-gca-compressed":{"source":"apache","extensions":["gca"]},"application/x-glulx":{"source":"apache","extensions":["ulx"]},"application/x-gnumeric":{"source":"apache","extensions":["gnumeric"]},"application/x-gramps-xml":{"source":"apache","extensions":["gramps"]},"application/x-gtar":{"source":"apache","extensions":["gtar"]},"application/x-gzip":{"source":"apache"},"application/x-hdf":{"source":"apache","extensions":["hdf"]},"application/x-httpd-php":{"compressible":true,"extensions":["php"]},"application/x-install-instructions":{"source":"apache","extensions":["install"]},"application/x-iso9660-image":{"source":"apache","extensions":["iso"]},"application/x-java-archive-diff":{"source":"nginx","extensions":["jardiff"]},"application/x-java-jnlp-file":{"source":"apache","compressible":false,"extensions":["jnlp"]},"application/x-javascript":{"compressible":true},"application/x-latex":{"source":"apache","compressible":false,"extensions":["latex"]},"application/x-lua-bytecode":{"extensions":["luac"]},"application/x-lzh-compressed":{"source":"apache","extensions":["lzh","lha"]},"application/x-makeself":{"source":"nginx","extensions":["run"]},"application/x-mie":{"source":"apache","extensions":["mie"]},"application/x-mobipocket-ebook":{"source":"apache","extensions":["prc","mobi"]},"application/x-mpegurl":{"compressible":false},"application/x-ms-application":{"source":"apache","extensions":["application"]},"application/x-ms-shortcut":{"source":"apache","extensions":["lnk"]},"application/x-ms-wmd":{"source":"apache","extensions":["wmd"]},"application/x-ms-wmz":{"source":"apache","extensions":["wmz"]},"application/x-ms-xbap":{"source":"apache","extensions":["xbap"]},"application/x-msaccess":{"source":"apache","extensions":["mdb"]},"application/x-msbinder":{"source":"apache","extensions":["obd"]},"application/x-mscardfile":{"source":"apache","extensions":["crd"]},"application/x-msclip":{"source":"apache","extensions":["clp"]},"application/x-msdos-program":{"extensions":["exe"]},"application/x-msdownload":{"source":"apache","extensions":["exe","dll","com","bat","msi"]},"application/x-msmediaview":{"source":"apache","extensions":["mvb","m13","m14"]},"application/x-msmetafile":{"source":"apache","extensions":["wmf","wmz","emf","emz"]},"application/x-msmoney":{"source":"apache","extensions":["mny"]},"application/x-mspublisher":{"source":"apache","extensions":["pub"]},"application/x-msschedule":{"source":"apache","extensions":["scd"]},"application/x-msterminal":{"source":"apache","extensions":["trm"]},"application/x-mswrite":{"source":"apache","extensions":["wri"]},"application/x-netcdf":{"source":"apache","extensions":["nc","cdf"]},"application/x-ns-proxy-autoconfig":{"compressible":true,"extensions":["pac"]},"application/x-nzb":{"source":"apache","extensions":["nzb"]},"application/x-perl":{"source":"nginx","extensions":["pl","pm"]},"application/x-pilot":{"source":"nginx","extensions":["prc","pdb"]},"application/x-pkcs12":{"source":"apache","compressible":false,"extensions":["p12","pfx"]},"application/x-pkcs7-certificates":{"source":"apache","extensions":["p7b","spc"]},"application/x-pkcs7-certreqresp":{"source":"apache","extensions":["p7r"]},"application/x-rar-compressed":{"source":"apache","compressible":false,"extensions":["rar"]},"application/x-redhat-package-manager":{"source":"nginx","extensions":["rpm"]},"application/x-research-info-systems":{"source":"apache","extensions":["ris"]},"application/x-sea":{"source":"nginx","extensions":["sea"]},"application/x-sh":{"source":"apache","compressible":true,"extensions":["sh"]},"application/x-shar":{"source":"apache","extensions":["shar"]},"application/x-shockwave-flash":{"source":"apache","compressible":false,"extensions":["swf"]},"application/x-silverlight-app":{"source":"apache","extensions":["xap"]},"application/x-sql":{"source":"apache","extensions":["sql"]},"application/x-stuffit":{"source":"apache","compressible":false,"extensions":["sit"]},"application/x-stuffitx":{"source":"apache","extensions":["sitx"]},"application/x-subrip":{"source":"apache","extensions":["srt"]},"application/x-sv4cpio":{"source":"apache","extensions":["sv4cpio"]},"application/x-sv4crc":{"source":"apache","extensions":["sv4crc"]},"application/x-t3vm-image":{"source":"apache","extensions":["t3"]},"application/x-tads":{"source":"apache","extensions":["gam"]},"application/x-tar":{"source":"apache","compressible":true,"extensions":["tar"]},"application/x-tcl":{"source":"apache","extensions":["tcl","tk"]},"application/x-tex":{"source":"apache","extensions":["tex"]},"application/x-tex-tfm":{"source":"apache","extensions":["tfm"]},"application/x-texinfo":{"source":"apache","extensions":["texinfo","texi"]},"application/x-tgif":{"source":"apache","extensions":["obj"]},"application/x-ustar":{"source":"apache","extensions":["ustar"]},"application/x-wais-source":{"source":"apache","extensions":["src"]},"application/x-web-app-manifest+json":{"compressible":true,"extensions":["webapp"]},"application/x-www-form-urlencoded":{"source":"iana","compressible":true},"application/x-x509-ca-cert":{"source":"apache","extensions":["der","crt","pem"]},"application/x-xfig":{"source":"apache","extensions":["fig"]},"application/x-xliff+xml":{"source":"apache","extensions":["xlf"]},"application/x-xpinstall":{"source":"apache","compressible":false,"extensions":["xpi"]},"application/x-xz":{"source":"apache","extensions":["xz"]},"application/x-zmachine":{"source":"apache","extensions":["z1","z2","z3","z4","z5","z6","z7","z8"]},"application/x400-bp":{"source":"iana"},"application/xacml+xml":{"source":"iana"},"application/xaml+xml":{"source":"apache","extensions":["xaml"]},"application/xcap-att+xml":{"source":"iana"},"application/xcap-caps+xml":{"source":"iana"},"application/xcap-diff+xml":{"source":"iana","extensions":["xdf"]},"application/xcap-el+xml":{"source":"iana"},"application/xcap-error+xml":{"source":"iana"},"application/xcap-ns+xml":{"source":"iana"},"application/xcon-conference-info+xml":{"source":"iana"},"application/xcon-conference-info-diff+xml":{"source":"iana"},"application/xenc+xml":{"source":"iana","extensions":["xenc"]},"application/xhtml+xml":{"source":"iana","compressible":true,"extensions":["xhtml","xht"]},"application/xhtml-voice+xml":{"source":"apache"},"application/xml":{"source":"iana","compressible":true,"extensions":["xml","xsl","xsd","rng"]},"application/xml-dtd":{"source":"iana","compressible":true,"extensions":["dtd"]},"application/xml-external-parsed-entity":{"source":"iana"},"application/xml-patch+xml":{"source":"iana"},"application/xmpp+xml":{"source":"iana"},"application/xop+xml":{"source":"iana","compressible":true,"extensions":["xop"]},"application/xproc+xml":{"source":"apache","extensions":["xpl"]},"application/xslt+xml":{"source":"iana","extensions":["xslt"]},"application/xspf+xml":{"source":"apache","extensions":["xspf"]},"application/xv+xml":{"source":"iana","extensions":["mxml","xhvml","xvml","xvm"]},"application/yang":{"source":"iana","extensions":["yang"]},"application/yin+xml":{"source":"iana","extensions":["yin"]},"application/zip":{"source":"iana","compressible":false,"extensions":["zip"]},"application/zlib":{"source":"iana"},"audio/1d-interleaved-parityfec":{"source":"iana"},"audio/32kadpcm":{"source":"iana"},"audio/3gpp":{"source":"iana","compressible":false,"extensions":["3gpp"]},"audio/3gpp2":{"source":"iana"},"audio/ac3":{"source":"iana"},"audio/adpcm":{"source":"apache","extensions":["adp"]},"audio/amr":{"source":"iana"},"audio/amr-wb":{"source":"iana"},"audio/amr-wb+":{"source":"iana"},"audio/aptx":{"source":"iana"},"audio/asc":{"source":"iana"},"audio/atrac-advanced-lossless":{"source":"iana"},"audio/atrac-x":{"source":"iana"},"audio/atrac3":{"source":"iana"},"audio/basic":{"source":"iana","compressible":false,"extensions":["au","snd"]},"audio/bv16":{"source":"iana"},"audio/bv32":{"source":"iana"},"audio/clearmode":{"source":"iana"},"audio/cn":{"source":"iana"},"audio/dat12":{"source":"iana"},"audio/dls":{"source":"iana"},"audio/dsr-es201108":{"source":"iana"},"audio/dsr-es202050":{"source":"iana"},"audio/dsr-es202211":{"source":"iana"},"audio/dsr-es202212":{"source":"iana"},"audio/dv":{"source":"iana"},"audio/dvi4":{"source":"iana"},"audio/eac3":{"source":"iana"},"audio/encaprtp":{"source":"iana"},"audio/evrc":{"source":"iana"},"audio/evrc-qcp":{"source":"iana"},"audio/evrc0":{"source":"iana"},"audio/evrc1":{"source":"iana"},"audio/evrcb":{"source":"iana"},"audio/evrcb0":{"source":"iana"},"audio/evrcb1":{"source":"iana"},"audio/evrcnw":{"source":"iana"},"audio/evrcnw0":{"source":"iana"},"audio/evrcnw1":{"source":"iana"},"audio/evrcwb":{"source":"iana"},"audio/evrcwb0":{"source":"iana"},"audio/evrcwb1":{"source":"iana"},"audio/evs":{"source":"iana"},"audio/fwdred":{"source":"iana"},"audio/g711-0":{"source":"iana"},"audio/g719":{"source":"iana"},"audio/g722":{"source":"iana"},"audio/g7221":{"source":"iana"},"audio/g723":{"source":"iana"},"audio/g726-16":{"source":"iana"},"audio/g726-24":{"source":"iana"},"audio/g726-32":{"source":"iana"},"audio/g726-40":{"source":"iana"},"audio/g728":{"source":"iana"},"audio/g729":{"source":"iana"},"audio/g7291":{"source":"iana"},"audio/g729d":{"source":"iana"},"audio/g729e":{"source":"iana"},"audio/gsm":{"source":"iana"},"audio/gsm-efr":{"source":"iana"},"audio/gsm-hr-08":{"source":"iana"},"audio/ilbc":{"source":"iana"},"audio/ip-mr_v2.5":{"source":"iana"},"audio/isac":{"source":"apache"},"audio/l16":{"source":"iana"},"audio/l20":{"source":"iana"},"audio/l24":{"source":"iana","compressible":false},"audio/l8":{"source":"iana"},"audio/lpc":{"source":"iana"},"audio/midi":{"source":"apache","extensions":["mid","midi","kar","rmi"]},"audio/mobile-xmf":{"source":"iana"},"audio/mp4":{"source":"iana","compressible":false,"extensions":["m4a","mp4a"]},"audio/mp4a-latm":{"source":"iana"},"audio/mpa":{"source":"iana"},"audio/mpa-robust":{"source":"iana"},"audio/mpeg":{"source":"iana","compressible":false,"extensions":["mpga","mp2","mp2a","mp3","m2a","m3a"]},"audio/mpeg4-generic":{"source":"iana"},"audio/musepack":{"source":"apache"},"audio/ogg":{"source":"iana","compressible":false,"extensions":["oga","ogg","spx"]},"audio/opus":{"source":"iana"},"audio/parityfec":{"source":"iana"},"audio/pcma":{"source":"iana"},"audio/pcma-wb":{"source":"iana"},"audio/pcmu":{"source":"iana"},"audio/pcmu-wb":{"source":"iana"},"audio/prs.sid":{"source":"iana"},"audio/qcelp":{"source":"iana"},"audio/raptorfec":{"source":"iana"},"audio/red":{"source":"iana"},"audio/rtp-enc-aescm128":{"source":"iana"},"audio/rtp-midi":{"source":"iana"},"audio/rtploopback":{"source":"iana"},"audio/rtx":{"source":"iana"},"audio/s3m":{"source":"apache","extensions":["s3m"]},"audio/silk":{"source":"apache","extensions":["sil"]},"audio/smv":{"source":"iana"},"audio/smv-qcp":{"source":"iana"},"audio/smv0":{"source":"iana"},"audio/sp-midi":{"source":"iana"},"audio/speex":{"source":"iana"},"audio/t140c":{"source":"iana"},"audio/t38":{"source":"iana"},"audio/telephone-event":{"source":"iana"},"audio/tone":{"source":"iana"},"audio/uemclip":{"source":"iana"},"audio/ulpfec":{"source":"iana"},"audio/vdvi":{"source":"iana"},"audio/vmr-wb":{"source":"iana"},"audio/vnd.3gpp.iufp":{"source":"iana"},"audio/vnd.4sb":{"source":"iana"},"audio/vnd.audiokoz":{"source":"iana"},"audio/vnd.celp":{"source":"iana"},"audio/vnd.cisco.nse":{"source":"iana"},"audio/vnd.cmles.radio-events":{"source":"iana"},"audio/vnd.cns.anp1":{"source":"iana"},"audio/vnd.cns.inf1":{"source":"iana"},"audio/vnd.dece.audio":{"source":"iana","extensions":["uva","uvva"]},"audio/vnd.digital-winds":{"source":"iana","extensions":["eol"]},"audio/vnd.dlna.adts":{"source":"iana"},"audio/vnd.dolby.heaac.1":{"source":"iana"},"audio/vnd.dolby.heaac.2":{"source":"iana"},"audio/vnd.dolby.mlp":{"source":"iana"},"audio/vnd.dolby.mps":{"source":"iana"},"audio/vnd.dolby.pl2":{"source":"iana"},"audio/vnd.dolby.pl2x":{"source":"iana"},"audio/vnd.dolby.pl2z":{"source":"iana"},"audio/vnd.dolby.pulse.1":{"source":"iana"},"audio/vnd.dra":{"source":"iana","extensions":["dra"]},"audio/vnd.dts":{"source":"iana","extensions":["dts"]},"audio/vnd.dts.hd":{"source":"iana","extensions":["dtshd"]},"audio/vnd.dvb.file":{"source":"iana"},"audio/vnd.everad.plj":{"source":"iana"},"audio/vnd.hns.audio":{"source":"iana"},"audio/vnd.lucent.voice":{"source":"iana","extensions":["lvp"]},"audio/vnd.ms-playready.media.pya":{"source":"iana","extensions":["pya"]},"audio/vnd.nokia.mobile-xmf":{"source":"iana"},"audio/vnd.nortel.vbk":{"source":"iana"},"audio/vnd.nuera.ecelp4800":{"source":"iana","extensions":["ecelp4800"]},"audio/vnd.nuera.ecelp7470":{"source":"iana","extensions":["ecelp7470"]},"audio/vnd.nuera.ecelp9600":{"source":"iana","extensions":["ecelp9600"]},"audio/vnd.octel.sbc":{"source":"iana"},"audio/vnd.qcelp":{"source":"iana"},"audio/vnd.rhetorex.32kadpcm":{"source":"iana"},"audio/vnd.rip":{"source":"iana","extensions":["rip"]},"audio/vnd.rn-realaudio":{"compressible":false},"audio/vnd.sealedmedia.softseal.mpeg":{"source":"iana"},"audio/vnd.vmx.cvsd":{"source":"iana"},"audio/vnd.wave":{"compressible":false},"audio/vorbis":{"source":"iana","compressible":false},"audio/vorbis-config":{"source":"iana"},"audio/wav":{"compressible":false,"extensions":["wav"]},"audio/wave":{"compressible":false,"extensions":["wav"]},"audio/webm":{"source":"apache","compressible":false,"extensions":["weba"]},"audio/x-aac":{"source":"apache","compressible":false,"extensions":["aac"]},"audio/x-aiff":{"source":"apache","extensions":["aif","aiff","aifc"]},"audio/x-caf":{"source":"apache","compressible":false,"extensions":["caf"]},"audio/x-flac":{"source":"apache","extensions":["flac"]},"audio/x-m4a":{"source":"nginx","extensions":["m4a"]},"audio/x-matroska":{"source":"apache","extensions":["mka"]},"audio/x-mpegurl":{"source":"apache","extensions":["m3u"]},"audio/x-ms-wax":{"source":"apache","extensions":["wax"]},"audio/x-ms-wma":{"source":"apache","extensions":["wma"]},"audio/x-pn-realaudio":{"source":"apache","extensions":["ram","ra"]},"audio/x-pn-realaudio-plugin":{"source":"apache","extensions":["rmp"]},"audio/x-realaudio":{"source":"nginx","extensions":["ra"]},"audio/x-tta":{"source":"apache"},"audio/x-wav":{"source":"apache","extensions":["wav"]},"audio/xm":{"source":"apache","extensions":["xm"]},"chemical/x-cdx":{"source":"apache","extensions":["cdx"]},"chemical/x-cif":{"source":"apache","extensions":["cif"]},"chemical/x-cmdf":{"source":"apache","extensions":["cmdf"]},"chemical/x-cml":{"source":"apache","extensions":["cml"]},"chemical/x-csml":{"source":"apache","extensions":["csml"]},"chemical/x-pdb":{"source":"apache"},"chemical/x-xyz":{"source":"apache","extensions":["xyz"]},"font/opentype":{"compressible":true,"extensions":["otf"]},"image/bmp":{"source":"apache","compressible":true,"extensions":["bmp"]},"image/cgm":{"source":"iana","extensions":["cgm"]},"image/fits":{"source":"iana"},"image/g3fax":{"source":"iana","extensions":["g3"]},"image/gif":{"source":"iana","compressible":false,"extensions":["gif"]},"image/ief":{"source":"iana","extensions":["ief"]},"image/jp2":{"source":"iana"},"image/jpeg":{"source":"iana","compressible":false,"extensions":["jpeg","jpg","jpe"]},"image/jpm":{"source":"iana"},"image/jpx":{"source":"iana"},"image/ktx":{"source":"iana","extensions":["ktx"]},"image/naplps":{"source":"iana"},"image/pjpeg":{"compressible":false},"image/png":{"source":"iana","compressible":false,"extensions":["png"]},"image/prs.btif":{"source":"iana","extensions":["btif"]},"image/prs.pti":{"source":"iana"},"image/pwg-raster":{"source":"iana"},"image/sgi":{"source":"apache","extensions":["sgi"]},"image/svg+xml":{"source":"iana","compressible":true,"extensions":["svg","svgz"]},"image/t38":{"source":"iana"},"image/tiff":{"source":"iana","compressible":false,"extensions":["tiff","tif"]},"image/tiff-fx":{"source":"iana"},"image/vnd.adobe.photoshop":{"source":"iana","compressible":true,"extensions":["psd"]},"image/vnd.airzip.accelerator.azv":{"source":"iana"},"image/vnd.cns.inf2":{"source":"iana"},"image/vnd.dece.graphic":{"source":"iana","extensions":["uvi","uvvi","uvg","uvvg"]},"image/vnd.djvu":{"source":"iana","extensions":["djvu","djv"]},"image/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"image/vnd.dwg":{"source":"iana","extensions":["dwg"]},"image/vnd.dxf":{"source":"iana","extensions":["dxf"]},"image/vnd.fastbidsheet":{"source":"iana","extensions":["fbs"]},"image/vnd.fpx":{"source":"iana","extensions":["fpx"]},"image/vnd.fst":{"source":"iana","extensions":["fst"]},"image/vnd.fujixerox.edmics-mmr":{"source":"iana","extensions":["mmr"]},"image/vnd.fujixerox.edmics-rlc":{"source":"iana","extensions":["rlc"]},"image/vnd.globalgraphics.pgb":{"source":"iana"},"image/vnd.microsoft.icon":{"source":"iana"},"image/vnd.mix":{"source":"iana"},"image/vnd.mozilla.apng":{"source":"iana"},"image/vnd.ms-modi":{"source":"iana","extensions":["mdi"]},"image/vnd.ms-photo":{"source":"apache","extensions":["wdp"]},"image/vnd.net-fpx":{"source":"iana","extensions":["npx"]},"image/vnd.radiance":{"source":"iana"},"image/vnd.sealed.png":{"source":"iana"},"image/vnd.sealedmedia.softseal.gif":{"source":"iana"},"image/vnd.sealedmedia.softseal.jpg":{"source":"iana"},"image/vnd.svf":{"source":"iana"},"image/vnd.tencent.tap":{"source":"iana"},"image/vnd.valve.source.texture":{"source":"iana"},"image/vnd.wap.wbmp":{"source":"iana","extensions":["wbmp"]},"image/vnd.xiff":{"source":"iana","extensions":["xif"]},"image/vnd.zbrush.pcx":{"source":"iana"},"image/webp":{"source":"apache","extensions":["webp"]},"image/x-3ds":{"source":"apache","extensions":["3ds"]},"image/x-cmu-raster":{"source":"apache","extensions":["ras"]},"image/x-cmx":{"source":"apache","extensions":["cmx"]},"image/x-freehand":{"source":"apache","extensions":["fh","fhc","fh4","fh5","fh7"]},"image/x-icon":{"source":"apache","compressible":true,"extensions":["ico"]},"image/x-jng":{"source":"nginx","extensions":["jng"]},"image/x-mrsid-image":{"source":"apache","extensions":["sid"]},"image/x-ms-bmp":{"source":"nginx","compressible":true,"extensions":["bmp"]},"image/x-pcx":{"source":"apache","extensions":["pcx"]},"image/x-pict":{"source":"apache","extensions":["pic","pct"]},"image/x-portable-anymap":{"source":"apache","extensions":["pnm"]},"image/x-portable-bitmap":{"source":"apache","extensions":["pbm"]},"image/x-portable-graymap":{"source":"apache","extensions":["pgm"]},"image/x-portable-pixmap":{"source":"apache","extensions":["ppm"]},"image/x-rgb":{"source":"apache","extensions":["rgb"]},"image/x-tga":{"source":"apache","extensions":["tga"]},"image/x-xbitmap":{"source":"apache","extensions":["xbm"]},"image/x-xcf":{"compressible":false},"image/x-xpixmap":{"source":"apache","extensions":["xpm"]},"image/x-xwindowdump":{"source":"apache","extensions":["xwd"]},"message/cpim":{"source":"iana"},"message/delivery-status":{"source":"iana"},"message/disposition-notification":{"source":"iana"},"message/external-body":{"source":"iana"},"message/feedback-report":{"source":"iana"},"message/global":{"source":"iana"},"message/global-delivery-status":{"source":"iana"},"message/global-disposition-notification":{"source":"iana"},"message/global-headers":{"source":"iana"},"message/http":{"source":"iana","compressible":false},"message/imdn+xml":{"source":"iana","compressible":true},"message/news":{"source":"iana"},"message/partial":{"source":"iana","compressible":false},"message/rfc822":{"source":"iana","compressible":true,"extensions":["eml","mime"]},"message/s-http":{"source":"iana"},"message/sip":{"source":"iana"},"message/sipfrag":{"source":"iana"},"message/tracking-status":{"source":"iana"},"message/vnd.si.simp":{"source":"iana"},"message/vnd.wfa.wsc":{"source":"iana"},"model/iges":{"source":"iana","compressible":false,"extensions":["igs","iges"]},"model/mesh":{"source":"iana","compressible":false,"extensions":["msh","mesh","silo"]},"model/vnd.collada+xml":{"source":"iana","extensions":["dae"]},"model/vnd.dwf":{"source":"iana","extensions":["dwf"]},"model/vnd.flatland.3dml":{"source":"iana"},"model/vnd.gdl":{"source":"iana","extensions":["gdl"]},"model/vnd.gs-gdl":{"source":"apache"},"model/vnd.gs.gdl":{"source":"iana"},"model/vnd.gtw":{"source":"iana","extensions":["gtw"]},"model/vnd.moml+xml":{"source":"iana"},"model/vnd.mts":{"source":"iana","extensions":["mts"]},"model/vnd.opengex":{"source":"iana"},"model/vnd.parasolid.transmit.binary":{"source":"iana"},"model/vnd.parasolid.transmit.text":{"source":"iana"},"model/vnd.rosette.annotated-data-model":{"source":"iana"},"model/vnd.valve.source.compiled-map":{"source":"iana"},"model/vnd.vtu":{"source":"iana","extensions":["vtu"]},"model/vrml":{"source":"iana","compressible":false,"extensions":["wrl","vrml"]},"model/x3d+binary":{"source":"apache","compressible":false,"extensions":["x3db","x3dbz"]},"model/x3d+fastinfoset":{"source":"iana"},"model/x3d+vrml":{"source":"apache","compressible":false,"extensions":["x3dv","x3dvz"]},"model/x3d+xml":{"source":"iana","compressible":true,"extensions":["x3d","x3dz"]},"model/x3d-vrml":{"source":"iana"},"multipart/alternative":{"source":"iana","compressible":false},"multipart/appledouble":{"source":"iana"},"multipart/byteranges":{"source":"iana"},"multipart/digest":{"source":"iana"},"multipart/encrypted":{"source":"iana","compressible":false},"multipart/form-data":{"source":"iana","compressible":false},"multipart/header-set":{"source":"iana"},"multipart/mixed":{"source":"iana","compressible":false},"multipart/parallel":{"source":"iana"},"multipart/related":{"source":"iana","compressible":false},"multipart/report":{"source":"iana"},"multipart/signed":{"source":"iana","compressible":false},"multipart/voice-message":{"source":"iana"},"multipart/x-mixed-replace":{"source":"iana"},"text/1d-interleaved-parityfec":{"source":"iana"},"text/cache-manifest":{"source":"iana","compressible":true,"extensions":["appcache","manifest"]},"text/calendar":{"source":"iana","extensions":["ics","ifb"]},"text/calender":{"compressible":true},"text/cmd":{"compressible":true},"text/coffeescript":{"extensions":["coffee","litcoffee"]},"text/css":{"source":"iana","compressible":true,"extensions":["css"]},"text/csv":{"source":"iana","compressible":true,"extensions":["csv"]},"text/csv-schema":{"source":"iana"},"text/directory":{"source":"iana"},"text/dns":{"source":"iana"},"text/ecmascript":{"source":"iana"},"text/encaprtp":{"source":"iana"},"text/enriched":{"source":"iana"},"text/fwdred":{"source":"iana"},"text/grammar-ref-list":{"source":"iana"},"text/hjson":{"extensions":["hjson"]},"text/html":{"source":"iana","compressible":true,"extensions":["html","htm","shtml"]},"text/jade":{"extensions":["jade"]},"text/javascript":{"source":"iana","compressible":true},"text/jcr-cnd":{"source":"iana"},"text/jsx":{"compressible":true,"extensions":["jsx"]},"text/less":{"extensions":["less"]},"text/markdown":{"source":"iana"},"text/mathml":{"source":"nginx","extensions":["mml"]},"text/mizar":{"source":"iana"},"text/n3":{"source":"iana","compressible":true,"extensions":["n3"]},"text/parameters":{"source":"iana"},"text/parityfec":{"source":"iana"},"text/plain":{"source":"iana","compressible":true,"extensions":["txt","text","conf","def","list","log","in","ini"]},"text/provenance-notation":{"source":"iana"},"text/prs.fallenstein.rst":{"source":"iana"},"text/prs.lines.tag":{"source":"iana","extensions":["dsc"]},"text/prs.prop.logic":{"source":"iana"},"text/raptorfec":{"source":"iana"},"text/red":{"source":"iana"},"text/rfc822-headers":{"source":"iana"},"text/richtext":{"source":"iana","compressible":true,"extensions":["rtx"]},"text/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"text/rtp-enc-aescm128":{"source":"iana"},"text/rtploopback":{"source":"iana"},"text/rtx":{"source":"iana"},"text/sgml":{"source":"iana","extensions":["sgml","sgm"]},"text/slim":{"extensions":["slim","slm"]},"text/stylus":{"extensions":["stylus","styl"]},"text/t140":{"source":"iana"},"text/tab-separated-values":{"source":"iana","compressible":true,"extensions":["tsv"]},"text/troff":{"source":"iana","extensions":["t","tr","roff","man","me","ms"]},"text/turtle":{"source":"iana","extensions":["ttl"]},"text/ulpfec":{"source":"iana"},"text/uri-list":{"source":"iana","compressible":true,"extensions":["uri","uris","urls"]},"text/vcard":{"source":"iana","compressible":true,"extensions":["vcard"]},"text/vnd.a":{"source":"iana"},"text/vnd.abc":{"source":"iana"},"text/vnd.curl":{"source":"iana","extensions":["curl"]},"text/vnd.curl.dcurl":{"source":"apache","extensions":["dcurl"]},"text/vnd.curl.mcurl":{"source":"apache","extensions":["mcurl"]},"text/vnd.curl.scurl":{"source":"apache","extensions":["scurl"]},"text/vnd.debian.copyright":{"source":"iana"},"text/vnd.dmclientscript":{"source":"iana"},"text/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"text/vnd.esmertec.theme-descriptor":{"source":"iana"},"text/vnd.fly":{"source":"iana","extensions":["fly"]},"text/vnd.fmi.flexstor":{"source":"iana","extensions":["flx"]},"text/vnd.graphviz":{"source":"iana","extensions":["gv"]},"text/vnd.in3d.3dml":{"source":"iana","extensions":["3dml"]},"text/vnd.in3d.spot":{"source":"iana","extensions":["spot"]},"text/vnd.iptc.newsml":{"source":"iana"},"text/vnd.iptc.nitf":{"source":"iana"},"text/vnd.latex-z":{"source":"iana"},"text/vnd.motorola.reflex":{"source":"iana"},"text/vnd.ms-mediapackage":{"source":"iana"},"text/vnd.net2phone.commcenter.command":{"source":"iana"},"text/vnd.radisys.msml-basic-layout":{"source":"iana"},"text/vnd.si.uricatalogue":{"source":"iana"},"text/vnd.sun.j2me.app-descriptor":{"source":"iana","extensions":["jad"]},"text/vnd.trolltech.linguist":{"source":"iana"},"text/vnd.wap.si":{"source":"iana"},"text/vnd.wap.sl":{"source":"iana"},"text/vnd.wap.wml":{"source":"iana","extensions":["wml"]},"text/vnd.wap.wmlscript":{"source":"iana","extensions":["wmls"]},"text/vtt":{"charset":"UTF-8","compressible":true,"extensions":["vtt"]},"text/x-asm":{"source":"apache","extensions":["s","asm"]},"text/x-c":{"source":"apache","extensions":["c","cc","cxx","cpp","h","hh","dic"]},"text/x-component":{"source":"nginx","extensions":["htc"]},"text/x-fortran":{"source":"apache","extensions":["f","for","f77","f90"]},"text/x-gwt-rpc":{"compressible":true},"text/x-handlebars-template":{"extensions":["hbs"]},"text/x-java-source":{"source":"apache","extensions":["java"]},"text/x-jquery-tmpl":{"compressible":true},"text/x-lua":{"extensions":["lua"]},"text/x-markdown":{"compressible":true,"extensions":["markdown","md","mkd"]},"text/x-nfo":{"source":"apache","extensions":["nfo"]},"text/x-opml":{"source":"apache","extensions":["opml"]},"text/x-pascal":{"source":"apache","extensions":["p","pas"]},"text/x-processing":{"compressible":true,"extensions":["pde"]},"text/x-sass":{"extensions":["sass"]},"text/x-scss":{"extensions":["scss"]},"text/x-setext":{"source":"apache","extensions":["etx"]},"text/x-sfv":{"source":"apache","extensions":["sfv"]},"text/x-suse-ymp":{"compressible":true,"extensions":["ymp"]},"text/x-uuencode":{"source":"apache","extensions":["uu"]},"text/x-vcalendar":{"source":"apache","extensions":["vcs"]},"text/x-vcard":{"source":"apache","extensions":["vcf"]},"text/xml":{"source":"iana","compressible":true,"extensions":["xml"]},"text/xml-external-parsed-entity":{"source":"iana"},"text/yaml":{"extensions":["yaml","yml"]},"video/1d-interleaved-parityfec":{"source":"apache"},"video/3gpp":{"source":"apache","extensions":["3gp","3gpp"]},"video/3gpp-tt":{"source":"apache"},"video/3gpp2":{"source":"apache","extensions":["3g2"]},"video/bmpeg":{"source":"apache"},"video/bt656":{"source":"apache"},"video/celb":{"source":"apache"},"video/dv":{"source":"apache"},"video/encaprtp":{"source":"apache"},"video/h261":{"source":"apache","extensions":["h261"]},"video/h263":{"source":"apache","extensions":["h263"]},"video/h263-1998":{"source":"apache"},"video/h263-2000":{"source":"apache"},"video/h264":{"source":"apache","extensions":["h264"]},"video/h264-rcdo":{"source":"apache"},"video/h264-svc":{"source":"apache"},"video/h265":{"source":"apache"},"video/iso.segment":{"source":"apache"},"video/jpeg":{"source":"apache","extensions":["jpgv"]},"video/jpeg2000":{"source":"apache"},"video/jpm":{"source":"apache","extensions":["jpm","jpgm"]},"video/mj2":{"source":"apache","extensions":["mj2","mjp2"]},"video/mp1s":{"source":"apache"},"video/mp2p":{"source":"apache"},"video/mp2t":{"source":"apache","extensions":["ts"]},"video/mp4":{"source":"apache","compressible":false,"extensions":["mp4","mp4v","mpg4"]},"video/mp4v-es":{"source":"apache"},"video/mpeg":{"source":"apache","compressible":false,"extensions":["mpeg","mpg","mpe","m1v","m2v"]},"video/mpeg4-generic":{"source":"apache"},"video/mpv":{"source":"apache"},"video/nv":{"source":"apache"},"video/ogg":{"source":"apache","compressible":false,"extensions":["ogv"]},"video/parityfec":{"source":"apache"},"video/pointer":{"source":"apache"},"video/quicktime":{"source":"apache","compressible":false,"extensions":["qt","mov"]},"video/raptorfec":{"source":"apache"},"video/raw":{"source":"apache"},"video/rtp-enc-aescm128":{"source":"apache"},"video/rtploopback":{"source":"apache"},"video/rtx":{"source":"apache"},"video/smpte292m":{"source":"apache"},"video/ulpfec":{"source":"apache"},"video/vc1":{"source":"apache"},"video/vnd.cctv":{"source":"apache"},"video/vnd.dece.hd":{"source":"apache","extensions":["uvh","uvvh"]},"video/vnd.dece.mobile":{"source":"apache","extensions":["uvm","uvvm"]},"video/vnd.dece.mp4":{"source":"apache"},"video/vnd.dece.pd":{"source":"apache","extensions":["uvp","uvvp"]},"video/vnd.dece.sd":{"source":"apache","extensions":["uvs","uvvs"]},"video/vnd.dece.video":{"source":"apache","extensions":["uvv","uvvv"]},"video/vnd.directv.mpeg":{"source":"apache"},"video/vnd.directv.mpeg-tts":{"source":"apache"},"video/vnd.dlna.mpeg-tts":{"source":"apache"},"video/vnd.dvb.file":{"source":"apache","extensions":["dvb"]},"video/vnd.fvt":{"source":"apache","extensions":["fvt"]},"video/vnd.hns.video":{"source":"apache"},"video/vnd.iptvforum.1dparityfec-1010":{"source":"apache"},"video/vnd.iptvforum.1dparityfec-2005":{"source":"apache"},"video/vnd.iptvforum.2dparityfec-1010":{"source":"apache"},"video/vnd.iptvforum.2dparityfec-2005":{"source":"apache"},"video/vnd.iptvforum.ttsavc":{"source":"apache"},"video/vnd.iptvforum.ttsmpeg2":{"source":"apache"},"video/vnd.motorola.video":{"source":"apache"},"video/vnd.motorola.videop":{"source":"apache"},"video/vnd.mpegurl":{"source":"apache","extensions":["mxu","m4u"]},"video/vnd.ms-playready.media.pyv":{"source":"apache","extensions":["pyv"]},"video/vnd.nokia.interleaved-multimedia":{"source":"apache"},"video/vnd.nokia.videovoip":{"source":"apache"},"video/vnd.objectvideo":{"source":"apache"},"video/vnd.radgamettools.bink":{"source":"apache"},"video/vnd.radgamettools.smacker":{"source":"apache"},"video/vnd.sealed.mpeg1":{"source":"apache"},"video/vnd.sealed.mpeg4":{"source":"apache"},"video/vnd.sealed.swf":{"source":"apache"},"video/vnd.sealedmedia.softseal.mov":{"source":"apache"},"video/vnd.uvvu.mp4":{"source":"apache","extensions":["uvu","uvvu"]},"video/vnd.vivo":{"source":"apache","extensions":["viv"]},"video/vp8":{"source":"apache"},"video/webm":{"source":"apache","compressible":false,"extensions":["webm"]},"video/x-f4v":{"source":"apache","extensions":["f4v"]},"video/x-fli":{"source":"apache","extensions":["fli"]},"video/x-flv":{"source":"apache","compressible":false,"extensions":["flv"]},"video/x-m4v":{"source":"apache","extensions":["m4v"]},"video/x-matroska":{"source":"apache","compressible":false,"extensions":["mkv","mk3d","mks"]},"video/x-mng":{"source":"apache","extensions":["mng"]},"video/x-ms-asf":{"source":"apache","extensions":["asf","asx"]},"video/x-ms-vob":{"source":"apache","extensions":["vob"]},"video/x-ms-wm":{"source":"apache","extensions":["wm"]},"video/x-ms-wmv":{"source":"apache","compressible":false,"extensions":["wmv"]},"video/x-ms-wmx":{"source":"apache","extensions":["wmx"]},"video/x-ms-wvx":{"source":"apache","extensions":["wvx"]},"video/x-msvideo":{"source":"apache","extensions":["avi"]},"video/x-sgi-movie":{"source":"apache","extensions":["movie"]},"video/x-smv":{"source":"apache","extensions":["smv"]},"x-conference/x-cooltalk":{"source":"apache","extensions":["ice"]},"x-shader/x-fragment":{"compressible":true},"x-shader/x-vertex":{"compressible":true}}

/***/ }),
/* 168 */
/***/ (function(module, exports) {

module.exports = {"name":"@auth0/hapi","description":"HTTP Server framework","homepage":"http://hapijs.com","version":"13.6.0","repository":{"type":"git","url":"git://github.com/hapijs/hapi"},"main":"lib/index.js","keywords":["framework","http","api","web"],"engines":{"node":">=4.0.0"},"dependencies":{"@auth0/statehood":"^4.1.1","accept":"2.x.x","ammo":"2.x.x","boom":"3.x.x","call":"3.x.x","catbox":"7.x.x","catbox-memory":"2.x.x","cryptiles":"3.x.x","heavy":"4.x.x","hoek":"4.x.x","iron":"4.x.x","items":"2.x.x","joi":"8.x.x","kilt":"2.x.x","mimos":"3.x.x","peekaboo":"2.x.x","shot":"^3.4.2","subtext":"4.x.x","topo":"2.x.x"},"devDependencies":{"code":"3.x.x","handlebars":"4.x.x","inert":"4.x.x","lab":"10.x.x","vision":"4.x.x","wreck":"7.x.x"},"scripts":{"test":"lab -a code -t 100 -L","test-tap":"lab -a code -r tap -o tests.tap","test-cov-html":"lab -a code -r html -o coverage.html"},"license":"BSD-3-Clause","_resolved":"https://a0us.jfrog.io/a0us/api/npm/npm/@auth0/hapi/-/@auth0/hapi-13.6.0.tgz","_integrity":"sha1-ZEHrIWYzdqyBCzpJEBRFDBai0nU=","_from":"@auth0/hapi@13.6.0"}

/***/ }),
/* 169 */
/***/ (function(module, exports) {

module.exports = {"title":"Auth0 Authorization","name":"auth0-authz-andy","version":"2.9.1","author":"auth0","description":"This extension gives Auth0 customers the possibility to manage group memberships for their users.","type":"application","logoUrl":"https://cdn.auth0.com/extensions/auth0-authz/assets/logo.svg","initialUrlPath":"/admins/login","updateConfirmMessage":"Warning! Read the documentation about breaking changes (https://auth0.com/docs/extensions/authorization-extension) before updating the extension. If you are upgrading from 2.5 or older, you have to rotate your Api Key and republish the rule upon upgrade.","uninstallConfirmMessage":"You are about to uninstall the \"Authorization Extension\". If you proceed all your data in this extension will be lost. Do you want to continue?","repository":"https://github.com/6footgeek/auth0-authorization-extension","keywords":["auth0","extension"],"auth0":{"createClient":true,"onUninstallPath":"/.extensions/on-uninstall","onUpdatePath":"/.extensions/on-update","scopes":"read:connections read:resource_servers update:resource_servers delete:resource_servers read:clients delete:clients read:users read:rules create:rules update:rules_configs update:rules delete:rules"},"secrets":{"STORAGE_TYPE":{"description":"Choose the storage type for the database","type":"select","required":true,"default":"webtask","allowMultiple":false,"options":[{"value":"webtask","text":"Webtask Storage"},{"value":"s3","text":"Amazon S3"}]},"S3_BUCKET":{"description":"Your S3 Bucket","example":"my-bucket","required":true,"visibleIf":{"STORAGE_TYPE":"s3"}},"S3_PATH":{"description":"Path to the JSON file","required":true,"example":"/auth0-authz.json","default":"/auth0-authz.json","visibleIf":{"STORAGE_TYPE":"s3"}},"S3_KEY":{"description":"Your S3 Key ID","required":true,"example":"AKIAJL.........","visibleIf":{"STORAGE_TYPE":"s3"}},"S3_SECRET":{"description":"Your S3 Key Secret","required":true,"example":"r3UOMBA......................","visibleIf":{"STORAGE_TYPE":"s3"}},"USER_SEARCH_ENGINE":{"description":"User search engine. Cloud only supports V3","type":"select","default":"v3","allowMultiple":false,"options":[{"value":"v3","text":"v3"},{"value":"v2","text":"v2"}]}}}

/***/ }),
/* 170 */
/***/ (function(module, exports) {

module.exports = require("async@2.1.2");

/***/ }),
/* 171 */
/***/ (function(module, exports) {

module.exports = require("auth0-extension-s3-tools@1.1.1");

/***/ }),
/* 172 */
/***/ (function(module, exports) {

module.exports = require("blipp@2.3.0");

/***/ }),
/* 173 */
/***/ (function(module, exports) {

module.exports = require("domain");

/***/ }),
/* 174 */
/***/ (function(module, exports) {

module.exports = require("good-console@6.1.2");

/***/ }),
/* 175 */
/***/ (function(module, exports) {

module.exports = require("good@7.0.1");

/***/ }),
/* 176 */
/***/ (function(module, exports) {

module.exports = require("hapi-auth-jwt2@7.0.1");

/***/ }),
/* 177 */
/***/ (function(module, exports) {

module.exports = require("hapi-swagger@7.4.0");

/***/ }),
/* 178 */
/***/ (function(module, exports) {

module.exports = require("inert@4.0.1");

/***/ }),
/* 179 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken@7.1.9");

/***/ }),
/* 180 */
/***/ (function(module, exports) {

module.exports = require("jwks-rsa@1.1.1");

/***/ }),
/* 181 */
/***/ (function(module, exports) {

module.exports = require("lru-memoizer@1.10.0");

/***/ }),
/* 182 */
/***/ (function(module, exports) {

module.exports = require("nconf@0.8.4");

/***/ }),
/* 183 */
/***/ (function(module, exports) {

module.exports = require("node-uuid@1.4.3");

/***/ }),
/* 184 */
/***/ (function(module, exports) {

module.exports = require("relish@0.2.4");

/***/ }),
/* 185 */
/***/ (function(module, exports) {

module.exports = require("superagent@1.2.0");

/***/ }),
/* 186 */
/***/ (function(module, exports) {

module.exports = require("winston@1.0.0");

/***/ })
/******/ ]);