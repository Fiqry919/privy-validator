import readline from "readline";
import Validator from "..";

const read = readline.createInterface({ input: process.stdin, output: process.stdout });
const input = (query: any) => new Promise((resolve) => read.question(query, resolve));

(async () => {
    start();

    const foo: any = await input("foo:");
    const bar: any = await input("bar:");
    const body: any = { foo, bar }

    const validator = await Validator.make(body, {
        foo: { required: true, type: "number", digits: 4 },
        bar: {
            required: true, type: "string", min: 8,
            regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&.*]).{8,}$/,
        },
    });

    if (!validator.validate()) console.error(validator.errors());
    else console.log("valid");

    read.close();
})();

read.on("exit", () => process.exit(0));

function start() { console.clear(); }