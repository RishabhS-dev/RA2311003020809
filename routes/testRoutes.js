const express = require("express");
const router = express.Router();
const Log = require("../logging_middleware/login_middle.js");

router.get("/success", async (req, res) => {
    await Log("backend", "info", "route", "Success route hit");
    res.send("Success");
});

router.get("/error", async (req, res) => {
    await Log("backend", "error", "handler", "Something went wrong");
    res.send("Error");
});

router.get("/db", async (req, res) => {
    await Log("backend", "fatal", "db", "Database connection failed");
    res.send("Database Connection failed");
});

module.exports = router;