var express = require('express');
var router = express.Router();

var {getList,getDetail,getSearch,getAll} = require('../controller/product')
/* GET home page. */

router.get('/index', function(req, res, next) {
    let result = getList()
    console.log(result)
    return result.then(data=>{
        data.bb= "1"
        res.send(data)
    })
});

router.get('/detail',function(req,res){
    let lid = req.query.lid
    let result = getDetail(lid)
    return result.then(data=>{
        res.send(data)
    })

});

// search
router.get('/search',function(req,res){
    let val = req.query.val || ''
    console.log(req.query.val)
    let result =getSearch(val)
    return result.then(data=>{
        res.send(data)
    })
})
 
router.get('/all',function(req,res){
    let pno = req.query.pno - 1
    let pSize = req.query.pSize || 8
    pno = pno*pSize
    let result = getAll(pno,pSize)
    return result.then(data=>{
        res.send(data)
    })
})

module.exports = router;
