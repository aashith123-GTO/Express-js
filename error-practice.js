const express=require("express")
const app=express()
const port=3000
const users=[{id:1,name:"Aashith"},{id:2,name:"Gintoki"}]
const validation = (req, res, next) => {
    const id = Number(req.params.id);

    const user = users.find(u => u.id === id);

    if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;

        return next(err);
    }

    req.user = user;
    next();
};

app.get("/user/:id", validation, (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user
    });
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});