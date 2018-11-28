
document.write('<script type="text/javascript" src="js/lib/FlyWeb.js"></script>')  //引入js 
document.write('<script type="text/javascript" src="js/workbook/init.js"></script>')  
document.write('<script type="text/javascript" src="js/workbook/drag.js"></script>')   
document.write('<script type="text/javascript" src="js/workbook/folder.js"></script>')  
document.write('<script type="text/javascript" src="js/workbook/project.js"></script>')  
document.write('<script type="text/javascript" src="js/workbook/file.js"></script>')  
document.write('<script type="text/javascript" src="js/workbook/nearOpen.js"></script>')   
document.write('<script type="text/javascript" src="js/workbook/listSearch.js"></script>')   
window.onload = main

    
var serverUrl = "127.0.0.1"  
var MyToken = "1111"
var Unrecognizable = false 

function main() {   
    g_post = new Post()
    WorkBookInit()
    onGetProject() 
}  

 

function Post(){
    //请求数据
    this.request =  FlyWeb  //-----------调用Flyweb里的request
    //导入
    this.import = function(){
        g_creatUl.style.visibility = "hidden"
        var data = {"Package":"import"}  
        data.ProInfo = g_projectJson 
        this.request("post",serverUrl + '/Workbook&pakage', data, listImport) 
    }
    //导出
    this.export = function(){        
        var data = {"Package":"export"}  
        data.ProInfo = g_projectJson 
        this.request("post",serverUrl + '/Workbook&pakage', data, onShowStatu)
    }
    //获取文本
    this.getTxt = function(cId){
        var data = {"FileId": cId.toString(), "unrecognizable":true}  
        data.ProInfo = g_projectJson 
        this.request("post",serverUrl + '/Workbook&getTxt', data, showTxt)   
    }
    //保存文本
    this.keepTxt = function(cId, txtInfo){
        var data = {"FileId": cId.toString(), "txtInfo":txtInfo}  
        data.ProInfo = g_projectJson
        this.request("post",serverUrl + '/Workbook&keepTxt', data, onShowStatu)
    }
    //删除文件
    this.deleteFile = function(pId, cId){ 
        var data = {"parentId":pId, "fileId": cId, "unrecognizable":false}  
        data.ProInfo = g_projectJson 
        this.request("post",serverUrl + '/Workbook&deleteFile', data, onShowStatu) 
    }
    //获取JSON文件配置
    this.getJson = function(jsonType, resFunc){ 
        var data = {"JsonType":jsonType}   
        data.ProInfo = g_projectJson
        this.request("post",serverUrl + '/Workbook&getJson', data, resFunc)   
    }
    //更新JSON文件配置
    this.upJson = function(jsonType, txtInfo){
        var data = {"JsonType":jsonType, "txtInfo":txtInfo}   
        data.ProInfo = g_projectJson
        this.request("post",serverUrl + '/Workbook&upJson', data, onShowStatu) 
    }  
    //更新项目名称
    this.upPro = function(proType, proName, resFunc){
        var data = {"ProType":proType, "proName":proName}    
        data.ProInfo = g_projectJson  
        this.request("post",serverUrl + '/Workbook&ProInfo', data, resFunc)  
	}
	//执行cmd语句
	this.cmdAct = function (jsonType, txtInfo) {
		var data = { "JsonType": jsonType, "txtInfo": txtInfo }
		this.request("post", serverUrl + '/Workbook&cmdAct', data, onShowStatu)
	}
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
        search_UpFileName() 
        onKeeptxt()
    } 
    else{ 
        if(event.keyCode == 13)
        {
            console.log(event)
            if(document.activeElement.id == "top-fileName")
            {
                search_UpFileName() 
            }else if(document.activeElement.id == "search-Name")
            {
                if(g_choiceFolderType == FolderType.project)
                { 
                    list_UpProject(); 
                }else if(g_choiceFolderType == FolderType.document){
                    list_upDirName() 
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
    //console.log("您点击了鼠标右键！")
    if(event.srcElement.id == "menu_moveFolder")
    {
       // console.log("您点击了鼠标右键！")
        if(sortThisFolder(g_choiceDirObj.par))
         {
            g_folderContainer.prepend(par.parentNode)
         }
    }

}
else if(btnNum==0)
{
    console.log("event")
    console.log(event)
    var choiceType = setChoiceFolderType(event.target)  
    console.log(choiceType)
    if(!choiceType || choiceType == FolderType.detail)
    {
        return;
    }   
    console.log("event2")
    if(selectFolde(event.target.id))  //选择文件夹
    { 
        list_setOpenDir(event.target.innerText) 
        if(loadFiles(g_choiceFolderId))
        { 
          selectFileStatu(g_choiceFileInfo.id)
        }
        selectFoldeStatu(event.target)
        return;
    }
    if(selectFileAct(event.target.id))  //选择文件
    {
        selectFileStatu(event.target.id)
        return;
    }
    //---old
    return
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
    if(event.srcElement.id == "menu_moveFolder")
    { 
        if(sortThisFolder(g_choiceDirObj.par.id))
         { 
            sortHttpLi(g_folderContainer, g_choiceDirObj.par.id)
         }
         return
    }
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
            if(sortThisFileFolder(par.id, g_choiceFileObj.id))
             {
                g_searchContainer.prepend(par.parentNode)
             }
        }
        return
    }
}
else if(btnNum==1)
{
//alert("您点击了鼠标中键！");
    if(event.srcElement.id == "menu_moveFolder")
    { 
        if(sortThisFolder(g_choiceDirObj.par.id, true))
         { 
            sortHttpLi(g_folderContainer, g_choiceDirObj.par.id)
         }
         return
    }
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
function recodeFileIndex(parent)
{
    g_choiceFileIndex = fileIndex(parent) 
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


