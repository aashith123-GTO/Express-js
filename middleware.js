const express=require('express');
const app=express()
app.use((req,res,next)=>{
    console.log(`Middleware is running ${req.method} and ${req.url}`);
    next();
});


app.get("/", (req, res) => {
    res.send("Express Practice Api");
});

app.get("/about", (req, res)=>{
    res.send("This is about page");
})

app.listen(3000,()=>{
    console.log("Server is running on the port 3000");
})