import { Kronos } from '@tb-dev/kronos';
import { isString } from '$global/guards';

declare global {
    interface Array<T> {
        /** Parses the array as a list of integers, but do not filter out any non-integer values. */
        asIntegerList(): number[];
        /** Parses the array as a list of integers, filtering out any non-integer values. */
        asIntegerListStrict(): number[];
    }

    interface Map<K, V> {
        /**
         * Returns a specified element from the Map object. If the value that is associated to the provided key is an object,
         * then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
         * 
         * @returns Returns the element associated with the specified key.
         * If no element is associated with the specified key, throws an error.
         */
        getStrict(key: K): V;
    }

    interface Number {
        /**
         * Converts a number to a Date object, exactly like `new Date()` does.
         * This will throw an error if the number is not a valid timestamp.
         */
        toDate(): Date;
    }

    interface ReadonlyMap<K, V> {
        /**
         * Returns a specified element from the Map object. If the value that is associated to the provided key is an object,
         * then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
         * 
         * @returns Returns the element associated with the specified key.
         * If no element is associated with the specified key, throws an error.
         */
        getStrict(key: K): V;
    }

    interface String {
        /**
         * Split a string into substrings using the specified separator and return them as a list of strings.
         * However, removes any empty strings from the returned list and trims each string.
         * @param separator A string that identifies character or characters to use in separating the string.
         * If omitted, a single-element array containing the entire string is returned.
         * @param limit A value used to limit the number of elements returned in the array.
         */
        splitAndTrim(separator: RegExp | string, limit?: number): string[];

        /**
         * Split a string into substrings using the specified separator and return them as a list of integers.
         * The returned list may contain `NaN` if any of the substrings cannot be parsed as an integer.
         * @param separator A string that identifies character or characters to use in separating the string.
         * If omitted, a single-element array containing the entire string is returned.
         * @param limit A value used to limit the number of elements returned in the array.
         */
        splitAsIntegerList(separator: RegExp | string, limit?: number): number[];

        /**
         * Split a string into substrings using the specified separator and return them as a list of integers.
         * If the string cannot be parsed as an integer, it is not included in the returned list.
         * @param separator A string that identifies character or characters to use in separating the string.
         * If omitted, a single-element array containing the entire string is returned.
         * @param limit A value used to limit the number of elements returned in the array.
         */
        splitAsIntegerListStrict(separator: RegExp | string, limit?: number): number[];

        /**
         * Parses the string as an integer, exactly like `Number.parseInt()` does.
         * @param radix A value between 2 and 36 that specifies the base of the number.
         * If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal.
         * All other strings are considered decimal.
         */
        toInteger(radix?: number): number;

        /**
         * Parses the string as an integer, exactly like `Number.parseIntStrict()` does.
         * @param radix A value between 2 and 36 that specifies the base of the number.
         * If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal.
         * All other strings are considered decimal.
         * @throws If the string cannot be parsed as an integer.
         */
        toIntegerStrict(radix?: number): number;


        /** Parses the string as a float, exactly like `Number.parseFloat()` does. */
        toFloat(): number;
        /**
         * Parses the string as a float, exactly like `Number.parseFloatStrict()` does.
         * @throws If the string cannot be parsed as a float.
         */
        toFloatStrict(): number;
    }

    interface URLSearchParams {
        /**
         * Get the first value associated to the given search parameter.
         * @param name The name of the search parameter to get.
         * @throws If the search parameter does not exist.
         */
        getStrict<T extends string>(name: string): T;

        /**
         * Get the first value associated to the given search parameter, then tries to parse it as an integer if it is not `null`.
         * The returned value may be `NaN` if it cannot be parsed as an integer.
         * @param name The name of the search parameter to get.
         * @param radix A value between 2 and 36 that specifies the base of the number.
         * If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal.
         * All other strings are considered decimal.
         */
        getAsInteger(name: string, radix?: number): number | null;

        /**
         * Get the first value associated to the given search parameter, then tries to parse it as an integer.
         * @param name The name of the search parameter to get.
         * @param radix A value between 2 and 36 that specifies the base of the number.
         * If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal.
         * All other strings are considered decimal.
         * @throws If the search parameter does not exist or if it cannot be parsed as an integer.
         */
        getAsIntegerStrict(name: string, radix?: number): number;
    }

    interface DateConstructor {
        yesterday(): number;
        tomorrow(): number;
        sevenDaysAgo(): number;
        sevenDaysFromNow(): number;
        thirtyDaysAgo(): number;
        thirtyDaysFromNow(): number;
    }

    interface NumberConstructor {
        /**
         * Converts a string to an integer, exactly like `Number.parseInt()` does.
         * @param rawString A string to convert into a number.
         * @param radix A value between 2 and 36 that specifies the base of the number.
         * If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal.
         * All other strings are considered decimal.
         * @throws If the string cannot be parsed as an integer.
         */
        parseIntStrict(rawString: string, radix?: number): number

        /**
         * Converts a string to a float, exactly like `Number.parseFloat()` does.
         * @param rawString A string to convert into a number.
         * @throws If the string cannot be parsed as a float.
         */
        parseFloatStrict(rawString: string): number;
    }
}

