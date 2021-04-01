const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User=mongoose.model("User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');

/*
router.get('/',(req,res)=>{
    res.send("hello");
});
*/
// creating middleware to verify token
// run only when user logged in


router.post('/signup',(req,res)=>{
    console.log(req.body.name);
    const {name,email,password,pic}=req.body;
    if(!email || !name || !password)
    {
        return res.status(422).json({error : "please add all the fields"});
    }

    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already exist with this email id"});
        }

        bcrypt.hash(password,12)
        .then(hashedPassword=>{    
            const user = new User({
                email,
                name,
                password:hashedPassword,
                pic
            });

            user.save()
            .then(user=>{
                res.json({message:"saved successfully"});
            }).catch(err=>{
                console.log(err);
            })
        }).catch()


    }).catch(err=>{
        console.log(err);
    });
   
});

router.post('/login',(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password)
    {
        return res.status(422).json({error:"plz add email or password"});
    }

    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser)
        {
            return res.status(422).json({error:"Invalid email or password"});
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch)
            {
               // res.json({message:"successfully signed in"});
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET); // JWT imp
                const {_id,name,email,followers,following,pic} = savedUser;
                res.json({token,user:{_id,name,email,followers,following,pic}}); 
            }
            else{
                return res.status(422).json({error:"wrong password"}); 
            }
        }).catch(err=>{
            console.log(err);
        })

    }).catch(  );


});


module.exports = router;