
//文件列表---------------------------------
g_sortLimit = 9  //默认重新排序限制数量
g_choiceFileInfo = []   //选择的文件信息
g_choiceFileLi = "" //选择的标签 
 
//文件
function onLoadFileJson()
{ 
    g_post.getJson("fileName", loadFileJson)
}

function loadFileJson(responseText)
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
        g_jsonFileInfo = jsonInfo
    }else{
        g_jsonFileInfo = [];// JSON.parse('{"101":[{"id":1,"fName":"hello"},{"id":2,"fName":"word"}],"102":[{"id":1,"fName":"hello"},{"id":2,"fName":"word"}]}') 
    }    
   onLoadFolder()   
       
}

function onLoadFile(key)
{
    
    initFileInfo()
    if(g_jsonFileInfo.hasOwnProperty(key))
    {  
        loadFile(key)        
        if(g_defaultFileKey)
        {  
            var bObj = document.getElementById(g_defaultFileKey);
            var Par = getParentObj(bObj)
            selectFile(Par)
        }
    } 
}

function loadDeleteFolde()
{   
    jsonInfo = g_jsonDirInfo;
    for(i = 0; jsonInfo[i]; i++){  
        if(!jsonInfo[i]["isDelete"])
        {
            continue;
        } 
        addCrashFolde(jsonInfo[i].id, jsonInfo[i].id, jsonInfo[i].fName, "永久删除")   
    }      
}
function loadUnDeleteFolde()
{   
    jsonInfo = g_jsonDirInfo;
    for(i = 0; jsonInfo[i]; i++){  
        if(jsonInfo[i]["isDelete"])
        {
            continue;
        } 
        addUnCrashFolde(jsonInfo[i].id, jsonInfo[i].id, jsonInfo[i].fName, "移到回收站")   
    }      
}

function loadDeleteFile()
{ 
    var setDefault = false 
    for(var item in g_jsonFileInfo){ 
        var jsonInfo=g_jsonFileInfo[item]; 
        for( i = 0; jsonInfo[i]; i++)
        { 
            if(!jsonInfo[i]["isDelete"])
            {
                continue;
            }
            if(!setDefault)
            {
                setDefault = true
                g_defaultDirKey = item
                g_defaultFileKey = jsonInfo[i].id
            }
            addCrashFile(-item, jsonInfo[i].id, jsonInfo[i].fName)  
        }
    }     
    selectDefualtFile(0) 
}

function loadFiles(parentId)
{       
    console.log(parentId)
    g_searchContainer.innerHTML = ""
    jsonInfo = getFileJson(parentId)
    console.log(jsonInfo)
    for( i = 0; jsonInfo[i]; i++)
    {   
        addFile(jsonInfo[i].id, jsonInfo[i].name) 
        if(i == 0) { 
            selectFile(jsonInfo[i].id)
        }
    }
    return i > 0
}
function getFileJson(parentId)
{ 
    jsonInfo = g_jsonFileInfo[parentId]     
   if(!jsonInfo)
   { 
       jsonInfo = g_jsonFileInfo[parentId] = []  
   } 
   return  jsonInfo;
}
function addFileJson(parentId, newNode)
{ 
    jsonInfo = g_jsonFileInfo[parentId]     
   if(!jsonInfo)
   { 
       jsonInfo = g_jsonFileInfo[parentId] = []  
   } 
   jsonInfo.push(newNode); 
   return  jsonInfo;
}
function selectFileAct(choiceFileId)
{
    if(g_choiceFolderType != FolderType.file)
        return false;
    return selectFile(choiceFileId)
}
function selectFile(choiceFileId)
{ 
    if(choiceFileId == "")
       return false;
    if(g_choiceFileInfo.id  == choiceFileId)
        return false;
    jsonInfo = getFileJson(g_choiceFolderId)
    for( i = 0; jsonInfo[i]; i++)
    {   
        if(jsonInfo[i].id == choiceFileId)
        {
            g_choiceFileInfo = jsonInfo[i]
            break;
        }
    } 
    g_topFileName.value = g_choiceFileInfo.name 
    g_post.getTxt(g_choiceFileInfo.id)  
    return true;
}

