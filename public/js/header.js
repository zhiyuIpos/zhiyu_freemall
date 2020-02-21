$(document).ready(function(){
    new Promise((resolve,reject)=>{
        // 加载头部，还加载用户的购物车
        $.ajax({
            url : '/header.html',
            type : 'get',
            success : function(result){
                $('#header').replaceWith(result)
                let isContent = $('.header').next().hasClass('content-cart') || $('.header').next().hasClass('content-user')
                let search = $('.header').next().hasClass('search-content')
                if(isContent){
                    $('.header').find('.header-nav').replaceWith("")
                }
                if(search){
                    $('.header-nav').find('.nav-default').html(`
                    <li><a href="index.html">首页</a></li>
                    <li><a href="javascript:;">·&nbsp;&nbsp;搜索结果&nbsp;&nbsp;·</a></li>
                    <li><a href="#">共搜索到${JSON.parse(sessionStorage.getItem('search')).length}款产品</a></li>
                    `)                   
                }
                // let session_user = isNaN(sessionStorage.getItem("username")) ? sessionStorage.getItem("username")  : 123
                let session_user = sessionStorage.getItem("username") ? sessionStorage.getItem('username') : "123"
                // 判断localStorage里面有没有数据，如果有数据就加载上去
                let results= JSON.parse(localStorage.getItem(session_user)) || []
                let $car = $('.cars')
                let $list = $('.list')                                                                       
                let $total =$('.total')
                let $sum=$('.sum')
                let $count =$('.count')
                let el =true
                // 函数 用于重构购物车
                $('<link rel="stylesheet" href="../css/header.css">').appendTo('head')
                $('<link rel="stylesheet" href="../iconfont/iconfont.css">').appendTo('head')
                function head(){
                    $list.html("")
                    let count=0 ,sum=0
                    $(results).each((i,ele)=>{
                        count+= ele.counts
                        sum+=ele.counts*ele.price
                            $list.append(`
                            <div class="car-list" data-pid="${ele.pid}">
                                <div class="car-list-img"><img src="${ele.img}" alt=""></div>
                                <div class="car-list-content cart-list">
                                    <p class="title">${ele.title}</p>
                                    <div>
                                        <span class="price">¥${ele.price}</span>  
                                        <label class="counts">${ele.counts}</label>
                                    </div>
                                </div>
                                <span id="close_count">&times;</span>
                            </div>`
                            )
                    })
                    if(count!=0){
                        $total.html(count)
                        $count.addClass('red')
                        $sum.html(`¥${sum.toFixed(2)}`)
                    }else{
                        $total.html(0)
                        $count.removeClass('red')
                        $car.removeClass('car-go')
                    } 
                }
                
                // 判断是否有值，如果有值就就执行添加class，并且调用head函数，重hui购物车
                if(results[0]){
                    $car.addClass('car-go')
                    head(results)
                    // 删除商品
                    $list.off("click","#close_count")
                    $list.on("click","#close_count",function (e){
                        e.preventDefault()
                        let $close = $(e.target)
                        let $val = $close.parent().attr('data-pid')
                        // 循环遍历，看看results里面是否已经有当前删除的商品pid，如果有就删除掉该商品
                        for(var ele in results){
                            if(results[ele].pid == $val){
                                results.splice(ele,1)
                                // 重新为 localStorage设置值
                                localStorage.setItem(session_user,JSON.stringify(results))
                                results= JSON.parse(localStorage.getItem(session_user)) || []
                                // 调用head函数，重新描绘购物车
                                head()                  
                                // $('<script src="js/cart.js"></script>').appendTo('head')
                            }
                        }
                    }) 
                }else{
                    head()
                }
                $('<link rel="stylesheet" href="../css/header.css">').appendTo('head')
                $('<link rel="stylesheet" href="../iconfont/iconfont.css">').appendTo('head')
                resolve(isContent)
            }    
        })
    }).then((isContent)=>{  
        //加载头部的用户信息 
        return new Promise((resolve,reject)=>{
            // 判断sessionStorage里面有没有数据，如果有，就再box后面添加数据
        let $hide =$('.hide')
        if(sessionStorage.getItem("username")){
            $hide.html("")
            $hide.append(`
            <div class="box-triangle"></div>
            <div class="user">
                <div class="user-img"><img src="images/Businesswoman.png" alt=""></div>
                <h6>${sessionStorage.getItem("username")}</h6>
                <ul >
                    <li><a href="javascript:;">我的订单</a></li>
                    <li><a href="javascript:;">账号资料</a></li>
                    <li><a href="javascript:;">收货地址</a></li>
                    <li><a href="javascript:;">售后服务</a></li>
                    <li><a href="javascript:;">我的优惠</a></li>
                    <li><a href="javascript:;" id="close_user">退出</a></li>
                </ul>
            </div>
            `)
        }
        
        // 退出清除sessionStorage
        let $close_user =$('#close_user')
        $close_user.click(function(){
            location.replace("index.html")
            sessionStorage.removeItem("username")
            $hide.replaceWith("")
        })
        // 滚轮
        if(!isContent){
            let s_top = document.getElementById('s_top');
            let nav = document.querySelector('.header-nav')
            let nav_down = document.querySelector('.nav')
            document.onscroll=function(){
            if(window.scrollY >= s_top.clientHeight){
                nav.className = 'header-nav header-fixed'
                nav_down.className = 'nav nav-down'
            }else{
                nav.className = 'header-nav'
                nav_down.className = 'nav'
            }
         }
        }
        resolve()  
        })    
    }).then(()=>{
        // 搜索框
        let $search = $('.search')
        let $search_btn=$search.children('button')
        let $search_val = $search.children('input')
        $search_btn.click(function(){
            let val = $search_val.val()
            if(val){
                $.ajax({
                    url:'/api/product/search',
                    data :{
                        val
                    },
                    type : 'get',
                    dataType : 'json',
                    success:function(res){
                        window.open('search.html',"_self")
                        sessionStorage.setItem('search',JSON.stringify(res))
                    }
                })
            }
        })

        // 点击的时候判断是否有sessionStorage,如果有就跳转到用户界面
        // 如果没有就跳转到登录界面
        let $user = $('.user')
        $user.click(function(){
            if(sessionStorage.getItem('username')){
                window.open('user.html','_self')
            }else{
                window.open('login.html',"_self")
            }
        })
        
        // 去购物车
        let $goCart = $('.goCart')
        $goCart.click(function(){
            let username = sessionStorage.getItem('username')
            console.log("username",username) 
            if(username){
                window.open('cart.html',"_self")
            }else{
                window.open('login.html','_self')
            }
        })
    }) 
})