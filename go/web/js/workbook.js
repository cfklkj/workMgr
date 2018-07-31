
window.onload = main
  
var serverUrl = "127.0.0.1"  
var MyToken = "1111"
var Unrecognizable = false 

function Post(){
    //请求数据
    this.request = function(GOrP, URL, jsonData, callBack){
        var xhr = new XMLHttpRequest();
        xhr.open(GOrP, URL, true);
        if(MyToken != "")
          xhr.setRequestHeader("token", MyToken); 
        if(jsonData == "")
        {
            xhr.send();
        }else
        {
            xhr.send(JSON.stringify(jsonData));
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) { // 读取完成
                if (xhr.status == 200) { 
                    return callBack(xhr.responseText)
                }
            } 
            if(xhr.status == 500){
                if(xhr.responseText == "token timeout")
                {
                    window.location.reload();
                }else
                    alert(xhr.responseText);
            }else{
                console.debug("request error");
            }
        }
    }
    //导入
    this.import = function(){
        g_creatUl.style.visibility = "hidden"
        var data = {"Package":"import"}  
        this.request("post",serverUrl + '/Workbook&pakage', data, listImport) 
    }
    //导出
    this.export = function(){        
        var data = {"Package":"export"}  
        this.request("post",serverUrl + '/Workbook&pakage', data, onShowStatu)
    }
    //获取文本
    this.getTxt = function(pId, cId){
        var data = {"parentId":pId, "fileId": cId, "unrecognizable":true}   
        this.request("post",serverUrl + '/Workbook&getTxt', data, showTxt)   
    }
    //保存文本
    this.keepTxt = function(pId, cId, txtInfo){
        var data = {"parentId":pId, "fileId": cId, "txtInfo":txtInfo}  
        this.request("post",serverUrl + '/Workbook&keepTxt', data, onShowStatu)
    }
    //删除文件
    this.deleteFile = function(pId, cId){ 
        var data = {"parentId":pId, "fileId": cId, "unrecognizable":false}   
        this.request("post",serverUrl + '/Workbook&deleteFile', data, onShowStatu) 
    }
    //获取JSON文件配置
    this.getJson = function(jsonType, resFunc){ 
        var data = {"JsonType":jsonType}   
        this.request("post",serverUrl + '/Workbook&getJson', data, resFunc)   
    }
    //更新JSON文件配置
    this.upJson = function(jsonType, txtInfo){
        var data = {"JsonType":jsonType, "txtInfo":txtInfo}   
        this.request("post",serverUrl + '/Workbook&upJson', data, onShowStatu) 
    }  
    //更新项目名称
    this.upPro = function(proType, proName, resFunc){
        var data = {"ProType":proType, "proName":proName}     
        this.request("post",serverUrl + '/Workbook&ProInfo', data, resFunc)  
    } 
}
 
 
    
