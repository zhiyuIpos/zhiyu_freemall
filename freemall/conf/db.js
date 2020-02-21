const env = process.env.NODE_ENV


let MYSQL_CONF 
let REDIS_CONF

// 本地测试环境
if(env === 'dev'){
    MYSQL_CONF={
        host:'127.0.0.1',
        port:3306,
        user:'root',
        password : '',
        database : 'myMall',
        connectionLimit:15
    },
    REDIS_CONF={
        port: 6379,
        host:'127.0.0.1'
    }
}

// 线上环境
if(env === 'prd'){
    MYSQL_CONF ={

    },
    REDIS_CONF={

    }
}

module.exports = {MYSQL_CONF , REDIS_CONF}