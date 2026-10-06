const express = require("express");
const app = express();

const validation = (req, res, next) => {
    const { name } = req.query;

    if (!name) {
        const err = new Error("Name is required");
        err.statusCode = 400;
        return next(err);
    }

    if (!/^[A-Za-z]+$/.test(name)) {
        const err = new Error("Name must contain only letters");
        err.statusCode = 400;
        return next(err);
    }

    next();
};

app.get("/user", validation, (req, res) => {
    res.send(`Hello ${req.query.name}`);
});

app.use((err, req, res, next) => {
    console.log("ERROR OBJECT:", err);
    console.log("STATUS CODE:", err.statusCode);
    console.log("MESSAGE:", err.message);

    res.status(err.statusCode).send(err.message);
});

app.listen(3000, () => {
    console.log("Server is running on the port 3000");
});