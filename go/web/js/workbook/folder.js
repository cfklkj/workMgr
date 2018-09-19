
function foldeIndex(parent)
{
    var par = parent.parentNode
    var tagLi = g_folderContainer.getElementsByTagName("li")
    for(i = 0; tagLi[i]; i++)
    {
        if(tagLi[i] == par)
        {
            return i
        }
    }
    return 0
}
function recodeFoldeIndex(parent)
{
    g_choiceDirIndex = foldeIndex(parent)  
}
function selectFoldeStatu(parent)
{    
    var tagI = parent.getElementsByTagName("i")
    if(g_choiceDirObj)
    {
        if(g_choiceDirObj == tagI[0])
        {
            return
        }
        g_choiceDirObj.par.className = g_choiceDirObj.oldClass       
        unselectFolder()
    }
    g_choiceDirObj = tagI[0]

    g_choiceDirObj.oldClass = parent.className 
    g_choiceDirObj.par = parent 
    g_choiceDirObj.par.className = "selected"
    g_choiceDirObj.thisType="unCrash"

    g_choiceDirObj.id = parent.id 
    g_choiceDirObj.style.visibility = "visible";  
}
function selectFolde(parent)
{ 
    selectFoldeStatu(parent)
    list_setOpenDir(parent)
    onLoadFile(g_choiceDirObj.id); 
    recodeFoldeIndex(parent)
}

function selectDefualtFolde(index)
{    
    if(index < 0)  //没有文件列表
    {
        g_detailValue.innerHTML = ""
        g_topFileName.value = ""
        return
    } 
    var li = g_folderContainer.getElementsByTagName("li") 
    if(!li[index])
    { 
        return
    }    
    var div = li[index].getElementsByTagName("div")
    parent = div[0]
    selectFolde(parent)
}
//刷新文件夹 
function onLoadFolders()
{
    if(g_isDeleteFolder)
    {
        g_isDeleteFolder = false
        return 
    }
    selectFoldeStatu(this) 
    
    initFileInfo()
    loadFolder(g_jsonDirInfo)
    loadUnDeleteFolde()
    g_choiceFileIndex = 0
    selectDefualtFile(0)
    g_choiceDirIndex = -1
    mouseleaveFileA()   
    var span = this.getElementsByTagName("span")
    list_setProject(span[0].title)
}
function onLoadFolder()
{ 
    loadFolder(g_jsonDirInfo)
    onNearOpen();
 /*   if(g_defaultDirKey)   
    { 
        var bObj = document.getElementById(g_defaultDirKey);
        selectFolde(bObj) 
    }*/
}
function onLoadDirJson()
{
    onShowStatu("加载文件夹");
    g_post.getJson("Dir", loadDirJson) 
}
function upDirJson()
{
    onShowStatu("添加文件夹");
    g_post.upJson("Dir", JSON.stringify(g_jsonDirInfo))  
}
function loadDirJson(responseText)
{
    
    try
    {
        jsonInfo = JSON.parse(responseText)
    }catch(err)
    {
        jsonInfo = 0
    }
    if(jsonInfo)
    {
        g_jsonDirInfo = jsonInfo
    }else{
        g_jsonDirInfo = []//JSON.parse('[{"fName":"c++","id":101},{"fName":"java","id":102}]')
        onAddFolder()
    }
    onLoadFileJson()
}
function loadFolder(jsonInfo)
{
    g_folderContainer.innerHTML = ""  
    for( i = 0; jsonInfo[i] && jsonInfo[i].id; i++)
    { 
        g_dirCount ++;
        if(jsonInfo[i]["isDelete"])
        {
            continue
        }
        if(!g_defaultDirKey)
        {
            g_defaultDirKey = jsonInfo[i].id
        }
        addFolder(jsonInfo[i].id, jsonInfo[i].fName)
    }
}
function addFolder(dirID, dirName)
{
    Ta = '\
    <li>\
        <div class="slidebar-content" id=' + dirID + '>\
            <div class="sidebar-item search-resulMove" file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="">\
                <i class="arrow arrowB" style="visibility: hidden;"></i>\
                <i class="icon-folder folderA"></i>\
                <span class="sidebar-item-text" >' + dirName + '</span>\
            </div>\
        </div>\
    </li>'
    g_folderContainer.innerHTML += Ta
}
function onAddFolder()
{    
    jsonInfo =  g_jsonDirInfo[g_choiceDirObj.id]    
    //得到新ID 
    newFolder = 0
    for(j = 101; !newFolder ;j++)
    {  
        for(i = 0; g_jsonDirInfo[i]; i++)
        {             
            if(g_jsonDirInfo[i].id == j)
            {
                break;
            }    
        }   
        if(!g_jsonDirInfo[i])
        {
            newFolder = j;
            var newNode = {
                "id":j,
                "fName":"newFolder"
            } 
            g_jsonDirInfo.push(newNode);             
        }
    } 
    unselectFolder()
    addFolder(newFolder, "新文件夹")  
    var bObj = document.getElementById(newFolder);
    selectFolde(bObj)  
    upDirJson()
}
function moveFolder(parentId)
{    
    for(j = 0; g_jsonDirInfo[j]; j ++)
    {
        if( g_jsonDirInfo[j].id == parentId)
        {                   
            g_jsonDirInfo[j]["isDelete"] = true  
            break;
        }
    }    
}
function unMoveFolder(parent)
{     
    parentId = parent.id   
    for(i = 0; g_jsonDirInfo[i]; i++)
    {
        if( g_jsonDirInfo[i].id == parentId)
        {
            g_jsonDirInfo[i]["isDelete"] = false
            break;
        }
    }  
    recodeChangeFileContianer(parent)  
    loadFolder(g_jsonDirInfo)
}
function deleteFolder(parent)
{  
    parentId = parent.id     
    for(j = 0; g_jsonDirInfo[j]; j ++)
    {
        if( g_jsonDirInfo[j].id == parentId)
        {  
            g_jsonDirInfo.splice(j, 1); 
            g_dirCount -= 1; 

            recodeChangeFileContianer(parent)   
            deleteAllFile(parentId)
            break;
        } 
    } 
}

function getJsonFoldeById(parentId)
{
    for(i = 0; g_jsonDirInfo[i]; i++)
    {
        if( g_jsonDirInfo[i].id == parentId)
        {
            return g_jsonDirInfo[i]
        }
    }
    return 0
}