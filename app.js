const express = require("express");

const app = express();
app.use(express.json());
let users = [
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


app.post("/users", (req, res)=>{
    const {name}=req.body;
    if(!name){
        res.status(400).send("Name is required");
        return;
    }
    const newUser ={id: users.length + 1, name};
    users.push(newUser);
    res.status(201).json(newUser);
})


app.put("/users/:id", (req, res)=>{
    const id=Number(req.params.id);
    const {name}=req.body;
    const user=users.find(u=>u.id===id);
    if(!user){
        res.status(404).send("User not found");
        return;
    }
    if(!name){
        res.status(404).send("name is required");
        return;
    }
            user.name=name;
            res.json(user);
        })

app.delete("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const user = users.find(u => u.id === id);

    if (!user) {
        res.status(404).send("User not found");
        return;
    }

    users = users.filter(u => u.id !== id);

    res.status(200).send("User deleted successfully");
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});