
var serverUrl = "127.0.0.1"   
var MyToken = "1111"
function Post(){
    //请求数据
    this.request =  FlyWeb  //-----------调用Flyweb里的request
    //导入
    this.import = function(){
        g_creatUl.style.visibility = "hidden"
        var data = {"Package":"import"}  
        data.ProInfo = g_projectJson 
        this.request("post",serverUrl + '/Workbook&pakage', data, listImport) 
    }
    //导出
    this.export = function(){        
        var data = {"Package":"export"}  
        data.ProInfo = g_projectJson 
        this.request("post",serverUrl + '/Workbook&pakage', data, onShowStatu)
    }
    //获取文本
    this.getTxt = function(cId){
        var data = {"FileId": cId.toString(), "unrecognizable":true}  
        data.ProInfo = g_projectJson 
        this.request("post",serverUrl + '/Workbook&getTxt', data, showTxt)   
    }
    //保存文本
    this.keepTxt = function(cId, txtInfo){
        var data = {}
        if(txtInfo.length > 1024) 
        { 
            data = {"FileId": cId.toString(), "txtInfo":zip(txtInfo)}  
        }else
        { 
            data = {"FileId": cId.toString(), "txtInfo":txtInfo}  
        }
        data.ProInfo = g_projectJson
        this.request("post",serverUrl + '/Workbook&keepTxt', data, onShowStatu)
    }
    //删除文件
    this.deleteFile = function(cId){ 
        var data = {"fileId": cId, "unrecognizable":false}  
        data.ProInfo = g_projectJson 
        this.request("post",serverUrl + '/Workbook&deleteFile', data, onShowStatu) 
    }
    //获取JSON文件配置
    this.getJson = function(jsonType, resFunc){ 
        var data = {"JsonType":jsonType}   
        data.ProInfo = g_projectJson
        this.request("post",serverUrl + '/Workbook&getJson', data, resFunc)   
    }
    //更新JSON文件配置
    this.upJson = function(jsonType, txtInfo){
        var data = {"JsonType":jsonType, "txtInfo":txtInfo}   
        data.ProInfo = g_projectJson
        this.request("post",serverUrl + '/Workbook&upJson', data, onShowStatu) 
    }  
    //更新项目名称
    this.upPro = function(proType, proName, resFunc){
        var data = {"ProType":proType, "proName":proName}    
        data.ProInfo = g_projectJson  
        this.request("post",serverUrl + '/Workbook&ProInfo', data, resFunc)  
	}
    //选择项目
    this.choice = function(proType,id, proPath, proName, resFunc){
        var data = {"ProType":proType, "proName":proName}   
        data.ProInfo = g_projectJson  
        data.ProInfo.Id = id
        data.ProInfo.ProPath = proPath
        data.ProInfo.proName = proName
        this.request("post",serverUrl + '/Workbook&ProInfo', data, resFunc)  
	}
	//执行cmd语句
	this.cmdAct = function (jsonType, txtInfo) {
		var data = { "JsonType": jsonType, "txtInfo": txtInfo }
		this.request("post", serverUrl + '/Workbook&cmdAct', data, onShowStatu)
    }
    //登入
    this.Login = function(userName, pwd, resFunc){
		var data = { "UserName": userName, "Password": pwd }
		this.request("post", serverUrl + '/Workbook&Login', data, resFunc)
    }
    this.LoginStatu = function(resFunc){
		this.request("post", serverUrl + '/Workbook&LoginStatu', "", resFunc) 
    }
}
 