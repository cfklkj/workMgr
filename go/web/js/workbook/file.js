 

//文件列表---------------------------------
g_sortLimit = 9  //默认重新排序限制数量
g_choiceFileInfo = []   //选择的文件信息
g_choiceFileLi = "" //选择的标签 
g_isChoiceFile = false  //是否处于选择中
g_moveInFolder = -1;
 
g_nearFileLimit = 10

g_isFirstLoad = true
g_isChange = false
g_nearOpen = []  //最近打开
//--del g_choiceFolderId
//文件
function onLoadFileJson()
{ 
    g_post.getJson("fileName", initFileJson)
} 
function upFileJson()
{
    g_post.upJson("fileName", JSON.stringify(g_jsonFileInfo)) 
}

//--文档
function loadFiles()
{      
    g_isChange = false
    parentId =  g_choiceFolderInfo.id
    g_searchContainer.innerHTML = ""
    jsonInfo = getFileJsonObj() 
    g_choiceFileInfo = [] 
    var isUpJson = false 
    var isAdd = false
    g_isChange = true
    for(var item =0 ; g_isChange && item < jsonInfo.length; item ++)
    {      
        if(!jsonInfo[item] || jsonInfo[item].folderId != parentId || jsonInfo[item].type != FolderType.file)
       {
           if (typeof(jsonInfo[item].id) != 'number')
           {
                isUpJson = true
               deleteJsonNode(jsonInfo, item);
           }
           continue;
       }     
        addFile(jsonInfo[item].id, jsonInfo[item].name)   
        isAdd = true; 
    } 
    if(isUpJson)
    {
        upFileJson()
    }  
    g_isFirstLoad = false
    return isAdd
} 

//--最近浏览
function sequence(a,b){    //排序
            if (a.viewTime>b.viewTime) {
                 return -1
          }else if(a.viewTime<b.viewTime){
                return 1
            }else{
                return 0
           }
    } 
function loadNearFile()
{      
    var viewItem = g_nearOpen 
    viewItem = g_nearOpen.sort(sequence) 
    for(item  = 0; item < viewItem.length &&  item < g_nearFileLimit; item ++)
    {
        addNearViewFile(viewItem[item].id, viewItem[item].name)  
    }
} 
//回收站
function loadDeleteFile()
{ 
    var jsonInfo = getFileJsonObj() 
    isUpJson = false
    for(item in jsonInfo){   
        if (typeof(jsonInfo[item].id) != 'number')
        {
             isUpJson = true
            deleteJsonNode(jsonInfo, item);
            continue; 
        }
        if(jsonInfo[item].type == FolderType.recycleBin)
       {
          addCrashFileLi(jsonInfo[item].id, jsonInfo[item].name)  
       } 
    } 
    if(isUpJson)     
    {
        upFileJson()
    }      
}
    
function selectNearFile(obj)
{ 
    if(g_choiceFolderType != FolderType.nearView && g_choiceFolderType != FolderType.Nearfile)
        return false 
    par = getParentDiv(obj)  
    jsonInfo = getFileJsonObj(g_choiceFolderInfo.id)
    for( i = 0; jsonInfo[i]; i++)
    {   
        if(jsonInfo[i].id == par.id)
        {
            g_choiceFileInfo = jsonInfo[i]  
            break;
        }
    }  
    setChoiceFileText(g_choiceFileInfo.name) 
    g_post.getTxt(g_choiceFileInfo.id)  
    return true;

}
function selectFile(choiceFileId)
{   
    if(choiceFileId == "")
       return false;
    if(g_choiceFileInfo.id  == choiceFileId)
        return false;  
    jsonInfo = getFileJsonObj(g_choiceFolderInfo.id)
    for( i = 0; jsonInfo[i]; i++)
    {   
        if(jsonInfo[i].id == choiceFileId)
        {
             g_choiceFileInfo = jsonInfo[i] 
             addNearFile(g_choiceFileInfo)
            break;
        }
    } 
    upFileJson() 
    setChoiceFileText(g_choiceFileInfo.name) 
    g_post.getTxt(g_choiceFileInfo.id)  
    return true;
}

