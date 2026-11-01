require("dotenv").config();
const jwt=require("jsonwebtoken");
const express=require("express");
const user={userId:101,role:"user"};
const token=jwt.sign(user,process.env.JWT_SECRET,{
    expiresIn:"15m",
    algorithm:"HS256"
});


const decoded=jwt.verify(token,process.env.JWT_SECRET,{
    algorithm:["HS256"]
});
console.log(token);
console.log(decoded);
