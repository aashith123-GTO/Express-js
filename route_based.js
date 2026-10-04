const express=require("express");
const app=express();
const checkMiddleWare=(req,res,next)=>{
    console.log(`Middleware is running ${req.method} and  ${req.url}`);
    next();
}


app.get("/",checkMiddleWare,(req,res)=>{
    res.send("Middleware is working");
})


app.get("/about", checkMiddleWare,(req, res)=>{
    res.send("This is about middleware page");
})

app.listen(3000,()=>{
    console.log("Server is running on the port 3000");
})