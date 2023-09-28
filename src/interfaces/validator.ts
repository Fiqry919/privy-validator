export enum Message {
    /**
     * required message
     */
    REQUIRED = "The :attribute is required",
    /**
     * data type message 
     */
    DATA_TYPE = "The :attribute must be :type",
    /**
     * type message
     */
    TYPE = "The :attribute must be valid :type",
    /**
     * min message
     */
    MIN = "The :attribute must be minimum :min characters",
    /**
     * max message
     */
    MAX = "The :attribute must be maximum :max characters",
    /**
     * before message
     */
    BEFORE = "The :attribute must be before :before",
    /**
     * after message
     */
    AFTER = "The :attribute must be after :after",
    /**
     * size message
     */
    DIGITS = "The :attribute must be have :digit digits",
    /**
     * size message
     */
    SIZE = "The :attribute has a maximum size :size",
    /**
     * included message
     */
    IN = "The :attribute must included in [:value]",
    /**
     * not included message
     */
    NOT_IN = "The :attribute must not included in [:value]",
    /**
     * between message
     */
    BETWEEN = "The :attribute must be between :min - :max",
    /**
     * regex message
     */
    REGEX = "The :attribute does not match with required pattern",
    /**
     * confirmed message
     */
    CONFIRMED = "The :attribute confirmation does not match",
    /**
     * Unknown message
     */
    UNKNOWN = "The :attribute is undefined"
}
/**
 * array mutation type
 */
type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift'
/**
 * make list with specific type and length
 */
export type List<T, L extends number, TO = [T, ...Array<T>]> = Pick<TO, Exclude<keyof TO, ArrayLengthMutationKeys>>
    & { readonly length: L, [I: number]: T, [Symbol.iterator]: () => IterableIterator<T> }
/**
 * validation schema
 */
export interface Schema {
    /**
     * required is a schema that indicates the value must exist not contain `undefined` | `""`. 
     * types required consist of `boolean` | `undefined` 
     * when this undefined then it is not required.
     * @example
     * ```javascript
     * Validator.make(request.body, { foo: { required: true } });
     * ```
     */
    required?: boolean
    /**
     * a type schema is a schema that specifies what type of data a value should be.
     * because types should be consistent, therefore types must be defined, cannot be undefined.
     * @example
     * ```javascript
     * Validator.make(request.body, { foo: { type: 'string' }});
     * ```
     */
    type: 'string' | 'number' | 'object' | 'array' | 'email' | 'date'
    /**
     * min is a schema that indicates the length of the value must be more than or equal to minimum, 
     * this schema consist of `number` | `undefined`. 
     * @example
     * ```javascript
     * Validator.make(request.body, { foo: { type: 'string', min: 8 }});
     * ```
     */
    min?: number
    /**
     * max is a schema that indicates the length of the value must be less than or equal to maximum, 
     * this schema similar to schema min.
     * @example
     * ```javascript
     * Validator.make(request.body, { foo: { type: 'string', max: 60 }});
     * ```
     */
    max?: number
    /**
     * before is a schema to ensure that the value must be less than before, so it is suitable for use on date types, 
     * this schema consist of `string` | `undefined`.
     * @example
     * ```javascript
     * Validator.make(request.body, { foo: { type: 'date', before: '2021-01-19' }});
     * ```
    */
    before?: string
    /**
     * after is a schema to ensure that the value must be more than after, this schema inverse of schema before.
     * @example
     * ```javascript
     * Validator.make(request.body, { foo: { type: 'date', after: '2021-01-19' }});
     * ```
    */
    after?: string
    /**
     * digits is a schema that indicates the length of the number must be equal, 
     * this schema consist of `number` | `undefined`.
     * @example
     * ```javascript
     * Validator.make(request.body, { foo: { type: 'number', digits: 10 }});
     * ```
     */
    digits?: number
    /**
     * (coming soon) size
     */
    size?: number
    /**
     * included is schema to ensures the value must be inside the inclusion. 
     * this schema consist of `any[]` | `undefined`.
     * @example
     * ```javascript
     * Validator.make(request.body, { foo: { type: 'number', in: [1, 2, 3, 4, 5] }});
     * ```
     */
    in?: any[]
    /**
     * not included is schema to ensures the value must be not inside the inclusion. 
     * this schema inverse of schema included.
     * @example
     * ```javascript
     * Validator.make(request.body, { 
     *    foo: { type: 'string',  notIn: ['Foo', 'Bar', 'Cat', 'Dog']}
     * });
     * ```
     */
    notIn?: any[]
    /**
     * between is a schema that ensures the value must be in between. this schema consist of `number[]` | `undefined` 
     * which when defined must contain 2 number min and max values.
     * @example
     * ```javascript
     * Validator.make(request.body, { foo: { type: 'number', between: [1, 10] }});
     * ```
     */
    between?: List<number, 2>
    /**
     * date between is a schema that ensures the value must be in between with date type. 
     * this schema consist of `string[]` | `undefined` 
     * which when defined must contain 2 date min and date max values with a format yyyy-MM-dd.
     * @example
     * ```javascript
     * Validator.make(request.body, { 
     *    foo: { type: 'date', dateBetween: ['2019-01-19', '2019-01-30'] }
     * });
     * ```
     */
    dateBetween?: List<string, 2>
    /**
     * digits between is a schema that ensures the value length of a number must be in between. 
     * this schema consist of `number[]` | `undefined` 
     * which when defined must contain 2 number min and max values.
     * @example
     * ```javascript
     * Validator.make(request.body, { 
     *    foo: { type: 'number', digitsBetween: [8, 12] }
     * });
     * ```
     */
    digitsBetween?: List<number, 2>
    /**
     * regex is a schema that ensures the value must match with regex, 
     * this schema consist of `any` | `undefined`.
     * @example
     * ```javascript
     * Validator.make(request.body, { 
     *   foo: { type: 'string', regex: /^\d{4}-\d{2}-\d{2}$/ }
     * });
     * ```
     */
    regex?: any
    /**
     * confirmed is a schema that ensures the value must match with target field. 
     * this schema consist of `boolean` | `undefined`
     * @example
     * ```javascript
     * Validator.make(request.body, { foo: { type: 'string', confirmed: true }});
     * ```
     * then the field with the name `foo_confirmation` must match with field `foo`.
     * 
     */
    confirmed?: boolean
    /**
     * custom is a schema that you have specified. 
     * where this scheme will return `Promise<void>` | `undefined`.
     * @example
     * ```js
     * custom: async (value) => {
     *   const user = await User.findOne({ where: { value } });
     *   if (user) throw new Error("your message");
     * }
     * ```
     * @returns Promise<void>
     */
    custom?: (value: any) => Promise<void>
}
/**
 * make all partial optional with specific or default value
 */
export type Type<T, L = keyof T> = { [P in keyof T]?: L }
/**
 * Schema validation
 */
export type ValidationSchema = Record<string, Schema>
/**
 * Custom message validation
 */
export type CustomMessage = Record<string, Type<Schema, string>>
