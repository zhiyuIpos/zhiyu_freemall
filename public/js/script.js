$(function(){

// storey
let timers , h, item
$(window).scroll(function(){
    // 获取当前滚动条的高度
    let top =$(document).scrollTop()
    let $storey = $('.storey')
    if(top > 100){
        $storey.css('display','block')
        $('.storey').off('click','div')
        $('.storey').on('click','div',function(e){
            let i = $(e.target).attr('data-i')
            let $block = $('.content').children('.content-block')
            if(i>=0){
                item = $block[i]
                goMove()
            }else{
                item = $('.header')
                goMove()
            }
        })
    }
})
function goMove(){
    timers = setInterval(move,0)
}

// 动画
function move(){
    //  h 表示当前元素距离顶部的距离
    h = $(item).offset().top
    let documentTop = $(document).scrollTop() //当前滚动条的距离
    // 如果当前滚动条的距离大于，元素距离顶部的距离，就往上滚
    if(h < documentTop){
        documentTop -=10
        if(documentTop <= h){
            clearInterval(timers)
            return
        }
    }else{
        documentTop +=10
        if(documentTop >= h){  
            clearInterval(timers)
            return
        }
    }
    $(document).scrollTop(documentTop)
}

let banner = document.getElementById('banner')
let main = document.getElementById('main')
let nav = document.getElementsByClassName('circle')[0]
let circle = nav.getElementsByTagName('li')
let timerId = null,index=0
banner.onmouseover=function(){
    clearInterval(timerId)
}
banner.onmouseout=function(){
    timerId = setInterval(scorll,2000)
}
banner.onmouseout()
function scorll(){
    if(index == main.children.length -1){
        index=0;
        main.style.left = '0px'
    }
    index++
    // 调用移动动画
    animateMove(main,-index*banner.offsetWidth,6)
    changeIcon()
}
function animateMove(obj,target,speed){
clearInterval(obj.timeId);  //每次执行动画先清除原有的定时器
obj.timeId=setInterval(function () {
    var currentLeft=obj.offsetLeft; //获取当前位置
    var isLeft=currentLeft>target?true:false;   //是否往左走
    if(isLeft){
        currentLeft-=10;    //往左走
    }else{
        currentLeft+=10;    //往右走
    }
    if(isLeft?currentLeft>target:currentLeft<target){
        obj.style.left=currentLeft+"px";  //如果当前位置不是在目标位置则进行位置处理
    }else{
        clearInterval(obj.timeId);
        obj.style.left=target+"px";
    }
},speed);

}

for(let j=0;j<circle.length;j++){
    circle[j].onclick=function(){
        index=j
        if(index == main.children.length -1){
            index=0;
            main.style.left = '0px'
        }
        // 调用移动动画
        animateMove(main,-index*banner.offsetWidth,6)
        changeIcon()
    }
}
function changeIcon(){
    for(let i=0;i<circle.length;i++){
        circle[i].className=""
    }
    index < circle.length ?circle[index].className ='circle-active':circle[0].className ='circle-active'
}





new Promise((resolve,reject)=>{
    $.ajax({
    url : '/api/product/index',
    type : 'get',
    dataType : 'json',
    success : function(result){
        let $block = $('#block')
        let $block1=$('#block1')
        console.log(result)
        // 官方精品
        let g_result = result.slice(0,7)
        $(g_result).each((index,ele)=>{
                if(ele.carefull == 0){
                    $block.prepend(`<div class="block-item"><a href="${ele.href}"><img src="${ele.img}" alt=""></a>
                        </div>
                        `  
                    )
                }else{
                    $block.append(
                        `<div class="block-item">
                        <img src="${ele.img}" alt="">
                        <h3>${ele.title}</h3>
                        <h4>${ele.sub_title}</h4>
                        <div>
                            <label>¥${ele.price.toFixed(2)}</label>    
                            <p class="show">
                                    <a href="${ele.href}">查看详情</a>
                                    <a href="javascript:;" data-pro="${ele.pid}-${ele.img}-${ele.title}-${ele.price.toFixed(2)}" data-i="${0}">加入购物车</a>
                            </p>
                        </div>
                        </div>
                        `
                    )
                }
        })
        // 品牌
        let p_result = result.slice(7,14)
        $(p_result).each((index,ele)=>{
            if(ele.carefull == 1){
                $block1.prepend(`<div class="block-item"><a href="${ele.href}"><img src="${ele.img}" alt=""></a>
                </div>
                    `
                )
            }else{
                $block1.append(
                    `<div class="block-item">
                    <img src="${ele.img}" alt="">
                    <h3>${ele.title}</h3>
                    <h4>${ele.sub_title}</h4>
                    <div>
                    <label>¥${ele.price.toFixed(2)}</label>    
                        <p class="show">
                                <a href="${ele.href}">查看详情</a>
                                <a href="javascript:void(0)" data-pro="${ele.pid}-${ele.img}-${ele.title}-${ele.price.toFixed(2)}" data-i="${0}"">加入购物车</a>
                        </p>
                    </div>
                    </div>
                    `
                )
            }
        })
        resolve()
    }
    })
}).then(()=>{
    $('.content').on('click','a',function(e){
        let $a = $(e.target)
        // 获取对应的data-i的值，默认值是0，每次点击都加对应的值1
        let count =parseInt($a.attr('data-i'))+1
        if($a.html()=='加入购物车'){
            $data = $a.attr('data-pro')
            data = $data.split('-')
            // let username=isNaN(sessionStorage.getItem("username")) ? sessionStorage.getItem("username") : '123'
            let username= sessionStorage.getItem("username") ? sessionStorage.getItem('username') : '123'
            console.log(username)
            let obj={pid:data[0],img:data[1],title:data[2],price:data[3],counts:count,bool:true} 
            if(username){
                // 先找对应的用户的购物车的数据，如果没有就是[]
                let u_data=JSON.parse(localStorage.getItem(username)) || []
                    u_data["address"] ?u_data["address"] : []
                // 如果不为空就push到u_data中
                if(u_data[0] == undefined){
                    u_data.push(obj)
                    localStorage.setItem(username,JSON.stringify(u_data))
                }else{
                    let local_data = JSON.parse(localStorage.getItem(username))
                    let bool= true
                    for(var ele in local_data){
                        if(local_data[ele].pid == data[0]){
                            // 如果这个pid在local的data里面已经存在了，
                            // 就执行count++
                            local_data[ele].counts++
                            bool=false
                            break
                        }
                    }
                    if(bool){
                        // 表示直接把对应的obj数据添加到local_data
                        local_data.push(obj)
                        localStorage.setItem(username,JSON.stringify(local_data))
                    }else{
                        // 如果是false，表示在只是对数量进行了+1操作,直接把修改了的local_data重新放入localStorage
                        localStorage.setItem(username,JSON.stringify(local_data))
                    }
                }
            }
            // 重新加载一次head文件
            $('head').append(`<script src="js/header.js"></script>`)
        }
    })
})

})