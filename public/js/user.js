$(function(){
    // 用户面板切换
    let $user_list = $('.left>ul')
    $user_list.on('click','li',function(e){
        let $li = $(e.target)
        $li.addClass('user-active').siblings('li').removeClass('user-active')
        let index =$li.attr('data-user')
        // 通过索引切换对应的block显示
        let $block =$('.right').children('.block')
        $($block[index]).css("display","block").siblings('.block').css('display','none')
    })

    // 获取值
    let username = sessionStorage.getItem('username')
    let res = JSON.parse(localStorage.getItem(username + 'checked')) || []

    // 设置用户名
    $('.user-name').html(username)
    let $content_items = $('.content-items')
    let $content_box
    console.log(res)
    for(var rs in res){
        $content_items.append(`
            <div class="content-box">                   
            </div>
        `)
        let sum= 0  
        $content_box =$('.content-box')
        let content_child=$content_items.children('.content-box')

        res[rs].forEach((data,i)=>{
            sum+=data.counts * data.price
            $(content_child[rs]).append(`
            <div class="content-item">
                <div class="content-item-info">
                    <a href="javascript:;"><img src="${data.img}" alt="" width="80" height="80"></a>
                    <span class="word">${data.title}</span>
                </div>
                <div class="cart-price">¥${parseInt(data.price).toFixed(2)}</div>
                <div id="count">${data.counts}</div>
                <div class="totals" data-x="1"></div>
            </div>
            `)
        })
        
        console.log()
        $(content_child[rs]).children(':first').siblings().find('.totals').html("")
        $(content_child[rs]).children(":first").find('.totals').html("¥"+sum.toFixed(2))
    }
})