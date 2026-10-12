const express=require("express");
const morgan=require("morgan");
const crypto=require("crypto");
const app=express();
const port=3000;

const reqId=((req,res,next)=>{
    req.requestId=crypto.randomUUID();
    next();
    
})



morgan.token("id",(req)=>{
    return req.requestId
})
app.use(reqId)
app.use(morgan(":id :method :url :status :response-time ms"));
app.use(express.json());

const validation=((req,res,next)=>{
    
    
    const {name}=req.query;
    
    if(!name){
        res.status(400).send("name is required");
        return
    }
    next()
})


app.get("/user",validation,(req,res)=>{

    res.json({name:req.query.name,requestId:req.requestId})
})



app.listen(port,()=>{console.log("Server is Running on port",port)})