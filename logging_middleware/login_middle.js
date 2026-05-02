const axios = require("axios");

const LOG_API = "http://20.207.122.201/evaluation-service/logs";

const validStacks = ["backend", "frontend"];
const validLevels = ["debug", "info", "warn", "error", "fatal"];

async function Log(stack, level, pkg, message) {
    try {
        stack = stack.toLowerCase();
        level = level.toLowerCase();
        pkg = pkg.toLowerCase();

        if (!validStacks.includes(stack) || !validLevels.includes(level)) {
            console.log("Invalid Credentials");
            return;
        }

        const res = await axios.post(LOG_API, {
            stack,
            level,
            package: pkg,
            message
        });

        console.log("Logging successful:", res.data);

    } catch (err) {
        console.log("Logging failed:", err.message);
    }
}

module.exports = Log;