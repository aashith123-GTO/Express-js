const express=require("express");
const app=express();
const validationMiddleware=(req,res,next)=>{
    const {name}=Number(req.query.name);
    if(!name){
        const err=new Error("Name is required");
        next(err);
    }
     if(name){
        next();
     }
    }
    
app.get("/user",validationMiddleware,(req,res)=>{
    res.send(`Hello, ${req.query.name}!`);
   
});

app.use((err,req,res,next)=>{
    console.log(err);
    res.status(401).send("Something went wrong");
});

app.listen(3000,()=>{
    console.log("Server is running on the port 3000");
})