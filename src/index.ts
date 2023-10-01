import { ValidationSchema, CustomMessage, Message } from "./interfaces/validator"
import { dateRange, isDataType, isDate, isEmail, parseDigit } from "./common/validator";

export default class Validator {
    private constructor(private state: boolean, private error: string[]) { }
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
    static async make(data: any, validationSchema: ValidationSchema, customMessage?: CustomMessage) {
        if (typeof data != 'object') this.invalid("Invalid argument of data"); // data is not object
        for (const key of Object.keys(data)) {
            if (!isNaN(Number(key))) this.invalid("Invalid argument typeof key"); // typeof key is not string
        }
        const Errors: any = {}

        for (const [attribute, schema] of Object.entries(validationSchema)) {
            if (!schema.type) this.invalid("Invalid argument of type"); // empty schema type
            const entries = data[attribute];
            const error: string[] = [];
            /**
             * required
             */
            if (schema.required && (typeof entries === 'undefined' || entries === '')) {
                error.push(this.setError(customMessage?.[attribute]?.required || Message.REQUIRED, attribute));
            } else if (typeof entries !== 'undefined') {
                /**
                 * data type
                 */
                if (isDataType(schema.type) && typeof entries !== schema.type) {
                    const type = schema.type;
                    error.push(this.setError(customMessage?.[attribute]?.type || Message.DATA_TYPE, attribute, { type }));
                }
                /**
                 * array type
                 */
                if (schema.type === 'array' && !Array.isArray(entries)) {
                    const type = schema.type;
                    error.push(this.setError(customMessage?.[attribute]?.type || Message.DATA_TYPE, attribute, { type }));
                }
                /**
                 * email type
                 */
                if (schema.type === 'email' && !isEmail(entries)) {
                    const type = schema.type;
                    error.push(this.setError(customMessage?.[attribute]?.type || Message.TYPE, attribute, { type }));
                }
                /**
                 * date type
                 */
                if (schema.type === 'date' && !isDate(entries)) {
                    const type = schema.type;
                    error.push(this.setError(customMessage?.[attribute]?.type || Message.TYPE, attribute, { type }));
                }
                /**
                 * min
                 */
                if (schema.min && entries.length < schema.min) {
                    const min = schema.min;
                    error.push(this.setError(customMessage?.[attribute]?.min || Message.MIN, attribute, { min }));
                }
                /**
                 * max
                 */
                if (schema.max && entries.length > schema.max) {
                    const max = schema.max;
                    error.push(this.setError(customMessage?.[attribute]?.max || Message.MAX, attribute, { max }));
                }
                /**
                 * before
                 */
                if (schema.before && isDate(entries) && !dateRange(entries, undefined, schema.before)) {
                    const before = schema.before;
                    error.push(this.setError(customMessage?.[attribute]?.before || Message.BEFORE, attribute, { before }));
                }
                /**
                 * after
                 */
                if (schema.after && isDate(entries) && !dateRange(entries, schema.after)) {
                    const after = schema.after;
                    error.push(this.setError(customMessage?.[attribute]?.after || Message.AFTER, attribute, { after }));
                }
                /**
                 * digits
                 */
                if (schema.digits) {
                    const digit = schema.digits;
                    const value = parseDigit(entries);
                    if (value !== digit) error.push(this.setError(customMessage?.[attribute]?.digits || Message.DIGITS, attribute, { digit }));
                }
                /**
                 * size
                 */
                // if (schema.size) {/** coming soon (for global/any need type mime:jpeg,etc) */ }
                /**
                 * in
                 */
                if (schema.in && !schema.in.includes(entries)) {
                    const value = schema.in.toString().replaceAll(',', ', ');
                    error.push(this.setError(customMessage?.[attribute]?.in || Message.IN, attribute, { value }));
                }
                /**
                 * not in
                 */
                if (schema.notIn && schema.notIn.includes(entries)) {
                    const value = schema.notIn.toString().replaceAll(',', ', ');
                    error.push(this.setError(customMessage?.[attribute]?.notIn || Message.NOT_IN, attribute, { value }));
                }
                /**
                 * between
                 */
                if (schema.between && (entries < schema.between[0] || entries > schema.between[1])) {
                    if (schema.between.length != 2) this.invalid("Invalid argument of between");
                    const [min, max] = schema.between;
                    error.push(this.setError(customMessage?.[attribute]?.between || Message.BETWEEN, attribute, { min, max }));
                }
                /**
                 * date between
                 */
                if (schema.dateBetween && isDate(entries)) {
                    if (schema.dateBetween.length != 2) this.invalid("Invalid argument of date between");
                    const [min, max] = schema.dateBetween;
                    if (!dateRange(entries, min, max)) {
                        error.push(this.setError(customMessage?.[attribute]?.dateBetween || Message.DATE_BETWEEN, attribute, { min, max }));
                    }
                }
                /**
                 * digits between
                 */
                if (schema.digitsBetween) {
                    if (schema.digitsBetween.length != 2) this.invalid("Invalid argument of digits between");
                    const [min, max] = schema.digitsBetween;
                    const digits = parseDigit(entries);
                    if (digits < min || digits > max) {
                        error.push(this.setError(customMessage?.[attribute]?.digitsBetween || Message.DIGITS_BETWEEN, attribute, { min, max }));
                    }
                }
                /**
                 * regular expression
                 */
                if (schema.regex) {
                    if (typeof schema.regex === 'string') schema.regex = new RegExp(schema.regex);
                    if (!schema.regex.test(entries)) error.push(this.setError(customMessage?.[attribute]?.regex || Message.REGEX, attribute));
                }
                /**
                 * custom
                 */
                if (schema.custom) {
                    try {
                        await schema.custom(entries);
                    } catch (e: any) {
                        error.push(customMessage?.[attribute]?.custom || (<Error>e).message || e.toString());
                    }
                }
                /**
                 * confirmed
                 */
                if (schema.confirmed) {
                    const confirmValue = data[`${attribute}_confirmation`];
                    if (confirmValue !== entries) {
                        error.push(this.setError(customMessage?.[attribute]?.confirmed || Message.CONFIRMED, attribute));
                    }
                }
            } // end elseif

            if (error.length) Errors[attribute] = error;
        }

        return new Validator(Object.keys(Errors).length === 0, Errors);
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
     * @returns Error
     */
    private static invalid(message: string) { throw new Error(message); }
}