function addNearFile(jsonInfo)
{
    var timestamp =Math.round(new Date() / 1000) 
    for(var index = 0; index < g_nearOpen.length; index ++)
    {
        if(g_nearOpen[index].id == jsonInfo.id)
        { 
            g_nearOpen[index].viewTime = timestamp 
            return;
        }
    } 
    g_nearOpen.push(jsonInfo) 
    try{ 
         g_nearOpen[g_nearOpen.length ].viewTime = timestamp
    }catch(err)
    {
        addNearFile(jsonInfo)
    }

}

function selectDefualtFile(index)
{    
    if(index < 0)  //没有文件列表
    {
        g_detailValue.innerHTML = ""
        g_topFileName.value = ""
        return
    } 
    var li = g_searchContainer.getElementsByTagName("li") 
    if(!li[index])
    { 
        return
    }    
    var div = li[index].getElementsByTagName("div")
    parent = div[0] 
    selectFile(parent)
} 
 
function onAddFile()
{     
    if(g_choiceFolderType != FolderType.document && g_choiceFolderType != FolderType.file)
    {
        alert("请选择文件夹后再操作！")
        return false
    } 
    var dates=new Date();
    newFileId = dates.getTime() 
    if(!addFileJson(g_choiceFolderInfo.id, newFileId))
        return false
    addFile(newFileId, "无标题文件"+newFileId)  
    var bObj = document.getElementById(newFileId);
    setChoiceFileLiType(bObj)
    return true; 
}
function addFile(spanID, spanValue)
{ 
    deleteValue = "移到回收站"
    Ta = '\
    <li draggable="true" ondragend="FileLeave(event)" id=' + spanID +'>\
        <div class="search-content">\
            <div class="search-item search_resulMoveB" file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="" onmouseenter=mouseenterFile(this) onmouseleave=mouseleaveFile() >\
                <i class="icon-Edit editA"></i>\
                <span class="search-item-text" id = "span'+ spanID +'">' + spanValue + '</span>\
                <spn title="' + deleteValue + '"><i class="icon_delete editB"></span>\
                </i>\
            </div>\
        </div>\
    </li>'
    g_searchContainer.innerHTML += Ta
}

function search_UpFileName()
{    
    if(g_choiceFileInfo.name  != g_topFileName.value)
    {             
        g_choiceFileInfo.name = g_topFileName.value    
        obj = document.getElementById( "span" + g_choiceFileInfo.id)
        obj.innerText = g_topFileName.value  
        upFileJson()
    }  
}
 

function InFolder(event)
{
    parId = getParentDiv(event.target).id; 
    if(g_choiceFolderInfo.id == parId)
     {
        g_moveInFolder = 0
        return;
     }   
    event.preventDefault();  
    if(g_moveInFolder != parId)
    { 
        g_moveInFolder = parId 
    }
}
function OutFolder(event)
{  
    g_moveInFolder = 0
}
function FileLeave(event)
{
    event.preventDefault();   
    if(g_moveInFolder < 1 || g_moveInFolder == g_choiceFolderInfo.id)
        return;
    moveIn = g_moveInFolder
    g_moveInFolder = 0; 
    jsonInfo = getFileJsonObj()
    for(var index = 0; index < jsonInfo.length; index ++)
    {
        if(jsonInfo[index] && jsonInfo[index].id == event.target.id)
        {
            jsonInfo[index].folderId = moveIn
            break;
        }
    }
     event.target.remove()  //移除
}
function addNearViewFile(spanID, spanValue)
{  
    addFile(spanID, spanValue) 
}
function addCrashFileLi(spanID, spanValue)
{ 
    deleteValue = "永久删除"
    unCrashValue = "还原"
    Ta = '\
    <li  id=' + spanID + '>\
        <div class="search-content">\
            <div class="search-item search_resulMoveB" file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="" onmouseenter=mouseenterFile(this) onmouseleave=mouseleaveFile() >\
                <i class="icon-Edit editA"></i>\
                <span class="search-item-text">' + spanValue + '</span>\
                <i title="' + deleteValue + '" i class="icon_delete editB"></i>\
                <i title="' + unCrashValue + '" class="icon_unCrash editB"></i>\
            </div>\
        </div>\
    </li>'
    g_searchContainer.innerHTML += Ta
} 
function sortThisFileFolder(parentId, fileId)  //将点击的项移动到第一位
{ 
    parentId = -parentId
    var jsonFile = 0
    for(i = 0; g_jsonFileInfo[parentId][i]; i++)
    {
        if( g_jsonFileInfo[parentId][i].id == fileId && i > g_sortLimit)
        {
            g_jsonFileInfo[parentId].unshift(g_jsonFileInfo[parentId][i])
            g_jsonFileInfo[parentId].splice(i+1,1); 
            upFileJson()
            return true
        }
    } 
    return false
}
function moveFile(obj)
{ 
    var tagLi = getParentTagLi(obj)  
    var fileJson = getFileJsonObj(g_choiceFolderInfo.id)  
    for(item in fileJson)
    {
        if(fileJson[item].id == tagLi.id)
        {
            fileJson[item].type = FolderType.recycleBin   
            upFileJson()
            tagLi.remove()
            break;
        }
    }   
}
function unMoveFile(obj)
{
    var tagLi = getParentTagLi(obj) 
    var fileJson = getFileJsonObj()  
    for(item in fileJson)
    {
        if(fileJson[item].id == tagLi.id)
        {        
            fileJson[item].type = FolderType.file
            unMoveFolder(null, fileJson[item].folderId)
            upFileJson()
            tagLi.remove()
            break;
        }
    }        
} 

