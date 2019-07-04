
function FlyWeb(){
    //请求数据
    this.request = function(GOrP, URL, jsonData, callBack){
        var xhr = new XMLHttpRequest();
        xhr.open(GOrP, URL, true);
        if(MyToken != "")
          xhr.setRequestHeader("token", MyToken); 
        if(jsonData == "")
        {
            xhr.send();
        }else
        {
            xhr.send(JSON.stringify(jsonData)); 
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) { // 读取完成
                if (xhr.status == 200) { 
                    return callBack(xhr.responseText)
                }
            } 
            if(xhr.status == 500){
                if(xhr.responseText == "token timeout")
                {
                    window.location.reload();
                }else
                    alert(xhr.responseText);
            }else{
                console.debug("request error");
            }
        }
    }
}