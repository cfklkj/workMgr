 
//刷新文件夹 
function initFolderInfo()
{    
    g_choiceFolderInfo = []
    g_searchContainer.innerHTML = "" 
    g_detailValue.innerText = ""
    g_topFileName.value = ""
}

function onLoadFolder()
{   
    initFolderInfo()
    loadFolder(getDocumentJson());
    limitFolderHeigh()   
} 

function onLoadDirJson()
{
    onShowStatu("加载文件夹");
    g_post.getJson("Dir", initDirJson) 
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

function addCrashFolde(spanID, spanValue,  deleteValue)
{  
    unCrashValue = "还原"
    Ta = '\
    <li  id=' + spanID + '>\
        <div class="search-content">\
            <div class="search-item search_resulMoveB" file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="" onmouseenter=mouseenterFile(this) onmouseleave=mouseleaveFile() >\
                <i class="icon-folder folderA"></i>\
                <span class="search-item-text">' + spanValue + '</span>\
                <i title="' + deleteValue + '" i class="icon_delete editB"></i>\
                <i title="' + unCrashValue + '" class="icon_unCrash editB"></i>\
            </div>\
        </div>\
    </li>'
    g_searchContainer.innerHTML += Ta
} 

function loadDeleteFolder()
{  
    var jsonInfo = getFolderJsonObj(FolderType.document) 
    isUpJson = false
    for(item in jsonInfo){   
        if (!jsonInfo[item] || typeof(jsonInfo[item].id) != 'number')
        {
             isUpJson = true
            deleteJsonNode(jsonInfo, item);
            continue; 
        }
        if(jsonInfo[item].type == FolderType.recycleBin)
        {
            addCrashFolde(jsonInfo[item].id, jsonInfo[item].name, "永久删除") 
        }        
    } 
    if(isUpJson)     
    {
        upDirJson()
    }     
}
function onAddFolder()
{      
    if(g_choiceFolderType < FolderType.project)
    {
        alert("请选中项目后重试")
        return
    }
    initFolderInfo()  
    var newNode = {
        "id":0,
        "type": FolderType.document,
        "name":"newFolder"
    } 
    for(j =  1;  ;j++)
    {  
        newNode.id = j; 
        if(addFolderJson(newNode))
        { 
            break;            
        }
    }   
    addFolder(newNode.id, newNode.name)   
    limitFolderHeigh()
    var bObj = document.getElementById(newNode.id);
    setChoiceFolderLiType(bObj)   
    selectFoldeJson()
}
function moveFolder(obj)
{     
    var objLi = document.getElementById(g_choiceFolderInfo.id)
    var tagLi = getParentTagLi(objLi)
    if(!tagLi)
        return 
    if(movFolderJson(g_choiceFolderInfo.id))
        tagLi.remove()   
}
function unMoveFolder(obj, fileParent)
{     
    if(!fileParent)
    { 
        par = getParentTagLi(obj)   
        if(!par)
            return false  
        fileParent = par.id
    }  
    var objLi = document.getElementById(fileParent)
    var tagLi = getParentTagLi(objLi)
    if(!tagLi)
        return 
    if(unMovFolderJson(fileParent))
    {
        tagLi.remove() 
        return  true
    }   
    return false
}
function deleteFolder(obj)
{  
    par = getParentTagLi(obj)   
    if(!par)
        return false   
    var objLi = document.getElementById(par.id)
    var tagLi = getParentTagLi(objLi)
    if(!tagLi)
        return 
    if(delFolderJson(par.id))
    {
        tagLi.remove() 
        return  true
    }   
    return false 
}
   
//移动html li
function insertAfter(newEl, targetEl)
{
    var parentEl = targetEl.parentNode;
            
    if(parentEl.lastChild == targetEl)
    {
        parentEl.appendChild(newEl);
    }else
    {
        parentEl.insertBefore(newEl,targetEl.nextSibling);
    }            
}
//排序li
function sortHttpLi(thisId, changeId)
{       
     A = document.getElementById(thisId);
     B = document.getElementById(changeId); 
    insertAfter(B, A);
}
 
//----获取选择类型
function getParentDiv(obj)
{
    if(!obj)
        return obj
    var par = obj.parentNode
    if(par)
    {     
        if(par.id != "")
            return par;
        return getParentDiv(par)
    }
    return par;
}
function getParentTagLi(obj)
{
    if(!obj)
        return obj
    if(obj.tagName == "LI")
        return obj
    var par = obj.parentNode
    if(par && par.tagName != "LI")
    {      
        return getParentTagLi(par)
    } 
    return par;
}
//--menu
function setChoiceDivType(obj)
{
    par = getParentDiv(obj)  
    if(!par)
        return 0  
    switch(par.id)
    {
        case "loadFolder":
        {
            g_choiceFolderType = FolderType.project 
            list_setOpenDir(g_proName) 
        }break;
        case "nearOpen":
        { 
            g_choiceFolderType = FolderType.nearView 
            list_setOpenDir("") 
        }break; 
        case "crash":
        { 
            g_choiceFolderType = FolderType.recycleBin
            list_setOpenDir("") 
        }break;
        case "flexible-right":
        { 
            g_choiceFolderType = FolderType.detail
            return g_choiceFolderType;
        }break;
        default:
            return 0;
    }  
    //删除或还原
    if(obj.className.indexOf('icon_delete') != -1 || obj.className.indexOf('icon_unCrash') != -1) 
        return g_choiceFolderType;

    //重选文件项
    unSelectDivStatu(g_choiceTag.B)
    unSelectDivStatu(g_choiceTag.A)
    g_choiceTag.A = par.id
    selectDivStatu(par.id)  
    return g_choiceFolderType
}

//--folder
function setChoiceFolderLiType(obj)
{
    par = getParentTagLi(obj)   
    if(!par)
        return false   
    if(getParentDiv(par).id != "folder-Container")
    { 
        return false
    }  
    //直接切换
    if(g_choiceFolderType == FolderType.nearView || g_choiceFolderType == FolderType.recycleBin )
    {
        onLoadFolder()
    }else{ 
        g_choiceFolderType =  FolderType.document
    }
    unSelectDivStatu(g_choiceTag.A)
    unSelectDivStatu(g_choiceTag.B)
    g_choiceTag.B = par.id
    selectDivStatu(par.id)    
    return g_choiceFolderType
}

//--file
function setChoiceFileLiType(obj)
{
    par = getParentTagLi(obj)   
    if(!par)
        return false  
    if(getParentDiv(par).id != "search-Container")
    { 
        return false
    }   
    if(g_choiceFolderType == FolderType.nearView)
    {
    //    return true;
    }
    else{  
        g_choiceFolderType =  FolderType.file
    } 
    unSelectLiStatu(g_choiceTag.C) 
    g_choiceTag.C = par.id 
    selectLiStatu(par.id)
    return true
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