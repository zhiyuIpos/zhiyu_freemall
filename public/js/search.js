$(function(){
    let data = JSON.parse(sessionStorage.getItem("search"))
    let $content = $('.block')
    data.forEach(item=>{
        $content.append(`
        <a href="${item.href}" class="block-a">
        <div class="block-item">
            <img src="${item.img}" alt="">
            <h3>${item.title}</h3>
            <h4>${item.sub_title}</h4>
            <div>
                ¥${item.price.toFixed(2)}
                <p class="show">
                    <button>更多详情</button>
                    <button class="add">加入购物车</button>
                </p>
            </div>
        </div>
        </a>
        `)
    })
    $content.on('click','.add',function(e){
        e.preventDefault()
        alert()
    })
})