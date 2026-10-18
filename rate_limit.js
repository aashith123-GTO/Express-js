const express=require("express");
const rateLimit=require("express-rate-limit");
const app=express();

const limit=rateLimit(
    {
        windowMs:60*1000,
        limit:5,
        message:{
            success:false,
            message:"To many requests"
        }
    }
);
app.get("/practice",limit,(req,res)=>{
    res.json({
        success:true,
        message:"Request successfull"
    })
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})
