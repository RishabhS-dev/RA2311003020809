const express = require("express");
const app = express();

app.use(express.json());

const testRoutes = require("./routes/testRoutes");
const Log = require("./logging_middleware/login_middle.js");
const schedulerRoutes = require("./routes/schedulerRoutes");

app.use("/api", schedulerRoutes);
app.use("/test", testRoutes);
app.use(async (req, res, next) => {
    await Log("backend", "info", "middleware", `${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
