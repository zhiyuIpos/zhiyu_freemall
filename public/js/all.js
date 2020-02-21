$(function(){
    new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://localhost:8888/api/product/all',
            type : 'get',
            data:{
                pno : 1,
                pSize : 8
            },
            dataType : 'json',
            success:function(res){
                let $block = $('.block')
                    res.forEach(data=>{
                        $block.append(`
                        <a href="${data.href}" class="block-a">
                        <div class="block-item">
                            <img src="${data.img}" alt="">
                            <h3>${data.title}</h3>
                            <h4>${data.sub_title}</h4>
                            <div>
                                ¥${data.price.toFixed(2)}
                                <p class="show">
                                    <button>更多详情</button>
                                    <button>加入购物车</button>
                                </p>
                            </div>
                        </div>
                        </a>`)
                    })
                    resolve()
                let $page =$('.page')
                $page.children(":first").css('cursor',"not-allowed")
                $page.children(":first").prop('disabled',true)
            }

        })
    }).then(()=>{
        /*
            判断是是跳转到第几页
        */
       let $page = $('.page')
       $page.on('click','button',function(e){
        let $btn = $(e.target)
        
        /*
            判断当前的按钮，是不是第一个页码，如果是，那么上一页的按钮禁用
            判断当前当前的按钮，是不是最后一个页码，如果是，那么下一页的按钮禁用
        */
       $page.children(":first").css('cursor',"pointer")
       $page.children(":first").prop('disabled',false)
       $page.children(":last").css('cursor',"pointer")
       $page.children(":last").prop('disabled',false)
        function isGo($btn){
            // 第一次点击的时候，就把初始值清空
            if($btn.prev().html()=='&lt;'){
                $btn.prev().prop("disabled",true)
                $btn.prev().css('cursor',"not-allowed")
            }else{
                $btn.prev().prop("disabled",false)
                $btn.prev().css('cursor',"pointer")
            }
            if($btn.next().html()=='&gt;'){
                $btn.next().prop("disabled",true)
                $btn.next().css('cursor',"not-allowed")
            }else{
                $btn.next().prop("disabled",false)
                $btn.next().css('cursor',"pointer")
            }
        }
        isGo($btn)
        /*
        如果点击的页码，就是本页码，就不用发数据
        */
        let $pno = $btn.html()
        if(!$btn.hasClass('active')){
            

        // 封装一个函数，传入pno，显示具体页码的数据
        function gotoPage(pno){
            $.ajax({
                url:'http://localhost:8888/api/product/all',
                type : 'get',
                data:{
                    pno : pno,
                    pSize : 8
                },
                dataType : 'json',
                success:function(res){
                    let $block = $('.block')
                    $block.html("")
                        res.forEach(data=>{
                            $block.append(`
                            <a href="${data.href}" class="block-a">
                            <div class="block-item">
                                <img src="${data.img}" alt="">
                                <h3>${data.title}</h3>
                                <h4>${data.subtitle}</h4>
                                <div>
                                    ¥${data.price.toFixed(2)}
                                    <p class="show">
                                        <button>更多详情</button>
                                        <button>加入购物车</button>
                                    </p>
                                </div>
                            </div>
                            </a>`)
                    })
                }
            })
        }
        /* 
            判断当前的按钮是具体的页码，还是上一页，下一页
        */
           if(!isNaN($pno)){
                $btn.addClass('active')
                $btn.siblings().removeClass('active')
                gotoPage($pno)
            }else if($pno=='&lt;'){
                $pno =$page.children('.active').html()
                $pno--
                // 当前有active这个类前一个页面变成active
                $page.children('.active').removeClass('active').prev().addClass('active')
                gotoPage($pno)
                isGo($page.children('.active'))
            }else if ($pno=='&gt;'){
                $pno =$page.children('.active').html()
                $page.children('.active').removeClass('active').next().addClass('active')    
                $pno++
                gotoPage($pno) 
                isGo($page.children('.active'))            
            }else{

            }
           
        }
       })
    })
})