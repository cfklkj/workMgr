//主文档类型
var  FolderType = {};
FolderType.nochoice = 0;
FolderType.document = 1;
FolderType.recycleBin = 2;
FolderType.nearView = 3; 
FolderType.project = 4; 
FolderType.file = 5; 
FolderType.detail = 6; 
    

g_choiceFolderType = FolderType.nochoice  //选择的文档类型
g_choiceFolderId = 0; //选择的文件夹
g_choiceFolderLi = ""  //选择的标签

g_jsonDirInfo = []//JSON.parse('[{"fName":"c++","id":101},{"fName":"java","id":102}]')


function onLoadDirJson()
{
    onShowStatu("加载文件夹");
    g_post.getJson("Dir", loadDirJson) 
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
        g_jsonDirInfo = []
        onAddFolder()
    }
    onLoadFileJson()
}

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

function getParentTagLi(obj)
{
    if(!obj)
        return obj
    var par = obj.parentNode
    if(par && par.tagName != "LI")
    {      
        return getParentTagLi(par)
    }
    return par;
}


function selectFoldeStatu(obj)
{     
    tagLi = getParentTagLi(obj)
    if(tagLi.tagName != "LI")
        return false; 
    tagLi.className = "selected"
    if(g_choiceFolderLi != "")
    { 
        oldTagLi = g_choiceFolderLi
        g_choiceFolderLi = tagLi
        oldTagLi.className = "";
    }else
    {
        g_choiceFolderLi = tagLi
    }
    //--old
    return;
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
function selectFolde(parentId)
{  
    if(g_choiceFolderId == parentId)
        return false;  
    for(id in g_jsonDirInfo)
    {  
        if(g_jsonDirInfo[id].id == parentId)
        { 
            g_choiceFolderId = parentId 
            return true;
        }
    } 
    return false;

    //old
    return
    selectFoldeStatu(parent)
    list_setOpenDir(parent)
    if(!isNoReloadFile) 
    {
       onLoadFile(g_choiceDirObj.id); 
    }
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
function upDirJson(newName)
{
    dirJsonObj = getJsonFoldeById(g_choiceFolderId)
    if(!dirJsonObj)
        return false
    dirJsonObj.fName = newName
    onShowStatu("更新文件夹");
    g_post.upJson("Dir", JSON.stringify(g_jsonDirInfo))  
    return true
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
    <li draggable="true"  ondragover="InFolder(event)">\
        <div class="slidebar-content">\
            <div class="sidebar-item search-resulMove" file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="">\
                <i class="arrow arrowB" style="visibility: hidden;"></i>\
                <i class="icon-folder folderA"></i>\
                <span class="sidebar-item-text" id=' + dirID + '>' + dirName + '</span>\
            </div>\
        </div>\
    </li>'
    g_folderContainer.innerHTML += Ta
}
function onAddFolder()
{      
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
                "type": FolderType.document,
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

var swapItems = function(arr, index1, index2) {
    var temp = arr[index2]
    arr[index2] = arr[index1]
    arr[index1] = temp
    return arr;
};

function sortThisFolder(parentId, down)  //将点击的项移动到第一位
{ 
    parentId = Math.abs(parentId)
    var jsonFile = 0 
    var limit = g_jsonDirInfo.length -1
    for(var index in g_jsonDirInfo)
    {
        if( g_jsonDirInfo[index].id == parentId && index > 0 && index < limit)
        { 
            if(!down)
            { 
              g_jsonDirInfo = swapItems(g_jsonDirInfo, index,  Math.abs(index) - 1); 
            }else
            {                
              g_jsonDirInfo = swapItems(g_jsonDirInfo, index,  Math.abs(index) + 1); 
            }
            upDirJson()
            return true
        }
    } 
    return false
}


//排序li
function sortHttpLi(parentNode, chileId, upDown)
{     
    g_choiceDirObj = 0
    loadFolder(g_jsonDirInfo) 
    var lis = document.getElementById(chileId)
    selectFolde(lis, true) 
}


//----选择文档类型
function getFolderId(obj)
{
    if(!obj)
        return obj
    var par = obj.parentNode
    if(par)
    {     
        if(par.id != "")
            return par;
        return getFolderId(par)
    }
    return par;
}
function setChoiceFolderType(obj)
{
    par = getFolderId(obj) 
    if(!par)
        return 0
        console.log("g_choiceFolderType")
        console.log(par.id)
    switch(par.id)
    {
        case "loadFolder":
        {
            g_choiceFolderType = FolderType.project
        }break;
        case "nearOpen":
        {
            g_choiceFolderType = FolderType.nearView
            selectFoldeTypeStatu(g_choiceFolderType) 
        }break;
        case "folder-Container":
        {
            g_choiceFolderType = FolderType.document
            selectFoldeTypeStatu(g_choiceFolderType) 
        }break;
        case "search-Container":
        {
            g_choiceFolderType = FolderType.file
        }break;
        case "flexible-right":
        {
            g_choiceFolderType = FolderType.detail 
        }break;
        case "crash":
        {
            g_choiceFolderType = FolderType.recycleBin
            selectFoldeTypeStatu(g_choiceFolderType) 
        }break;
        default:
            return 0;
    } 
    console.log(g_choiceFolderType)
    return g_choiceFolderType
}

function selectFoldeTypeStatu(obj)
{     
    obj.className = "selected"
    if(g_choiceFolderLi != "")
    { 
        oldTagLi = g_choiceFolderLi
        g_choiceFolderLi = obj
        oldTagLi.className = "";
    }else
    {
        g_choiceFolderLi = obj
    }
}