function deleteFile(obj)
{ 
    var tagLi = getParentTagLi(obj) 
    var jsonInfo = getFileJsonObj(FolderType.recycleBin) 
    for(item in jsonInfo)
    {
        if(jsonInfo[item].id == tagLi.id)
        {   
            deleteJsonNode(jsonInfo, item) 
            tagLi.remove()
            g_post.deleteFile(tagLi.id)  
            break;
        }
    } 
    upFileJson()
}
function deleteAllFile(parentId)
{    
    i = 0  
    do    //do while 执行遍历删除文件
    {        
        if(g_jsonFileInfo[parentId][i])
        { 
            g_post.deleteFile(parseInt(parentId), parseInt(g_jsonFileInfo[parentId][i].id)) 
            g_jsonFileInfo[parentId].splice(i, 1); 
        }
    }while(g_jsonFileInfo[parentId][i])
    recodeChangeFileContianer(parent)
} 

//文件内容----------------------------------- 

function showTxt(txtInfo)
{ 
    g_detailValue.innerHTML = txtInfo
    if(g_newFile)
    { 
        g_newFile = 0
        g_detailValue.select()
        g_detailValue.focus()        
    }
    onChangeMode()
}


function onKeeptxt()
{   
    if(g_choiceFolderType != FolderType.detail )
        return false;      
    g_post.keepTxt(g_choiceFileInfo.id, g_detailValue.innerHTML) 
    return true
}

//---do cmd
 //传入要获取其中选择文本的对象
 function getSelectedText(selectObj){ 
    ranges = window.getSelection();
    if(ranges.rangeCount > 0)
    {
        start =  selectObj.selectionStart
        end = selectObj.selectionEnd
       return selectObj.value.substring(start, end); 
    }
    return ""
  }


function onCmdAct()
{
    var actStr = getSelectedText(g_detailValue)
    if(actStr != "")
    { 
       g_post.cmdAct("cmdAct", actStr)  
    } 
}

//--other func
function onChangeMode()
{
    m_showWeb.innerHTML = "" 
    try{ 
    JsonInfo = JSON.parse(g_detailValue.innerHTML)
    }catch(err){
        return
    }
    if(JsonInfo)
    { 
        for(var chileLink in JsonInfo)
        {    
            showLink("webShowDetail", JsonInfo[chileLink].link, JsonInfo[chileLink].name)
        } 
    }
}

function showLink(Pid, link, linkName)
{
    chileDiv = document.getElementById(Pid)
    if(chileDiv)
    {
        chileDiv.innerHTML += '&emsp;<a href="' + link + '" target="_blank">' + linkName + '</a>'
    }else
    { 
        objDiv = "<div id=" + Pid + ">" + '<a href="' + link + '" target="_blank">' + linkName + '</a>'
        m_showWeb.innerHTML += objDiv
    }
}