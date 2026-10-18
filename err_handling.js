const express=require("express");
const app=express()
app.get("/practice",(req,res,next)=>{
    const err=new Error("Practice Error Occurred");
    err.statusCode=400
    next(err)

})
app.use((req,res,next)=>{
    const err=new Error("Route not found");
    err.statusCode=404;
    next(err);
})

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode;
    res.status(statusCode).json({
        sucess:false,
        message:err.message
    })
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});