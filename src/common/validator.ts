/**
 * @returns boolean
 */
export function isDataType(x: any): boolean { return ['string', 'number', 'object', /** etc data type */].includes(x); }
/**
 * @returns boolean
 */
export function isEmail(x: string): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x); }
/**
 * 
 * @returns number
 */
export function parseDigit(x: any): number {
    return typeof x === 'number' ? Math.abs(x).toString().length : x.match(/-?\d+(\.\d+)?/g).join('').length;
}
/**
 * @return RegExp
 */
export function parseRegex(x: string): RegExp { return new RegExp(x.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')) }
/**
 * 
 * @returns boolean
 */
export function isDate(x: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (!regex.test(x)) return false;

    const split = x.split("-");
    const Y = parseInt(split[0], 10);
    const M = parseInt(split[1], 10);
    const D = parseInt(split[2], 10);

    if (isNaN(Y) || isNaN(M) || isNaN(D)) return false;
    if (M < 1 || M > 12 || D < 1 || D > 31) return false;

    return true;
}
/**
 * 
 * @returns boolean
 */
export function dateRange(date: string, min?: string, max?: string): boolean {
    const value = new Date(date);
    const after = min ? new Date(min) : undefined;
    const before = max ? new Date(max) : undefined;

    return (after && before) ? (value >= after && value <= before) : after ? (value > after) : before ? (value < before) : false;
}
/**
 * 
 * @returns number
 */
export function getSize(x: any): number {
    if (typeof x === 'number') return Math.abs(x).toString().length;
    else if (Array.isArray(x)) return x.length;
    else if (typeof x === 'object') return Object.keys(x).length;
    else return 0;
}