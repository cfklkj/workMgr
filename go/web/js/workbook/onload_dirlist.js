

//刷新文件夹  
g_rootGuid = ""
g_actOldFolder = []  //A  -- Pro chile   B chile -chile

function clearPro()
{
    g_choiceFolderInfo = []
    g_folderContainer.innerText = "" 
}
function clearProChile()
{
    g_searchContainer.innerHTML = "" 
    g_choiceFolder.setAttribute("proId", "")
    g_choiceFolder.value = ""  
}

function clearAllText()
{     
    clearPro()
    clearProChile()
  //  g_detailValue.innerText = ""
  //  g_topFileName.value = "" 
}


function onLoadFolder()
{   
    proGuid = g_loadFolder.Guid 
    if(typeof(proGuid)=="undefined" || proGuid == "")
    {
        alert("请新建项目")
        return ;
    }
   // clearAllText()
    getLinkData(proGuid)
    onChangeStatu("")  
} 

function pushOldFolder(id, name)
{ 
    data = {"guid":id, "name":name}
    g_actOldFolder.push(data)
}

function pullTopOldFolder()
{ 
    if(g_actOldFolder.length < 1)
        return null
    return g_actOldFolder.pop()
}  


function onBackUpFolder(){
    
    var topEle = pullTopOldFolder()
    if(topEle != null)
    { 
        id = topEle.guid
        //清理
        clearProChile()
        //获取-服务器信息
        g_searchName.value = topEle.name  
        g_searchName.setAttribute("proId", id)
        getLinkData(id)
        pId = getParentObjId(document.getElementById(id))
        if(pId != null && pId == "folder-Container")
         {
            onChangeStatu(id) 
            onChangeStatu_file("") 
         }   
    }
}

function onLoadFolderChile(id)
{    
    if(typeof(id)=="undefined" || (id.indexOf("D_") == -1 &&  id.indexOf("P_") == -1))
    { 
        return false;
    }  
    //存上一级id
    oldId = g_searchName.getAttribute("proId", id)
    oldName = g_searchName.value
    pushOldFolder(oldId, oldName)
    //获取-本地信息
    g_searchName.value = getParentObjName(id)   
    g_searchName.setAttribute("proId", id)
    //清理
    clearProChile()
    //获取-服务器信息
    getLinkData(id)
    pId = getParentObjId(document.getElementById(id))
    if(pId != null && pId == "folder-Container")
    {
       onChangeStatu(id) 
       onChangeStatu_file("") 
    }   
    return true
}  

function resultAltDirName(res)
{
    if(res == "true")
    {
        obj = document.getElementById( "span" + getChoiceFolderId())
        obj.innerText = g_searchName.value  
    }
}
function getChoiceFolderId(){
    return g_searchName.getAttribute("proId")
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


//--加载到标签
function loadFolder(jsonInfo)
{
    if(!jsonInfo)
        return; 
    g_folderContainer.innerHTML = ""  
    for( i = 0; jsonInfo[i] && jsonInfo[i].id; i++)
    {  
        if(jsonInfo[i].type != FolderType.document)
           continue;
        addFolder(jsonInfo[i].id, jsonInfo[i].name) 
    }
    return i > 0
}
function addFolder(dirID, dirName)
{
    Ta = '\
    <li draggable="true"  ondragover="InFolder(event)" ondragleave="OutFolder(event)" id=' + dirID + ' value= ' + dirName + '>\
        <div class="slidebar-content">\
            <div class="sidebar-item search-resulMove" file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="">\
                <i class="arrow arrowB" style="visibility: hidden;"></i>\
                <i class="icon-folder folderA"></i>\
                <span class="sidebar-item-text">' + dirName + '</span>\
            </div>\
        </div>\
    </li>'
    g_folderContainer.innerHTML += Ta
} 


//--------------------------------btn act---
function onShowDir(id){
    if(id)
        return false

        return true;
        
}