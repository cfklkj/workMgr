
//
json_proList = {};
g_choiceTag = {}

//----------------new pro
function onNewPro()
{    
    g_creatUl.style.visibility = "hidden"
    getProGuid()
}
function resultNewPro(type, res){
    if(type == "guid"){
        if(res == ""){
            alert("创建项目失败 -1")
            return
        }
        g_proName = "newPro" 
        newProlist(res, g_proName)

    }else  //prolist
    {
        if(res == "true"){ 
            onShowAllPro("projectHistory")
        }
    }
}
//----------------get pro list
function onGetProlist(){  
    getProlist()
}
function resultGetProlist(res){ 
    if(res == "")
      return;
    json_proList = JSON.parse(res) 
    //没有项目
    if(json_proList.length < 1 )
        return;
    //加载目录
    loadProlist(json_proList)
}

//-------------------------------------------------------btn act
//所有
function onShowAllPro(id){
    if(id != "projectHistory")
        return false;
    onChangeStatu(id)
    onGetProlist()
    return true;
}
//单个
function onShowPro(id){
    if(id.indexOf("P_") == -1)
        return false;  
    setParent(id) 
    onLoadFolder()
    return true; 
}

function isSelFolder(){ 
     choiceId =  getSearchId()
    if(choiceId.indexOf("D_") == -1)
        return false
    return true
}
function isSelProDir(){
    guid = getSearchId()
    if(guid.indexOf("P_") == -1 && guid.indexOf("D_") == -1)
        return false
    return true
}

//alt pro result
function resultAltProName(res){
    if(res == "true")
    { 
        g_choiceFolder.setAttribute("proName", g_searchName.value)
        g_choiceFolder.innerText=g_searchName.value
    }
}