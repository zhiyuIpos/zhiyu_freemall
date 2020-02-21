const {exec} = require('../db/mysql')
const getList = ()=>{
    let sql = `select * from product`
    return exec(sql).then(data=>{
        return data
    })
}

const getDetail = (id)=>{
    let sql =`select * from product_detail where lid=${id}`
    var result={}
    return exec(sql).then(data=>{
        result.list=data[0]
        return data[0]
    })
    .then(data=>{
        let id = result.list.lid
        let sql =`select * from product_imgs where lid=${id}`
        return exec(sql)
    })
    .then(data=>{
        result.imgs = data
        return result
    })
    .catch(err=>{
        console.log(err)
    })

}

// search
const getSearch=(val)=>{
    let sql =  `select pid,img,title,sub_title,price,href from product where title like "%${val}%"`
    return exec(sql).then(data=>{
        return data
    })
}

// all

const getAll=(pno,pSize)=>{
    let sql =`select * from product LIMIT ${pno},${pSize}`
    return exec(sql).then(data=>{
        return data
    })
}
module.exports = {getList,getDetail,getSearch,getAll}