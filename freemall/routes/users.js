var express = require('express');
var router = express.Router();

var {newUser,getUser,userLogin} = require('../controller/users')

router.post('/register',(req,res)=>{
    let { username , password} = req.body
    let result = newUser(username,password)
    return result.then(data=>{
        res.send(data)
    })
})

router.get('/getUser/:username',(req,res)=>{
    let result = getUser(req.params.username)
    return result.then(data=>{
        if(data.username){
            res.send(true)
        }else{
            res.send(false)
        }
    })
})

router.post('/login',(req,res)=>{
    let {username,password} = req.body
    let result = userLogin(username,password)
    return result.then(data=>{
        if(data.username){
            req.session.username = data.username
            res.send(data)
        }else{
            res.send(false)
        }
    })
})

module.exports = router;
