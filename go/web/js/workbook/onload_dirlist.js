

//刷新文件夹  
g_rootGuid = ""

function clearPro()
{ 
    g_folderContainer.innerText = "" 
}
function clearProChile()
{
    g_searchContainer.innerHTML = "" 
    setSearchInfo("", "")   
}

function clearAllText()
{     
    clearPro()
    clearProChile() 
}


function onLoadFolder()
{   
    proGuid = getParentID()
    if(typeof(proGuid)=="undefined" || proGuid == "")
    {
        alert("请新建项目或在所有项目中选择项目")
        return ;
    }
    onChangeStatu("")  
    clearAllText()

    name = getParentName()  
    setSearchInfo(proGuid, name)
    setChoiceValue(proGuid, name)
    
    getLinkData(proGuid)
} 


function onLoadFolderChile(id)
{    
    if(typeof(id)=="undefined" || (id.indexOf("D_") == -1 &&  id.indexOf("P_") == -1))
    { 
        return false;
    }  
    //存上一级id
    oldId = getSearchId()
    oldName = g_searchName.value
    pushOldFolder(oldId, oldName)
    //获取-本地信息
    name = getParentObjName(id) 
    //清理
    clearProChile()
    //设置
    setSearchInfo(id, name)
    //获取-服务器信息
    getLinkData(id)   
    setChileFolderStatu(id) 
    return true
}  
//修改名称
function resultAltDirName(res)
{
    if(res == "true")
    {
        obj = document.getElementById( "span" + getChoiceFolderId())
        if(obj)
            obj.innerText = g_searchName.value  
    }
}
function resultGetLinklist(type, res){
    
    type;
    
    try
    {
        jsonInfo = JSON.parse(res)
    }catch(err)
    {
        return ;
    }
    if(jsonInfo.length < 1)
        return; 
    if(getChoiceFolderId().indexOf("D_") != -1 )
    {
        loadProlist(jsonInfo);

    }else{
        loadProInfo(jsonInfo);
    }  
    limitFolderHeigh()      
}


function resultGetChileLinklist(type, res){
    
    type;
    
    try
    {
        jsonInfo = JSON.parse(res)
    }catch(err)
    {
        return ;
    }
    if(jsonInfo.length < 1)
        return; 
    loadProlist(jsonInfo);
    limitFolderHeigh()      
} 
