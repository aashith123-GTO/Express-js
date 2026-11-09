require("dotenv").config();
const express=require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const app=express();

app.use(express.json());
const PORT=process.env.PORT || 3000;

let users=[]
let refreshTokens=[]

app.post("/register",async (req,res)=>{
    const {username,email,password}=req.body;
    
    if(!username || !email || !password){
        res.status(400).send("username email and password are required");
        return;
    }
    const findUser=users.find((user)=>user.email===email);
    if(findUser){
        res.status(409).send("email already exists");
        return;
    }
    const hashedPassword=await bcrypt.hash(password,12);
    users.push({id:Date.now(),username,email,password:hashedPassword});
    res.status(201).send("user registered successfully");
})

app.post("/login",async(req,res)=>{
    const {username,email,password}=req.body;
    if(!email || !password){
        res.status(400).send(" email and password are required");
        return;
    }
    const findUser=users.find((user)=>user.email===email);
    if(!findUser){
        res.status(404).send("user not found");
        return;
    }
    const passwordVerify=await bcrypt.compare(password,findUser.password);
    if(!passwordVerify){
        res.status(401).send("invalid password");
        return;
    }

    const accessToken=jwt.sign({userID:findUser.id},process.env.JWT_SECRET,{expiresIn:"15m",algorithm:"HS256"});

    const refreshToken=jwt.sign({userID:findUser.id},process.env.JWT2_SECRET,{expiresIn:"7d",algorithm:"HS256"});

refreshTokens.push({
    userID: findUser.id,
    token: refreshToken
});
return res.status(200).json({
    message: "Login successful",
    accessToken,
    refreshToken
});
});


const authentication=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message:"Authorization header is missing"
        });

    }

    const token=authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"Token is missing"
        });
    }
    let decoded;
    try{
    decoded=jwt.verify(token,process.env.JWT_SECRET,{
        algorithms:["HS256"]
    })
    req.user=decoded;
}catch(err){
    return res.status(401).json({
        message:"Invalid token"
    });
}
    next();
    
}


app.get("/profile",authentication,(req,res)=>{
    return res.status(200).json({
        message:"Profile data",
        user:req.user
    })
})




app.post("/refresh-token",(req,res)=>{
    const {refreshToken}=req.body;
    if(!refreshToken){
        return res.status(400).json({
            message:"Refresh token is required"
        });
    }
    let tokenVerify;
    
    try{
        tokenVerify=jwt.verify(refreshToken,process.env.JWT2_SECRET,{
            algorithms:["HS256"]
        })
    }catch(err){
        return res.status(401).json({
            message:"Invalid refresh token"
        });
    }
    const storedToken=refreshTokens.find((token)=>token.token===refreshToken);
    if(!storedToken || storedToken.userID!==tokenVerify.userID){
        return res.status(401).json({
            message:"Refresh token not found"
        })
    }
    const accessToken=jwt.sign({userID:tokenVerify.userID},process.env.JWT_SECRET,{expiresIn:"15m",algorithm:"HS256"});

    refreshTokens=refreshTokens.filter((token)=>token.token!==refreshToken);

    const newRefreshToken=jwt.sign({userID:tokenVerify.userID},process.env.JWT2_SECRET,{expiresIn:"7d",algorithm:"HS256"});

    refreshTokens.push({
        userID: tokenVerify.userID,
        token: newRefreshToken
    });
    
    return res.status(200).json({
        message:"Access token generated successfully",
        accessToken,
        refreshToken: newRefreshToken
    })


 
});

app.post("/logout",(req,res)=>{
    const {refreshToken}=req.body;

    if(!refreshToken){
        return res.status(400).json({
            message:"Refresh token is required"
        });
    }

    const tokenExists=refreshTokens.find(
        (token)=>token.token===refreshToken
    );

    if(!tokenExists){
        return res.status(401).json({
            message:"Refresh token not found or already revoked"
        });
    }

    refreshTokens=refreshTokens.filter(
        (token)=>token.token!==refreshToken
    );

    return res.status(200).json({
        message:"Logged out successfully"
    });
});

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})