Array.prototype.asIntegerList = function(): number[] {
    return this.map((i) => Number.parseInt(i, 10));
};

Array.prototype.asIntegerListStrict = function(): number[] {
    const parsedArray = this.map((i) => Number.parseInt(i, 10));
    return parsedArray.filter((i) => !Number.isNaN(i));
};

Map.prototype.getStrict = function<K, V>(key: K): V {
    const item = this.get(key);
    if (item === undefined) {
        throw new Error(`Key "${key}" does not exist in the map.`);
    };
    return item;
};

Number.prototype.toDate = function(): Date {
    const value = this.valueOf();
    if (!Number.isFinite(value) || value < 0) {
        throw new TypeError(`Invalid date value: ${value}`);
    };
    return new Date(value);
};

String.prototype.splitAndTrim = function(separator: RegExp | string, limit?: number): string[] {
    const values = this.split(separator, limit);
    return values.map((i) => i.trim()).filter((i) => i.length > 0);
};

String.prototype.splitAsIntegerList = function(separator: RegExp | string, limit?: number): number[] {
    const values = this.split(separator, limit);
    return values.asIntegerList();
};

String.prototype.splitAsIntegerListStrict = function(separator: RegExp | string, limit?: number): number[] {
    const values = this.split(separator, limit);
    return values.asIntegerListStrict();
};

String.prototype.toFloat = function(): number {
    const value = this.valueOf();
    return Number.parseFloat(value);
};

String.prototype.toFloatStrict = function(): number {
    const value = this.valueOf();
    return Number.parseFloatStrict(value);
};

String.prototype.toInteger = function(radix: number = 10): number {
    const value = this.valueOf();
    return Number.parseInt(value, radix);
};

String.prototype.toIntegerStrict = function(radix: number = 10): number {
    const value = this.valueOf();
    return Number.parseIntStrict(value, radix);
};

URLSearchParams.prototype.getStrict = function<T extends string>(name: string): T {
    const item = this.get(name);
    if (item === null) {
        throw new Error(`Search parameter "${name}" does not exist in the URL.`);
    };
    return item as T;
};

URLSearchParams.prototype.getAsInteger = function(name: string, radix: number = 10): number | null {
    const item = this.get(name);
    if (item === null) return item;
    return Number.parseInt(item, radix);
};

URLSearchParams.prototype.getAsIntegerStrict = function(name: string, radix: number = 10): number {
    const item = this.get(name);
    if (!isString(item)) {
        throw new Error(`Search parameter "${name}" does not exist in the URL.`);
    };
    return Number.parseIntStrict(item, radix);
};

Date.yesterday = function(): number {
    return Date.now() - Kronos.Day;
};

Date.tomorrow = function(): number {
    return Date.now() + Kronos.Day;
};

Date.sevenDaysAgo = function(): number {
    return Date.now() - Kronos.Week;
};

Date.sevenDaysFromNow = function(): number {
    return Date.now() + Kronos.Week;
};

Date.thirtyDaysAgo = function(): number {
    return Date.now() - Kronos.Month;
};

Date.thirtyDaysFromNow = function(): number {
    return Date.now() + Kronos.Month;
};

Number.parseFloatStrict = function(rawString: string): number {
    const parsed = Number.parseFloat(rawString);
    if (Number.isNaN(parsed)) {
        throw new TypeError(`"${rawString}" could not be parsed as a float.`);
    };
    return parsed;
};

Number.parseIntStrict = function(rawString: string, radix: number = 10): number {
    const parsed = Number.parseInt(rawString, radix);
    if (Number.isNaN(parsed)) {
        throw new TypeError(`"${rawString}" could not be parsed as an integer.`);
    };
    return parsed;
};