
//文件列表---------------------------------
g_sortLimit = 9  //默认重新排序限制数量
 
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

function loadFile(key, isDelete)
{ 
    jsonInfo =  g_jsonFileInfo[key]
    var setDefault = false
    g_defaultFileKey = 0
    for( i = 0; jsonInfo[i]; i++)
    { 
        if(jsonInfo[i]["isDelete"])
        {
            continue;
        }
        if(!setDefault)
        {
            setDefault = true
            g_defaultFileKey = jsonInfo[i].id
        }
        addFile(-key, jsonInfo[i].id, jsonInfo[i].fName) 
    }
}
function onAddFile()
{      
     
    var id = parseInt(g_choiceDirObj.par.id)
    if(id > 100 && id < 200)
    {

    }else
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
function addFile(divId, spanID, spanValue)
{ 
    deleteValue = "移到回收站"
    Ta = '\
    <li>\
        <div class="search-content" id=' + divId + '>\
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
function onShowTxt(parentId, fileId)
{         
    fileObj = getJsonFileById(parentId, fileId) 
    if( fileObj)
    {    
        g_choiceDirObj.id = Math.abs(parentId)
        g_topFileName.value = fileObj.fName
        g_post.getTxt(parentId, fileObj.id) 
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
    if(g_choiceDirObj.id > 100)
    { 
        fileObj = getJsonFileById(g_choiceDirObj.id, g_choiceFileObj.id) 
        if( fileObj)
        { 
            g_post.keepTxt(parseInt(g_choiceDirObj.id), parseInt(g_choiceFileObj.id), g_detailValue.innerHTML)
        }
    }
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