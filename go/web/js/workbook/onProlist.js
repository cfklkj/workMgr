
//
json_proList = {};
g_choiceTag = {}

//----------------
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
function onShowAllPro(id){
    if(id != "projectHistory")
        return false;
    onChangeStatu(id)
    onGetProlist()
    return true;
}
function onChangeStatu(id){
    
    if(g_choiceTag.A != null)
       unSelectDivStatu(g_choiceTag.A)
    g_choiceTag.A = id
    selectDivStatu(id)  
}

function onChangeStatu_file(id){
    
    if(g_choiceTag.B != null)
        unSelectLiStatu(g_choiceTag.B)
    g_choiceTag.B = id
    selectLiStatu(id)  
}

function isSelFolder(){ 
     choiceId =  g_searchName.getAttribute("proId")
    if(choiceId.indexOf("D_") == -1)
        return false
    return true
}
function isSelProDir(){
    guid = g_searchName.getAttribute("proId");
    if(guid.indexOf("P_") == -1 && guid.indexOf("D_") == -1)
        return false
    return true
}
function setParentID(id){ 
    if(id.indexOf("P_") != -1)
         g_choiceFolder.setAttribute("proIdParent", id)
}
function getParentID(id){ 
    return   g_choiceFolder.getAttribute("proIdParent")
}

function onShowPro(id){
    if(id.indexOf("P_") == -1)
        return false; 
    g_loadFolder.Guid  = id;
    g_searchName.value = getParentObjName(id)  
    g_searchName.setAttribute("proId", id)
    g_choiceFolder.setAttribute("proId", id)
    g_choiceFolder.setAttribute("proName", g_searchName.value)
    g_choiceFolder.innerText=g_searchName.value
    setParentID(id)
    clearProChile()
    onLoadFolder()
    return true;
        
}

function resultAltProName(res){
    if(res == "true")
    { 
        g_choiceFolder.setAttribute("proName", g_searchName.value)
        g_choiceFolder.innerText=g_searchName.value
    }
}
//--------------------选中菜单状态
//选中与否 在添加节点后其内存位置会变化所以要分开来
function unSelectDivStatu(divId)
{
    var obj = document.getElementById(divId) 
    if(!obj)
        return
    obj.className =  "" 
} 
function selectDivStatu(divId)
{      
    var obj = document.getElementById(divId) 
    if(!obj)
        return
    obj.className = "selected"
}
function unSelectLiStatu(divId)
{   
    obj = document.getElementById(divId)  
    if(!obj)
        return
    obj.className = ""  
}
function selectLiStatu(divId)
{ 
    obj = document.getElementById(divId)
    if(!obj)
        return 
    obj.className = "fileSelected" 
} 