function main() {   
    g_post = new Post()

    InitNearOpen()
   InitGlobalParame() 
   document.onkeydown=onKeydown
   document.onmousedown=onMouseDwon 
   document.onmouseup=onMouseUp 
   document.onmousemove=onMouseMove 

   // document.onkeydown=onKeyLogin     
   m_crash = document.getElementById('crash'); 
   m_crash.onclick = onDelete
   m_nearOpen = document.getElementById('nearOpen'); 
   m_nearOpen.onclick = onNearOpen
   m_saveTxt = document.getElementById('note-save-btn'); 
   m_saveTxt.onclick = onKeeptxt
   m_newFile = document.getElementById('new-file'); 
   m_newFile.onclick = onAddFile
   m_newFolder = document.getElementById('new-folder'); 
   m_newFolder.onclick = onAddFolder
   m_listImport = document.getElementById('list-import'); 
   m_listImport.onclick = onListImport
   m_listExport = document.getElementById('list-export'); 
   m_listExport.onclick = onListExport
   m_listCreate = document.getElementById('list-create'); 
   m_listCreate.onclick = onNewPro
   m_listOpen = document.getElementById('list-open'); 
   m_listOpen.onclick = onOpenPro
   g_listMenu = document.getElementById('list-menu'); 
   g_listMenu.onclick = list_menus 
   
   InitGlobalCtrl()
   onGetProject()
}  
function InitGlobalCtrl()
{    
    g_loadFolder = document.getElementById('loadFolder'); 
    g_loadFolder.onclick = onLoadFolders
    m_create = document.getElementById('create'); 
    m_create.onclick = onCreate
    g_folderContainer = document.getElementById('folder-Container'); 
    g_searchContainer = document.getElementById('search-Container'); 
    g_listSearch = document.getElementById('list-search');  
    g_searchValue = document.getElementById('search-value'); 
    g_detailValue = document.getElementById('detail-value'); 
    g_topFileName = document.getElementById('top-fileName'); 
    g_flexibleLeft = document.getElementById('flexible-left'); 
    g_flexibleMide = document.getElementById('flexible-mide'); 
    g_flexibleRight = document.getElementById('flexible-right'); 
    g_dragMide = document.getElementById('dragMid');  
    g_dragLeft = document.getElementById('dragSide');  
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
    g_proName = ""
    g_dragMove = 0;
    g_isDeleteFolder  = false;
}
//drag---------------------------------
function getStyle(obj, attr)
{  

    if(obj.currentStyle)  {  
  
      return obj.currentStyle[attr];  
  
    } else{  
  
      return getComputedStyle(obj,false)[attr];  
    }
  
} 
function onDragMid(Y)
{ 
    var widthLeft =  parseInt(getStyle(g_flexibleLeft, "width"))
    newWidth = Y - widthLeft
    if(newWidth  > 300 && newWidth < 800)
    {
        var widthMide =  parseInt(getStyle(g_flexibleMide, "width"))  
        g_flexibleMide.style.width = newWidth
        g_flexibleRight.style.left = Y + 4
        bodyWidth =  document.body.clientWidth   
        g_flexibleRight.style.width = bodyWidth - newWidth
    } 
}
function onDragLeft(Y)
{  
    if( Y <250)
    {
        Y = 251
    }
    if(Y < 500)
    {
        var widthMide =  parseInt(getStyle(g_flexibleMide, "width"))  
        g_dragLeft.style.left = Y
        g_flexibleLeft.style.width = Y
        g_flexibleMide.style.left = Y + 2
        g_flexibleRight.style.left = Y + widthMide + 2*2
        bodyWidth =  document.body.clientWidth   
        g_flexibleRight.style.width = bodyWidth - Y- widthMide
    } 
}
//获取项目-------------------------------------
function onGetProject()
{     
    g_post.getJson("Project", loadProJson) 
}
function loadProJson(proName)
{ 
    list_setProject(proName)
    //加载目录
    onLoadDirJson()
}
function UpProject()
{     
    g_post.upPro("rename", g_proName, onUpProject) 
}
function onUpProject(info)
{
    if(info == 'ok')
    {
        var span = g_loadFolder.getElementsByTagName("span")
        span[0].title = g_proName
    }else
    {
        alert(info)
    }
}
function onNewPro()
{    
    g_creatUl.style.visibility = "hidden"
    g_proName = "newPro"
    g_post.upPro("new", g_proName, newPro)
}
function onOpenPro()
{
    g_creatUl.style.visibility = "hidden"
    g_post.upPro("open", g_proName, newPro) 
}
function newPro(proName)
{
    if(proName != ""){ 
        location.reload()
    }
}
function onDelete()
{ 
    selectFolde(this)
    g_choiceDirObj.thisType="crash"

    initFileInfo();
    loadDeleteFolde();
    loadDeleteFile();
}
function onNearOpen()
{
    selectFolde(m_nearOpen)
    g_choiceDirObj.thisType="unCrash"
    initFileInfo();
    loadNearFile();
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
    else{ 
        if(event.keyCode == 13)
        {
            if(document.activeElement.id == "top-fileName")
            {
                search_UpFileName(fileObj) 
            }else if(document.activeElement.id == "search-Name")
            {
                if(g_choiceDirObj.par.id == "loadFolder")
                {
                    list_UpProject(); 
                }else if(Math.abs(g_choiceDirObj.par.id) > 100){
                    list_upDirName(g_choiceDirObj.id) 
                }               
                
            }
        } 
    }
} 
function onMouseUp()
{
    var btnNum = event.button;
   // console.log("eventUp %d", btnNum)
   if(btnNum==0)
   { 
        g_dragMove = 0; 
   }

}
function onMouseMove(event)
{
    var btnNum = event.button; 
   if(g_dragMove == 1)
   {
        onDragMid(event.clientX)
   }
   if(g_dragMove == 2)
   {
        onDragLeft(event.clientX)
   }

}
function onMouseDwon(event)
{
var btnNum = event.button; 
if (btnNum==2)
{ 
    console.log("您点击了鼠标右键！")
}
else if(btnNum==0)
{
    if(event.srcElement == g_dragMide)
    {
        g_dragMove = 1; 
        return;
    }
    if(event.srcElement == g_dragLeft)
    {
        g_dragMove = 2; 
        return;
    }
    var par = getParentObj(event.srcElement)
    if(event.srcElement.className.indexOf('editC') != -1 || event.srcElement.className.indexOf('editD') != -1)  //删除目录
    { 
        var id =  Math.abs(g_choiceDirObj.par.id)
        if(id >100 && id < 200)
        {
        }else{          
            try{
                par.id
            } catch(err){
                alert("请选择文件夹后再操作")
                return
            }
        }
        if(g_choiceDirObj.id > 100)
        { 
            g_isDeleteFolder = true;
            moveFolder(g_choiceDirObj.id)             
            recodeChangeFolderContianer(g_choiceDirObj.par) 
            selectDefualtFolde(g_choiceDirIndex) 
        }else if(par.id > 100)
        {
            moveFolder(par.id)
            recodeChangeFileContianer(par)
            selectDefualtFile(g_choiceFileIndex)
            loadFolder(g_jsonDirInfo)
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
                recodeChangeFolderContianer(par) 
                selectDefualtFolde(g_choiceDirIndex)
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
            if(g_choiceDirObj.par == g_loadFolder)
            {
                list_UpProject()
            }
            selectFolde(par)
        }
       return;
    } else if(par.id < -100) //文件目录
    {  
        if(selectFile(par) && g_choiceDirObj.par.parentNode.parentNode == g_folderContainer)
        { 
            AddNearOpen(par.id,  g_choiceFileObj.id)
        }
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
    if(g_choiceDirIndex < 0)
    {
        return 
    } 
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
function upFileJson()
{
    g_post.upJson("fileName", JSON.stringify(g_jsonFileInfo)) 
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




//list-search
function list_setProject(projectName)
{
    g_proName = projectName
    var span = g_listSearch.getElementsByTagName("span")
    var input = g_listSearch.getElementsByTagName("input")
    span[1].className = "icon-oFolde"
    input[0].value = g_proName
    var span = g_loadFolder.getElementsByTagName("span")
    span[0].title = g_proName
}
function list_UpProject()
{ 
    if(g_choiceDirObj.par != g_loadFolder)
        return
    var input = g_listSearch.getElementsByTagName("input") 
    g_proName =  input[0].value
    UpProject()
}
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


function list_menus()
{ 
    var ul = g_listSearch.getElementsByTagName("ul") 
    if(g_creatUl && g_creatUl.style.visibility == "visible")
    {           
        if(g_creatUl == ul[0]) 
        { 
            g_creatUl.style.visibility = "hidden"
        }else
        {
            g_creatUl.style.visibility = "hidden" 
            g_creatUl = ul[0]
            g_creatUl.style.visibility = "visible"
        }
    }else
    {
        g_creatUl = ul[0]
        g_creatUl.style.visibility = "visible"
    } 
} 

function onListImport(responseText)
{     
    
    if(responseText == "已执行--")
    {
        g_post.import()
    }else
    {
        onShowTxt(responseText)
    }
}

function listImport()
{
    location.reload() 
}

function onListExport()
{      
    g_creatUl.style.visibility = "hidden"
    g_post.export()
}
 


//--------------------------------
//nearOpen
function Queue(size) {
    var list = [];

    //向队列中添加数据
    this.push = function(data) {
        if (data==null) {
            return false;
        }
        var index = this.find(data);
        if(index > -1)
        {
            return false;
        }
        //如果传递了size参数就设置了队列的大小
        if (size != null && !isNaN(size)) {
            if (list.length == size) {
                this.pop();
            }
        }
        list.unshift(data);
        return true;
    }

    //从队列中取出数据
    this.pop = function() {
        return list.pop();
    }

    //从队列移除数据
    this.move = function(value) { 
        var index = this.find(value);
        if(index > -1)
        {
            return list.splice(index,1);
        }   
    }
    //查找队列值
    this.find = function(value){
        for(i = 0; i<list.length; i++)
        {
            if(list[i].ParentId == value.ParentId && list[i].ChileId == value.ChileId)
            {
                return i;
            }  
        } 
        return -1;
    }
    //返回队列的大小
    this.size = function() {
        return list.length;
    }

    //返回队列的内容
    this.quere = function() {
        return list;
    }
}

function InitNearOpen()
{
    var size = 10
    g_queue = new Queue(size) 
    g_post.getJson("NearFile", onAddNearOpen)
} 
function onAddNearOpen(responseText)
{
    try
    {
        JsonInfo = JSON.parse(responseText)
    }catch(err)
    { 
        JsonInfo = 0
    }
    if(JsonInfo)
    { 
        for(var i = JsonInfo.length-1; JsonInfo[i]; i--)
        {
            AddNearOpen(JsonInfo[i].ParentId, JsonInfo[i].ChileId, false)
        }
    }
}
function AddNearOpen(pId, cId, isUp = true)
{ 
    var value = {"ParentId":pId, "ChileId":cId}  
    g_queue.push(value)  
    if(isUp)
    {
        g_post.upJson("NearFile", JSON.stringify(g_queue.quere()))
    }
}

function getNearFileJson(pId, cId)
{
    jsonInfo =  g_jsonFileInfo[Math.abs(pId)]  
    for(var i = 0; jsonInfo[i]; i++)
    {     
        if(jsonInfo[i].id == cId)
            return jsonInfo[i];
    }
    return null;
}

function loadNearFile()
{  
    var setDefault = false
    g_defaultFileKey = 0
    var quer = g_queue.quere() 
    var size = g_queue.size()
    for(i = 0; i < size; i++)
    {
        pId = quer[i].ParentId
        cId = quer[i].ChileId
        var fJson = getNearFileJson(pId, cId)
        if(fJson)
        {
            if(!setDefault)
            {
                setDefault = true
                g_defaultFileKey = fJson.id
            }
            if(fJson["isDelete"])
            {
               // addCrashFile(pId, cId, fJson.fName)  
            }else
            {
                addFile(pId, cId, fJson.fName) 
            }
        }
    }
}