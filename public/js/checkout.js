
$(function(){
let $order = $('.order-info')
let $cover = $('.info-cover')
let $address =$('.info-address')
let username = sessionStorage.getItem('username')
let res= JSON.parse(localStorage.getItem(username))  || []
let all =[],rs=[]
// 购物清单
let $carts = $('.cart-items')
function head(){
    $carts.html("")
    let all_bool = true
    let choose_sum =0 
    if(res.length > 0){
        res.forEach((data,i)=>{
        if(data.bool){
            // 是true表示在这次订单里面
            all.push(data)
            $carts.append(`
            <div class="cart-item" data-i=${data.pid}>
                <div class="cart-item-info">
                    <a href="javascript:;" class="img"><img src="${data.img}" alt="" width="80" height="80"></a>
                    <span>${data.title}</span>
                </div>
                <div class="cart-price">${parseInt(data.price).toFixed(2)}</div>
                <div id="count">${data.counts}</div>
                <div class="totals">${data.counts * data.price}</div>
            </div>
            `)
            if(!data.bool){
                all_bool = false
            }else{
                choose_sum+=data.counts * data.price
            } 
        }else{
            // 是false，表示没有在这次订单里面
            rs.push(data)
        } 
    })
        if(all_bool){
            $('.all').addClass('right')
        }
    $('.sums').html(`¥${choose_sum.toFixed(2)}`)
    }else{
        let $cart_shop = $('.cart-shop')
        let $cart_block =$('.block')
        $cart_shop.css('display','none')
        $cart_block.css('display','block')
    }   
}
head()

show_address($('.order-info'))

// 封装一个显示收货地址的函数
function show_address(item){
    // 用于获取用户地址
    let arr
    arr = JSON.parse(localStorage.getItem(username + 'address')) ?  JSON.parse(localStorage.getItem(username + 'address')): []
    arr.forEach((data,i)=>{
        item.prepend(`
        <div class="new-address" data-address="${i}">
            <div class="address-box">
            <div>用户名:${data.name}</div>
            <div>用户电话:${data.phone}</div>
            <div>用户地址:${data.address}</div>
            </div>
            <div class="change-address"><button>修改</button><button>删除</button></div>    
        </div>
        `)
    })
}


// 地址填写
$order.on('click','.order-address',function(e){
    $cover.css('display',"block")
    $address.css('display','block')
    let $name = $('.name')
    let $phone = $('.phone')
    let $address1 = $('.address')
    $name.val("")
    $phone.val("")
    $address1.val("")
    
})

// 地址填写关闭
let $address_close = $('.address-close')
let $info_keep = $('.info-keep')
$address_close.click(function(){
    $cover.css('display',"none")
    $address.css('display','none')
})

// 用于获取用户地址
let arr 
arr = JSON.parse(localStorage.getItem(username + 'address')) 
?  JSON.parse(localStorage.getItem(username + 'address')): []

// 点击切换按钮
$('.order-info').on('click','.new-address',function(e){
    $(e.currentTarget).addClass('check-address').siblings().removeClass('check-address')
})

/* 
    
*/
// 删除,修改地址
$('.order-info').on('click','button',function(e){
    let $btn = $(e.target)
    let $name = $('.name')
    let $phone = $('.phone')
    let $address1 = $('.address')
    let $defaults = $('.defaults')
    let $list = $('.info-list')
    // 获取当前按钮的对应的数据
    let data = $btn.parent().parent().attr('data-address')
    if($btn.html() == '修改'){
        $cover.css('display',"block")
        $address.css('display','block')
        $name.val(arr[data].name)
        $phone.val(arr[data].phone)
        $address1.val(arr[data].address)
        $address.attr('data-i',data)

        // // if当前的
        // if(arr[data].defaults){
        //     $defaults.addClass('label_check')
        // }else{
        //     $defaults.removeClass('label_check')
        // }
    }else{
        arr.splice(data,1)
        localStorage.setItem(username + 'address', JSON.stringify(arr))
        // 刷新
        $('.order-address').siblings().replaceWith("")
        show_address($('.order-info'))
    }
    isChecked()
})

isChecked()
// 地址勾选默认
$('.defaults').click(function(){
    if($(this).hasClass('label_check')){
    }else{
        $(this).addClass('label_check')
    }
})

// 定义一个方法，用于设置第一个地址为选中状态，或者判断是否是true状态
function isChecked(){
    let $default_checked = $('.order-info').children('.new-address:first-child')
    $default_checked.addClass('check-address')
}


// 地址保存
$info_keep.click(function(){
    // 点击保存按钮的时候，需要把里面的数据保存到对应的用户的列表项里面
    let $info_list = $('.info-list').children('input[type="text"]')
    let defaults = $('.defaults').hasClass('label_check')
    let $info =$('.order-address')
    let obj = {},i=0
    for(let x of $info_list){
        obj[$(x).attr('class')]=x.value
    }

    // 如果把当前地址设置为true，就需要修改其他地址为false，默认地址只有一个
    if(defaults){
        obj.defaults = defaults 
        // 循环修改 其他地址为false
        for(var a in arr){
            arr[a].defaults = false
        }
    }
    // 判断是修改保存还是新增地址保存
    let iss = $('.info-address').attr('data-i')
    // 如果是当前弹出框中的数据是>=0的表示数据是修改
    if(iss>=0){
        arr[iss].name = $info_list[0].value
        arr[iss].phone = $info_list[1].value
        arr[iss].address = $info_list[2].value
        // 修改之后，清空弹框上的data-i标识
        $('.info-address').attr('data-i',-1)
    }else{
        // 表示增加
        arr.push(obj)
        $info.siblings().replaceWith("")
        show_address($('.order-info'))
        $('.order-info').children(":first").addClass('check-address')
    }
    
    localStorage.setItem(username + 'address', JSON.stringify(arr))
    $info.siblings().replaceWith("")
    show_address($('.order-info'))
    $cover.css('display',"none")
    $address.css('display','none')
    isChecked()
})

    // 提交订单
    $('.balance').click(function(){
        // 拿到此时已经选中的地址，和商品为true的商品清空，存放到用户地址里面去
        let $address_submit = $('.order-info').find('.check-address')
        let $val = $address_submit.children('.address-box').children('div')
        let arr =[] ,pid

        for(var i =0;i<$val.length;i++){
            arr.push($($val[i]).html().split(':')[1])
        }
        res.forEach((data,i)=>{
            if(data.bool){
                data.address = arr
                pid = data.pid
                localStorage.setItem(username + 'balance_address',JSON.stringify(arr))
                return
            }  
        })
        // 重新设置username还有为提交的订单的商品
        localStorage.setItem(username,JSON.stringify(rs))

        let alls = []
        alls = JSON.parse(localStorage.getItem(username + 'checked')) ? JSON.parse(localStorage.getItem(username + 'checked')) : []
        // 设置已经提交的订单的商品，保存起来
        alls.push(all)
        console.log(alls)
        localStorage.setItem(username + 'checked',JSON.stringify(alls))
        console.log(localStorage.getItem(username + 'checked'))
        // 提交成功，跳转到购物车界面
        window.open('cart.html','_self')
    })
})