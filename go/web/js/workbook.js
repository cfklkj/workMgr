
window.onload = main
  
var serverUrl = "127.0.0.1"
var MyToken = ""
var MylistArray = new Array()
var listArrayCount = 0
var Unrecognizable = false
var isEditInfo = false
document.onkeydown=onKeydown
document.onmousedown=onMouseDwon 
function AjaxInfo(GOrP, URL, data, actType)
{ 
   var xhr = new XMLHttpRequest();
   xhr.open(GOrP, URL, true);
   if(MyToken != "")
     xhr.setRequestHeader("token", MyToken); 
   if(data == "")
   {
       xhr.send();
   }else
   {
       xhr.send(JSON.stringify(data));
   }
   xhr.onreadystatechange = function () {;
       if (xhr.readyState == 4) { // 读取完成
           if (xhr.status == 200) { 
               if(actType == "onGetDBlist")
               {
                   onGetDBlist(JSON.parse(xhr.responseText))
               }
               else if(actType == "onShowDir")
               {
                    onShowDir(JSON.parse(xhr.responseText))
               } 
               else if(actType == "showTxt")
               {
                    showTxt(xhr.responseText)
               } 
               else if(actType == "loadFileJson")
               {
                    try
                    {
                        loadFileJson(JSON.parse(xhr.responseText))
                    }catch(err)
                    {
                        loadFileJson(0)
                    }
               } 
               else if(actType == "loadDirJson")
               {
                   try
                   {
                        loadDirJson(JSON.parse(xhr.responseText))
                   }catch(err)
                   {
                        loadDirJson(0)
                   }
               } 
               else if(actType == "showStatu")
               {
                    onShowStatu(xhr.responseText)
               } 
           }
           if(xhr.status == 500){
               if(xhr.responseText == "token timeout")
               {
                   window.location.reload();
               }else
                   alert(xhr.responseText);
           }
       }
   }
}
    
function main() {   
   // document.onkeydown=onKeyLogin     
   m_crash = document.getElementById('crash'); 
   m_crash.onclick = onDelete
   m_saveTxt = document.getElementById('note-save-btn'); 
   m_saveTxt.onclick = onKeeptxt
   m_newFile = document.getElementById('new-file'); 
   m_newFile.onclick = onAddFile
   m_newFolder = document.getElementById('new-folder'); 
   m_newFolder.onclick = onAddFolder
   m_create = document.getElementById('create'); 
   m_create.onclick = onCreate
   
   InitGlobalCtrl()
   InitGlobalParame() 
   onLoadDirJson()
}  
function InitGlobalCtrl()
{    
    g_folderContainer = document.getElementById('folder-Container'); 
    g_searchContainer = document.getElementById('search-Container'); 
    g_listSearch = document.getElementById('list-search'); 
    g_searchValue = document.getElementById('search-value'); 
    g_detailValue = document.getElementById('detail-value'); 
    g_topFileName = document.getElementById('top-fileName'); 
}

