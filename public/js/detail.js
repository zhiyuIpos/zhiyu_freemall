$(function(){
    new Promise((resolve,reject)=>{
        $.ajax({
            url: '/header.html',
            type : 'get',
            success:function(result){
                $('#header').replaceWith(result)
                $('<link rel="stylesheet" href="iconfont/iconfont.css">').appendTo('head')
                $('<link rel="stylesheet" href="css/header.css">').appendTo('head')
                // $('<script src="js/header.js"></script>').appendTo('head') 
                resolve()
            }
        })
    }).then(()=>{
        return new Promise(resolve => {
            $.ajax({
                url : '/footer.html',
                type : 'get',
                success:function(result){
                    $(`<link rel="stylesheet" href="css/footer.css">`).appendTo('head')
                    resolve()
                }
            })
        })
    }).then(()=>{
        var lid = location.search.split('=')[1]
        $.ajax({
            url : '/api/product/detail',
            type : 'get',
            data :{
                lid
            },
            dataType :'json',
            success:function(result){
                let list = result.list
                console.log(result.imgs)
                
                let $imgs =$('#imgs')
                let imgs = result.imgs
                $('.go-cart').attr('data-pro',`${list.lid}-${imgs[0].img}-${list.title}-${list.price.toFixed(2)}`)
                $(imgs).each((i,ele)=>{
                    if(i==0){
                        $imgs.append(`<li class="img-active"><img src="${ele.img}" alt=""></li>`)
                        $('.big-img').html(`<img src="${ele.img}"><div class="cover"></div>`)
                        $('.img').html(`<img src="${ele.img}">`)
                    }else{
                        $imgs.append(`<li><img src="${ele.img}" alt=""></li>`)
                    }
                })
                $('#imgs').on('click','img',function(e){
                    $img = $(e.target)
                    $img.parent().addClass('img-active').siblings().removeClass('img-active')
                    $('.big-img').html(`<img src="${$img.attr('src')}"><div class="cover"></div>`)
                    $('.img').html(`<img src="${$img.attr('src')}">`)
                })
                $('.big-img').on('mouseover',function(){
                    $('.img').css("display",'block')
                    $('.cover').css("display",'block')
                })
                $('.big-img').on('mousemove',function(e){
                    let $this = $(this)
                    // 获取鼠标的距离
                    let pageX = e.pageX
                    let pageY = e.pageY

                    // 获取父元素到页面左边和顶部的距离
                    let prX = $this.offset().left
                    let prY =$this.offset().top

                    // 计算出盒子的距离
                    let boxX=pageX  - prX
                    let boxY = pageY -prY
                    $('.cover').css({
                        "left": boxX - $('.cover').width()/2 + 'px',
                        "top" : boxY - $('.cover').height()/2 + 'px'
                    })

                    // 判断边界问题
                    // 如果移动到左右两边，判断是否是大于0的，如果大于0，就设置为多少值
                    // 如果是小于0的，就设置为left为0
                    if(boxX>= $('.big-img').width() - $('.cover').width()/2){
                        $('.cover').css("left",$('.big-img').width()- $('.cover').width())
                    }
                    if(boxX<=$('.cover').width()/2){
                        $('.cover').css("left",0)
                    }
                    if(boxY>= $('.big-img').height() - $('.cover').height()/2){
                        $('.cover').css("top",$('.big-img').height()- $('.cover').height())
                    }
                    if(boxY<=$('.cover').height()/2){
                        $('.cover').css("top",0)
                    }

                    $('img').css({
                        "left":-(boxX)+ 'px',
                        "top" : -(boxY)+ 'px'
                    })
                })
                $('.big-img').on('mouseout',function(){
                    $('.img').css("display",'none')
                    $('.cover').css("display",'none')
                })
                
                let data = result.list
                $('#title').html(`${data.title}`)
                $('#sub-title').children(":first").html(`${data.sub_title}`)
                $('#sub-title').children(":last").html(`¥${data.price.toFixed(2)}`)
                $('#block').html(`<img src="${data.img_detail}" >`)
            }
        })

        // 
        function change(val,id){
            let username=sessionStorage.getItem("username")
            let res = Object.prototype.toString.call(JSON.parse(localStorage.getItem(username))) !== '[object Null]' ? JSON.parse(localStorage.getItem(username)) : []
            let data = $('.go-cart').attr('data-pro').split('-')
            obj = {pid:data[0],img:data[1],title:data[2],price:data[3],counts:val,bool:true} 
            let bool= true
                for(var ele in res){
                    if(res[ele].pid == id){
                        res[ele].counts+=val
                        // 重新为 localStorage设置值
                        localStorage.setItem(username,JSON.stringify(res))
                        res= JSON.parse(localStorage.getItem(username)) || []
                        bool =false
                        break
                    }
                }
            if(bool){
                // 表示直接把对应的obj数据添加到local_data
                res.push(obj)
                localStorage.setItem(username,JSON.stringify(res))
            }else{
                // 如果是false，表示在只是对数量进行了+1操作,直接把修改了的local_data重新放入localStorage
                localStorage.setItem(username,JSON.stringify(res))
            }
        }
        function allowed(btn,val){  
            let $btn = $(btn).html()=='-' ? $(btn) : $(btn).prev().prev()
            if(val==1){
                $btn.addClass('allowed')
                $btn.prop('disabled',true)
            }else{
                $btn.removeClass('allowed')
                $btn.prop('disabled',false) 
            }
        }

        // 购物车加减
        let $sub=$('.sub')
        allowed($sub,$sub.next().val())

        $('#count').on('click','button',function(e){
            let $btn = $(e.target)
            let $parent_id= location.search.split("=")[1]
            let $text=$('#count>input')
            let $val= parseInt($text.val())
            if($btn.html() =='-'){
                allowed($btn,--$val)
                $text.val($val)
            }else{
                allowed($btn,++$val)
                $text.val($val)
            }
        })

        $('.go-cart').click(function(){
            let $parent_id= location.search.split("=")[1]
            let $text=$('#count>input')
            let $val= parseInt($text.val())
            change($val,$parent_id)
            $('<script src="js/header.js"><script>').appendTo('head')
        })

    }).catch(err=>{
        console.log(err)
    })
})


