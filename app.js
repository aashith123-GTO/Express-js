const express = require("express");

const app = express();

const users = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" }
];

app.get("/", (req, res) => {
    res.send("Express Practice API");
});

app.get("/about", (req, res) => {
    res.send("This is about page");
});

app.get("/users", (req, res) => {
    const { name } = req.query;

    if (name) {
        const filteredUsers = users.filter(user => user.name === name);

        res.json(filteredUsers);
        return;
    }

    res.json(users);
});

app.get("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const user = users.find(u => u.id === id);

    if (!user) {
        res.status(404).send("User not found");
        return;
    }

    res.json(user);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});