function InitGlobalParame()
{
    g_dirCount = 0
    g_choiceDirObj = 0; 
    g_choiceDirIndex = 0;
    g_choiceFileObj = 0;
    g_choiceFileIndex = 0;
    g_jsonDirInfo = 0;
    g_jsonFileInfo = 0;

    g_creatUl = 0;
    g_defaultDirKey = 0;
    g_defaultFileKey = 0;

    g_newFile = 0;
    g_deleteTagI = []; 
}
function onDelete()
{ 
    if(g_choiceDirObj)
    {
        if(g_choiceDirObj == this)
        {
            return
        }
        g_choiceDirObj.par.className = g_choiceDirObj.oldClass
        if(g_choiceDirObj.style.visibility == "visible")
        {
             g_choiceDirObj.style.visibility = "hidden"
        } 
    }
    g_choiceDirObj = this

    g_choiceDirObj.oldClass = this.className 
    g_choiceDirObj.par = this 
    g_choiceDirObj.par.className = "selected" 
    g_choiceDirObj.thisType="crash"

    initFileInfo();
    loadDeleteFolde();
    loadDeleteFile();
}
//获取父节点
function getParentObj(obj)
{
    if(!obj)
        return obj
    var par = obj.parentNode
    if(par)
    {
        if(par.id > 0)return par;   
        if(par.id < -100)return par;        
        return getParentObj(par)
    }
    return par;
}
function findParentObj(obj, id)
{
    var par = obj.parentNode
    if(par)
    {
        if(par.id == id)return par;         
        return getParentObj(par)
    }
    return par;
}
function onKeydown()
{ 
    if (event.ctrlKey == true && event.keyCode == 83) {//Ctrl+S 
        event.returnvalue = false; 
        onKeeptxt()
    } 
} 
function onMouseDwon(event)
{
var btnNum = event.button;
if (btnNum==2)
{
//alert("您点击了鼠标右键！")
}
else if(btnNum==0)
{
    var par = getParentObj(event.srcElement)
    if(event.srcElement.className.indexOf('editC') != -1)  //删除目录
    { 
        if(g_choiceDirObj.id > 100)
        { 
            moveFolder() 
            selectDefualtFolde(g_choiceDirIndex)
        }
        return
    }
    //alert("您点击了鼠标左键！")
    if(!par || !par.id)
        return; 
    if(event.srcElement.className.indexOf('icon_delete') != -1)
    { 
        if(par && par.id > 100) //目录
        { 
            deleteFolder(par)            
        }else{
            if(g_choiceDirObj.thisType == "unCrash")
            { 
                moveFile(par) 
            }else  //彻底删除
            { 
                deleteFile(par)
            } 
        }
        selectDefualtFile(g_choiceFileIndex)
        return
    }
    if(event.srcElement.className.indexOf('icon_unCrash') != -1) //还原
    {
        if(par.id > 100) //目录
        { 
             unMoveFolder(par)            
        }else{
             unMoveFile(par);
        }
        selectDefualtFile(g_choiceFileIndex)
        return
    }
    if(par.id > 99 && par.id < 1000) //第一层目录
    { 
        if(par.className == "slidebar-content")
        {
            selectFolde(par)
        }
       return;
    } else if(par.id < -100) //文件目录
    { 
        selectFile(par)
        return
    }
}
else if(btnNum==1)
{
//alert("您点击了鼠标中键！");
}
else
{
//alert("您点击了" + btnNum+ "号键，我不能确定它的名称。");
}
}
//显示删除图标
function mouseenterFile(obj)
{ 
    var tagI = obj.getElementsByTagName("i") 
    mouseleaveFile()
    g_deleteTagI.B = tagI
    tagI[1].style.visibility = "visible"
    if(tagI[2])
    tagI[2].style.visibility = "visible"
    
}
function mouseleaveFile()
{
    if(g_deleteTagI.B)
    {  
        g_deleteTagI.B[1].style.visibility = "hidden"
        if(g_deleteTagI.B[2])
        g_deleteTagI.B[2].style.visibility = "hidden"
    }
}
function mouseenterFileA(obj)
{ 
    var tagI = obj.getElementsByTagName("i") 
    mouseleaveFileA()
    g_deleteTagI.A = tagI
    tagI[2].style.visibility = "visible" 
    
}
function mouseleaveFileA()
{
    if(g_deleteTagI.A)
    {  
         g_deleteTagI.A[2].style.visibility = "hidden"
    }
}
//新建------------------------
function onCreate()
{ 
    if(g_creatUl && g_creatUl.style.visibility == "visible")
    {            
        g_creatUl.style.visibility = "hidden"
    }else
    {
        var ul = m_create.getElementsByTagName("ul") 
        g_creatUl = ul[0]
        g_creatUl.style.visibility = "visible"
    } 
} 
//选择事件---------------------------------
function unselectFile()
{
    if(g_choiceFileObj)
    { 
        g_choiceFileObj.par.className = g_choiceFileObj.oldClass  
    }
    g_choiceFileObj = 0
}
function unselectFolder()
{ 
    if(g_choiceDirObj)
    { 
        g_choiceDirObj.par.className = g_choiceDirObj.oldClass  
    }
    g_choiceDirObj = 0
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
function selectFile(parent)
{
    if(parent.id > 100)  //目录
        return
    var span = parent.getElementsByTagName("span") 
    if(g_choiceFileObj == span[0])
    {
        return
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

} 
function fileIndex(parent)
{
    var par = parent.parentNode
    var tagLi = g_searchContainer.getElementsByTagName("li")
    for(i = 0; tagLi[i]; i++)
    {
        if(tagLi[i] == par)
        {
            return i
        }
    }
    return 0
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
function recodeFileIndex(parent)
{
    g_choiceFileIndex = fileIndex(parent) 
}
function selectFolde(parent)
{ 
    var tagI = parent.getElementsByTagName("i")
    if(g_choiceDirObj)
    {
        if(g_choiceDirObj == tagI[0])
        {
            return
        }
        g_choiceDirObj.par.className = g_choiceDirObj.oldClass
        if(g_choiceDirObj.style.visibility == "visible")
        {
             g_choiceDirObj.style.visibility = "hidden"
        } 
    }
    g_choiceDirObj = tagI[0]

    g_choiceDirObj.oldClass = parent.className 
    g_choiceDirObj.par = parent 
    g_choiceDirObj.par.className = "selected"
    g_choiceDirObj.thisType="unCrash"

    g_choiceDirObj.id = parent.id 
    g_choiceDirObj.style.visibility = "visible";  
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
function onLoadFolder()
{ 
    loadFolder(g_jsonDirInfo)
    if(g_defaultDirKey)   
    { 
        var bObj = document.getElementById(g_defaultDirKey);
        selectFolde(bObj)
    }
}
function onLoadDirJson()
{
    onShowStatu("加载文件夹");
    var data = {"JsonType":"Dir"}    
    AjaxInfo("post",serverUrl + '/Workbook&getJson', data, "loadDirJson")   
}
function upDirJson()
{
    onShowStatu("添加文件夹");
    var data = {"JsonType":"Dir", "txtInfo":JSON.stringify(g_jsonDirInfo)}  
    AjaxInfo("post",serverUrl + '/Workbook&upJson', data, "showStatu")  
}
function loadDirJson(jsonInfo)
{
    if(jsonInfo)
    {
        g_jsonDirInfo = jsonInfo
    }else{
        g_jsonDirInfo = []//JSON.parse('[{"fName":"c++","id":101},{"fName":"java","id":102}]')
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
function moveFolder()
{  
    parentId = g_choiceDirObj.id  
    for(j = 0; g_jsonDirInfo[j]; j ++)
    {
        if( g_jsonDirInfo[j].id == parentId)
        {                   
            g_jsonDirInfo[j]["isDelete"] = true  
            break;
        }
    }    
    recodeChangeFolderContianer(g_choiceDirObj.par) 
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

function recodeChangeFolderContianer(parent)
{
    if(g_choiceDirIndex == 0 || (g_choiceDirIndex > 0 && g_choiceDirIndex == foldeIndex(parent)))
    {
        
        var li = g_folderContainer.getElementsByTagName("li") 
        if(!li[g_choiceDirIndex + 1])  //没有下个节点
        {
            for(i = g_choiceDirIndex - 1; i > 0; i--) 
            {
                if(li[i])
                    break
            } 
            if(!li[i]) //没有节点了
            {
                g_choiceDirIndex = -1
            }else
            {
                g_choiceDirIndex = i
            }
        } 
    }
    g_folderContainer.removeChild(parent.parentNode)  //parent.remove()
    upDirJson()
}
//文件
function onLoadFileJson()
{
    var data = {"JsonType":"fileName"}  
    AjaxInfo("post",serverUrl + '/Workbook&getJson', data, "loadFileJson")    
}

function loadFileJson(jsonInfo)
{
    if(jsonInfo)
    {
        g_jsonFileInfo = jsonInfo
    }else{
        g_jsonFileInfo = [];// JSON.parse('{"101":[{"id":1,"fName":"hello"},{"id":2,"fName":"word"}],"102":[{"id":1,"fName":"hello"},{"id":2,"fName":"word"}]}') 
    }    
    onLoadFolder() 
}
function upFileJson()
{
    var data = {"JsonType":"fileName", "txtInfo":JSON.stringify(g_jsonFileInfo)}  
    AjaxInfo("post",serverUrl + '/Workbook&upJson', data, "showStatu")
}
//显示状态
function onShowStatu(msgInfo)
{ 
    g_searchValue.innerText = msgInfo
}
 
function initFileInfo()
{    
    g_searchContainer.innerHTML = "" 
    g_detailValue.innerText = ""
    g_topFileName.value = ""
}

//文件列表---------------------------------
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
        addCrashFolde(jsonInfo[i].id, jsonInfo[i].id, jsonInfo[i].fName)   
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
            <div class="search-item " file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="" onmouseenter=mouseenterFile(this) onmouseleave=mouseleaveFile() >\
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
            <div class="search-item " file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="" onmouseenter=mouseenterFile(this) onmouseleave=mouseleaveFile() >\
                <i class="icon-Edit editA"></i>\
                <span class="search-item-text" id=' + spanID + '>' + spanValue + '</span>\
                <i title="' + deleteValue + '" i class="icon_delete editB"></i>\
                <i title="' + unCrashValue + '" class="icon_unCrash editB"></i>\
            </div>\
        </div>\
    </li>'
    g_searchContainer.innerHTML += Ta
}
function addCrashFolde(divId, spanID, spanValue)
{ 
    deleteValue = "永久删除"
    unCrashValue = "还原"
    Ta = '\
    <li>\
        <div class="search-content" id=' + divId + '>\
            <div class="search-item " file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="" onmouseenter=mouseenterFile(this) onmouseleave=mouseleaveFile() >\
                <i class="icon-folder folderA"></i>\
                <span class="search-item-text" id=' + spanID + '>' + spanValue + '</span>\
                <i title="' + deleteValue + '" i class="icon_delete editB"></i>\
                <i title="' + unCrashValue + '" class="icon_unCrash editB"></i>\
            </div>\
        </div>\
    </li>'
    g_searchContainer.innerHTML += Ta
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
function recodeChangeFileContianer(parent)
{
    if(g_choiceFileIndex == 0 || (g_choiceFileIndex > 0 && g_choiceFileIndex == fileIndex(parent)))
    {
        
        var li = g_searchContainer.getElementsByTagName("li") 
        if(!li[g_choiceFileIndex + 1])  //没有下个节点
        {
            for(i = g_choiceFileIndex - 1; i > 0; i--) 
            {
                if(li[i])
                    break
            } 
            if(!li[i]) //没有节点了
            {
                g_choiceFileIndex = -1
            }else
            {
                g_choiceFileIndex = i
            }
        } 
    }
    isFolde = parent.id  > 100
    if(isFolde)
    {
        upDirJson()
    }else{ 
        upFileJson()
    }
    g_searchContainer.removeChild(parent.parentNode)  //parent.remove()
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
    var data = {"parentId":parseInt(parentId), "fileId": parseInt(fileId), "unrecognizable":false}   
    AjaxInfo("post",serverUrl + '/Workbook&deleteFile', data, "showStatu")
}
function deleteAllFile(parentId)
{    
    i = 0  
    do    //do while 执行遍历删除文件
    {        
        if(g_jsonFileInfo[parentId][i])
        { 
            var data = {"parentId":parseInt(parentId), "fileId": parseInt(g_jsonFileInfo[parentId][i].id), "unrecognizable":false}   
            AjaxInfo("post",serverUrl + '/Workbook&deleteFile', data, "showStatu") 
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
function search_UpFileName(fileObj)
{    
    if(fileObj.fName != g_topFileName.value)
    {            
        fileObj.fName = g_topFileName.value 
        g_choiceFileObj.innerText = g_topFileName.value 
        upFileJson()
    }  
}
//文件内容-----------------------------------
function onShowTxt(parentId, fileId)
{           
    fileObj = getJsonFileById(parentId, fileId) 
    if( fileObj)
    {
        g_topFileName.value = fileObj.fName
        var data = {"parentId":parentId, "fileId": fileObj.id, "unrecognizable":true}   
        AjaxInfo("post",serverUrl + '/Workbook&getTxt', data, "showTxt")  
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
}
function onKeeptxt()
{ 
    fileObj = getJsonFileById(g_choiceDirObj.id, g_choiceFileObj.id) 
    if( fileObj)
    {
        var data = {"parentId":g_choiceDirObj.id, "fileId": fileObj.id, "txtInfo":g_detailValue.innerHTML}   
        list_upDirName(g_choiceDirObj.id)
        search_UpFileName(fileObj)
        var data = {"parentId":parseInt(g_choiceDirObj.id), "fileId": fileObj.id, "txtInfo":g_detailValue.innerHTML}  
        AjaxInfo("post",serverUrl + '/Workbook&keepTxt', data, "showStatu")
    }
}




//list-search
function list_setOpenDir(parent)
{
    var span = g_listSearch.getElementsByTagName("span")
    var input = g_listSearch.getElementsByTagName("input")
    span[1].className = "icon-oFolde"
    input[0].value = parent.innerText
}
function list_upDirName(parentId)
{ 
    dirObj = getJsonFoldeById(parentId)
    if(!dirObj)
        return
    var span = g_choiceDirObj.par.getElementsByTagName("span")
    var input = g_listSearch.getElementsByTagName("input")
    if(g_choiceDirObj.fName != input[0].value)
    {            
        dirObj.fName = input[0].value 
        span[0].innerText = input[0].value 
        upDirJson()
    }  
}





 