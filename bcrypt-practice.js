const bcrypt=require("bcrypt");
const express=require("express")
const app=express()
async function pass(){
const storedPassword=await bcrypt.hash("zoro123",12);
console.log(storedPassword);
const storedPassword2=await bcrypt.hash("zoro123",12);
console.log(storedPassword2)
const password=await bcrypt.compare("zoro123",storedPassword);
console.log(password);
const password2=await bcrypt.compare("sanji123",storedPassword2);
console.log(password2);
}

pass();
