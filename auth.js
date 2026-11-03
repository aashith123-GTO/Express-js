require("dotenv").config();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const express=require("express");
const app=express();

app.use(express.json());
const user=[]

app.post("/register",async (req,res)=>{
    const {email,password}=req.body
  
    if(!email || !password){
        res.status(400).send("email and password are requred");
        return;
    }
    const existingEmail=user.find((user)=>user.email===email);
    if(existingEmail){
        res.status(409).send("email already exists");
        return;
    }
    const storedPassword=await bcrypt.hash(password,12);
    user.push({email,password:storedPassword});
    res.status(201).send("user registered sucessfully");
    console.log(user);
});




app.post("/login",async (req,res)=>{
    const {email,password}=req.body;
    const findUser=user.find((user)=>user.email===email);
    if(!email || !password){
        res.status(401).send("email and password are required");
        return;
    }
    if(!findUser){
        res.status(404).send("user not found");
        return;
    }

    const passwordMatch=await bcrypt.compare(password,findUser.password);
    if(!passwordMatch){
        res.status(401).send("invalid password");
        return;
    }
    const token=jwt.sign({email: findUser.email},process.env.JWT_SECRET,{
        expiresIn:"15m",
        algorithm:"HS256"
    });


    console.log(findUser);
    res.json({
    message: "Login successful",
    token: token
});
})

const authentication = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
        res.status(401).send("authorization header is missing");
        return;
    }

    const tokenSplit = authHeader.split(" ");
    const token = tokenSplit[1];

    if (tokenSplit[0] !== "Bearer" || !token) {
        res.status(400).send("Request rejected");
        return;
    }

    try {
        const tokenVerify = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"]
        });
        
        req.user = tokenVerify;
    } catch (error) {
        console.log(error.name);
        console.log(error.message);
        res.status(401).send("Invalid or expired token");
        return;
    }
    next();
}

app.get("/profile",authentication,(req,res)=>{
    res.json({
        message:"Welcome to your profile",
        user:req.user
    })
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})


