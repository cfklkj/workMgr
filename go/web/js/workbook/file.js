 

//文件列表---------------------------------
g_sortLimit = 9  //默认重新排序限制数量
g_choiceFileInfo = []   //选择的文件信息
g_choiceFileLi = "" //选择的标签 
g_isChoiceFile = false  //是否处于选择中
g_moveInFolder = -1;
 
g_nearFileLimit = 10
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
    parentId =  g_choiceFolderInfo.id
    g_searchContainer.innerHTML = ""
    jsonInfo = getFileJsonObj() 
    g_choiceFileInfo = []
    console.log("loadFiles：lenth="+jsonInfo.length)
    console.log(jsonInfo) 
    var isUpJson = false
    for(var item =0 ; item < jsonInfo.length; item ++)
    {    
        console.log(jsonInfo[item])
        if(!jsonInfo[item] ||  typeof(jsonInfo[item].id) != 'number' || jsonInfo[item].folderId != parentId || jsonInfo[item].type != FolderType.file)
       {
           if (typeof(jsonInfo[item].id) != 'number')
           {
                isUpJson = true
               deleteJsonNode(jsonInfo, item);
           }
           continue;
       }    
            console.log("add")
        addFile(jsonInfo[item].id, jsonInfo[item].name)    
    } 
    if(isUpJson)
    {
        upFileJson()
    }
    return i > 0
} 

//--最近浏览
function loadNearFile()
{     
    jsonObj = getFileJsonObj() 
    isUpJson = false
    var dates=new Date(); 
    viewTime = dates.getTime();
    var viewItem = [] 
    for(var item = 0 ; item < jsonObj.length; item ++){   
        if (typeof(jsonObj[item].id) != 'number')
        {
             isUpJson = true
            deleteJsonNode(jsonObj, item);
            continue; 
        } 
        if(jsonObj[item].viewTime)
        {
            viewItem[viewItem.length] = jsonObj[item]  
        }
    } 
    viewItem.sort()
    for(item  = 0; item < g_nearFileLimit; item ++)
    {
        addNearViewFile(viewItem[item].id, viewItem[item].name)  
    }
    if(isUpJson)     
    {
        upFileJson()
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
    console.log("selectNearFile")
    if(g_choiceFolderType != FolderType.nearView)
        return false 
    par = getParentDiv(obj) 
    console.log(par.id)
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
    console.log("selectFile")
    console.log(choiceFileId)
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
            var dates=new Date(); 
            jsonInfo[i].viewTime = dates.getTime()
            break;
        }
    } 
    upFileJson() 
    setChoiceFileText(g_choiceFileInfo.name) 
    g_post.getTxt(g_choiceFileInfo.id)  
    return true;
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
    console.log(g_choiceFolderType)
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
        console.log(parId)
        g_moveInFolder = parId
        console.log("InFolder")
        console.log(g_moveInFolder)
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
    console.log("FileLeave--:"+moveIn);
        console.log(event.target.id)
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
    Ta = '\
    <li>\
        <div class="search-content" id=' + spanID + ' value = ' + spanValue + '>\
            <div class="search-item search_resulMoveB" file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="" onmouseenter=mouseenterFile(this) onmouseleave=mouseleaveFile() >\
                <i class="icon-Edit editA"></i>\
                <span class="search-item-text">' + spanValue + '</span>\
            </div>\
        </div>\
    </li>'
    g_searchContainer.innerHTML += Ta
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
    console.log("moveFile")
    var tagLi = getParentTagLi(obj) 
    console.log(tagLi.id)
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
            console.log("unMoveFile")
            console.log(fileJson[item])
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
    console.log("deleteFile")
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
    console.log("onKeepTxt")
    console.log(g_choiceFolderType)
    console.log(FolderType.detail)
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
    JsonInfo = JSON.parse(g_detailValue.innerHTML)
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