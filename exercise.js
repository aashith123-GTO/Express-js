const express=require("express");
const app=express();
const validationMiddleware=(req,res,next)=>{
    const {name}=req.query;
    if(!name){
        res.status(401).send("Name not found");
        return;
    }
    next();
}


app.get("/user",validationMiddleware,(req,res)=>{
    res.send(`Hello, ${req.query.name}!`);
});


app.listen(3000,()=>{
    console.log("Server is running on the port 3000");
})