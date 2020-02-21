$(function(){
    let $page =$('.page')
    $page.children(":first").css('cursor',"not-allowed")
    $page.children(":first").prop('disabled',true)
    let username = sessionStorage.getItem('username')
    let res= JSON.parse(localStorage.getItem(username))  || []
    let $carts = $('.cart-items')
    function head(){
        $carts.html("")
        let all_bool = true
        let choose_sum =0 
        if(res.length > 0){
            res.forEach(data=>{
            $carts.append(`
            <div class="cart-item" data-i="${data.pid}">
                <div class="cart-item-info">
                    <label class="${data.bool ? 'right' : ''}"></label>
                    <a href="javascript:;"><img src="${data.img}" alt=""></a>
                    <span>${data.title}</span>
                </div>
                <div class="cart-price">${data.price}</div>
                <div id="count">
                    <button class="minus">-</button><input type="text" class="as" value="${data.counts}" ><button>+</button>
                </div>
                <div class="totals">${(data.price*data.counts).toFixed(2)}</div>
                <button class="del" id="close_count">&times;</button>
            </div>
            `)
                if(!data.bool){
                    all_bool = false
                }else{
                    choose_sum+=data.counts * data.price
                }  
            })
            // 如果没有一个按钮是false ，就说明是全部选中的，就添加类right
            if(all_bool){
                $('.all').addClass('right')
            }
            // 在循环之后，把统计的数据放到页面上
            $('.sums').html(`¥${choose_sum.toFixed(2)}`)
        }else{
            let $cart_shop = $('.cart-shop')
            let $cart_block =$('.block')
            $cart_shop.css('display','none')
            $cart_block.css('display','block')
        }   
    }
    head()
    function allowed(btn,val){
        let $btn = $(btn) || $(btn).prev().prev()

        if(val==1){
            $btn.addClass('allowed')
            $btn.prop('disabled',true)
            $btn.html() == '现在结算' ? $btn.css("background","#eee") : ''
            return true
        }else{
            $btn.removeClass('allowed')
            $btn.prop('disabled',false) 
            $btn.html() == '现在结算' ? $btn.css("background","#6c8cd4") : ''
            return false
        }
        
    }
    

    //封装函数 修改数量
    function change(val,id){
        /* 如果val为空，表示删除，如果不为空表示修改 */
        if(val ==""){
            for(var ele in res){
                if(res[ele].pid == id){
                    res.splice(ele,1)
                    // 数量设置为
                    // 重新为 localStorage设置值
                    localStorage.setItem(username,JSON.stringify(res))
                    res= JSON.parse(localStorage.getItem(username)) || []
                    head()
                    $('<script src="js/header.js"><script>').appendTo('head')
                    $('<script src="js/cart.js"><script>').appendTo('head')
                }
            }
        }else{
            for(var ele in res){
                if(res[ele].pid == id){
                    // 数量设置为
                    res[ele].counts=val
                    // 重新为 localStorage设置值
                    localStorage.setItem(username,JSON.stringify(res))
                    res= JSON.parse(localStorage.getItem(username)) || []
                    head()
                    $('<script src="js/header.js"><script>').appendTo('head')
                    $('<script src="js/cart.js"><script>').appendTo('head')
                }
            }
        }
    }

    // 每次页面加载的时候，都调用allowed判断当前的数量是否是1，如果就把-号禁用，不能减少了
    let $btn = $('.minus')
    for(var b of $btn){
        let $b=$(b).next().val()
        if($b==1){
            allowed($(b),$b)
        }
    }

    // 购物清单上的直接修改值得价格输入框
    $carts.off('click','button')
    $carts.on('blur','input[type="text"]',function(e){
        let $input = $(e.target)
        let $input_val =$input.val()
        let $sub = $input.prev()
        let $parent_id = $input.parent().parent().attr('data-i')
        if($input_val<0){
            alert("不能少于1")
        }else if($input_val==0){
            allowed($sub,$input_val)
            change("",$parent_id)
        }else{
            change(parseInt($input_val),$parent_id)
        }
    })

    //添加数量或者减少数量的 
    $carts.on('click','button',function(e){
        let $btn = $(e.target)
        let $btn_val = $btn.html()
        let $val = $btn.next().val() || $btn.prev().val()
        let $cart_id = $btn.parent().parent().attr('data-i')
        allowed($btn,$val)
        if($btn_val=='+'){
            // $val++
            allowed($btn,$val++)
            $btn.prev().val($val)
            // 传值过去
            change($val,$cart_id)
        }else if($btn_val =='-'){
            // $val--
            allowed($btn,$val--)
            $btn.next().val($val)
            change($val,$cart_id)
        }else if($btn_val == '×'){
            // 获取当前商品的id，
            let $id = $btn.parent().attr('data-i')
            // 调用change函数
            change("",$id) 
        }
    })

    // 
    let $all_choose = $('.all')
    function choose($id){
        let $all = $('.cart-item-info').children('label')
        let choose_count = 0
        let choose_sum = 0
        // 循环遍历，如果有当前id与本id一样，就设置bool为相反的值
        for(var i in res){ 
            if(res[i].pid == $id){
                res[i].bool = !res[i].bool
                // 如果当前是true表示有，right，在点击之后就要移除right
                if(!res[i].bool){
                    $($all[i]).removeClass('right')
                }
                localStorage.setItem(username,JSON.stringify(res))
                res= JSON.parse(localStorage.getItem(username)) || []
                head()     
            }
            // 把为true的值，累加到一起，就是选中的商品
            if(res[i].bool){
                choose_count+=res[i].counts
                choose_sum+=res[i].counts * res[i].price
            }
        }
        $('.total-choose').html(choose_count)
    }
    choose()

    // 判断是否是全选
    $carts.off('click','label')
    $carts.on('click','label',function(e){
        let $choose = $(e.target)
        let $id =$choose.parent().parent().attr('data-i')
        choose($id)
        let bool = true
        for(var i in res){   
            // 如果有false，就移除全选按钮上的right类  
            if(!res[i].bool){ 
                $all_choose.removeClass('right')
                bool = false
            }
        }
        isBalance()
        // 判断，如果都没有false，就添加全选按钮上的right类
        if(bool){
            $all_choose.addClass('right')
        }
        
    })

    function isBalance(){
        let check_bool = false
        for(var i in res){
            if(res[i].bool){
                // 否则就表示里面有true ，就设置check_bool为true
                check_bool = true
                break
            }
        }
        if(check_bool){
            allowed($('.balance'),2)
        }else{
            allowed($('.balance'),1)
        }
    }
    // 全部数据
    function alls($id){
        let $all = $('.cart-item-info').children('label')
        choose_count =0
        for(let i in res){
            if($id){
                res[i].bool = false
                localStorage.setItem(username,JSON.stringify(res))
                res= JSON.parse(localStorage.getItem(username)) || []
                head()     
            }else{
                res[i].bool = true
                choose_count+=res[i].counts
                localStorage.setItem(username,JSON.stringify(res))
                res= JSON.parse(localStorage.getItem(username)) || []
                head() 
            }
        }
        $('.total-choose').html(choose_count)
    }

    // 切换全选按钮
    let $all_right = $('.all')
    $all_right.click(function(){
        let $all = $(this)
        if($all.hasClass('right')){
            $all.removeClass('right')
            allowed($('.balance'),1)
            alls(true)
        }else{
            $all.addClass('right')
            allowed($('.balance'),2)
            alls(false)
        }
        
    })

    // 删除选中的商品
    let $del = $('.del-choose')
    $del.click(function(){
        // 循环遍历,遍历出满足条件的
        res=res.filter(data=>{
            return data.bool == false
        })
        // 重新设置res的值
        localStorage.setItem(username,JSON.stringify(res))
        // 调用head函数
        choose()
        head()
        $('<script src="js/header.js"><script>').appendTo('head')
    })

    // 结算，跳到收货地址选择

    let $balance = $('.balance')
    isBalance()
    $balance.click(function(){
        if($balance.html() == '现在结算'){
            window.open('checkout.html',"_self")   
        }
    })

})