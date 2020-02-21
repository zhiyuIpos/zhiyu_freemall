const mysql = require('mysql')

// 引入配置
const {MYSQL_CONF} = require('../conf/db')
const pool = mysql.createPool(MYSQL_CONF)

function exec(sql){
    let promise = new Promise((resolve,reject)=>{
        pool.query(sql,(err,result)=>{
            if(err){
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise
}


module.exports = {exec}