
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");


const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');


mongoose.connect("mongodb://0.0.0.0/userDB");

const userSchema=new mongoose.Schema({
    username:String,
    password:String
})

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/login",function(req,res){
    res.render("login");
});



app.post("/register",function(req,res){
    const email=req.body.username;
    const password=req.body.password;
    const user=new User({
        username:email,
        password:password
    });
    user.save();
    res.render("secrets");
})


app.post("/login",function(req,res){
    const email=req.body.username;
    const password=req.body.password;
    User.findOne({username:email})
    .then(function(findUser){
        if(findUser.password===password){
            res.render("secrets");
        }
    })
})








app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  
