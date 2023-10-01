## Introduction

<b>privy-validator</b> is validator request, building for express. it can work in middleware or your function like a controllers.<br/>
This was inspired by the laravel validator, but the laravel validator is much better, only slightly similar.

## Contents List
- [Installation](#installation)
- [Schema](#schema)
    - [Required](#required)
    - [Type](#type)
    - [Min](#min)
    - [Max](#max)
    - [Digits](#digits)
    - [Before](#before)
    - [After](#after)
    - [Included](#included)
    - [Not included](#not-included)
    - [Between](#between)
    - [Date between](#date-between)
    - [Digits between](#digits-between)
    - [Regex](#regex)
    - [Confirmed](#confirmed)
    - [Custom](#custom)
- [Customize message](#customize-message)
- [Example usage](#example-usage)
    - [Middleware](#middleware)
    - [Controller](#controller)

<br/><br/>

## Installation
```bash
npm install privy-validator
```
Common JS
```javascript
const Validator = require("privy-validator").default;
```
ES modules
```javascript
import Validator from 'privy-validator';
```
<br/><br/>

## Schema
Here is a list of schemas that are currently available

### Required
schema required is a schema that indicates the value must exist not contain `undefined` | `""`. types required consist of `boolean` | `undefined` when this undefined then it is not required. Here's the usage required :
```javascript
Validator.make(request.body, { foo: { required: true } });
```

### Type
a type schema is a schema that specifies what type of data a value should be, for now schema types consist of
```javascript
type: 'string' | 'number' | 'object' | 'array' | 'email' | 'date'
```
because types should be consistent, therefore types must be defined, cannot be undefined. Here's the usage type :
```javascript
Validator.make(request.body, { foo: { type: 'string' } });
```

### Min
schema min is a schema that indicates the length of the value must be more than or equal to minimum, this schema consist of `number` | `undefined`. Here's the usage min :
```javascript
Validator.make(request.body, { foo: { type: 'string', min: 8 } });
```
because min calculates from its length, then can work well when type `string` | `array`.

### Max
schema max is a schema that indicates the length of the value must be less than or equal to maximum, this schema similar to schema min. Here's the usage max :
```javascript
Validator.make(request.body, { foo: { type: 'string', max: 60 } });
```

### Digits
schema digits is a schema that indicates the length of the number must be equal, this schema consist of `number` | `undefined`. Here's the usage digits :
```javascript
Validator.make(request.body, { foo: { type: 'number', digits: 10 } });
```

### Before
schema before is a schema to ensure that the value must be less than before, so it is suitable for use on date types, this schema consist of `string` | `undefined`. Here's the usage before :
```javascript
Validator.make(request.body, { foo: { type: 'date', before: '2021-01-19' } });
```
then the valid value for the case is less than 2021-01-19, note make sure the date format should be <b>yyyy-MM-dd</b>.

### After
schema after is a schema to ensure that the value must be more than after, this schema inverse of schema before, Here's the usage after :
```javascript
Validator.make(request.body, { foo: { type: 'date', after: '2021-01-19' } });
```
then the valid value for the case is more than 2021-01-19.

### Included
schema included is schema to ensures the value must be inside the inclusion. this schema consist of `any[]` | `undefined`. Here's the usage included :
```javascript
Validator.make(request.body, { foo: { type: 'number', in: [1, 2, 3, 4, 5] } });
```
when the value is not in the inclusion is considered invalid.

### Not included
schema not included is schema to ensures the value must be not inside the inclusion. this schema inverse of schema included. Here's the usage not included :
```javascript
Validator.make(request.body, { foo: { type: 'string', notIn: ['Foo', 'Bar', 'Cat', 'Dog'] } });
```
when the value is on inclusion is considered invalid.

### Between
schema between is a schema that ensures the value must be in between. this schema consist of `number[]` | `undefined` which when defined must contain 2 number min and max values, Here's the usage between :
```javascript
Validator.make(request.body, { foo: { type: 'number', between: [1, 10] } });
```
then a valid value is between 1 - 10.


### Date between
schema date between is a schema that ensures the value must be in between with date type. this schema consist of `string[]` | `undefined` which when defined must contain 2 date min and date max values with a format yyyy-MM-dd. Here's the usage date between :
```javascript
Validator.make(request.body, { foo: { type: 'date', dateBetween: ['2019-01-19', '2019-01-30'] } });
```
then the valid date is between 2019-01-19 to 2019-01-30.


### Digits between
schema digits between is a schema that ensures the value length of a number must be in between. this schema consist of `number[]` | `undefined` which when defined must contain 2 number min and max values. Here's the usage digits between :
```javascript
Validator.make(request.body, { foo: { type: 'number', digitsBetween: [8, 12] } });
```
then the number length of a value must be between 8 to 12 digits.

### Regex
schema regex is a schema that ensures the value must match with regex, this schema consist of `any` | `undefined`. Here's the usage regex :
```javascript
Validator.make(request.body, { foo: { type: 'string', regex: /^\d{4}-\d{2}-\d{2}$/ } });
```
this schema can be used to validate phone numbers, passwords, etc. note regex can run properly when without quotes.

### Confirmed
schema confirmed is a schema that ensures the value must match with target field. this schema consist of `boolean` | `undefined`. Here's the usage confirmed :
```javascript
Validator.make(request.body, { foo: { type: 'string', confirmed: true } });
```
then the field with the name `foo_confirmation` must match with field `foo`.

### Custom
schema custom is a schema that you have specified. where this scheme will return `Promise<void>` | `undefined`. Here's the usage custom :
```javascript
Validator.make(request.body, { foo: { type: 'string', custom: async (value) => {
    // here you can specify the code
}}});
```
a catch-block container is provided, so you can throw an error when the value is invalid. If you're still confused, I'll give another example.
```javascript
Validator.make(request.body, { foo: { type: 'string', custom: async (value) => {
    const find = await Foo.findOne({ where: { bar: value }});
    if (!find) throw new Error('your error message');
}}});
```
i hope you can use these schema custom to replace schema that are not yet or not available.
<br/><br/><br/>

## Customize message
If the given error message is not suitable, you can customize the message according to your needs. Here's is an example :

```javascript
Validator.make(request.body, { /** validation schema */ }, {
    foo: {
        required: "The :attribute must be required",
    }
});
```
`:attribute` will be replaced with the field name.<br/><br/>

```javascript
Validator.make(request.body, { /** validation schema */ }, {
    foo: {
        type: "The :attribute must be valid :type",
    }
});
```
`:type` will be replaced with the type target.<br/><br/>

```javascript
Validator.make(request.body, { /** validation schema */ }, {
    foo: {
        min: "The :attribute must be minimum :min characters",
    }
});
```
`:min` will be replaced with the minimum target.<br/><br/>

```javascript
Validator.make(request.body, { /** validation schema */ }, {
    foo: {
        max: "The :attribute must be maximum :max characters",
    }
});
```
`:max` will be replaced with the maximum target.<br/><br/>

```javascript
Validator.make(request.body, { /** validation schema */ }, {
    foo: {
        between: "The :attribute must be between :min - :max",
    }
});
```
for between are usually available `:min` and `:max`. including date between and digits between.<br/><br/>

and the following for descriptions of all available : <br/><br/>
`:attribute` will be replaced with the field name.<br/><br/>
`:type` will be replaced with the type target.<br/><br/>
`:min` will be replaced with the minimum target.<br/><br/>
`:max` will be replaced with the maximum target.<br/><br/>
`:digit` will be replaced with the digits target.<br/><br/>
`:before` will be replaced with the before target.<br/><br/>
`:after` will be replaced with the after target.<br/><br/>
`:value` will be replaced with the target value, like a array/object will usually use this.
<br/><br/><br/>


## Example usage
its use you can use it as middleware or on function such as controller. Here is an example of its use below.

### Middleware
- Asynchronous
```javascript
async function foo_middleware(request, response, next) {
    const validator = await Validator.make(request.body, {
        foo: { required: true, type: 'string' },
        bar: { required: true, type: 'string', min:8, max: 60 }
    });

    if (!validator.validate()) {
        return response.status(400).json({ errors: validator.errors() });
    }
    next();
}

app.post('/foo', foo_middleware, /** your next function/ controllers */);
```
<br/>

- Synchronous 
```javascript
function bar_middleware(request, response, next) {
    Validator.make(request.body, {
        foo: { required: true, type: 'string' },
        bar: { required: true, type: 'string', min:8, max: 60 }
    }).then((result) => {
        if(!result.validate()) {
            return response.status(400).json({ errors: result.errors() });
        }
        next();
    });
}

app.post('/bar', bar_middleware, /** your next function/ controllers */);
```
<br/>


### Controller
this time I would like to give a real example such as a register new user.
```javascript
app.post('/register', async (request, response) => {
    const validator = await Validator.make(request.body, {
        username: { required: true, type: 'string' },
        email: { required: true, type: 'email', custom: async (email) => {
            // make unique validation with schema custom
            const user = await User.findOne({ where: { email }});
            if(user) throw new Error('email already exists');
        }},
        password: {
            required: true, type: 'string', min:8, max: 60,
            regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&.*]).{8,}$/
        }
    }, { // customize message 
        password: {
            regex: "The :attribute must contain at least one uppercase, number, and special character." 
        }
    });

    // checking validation status
    if (!validator.validate()) {
        return response.status(400).json({ errors: validator.errors() });
    }

    // create a new user here...
});
```
##
[![Downloads](https://badgen.net/npm/dt/privy-validator)](https://www.npmjs.com/package/privy-validator)


