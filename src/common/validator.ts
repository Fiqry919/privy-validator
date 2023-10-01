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
    switch (typeof x) {
        case 'number':
            return Math.abs(x).toString().length;
        case 'string':
            return Math.abs(Number(x.replace(/\D/g, ''))).toString().length;
        case 'object':
            if (Array.isArray(x)) return x.length;
            return Object.keys(x).length;
        default:
            return NaN;
    }
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
 * @returns boolean
 */
export function isPositiveInt(x: any): boolean {
    const n = Math.floor(Number(x));
    return n !== Infinity && String(n) === x && n >= 0;
}
/**
 * 
 * @returns boolean
 */
export function dateRange(date: string, min?: string, max?: string): boolean {
    const value = new Date(date);
    const after = min ? new Date(min) : min;
    const before = max ? new Date(max) : max;

    return (after && before) ? (value >= after && value <= before) : after ? (value > after) : before ? (value < before) : false;
}