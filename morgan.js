const express=require("express");
const morgan=require("morgan");
const crypto=require("crypto");
const app=express();
const port=3000;


app.use(morgan("dev"));
app.use(express.json());

app.use((req,res,next)=>{
    const ID=req.requestId=crypto.randomUUID();
    console.log(ID)
    const {name}=req.query;
    
    if(!name){
        res.status(400).send("name is required");
        return
    }
    next()
});
app.get("/user",(req,res)=>{

    res.json({name:req.query.name,reqestId:req.requestId})
})

app.listen(port,()=>{console.log("Server is Running on port",port)})