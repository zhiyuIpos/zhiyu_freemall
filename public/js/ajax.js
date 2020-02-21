// 封装了一个ajax函数
function ajax(postData,method,url,success){
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange=function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            success(JSON.parse(xhr.responseText))
        }
    }
    xhr.open(method,url,true)
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
    postData ? xhr.send(postData) : xhr.send();   
}