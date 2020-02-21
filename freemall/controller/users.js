const {exec} = require('../db/mysql')
const newUser=(username,password)=>{
    let sql = `insert into users (username,password)values('${username}','${password}') `
    return exec(sql).then(data=>{
        return {insertId : data.insertId}
    })
}

const getUser=(username)=>{
    let sql  = `select username from users where username ='${username}'`
    return exec(sql).then(data=>{
        return data[0] || {}
    })
}

const userLogin =(username,password)=>{
    let sql =`select username,password from users where username='${username}' and password='${password}'`
    return exec(sql).then(data=>{
        return data[0] || {}
    })
}
module.exports = {newUser,getUser,userLogin}