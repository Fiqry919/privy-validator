import { ValidationSchema, CustomMessage, Message, ValidationErrors, Schema } from "./interfaces/validator"
import { dateRange, isDataType, isDate, isEmail, parseDigit } from "./common/validator";
import regexPatterns from "./common/regex";

export default class Validator<T> {
    private constructor(private state: boolean, private error: { [key in keyof T]?: string[] }) { }
    /**
     * checking validation status
     * @return boolean
     */
    validate() { return this.state }
    /**
     * getting errors validation
     * @return string[]
     */
    errors() { return this.error }
    /**
     * make a validation
     * @param data - request body or any typeof object for validate 
     * @param validationSchema - validation schema
     * @param customMessage - custom message
     * @return Validator
     */
    static async make<T extends Record<string, any>>(data: T, validationSchema: ValidationSchema<T>, customMessage?: CustomMessage<T>) {
        if (typeof data != 'object') this.invalid("Invalid argument of data"); // data is not object
        for (const key of Object.keys(data)) {
            if (!isNaN(Number(key))) this.invalid("Invalid argument typeof key"); // typeof key is not string
        }
        const Errors: any = {}

        for (const [attribute, value] of Object.entries(validationSchema)) {
            let schema = <Schema>value
            if (schema && typeof schema === 'string') {
                schema = this.parse(schema) as Schema
            }

            if (!schema?.type) this.invalid("Invalid argument of type"); // empty schema type
            const entries = data[attribute];
            const error: string[] = [];
            const errorConfirm: string[] = [];
            /**
             * required
             */
            if (schema?.required && (!entries || entries === '')) {
                error.push(this.setError(customMessage?.[attribute]?.required || customMessage?.["*"]?.required || Message.REQUIRED, attribute));
            } else if (typeof entries !== 'undefined') {
                /**
                 * data type
                 */
                if (schema?.type && isDataType(schema?.type) && typeof entries !== schema.type) {
                    const type = schema.type;
                    error.push(this.setError(customMessage?.[attribute]?.type || customMessage?.["*"]?.type || Message.DATA_TYPE, attribute, { type }));
                }
                /**
                 * array type
                 */
                if (schema?.type === 'array' && !Array.isArray(entries)) {
                    const type = schema.type;
                    error.push(this.setError(customMessage?.[attribute]?.type || customMessage?.["*"]?.type || Message.DATA_TYPE, attribute, { type }));
                }
                /**
                 * email type
                 */
                if (schema?.type === 'email' && !isEmail(entries)) {
                    const type = schema.type;
                    error.push(this.setError(customMessage?.[attribute]?.type || customMessage?.["*"]?.type || Message.TYPE, attribute, { type }));
                }
                /**
                 * date type
                 */
                if (schema?.type === 'date' && !isDate(entries)) {
                    const type = schema.type;
                    error.push(this.setError(customMessage?.[attribute]?.type || customMessage?.["*"]?.type || Message.TYPE, attribute, { type }));
                }

                /**
                 * regex pettern type
                 */
                if (schema?.type && (`${schema.type}Regex` in regexPatterns)) {
                    const type = schema.type;
                    const typeWithRegex = `${schema.type}Regex`;
                    const regex = regexPatterns[typeWithRegex as keyof typeof regexPatterns];
                    if (!regex.test(entries)) {
                        error.push(this.setError(customMessage?.[attribute]?.type || customMessage?.["*"]?.type || Message.TYPE, attribute, { type }));
                    }
                }

                /**
                 * min
                 */
                if (schema?.min && entries.length < schema.min) {
                    const min = schema.min;
                    error.push(this.setError(customMessage?.[attribute]?.min || customMessage?.["*"]?.min || Message.MIN, attribute, { min }));
                }
                /**
                 * max
                 */
                if (schema?.max && entries.length > schema.max) {
                    const max = schema.max;
                    error.push(this.setError(customMessage?.[attribute]?.max || customMessage?.["*"]?.max || Message.MAX, attribute, { max }));
                }
                /**
                 * before
                 */
                if (schema?.before && isDate(entries) && !dateRange(entries, undefined, schema?.before)) {
                    const before = schema.before;
                    error.push(this.setError(customMessage?.[attribute]?.before || customMessage?.["*"]?.before || Message.BEFORE, attribute, { before }));
                }
                /**
                 * after
                 */
                if (schema?.after && isDate(entries) && !dateRange(entries, schema?.after)) {
                    const after = schema.after;
                    error.push(this.setError(customMessage?.[attribute]?.after || customMessage?.["*"]?.after || Message.AFTER, attribute, { after }));
                }
                /**
                 * digits
                 */
                if (schema?.digits) {
                    const digit = schema.digits;
                    const value = parseDigit(entries);
                    if (value !== digit) error.push(this.setError(customMessage?.[attribute]?.digits || customMessage?.["*"]?.digits || Message.DIGITS, attribute, { digit }));
                }
                /**
                 * in
                 */
                if (schema?.in && !schema.in.includes(entries)) {
                    const value = schema.in.toString().replaceAll(',', ', ');
                    error.push(this.setError(customMessage?.[attribute]?.in || customMessage?.["*"]?.in || Message.IN, attribute, { value }));
                }
                /**
                 * not in
                 */
                if (schema?.notIn && schema.notIn.includes(entries)) {
                    const value = schema.notIn.toString().replaceAll(',', ', ');
                    error.push(this.setError(customMessage?.[attribute]?.notIn || customMessage?.["*"]?.notIn || Message.NOT_IN, attribute, { value }));
                }
                /**
                 * between
                 */
                if (schema?.between) {
                    if (schema.between.length != 2) this.invalid("Invalid argument of between");
                    const [min, max] = schema?.between;
                    if (entries < min || entries > max) error.push(this.setError(customMessage?.[attribute]?.between || customMessage?.["*"]?.between || Message.BETWEEN, attribute, { min, max }));
                }
                /**
                 * date between
                 */
                if (schema?.dateBetween && isDate(entries)) {
                    if (schema.dateBetween.length != 2) this.invalid("Invalid argument of date between");
                    const [min, max] = schema?.dateBetween;
                    if (!dateRange(entries, min, max)) {
                        error.push(this.setError(customMessage?.[attribute]?.dateBetween || customMessage?.["*"]?.dateBetween || Message.DATE_BETWEEN, attribute, { min, max }));
                    }
                }
                /**
                 * digits between
                 */
                if (schema?.digitsBetween) {
                    if (schema.digitsBetween.length != 2) this.invalid("Invalid argument of digits between");
                    const [min, max] = schema?.digitsBetween;
                    const digits = parseDigit(entries);
                    if (digits < min || digits > max) {
                        error.push(this.setError(customMessage?.[attribute]?.digitsBetween || customMessage?.["*"]?.digitsBetween || Message.DIGITS_BETWEEN, attribute, { min, max }));
                    }
                }
                /**
                 * regular expression
                 */
                if (schema?.regex) {
                    if (typeof schema.regex === 'string') schema.regex = new RegExp(schema?.regex);
                    if (!schema?.regex.test(entries)) error.push(this.setError(customMessage?.[attribute]?.regex || customMessage?.["*"]?.regex || Message.REGEX, attribute));
                }
                /**
                 * custom
                 */
                if (schema?.custom) {
                    try {
                        await schema.custom(entries);
                    } catch (e: any) {
                        error.push(customMessage?.[attribute]?.custom || customMessage?.["*"]?.custom || (<Error>e).message || e.toString());
                    }
                }
                /**
                 * confirmed
                 */
                if (schema?.confirmed) {
                    const confirmValue = data[`${attribute}_confirmation`];
                    if (confirmValue !== entries) {
                        errorConfirm.push(this.setError(customMessage?.[attribute]?.confirmed || customMessage?.["*"]?.confirmed || Message.CONFIRMED, attribute));
                    }
                }
            } // end elseif

            if (error.length) {
                Errors[attribute] = error;
            }
            if (errorConfirm.length) {
                Errors[`${attribute}_confirmation`] = errorConfirm;
            }
        }

        return new Validator(Object.keys(Errors).length === 0, <ValidationErrors<T>>Errors);
    }
    /**
     * set error message
     * @return string
     */
    private static setError(message: string, attribute: string, parameters?: Record<string, any>): string {
        let errorMessage = message.replace(":attribute", attribute);
        if (parameters) {
            for (const [k, v] of Object.entries(parameters)) {
                errorMessage = errorMessage.replace(`:${k}`, v.toString());
            }
        }
        return errorMessage
    }
    /**
     * set invalid argument
     * @throw Error
     */
    private static invalid(args: string) { throw new TypeError(args); }
    /**
     * 
     */
    private static parse(input: string): Record<string, any> {
        const result: Record<string, any> = {};
        const parts = input.split('|');

        parts.forEach(part => {
            const [key, value] = part.split(':');
            if (value === undefined) {
                result[key] = true; // If no value provided, set it as true
            } else if (!isNaN(Number(value))) {
                result[key] = Number(value); // If value is a number, parse it as number
            } else if (value.startsWith('[') && value.endsWith(']')) {
                result[key] = JSON.parse(value); // If value is an array, parse it as array
            } else if (value === 'true') {
                result[key] = true; // If value is 'true', set it as true
            } else if (value === 'false') {
                result[key] = false; // If value is 'false', set it as false
            } else if (key === 'regex') {
                result[key] = new RegExp(value);
            } else {
                result[key] = value; // Otherwise, set it as string
            }
        });

        return result;
    }
}