function selectFileStatu(choiceFileId)
{ 
    console.log("choiceFileId")
    console.log(choiceFileId)
    obj = document.getElementById(choiceFileId)
    if(!obj)
        return false;
    tagLi = getParentTagLi(obj)
    if(tagLi.tagName != "LI")
        return false;  
    tagLi.className = "fileSelected"
    if(g_choiceFileLi != "")
    {  
        g_choiceFileLi.className = ""
        g_choiceFileLi = tagLi 
    }else
    { 
        g_choiceFileLi = tagLi
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
function selectFile1(parent)
{
    if(parent.id > 100)  //目录
        return false
    var span = parent.getElementsByTagName("span") 
    if(g_choiceFileObj == span[0])
    {
        return true
    } 
    if(g_choiceFileObj)
    { 
        g_choiceFileObj.par.className = g_choiceFileObj.oldClass  
    }
    g_choiceFileObj = span[0] 

    g_choiceFileObj.oldClass = parent.className 
    g_choiceFileObj.par = parent 
    g_choiceFileObj.par.className = "fileSelected"
    onShowTxt(-parent.id,  g_choiceFileObj.id)
    recodeFileIndex(parent)
    return true
} 
 
function onAddFile()
{           
    if(g_choiceFolderType != FolderType.document)
    {
        alert("请选择文件夹后再操作！")
        return false
    } 
    var dates=new Date();
    newFileId = dates.getTime()
    var newNode = {
        "id":newFileId,
        "name":"无标题文件"
    }   
    addFileJson(g_choiceFolderId, newNode)
    jsonInfo = getFileJson(g_choiceFolderId)
    console.log("g_choiceFolderId")
    console.log(jsonInfo)
    console.log(g_jsonFileInfo)
    addFile(newNode.id, newNode.name) 
    if(selectFile(newNode.id))
    {
        selectFileStatu(newNode.id)
    } 
    return true; 
}
function addFile(spanID, spanValue)
{ 
    deleteValue = "移到回收站"
    Ta = '\
    <li draggable="true" ondragend="FileLeave(event)">\
        <div class="search-content">\
            <div class="search-item search_resulMoveB" file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="" onmouseenter=mouseenterFile(this) onmouseleave=mouseleaveFile() >\
                <i class="icon-Edit editA"></i>\
                <span class="search-item-text" id=' + spanID + '>' + spanValue + '</span>\
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
        console.log('search_UpFileName')
        console.log(g_choiceFileInfo)
        console.log(g_jsonFileInfo)
        g_choiceFileInfo.name = g_topFileName.value 
        console.log(g_choiceFileInfo)
        console.log(g_jsonFileInfo)
        document.getElementById(g_choiceFileInfo.id).innerText = g_topFileName.value 
        upFileJson()
    }  
}

//--old

function onAddFile1()
{           
    if(g_choiceFolderType != FolderType.document)
    {
        alert("请选择文件夹后再操作！")
        return 
    } 
    jsonInfo =  g_jsonFileInfo[g_choiceDirObj.id]    
    var g_newFile = 0
     if(!jsonInfo)
    { 
        jsonInfo = g_jsonFileInfo[g_choiceDirObj.id] = []  
    }
    //得到新ID 
    for(j = 1; !g_newFile ;j++)
    { 
        for( i = 0; jsonInfo[i]; i++)
        { 
            if(j == jsonInfo[i].id)
            {
                break;
            }
        }
        if(!jsonInfo[i])
        {            
            g_newFile = j;
            var newNode = {
                "id":j,
                "fName":"newFile"
            } 
            jsonInfo.push(newNode);
        }
    }
    unselectFile()
    addFile(-g_choiceDirObj.id, g_newFile, "无标题文件") 
    var bObj = document.getElementById(g_newFile);
    var Par = getParentObj(bObj)
    selectFile(Par)
    g_topFileName.value = "无标题文件"
}
function InFolder(event)
{
    event.preventDefault(); 
    var par = getParentObj(event.target)
    console.log(par.id)
    console.log(event)
}
function FileLeave(event)
{
    event.preventDefault(); 
    //alert(event.target.getAttribute("value"));
    event.target.remove()  //移除
}
function addCrashFile(divId, spanID, spanValue)
{ 
    deleteValue = "永久删除"
    unCrashValue = "还原"
    Ta = '\
    <li>\
        <div class="search-content" id=' + divId + '>\
            <div class="search-item search_resulMoveB" file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="" onmouseenter=mouseenterFile(this) onmouseleave=mouseleaveFile() >\
                <i class="icon-Edit editA"></i>\
                <span class="search-item-text" id=' + spanID + '>' + spanValue + '</span>\
                <i title="' + deleteValue + '" i class="icon_delete editB"></i>\
                <i title="' + unCrashValue + '" class="icon_unCrash editB"></i>\
            </div>\
        </div>\
    </li>'
    g_searchContainer.innerHTML += Ta
}
function addUnCrashFolde(divId, spanID, spanValue,  deleteValue)
{   
    Ta = '\
    <li>\
        <div class="search-content" id=' + divId + '>\
            <div class="search-item search_resulMoveB" file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="" onmouseenter=mouseenterFile(this) onmouseleave=mouseleaveFile() >\
                <i class="icon-folder folderA"></i>\
                <span class="search-item-text" id=' + spanID + '>' + spanValue + '</span>\
                <i title="' + deleteValue + '" i class="icon_delete editD"></i>\
            </div>\
        </div>\
    </li>'
    g_searchContainer.innerHTML += Ta
} 
function addCrashFolde(divId, spanID, spanValue,  deleteValue)
{  
    unCrashValue = "还原"
    Ta = '\
    <li>\
        <div class="search-content" id=' + divId + '>\
            <div class="search-item search_resulMoveB" file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="" onmouseenter=mouseenterFile(this) onmouseleave=mouseleaveFile() >\
                <i class="icon-folder folderA"></i>\
                <span class="search-item-text" id=' + spanID + '>' + spanValue + '</span>\
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
function upFileJson()
{
    g_post.upJson("fileName", JSON.stringify(g_jsonFileInfo)) 
}
function moveFile(parent)
{
    var span = parent.getElementsByTagName("span")
    parentId = -parent.id
    fileId = span[0].id
    
    var jsonFile = 0
    for(i = 0; g_jsonFileInfo[parentId][i]; i++)
    {
        if( g_jsonFileInfo[parentId][i].id == fileId)
        {
            g_jsonFileInfo[parentId][i]["isDelete"] = true 
            break;
        }
    } 
    recodeChangeFileContianer(parent)
}
function unMoveFile(parent)
{
    var span = parent.getElementsByTagName("span")
    parentId = -parent.id
    fileId = span[0].id
    
    var jsonFile = 0
    for(i = 0; g_jsonFileInfo[parentId][i]; i++)
    {
        if( g_jsonFileInfo[parentId][i].id == fileId)
        {
            g_jsonFileInfo[parentId][i]["isDelete"] = false
            break;
        }
    }  
    recodeChangeFileContianer(parent)
}



function deleteFile(parent)
{
    var span = parent.getElementsByTagName("span")
    parentId = -parent.id
    fileId = span[0].id
    
    var jsonFile = 0
    for(i = 0; g_jsonFileInfo[parentId][i]; i++)
    {
        if( g_jsonFileInfo[parentId][i].id == fileId)
        {  
            g_jsonFileInfo[parentId].splice(i, 1); 
            break;
        }
    }   
    recodeChangeFileContianer(parent)
    g_post.deleteFile(parseInt(parentId), parseInt(fileId))  
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
function getJsonFileById(parentId, fileId)
{
    for(i = 0; g_jsonFileInfo[parentId][i]; i++)
    {
        if( g_jsonFileInfo[parentId][i].id == fileId)
        {
            return g_jsonFileInfo[parentId][i]
        }
    }
    return 0
}



//文件内容-----------------------------------
function onShowTxt1(fileId, fileName)
{         
    g_topFileName.value = fName 

    //--old
    return 
    fileObj = getJsonFileById(parentId, fileId) 
    if( fileObj)
    {    
        g_choiceDirObj.id = Math.abs(parentId)
        g_topFileName.value = fileObj.fName 
    } 
}

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
    console.log("onkeep")
    console.log(g_choiceFolderType) 
    if(g_choiceFolderType != FolderType.detail )
        return false;      
    g_post.keepTxt(g_choiceFileInfo.id, g_detailValue.innerHTML) 
    return true
}


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