  

var proActPost =  proActPost || {}; 
var wkPost = proActPost.commonMethod  = { 
    //请求数据 
    version: "/v1",     
    checkData: function(res){
        data = JSON.parse(res)
        if (data == null || data.Code != 200) {        
            alert(res) 
            return null
        }else{ 
            return data
        }      
    },
    requestJson:function(GOrP, URL, data, callBack){ 
        this.request(GOrP, URL, JSON.stringify(data), callBack);
    },
    request: function(GOrP, URL, data, callBack){ 
        var xhr = new XMLHttpRequest();
        xhr.open(GOrP, URL, true); 
        xhr.send(data);  
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) { // 读取完成
                if (xhr.status == 200) { 
                     data = wkPost.checkData(xhr.responseText)
                     if (data != null){ 
                        callBack(data)
                     } 
                     return
                }
            }             
            if(xhr.status == 500){
                if(xhr.responseText == "token timeout")
                {
                    window.location.reload();
                }else
                    alert(xhr.responseText);
            }else{
                console.debug("request error", xhr.status);
            }
        }
    },
    //get prolist
    proGet: function(path, root, resFunc) {
        var data = root
        this.request("post",this.version + '/workbook/dir/get?proid='+path, data, resFunc)  
    },   
    //create pro
    // proCreate: function(path, resFunc){
    //     var data = {}
    //     this.request("post",this.version + '/workbook/pro/create?proid='+path, data, resFunc)  
    // },
    //creat dir
    dirCreate: function(path, root, resFunc){
        var data = root
        this.request("post",this.version + '/workbook/dir/create?proid='+path, data, resFunc)  
    },
    //creat file
    fileCreate: function(path, root, resFunc){
        var data = root
        this.request("post",this.version + '/workbook/file/create?proid='+path, data, resFunc)  
    },
    //alt file  
    fileAlt: function(path, guid, data, resFunc){
        var data = {"Guid":guid, "Data":data}
        this.requestJson("post",this.version + '/workbook/file/alt?proid='+path, data, resFunc)  
    },
    //get file
    fileGet: function(path, guid, resFunc){
        var data = guid
        this.request("post",this.version + '/workbook/file/get?proid='+path, data, resFunc)  
    },    
    //alt name 
    nameAlt: function(path, guid, name, resFunc){
        var data = {"Guid":guid, "Name":name}
        this.requestJson("post",this.version + '/workbook/name?proid='+path, data, resFunc)  
    },
    
    //add link
    linkAdd: function(path, root, guid, resFunc){
        var data = {"RootGuid":root, "ChileGuid": guid}
        this.requestJson("post",this.version + '/workbook/link/add?proid='+path, data, resFunc)  
    },    
    //swap link
    linkSwap: function(path, root, guidA, guidB, resFunc){
        var data = {"RootGuid":root, "GuidA": guidA, "GuidB":guidB}
        this.requestJson("post",this.version + '/workbook/link/swap?proid='+path, data, resFunc)  
    },    
    //change link
    linkChange: function(path, rootA, rootB, guid, resFunc){ 
        var data = {"RootGuidA":rootA, "RootGuidB":rootB, "Guid":guid}
        this.requestJson("post",this.version + '/workbook/link/change?proid='+path, data, resFunc)  
    }
}
 