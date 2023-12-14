import readline from "readline";
import Validator from "..";

const read = readline.createInterface({ input: process.stdin, output: process.stdout });
const input = (query: any) => new Promise((resolve) => read.question(query, resolve));

(async () => {
    start();

    const username = await input("username:");
    const email = await input("email:");
    const password = await input("password:");
    const body = { username, email, password }

    const validator = await Validator.make(body, {
        username: { required: true, type: 'string' },
        email: {
            required: true, type: 'email', custom: async (email) => {
                // make unique validation with schema custom
                // const user = await User.findOne({ where: { email } });
                // if (user) throw new Error('email already exists');
            }
        },
        password: {
            required: true, type: 'string', min: 8, max: 60,
            regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&.*]).{8,}$/
        }
    }, { // customize message 
        password: {
            regex: "The :attribute must contain at least one uppercase, number, and special character."
        }
    });

    if (!validator.validate()) console.error(validator.errors());
    else console.log("valid");

    read.close();
})();

read.on("exit", () => process.exit(0));

function start() { console.clear(); }