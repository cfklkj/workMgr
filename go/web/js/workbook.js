
document.write('<script type="text/javascript" src="js/lib/FlyWeb.js"></script>')  //引入js 
//document.write('<script type="text/javascript" src="js/lib/jquery.js"></script>')  
document.write('<script type="text/javascript" src="js/lib/pako.min.js"></script>')  
document.write('<script type="text/javascript" src="js/workbook/zip.js"></script>')  
document.write('<script type="text/javascript" src="js/workbook/init.js"></script>')  
document.write('<script type="text/javascript" src="js/workbook/drag.js"></script>')   
// document.write('<script type="text/javascript" src="js/workbook/folderJson.js"></script>')  
// document.write('<script type="text/javascript" src="js/workbook/folder.js"></script>')  
// document.write('<script type="text/javascript" src="js/workbook/project.js"></script>')  
// document.write('<script type="text/javascript" src="js/workbook/fileJson.js"></script>')  
document.write('<script type="text/javascript" src="js/workbook/onKeyBoard.js"></script>')  
document.write('<script type="text/javascript" src="js/workbook/onGetSetTagInfo.js"></script>')   
document.write('<script type="text/javascript" src="js/workbook/onNearOpen.js"></script>')  
document.write('<script type="text/javascript" src="js/workbook/ondirlist.js"></script>')
document.write('<script type="text/javascript" src="js/workbook/onloadInfo.js"></script>')
document.write('<script type="text/javascript" src="js/workbook/onload_dirlist.js"></script>')      
document.write('<script type="text/javascript" src="js/workbook/onProlist.js"></script>')     
document.write('<script type="text/javascript" src="js/workbook/workbook_guid.js"></script>')  
document.write('<script type="text/javascript" src="js/workbook/workbook_prolist.js"></script>')  
document.write('<script type="text/javascript" src="js/workbook/workbook_dirlist.js"></script>')  
document.write('<script type="text/javascript" src="js/workbook/workbook_link.js"></script>') 
document.write('<script type="text/javascript" src="js/workbook/workbook_txt.js"></script>')    
document.write('<script type="text/javascript" src="js/workbook/onTxt.js"></script>')   
document.write('<script type="text/javascript" src="js/workbook/post.js"></script>')  
window.onload = main

    
var serverUrl = "127.0.0.1"  
var MyToken = "1111"
var Unrecognizable = false 
var g_isSetTime = false
var g_setTime

function main() {   
    g_post = new Post()
    WorkBookInit()
}   

//获取父节点 父id
function getParentObjId(obj)
{
    if(!obj)
        return obj
    var par = obj.parentNode
    if(par != null)
    {
        if(typeof(par.id) == "string" && par.id != "")
           return par.id;          
        return getParentObjId(par)
    }
    return ""
}
//获取节点name
function getParentObjName(id)
{
    var obj = document.getElementById(id)  
    value= obj.getAttribute("dirName"); 
    return value;   
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
    timeOutCheckEdit()
    if (event.ctrlKey == true && event.keyCode == 83) {//Ctrl+S 
        event.returnvalue = false;  
        onKeeptxt()
        return
    } 
    if (event.ctrlKey == true && event.keyCode == 8) {//Ctrl+  backspace
        onBackUpFolder()
        return
    } 
    if (event.ctrlKey == true && event.keyCode == 38) {//Ctrl+  up
        if( g_choiceTag.B && g_choiceTag.B == g_topFileName.getAttribute("fileId"))
        {
            pId = getSearchId();
            tagMoveUp(g_searchContainer, pId, g_choiceTag.B)
        } else if(g_choiceTag.A && g_choiceTag.A == getSearchId())
        {
            pId = getParentID();
            tagMoveUp(g_folderContainer, pId, g_choiceTag.A)
        }  
        return
    } 
    if (event.ctrlKey == true && event.keyCode == 40) {//Ctrl+  down
        if( g_choiceTag.B && g_choiceTag.B == g_topFileName.getAttribute("fileId"))
        {
            pId =  getSearchId();
            tagMoveDown( g_searchContainer, pId, g_choiceTag.B)
        } else if(g_choiceTag.A && g_choiceTag.A == getSearchId())
        {
            pId =  getParentID();
            tagMoveDown( g_folderContainer, pId, g_choiceTag.A)
        }  
        return
    } 
    if (event.keyCode == 38) {//Ctrl+  up
        if( g_choiceTag.B && g_choiceTag.B == g_topFileName.getAttribute("fileId"))
        {
            tagUp(g_searchContainer, g_choiceTag.B)
        } else if(g_choiceTag.A && g_choiceTag.A == getSearchId())
        {
            tagUp(g_folderContainer, g_choiceTag.A)
        }  
        return
    } 
    if (event.keyCode == 40) {//Ctrl+  down
        if( g_choiceTag.B && g_choiceTag.B == g_topFileName.getAttribute("fileId"))
        {
            tagDown( g_searchContainer, g_choiceTag.B)
        } else if(g_choiceTag.A && g_choiceTag.A == getSearchId())
        {
            tagDown( g_folderContainer, g_choiceTag.A)
        }  
        return
    } 
    else{ 
        if(event.keyCode == 13)
        { 
            if(document.activeElement.id == "top-fileName")
            {
                upFileName() 
            }else if(document.activeElement.id == "search-Name")
            {
                guid = getChoiceFolderId()
                if(guid == "")
                    return;
                if(guid.indexOf("P_") != -1)
                {
                    altProlist(guid, g_searchName.value)
                    return;
                }
                altDirlist(guid, g_searchName.value) 
                
            }
        } 
    }
}  
//设置定时器
function timeOutCheckEdit()
{
    if(g_isSetTime)
        return;
    g_isSetTime = true;
    //循环执行，每隔1秒钟执行一次 1000 
    g_setTime =window.setInterval(refreshCount, 3000);
    function refreshCount() { 
      onKeeptxt()
      unTimeOutCheckEdit() 
    } 
}
//去掉定时器
function unTimeOutCheckEdit()
{
    if(g_setTime)
    {
        window.clearInterval(g_setTime)
        g_isSetTime = false;
    }
}
function onMouseUp()
{
    var btnNum = event.button; 
   if(btnNum==0)
   { 
        g_dragMove = 0; 
   }

   var id = getParentObjId(event.srcElement)
   //子目录
   if(onLoadFolderChile(id))
       return

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
        if(g_choiceFolderType = FolderType.document)
        {
            if(sortThisFolder(g_choiceDirObj.par))
             {
                g_folderContainer.prepend(par.parentNode)
             }
            alert("请先选择需要移动的目录!")
            return ;
        } 
    }

}
else if(btnNum==0)
{  
    //拖拽边界
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

    var id = getParentObjId(event.srcElement)
    //所有项目
    if(onShowAllPro(id))
        return
    //单个项目
    if(onShowPro(id))
        return
    //子文件
    if(onShowTxt(id))
        return;
    return; 
    //选择菜单
    //--setChoiceDivType(event.target)  
    //移动目录位置
    var par = getParentObj(event.srcElement)
    if(event.srcElement.id == "menu_moveFolder")
    {  
        if(g_choiceFolderType == FolderType.document)  //目录
        {
            var upIndex = getLiUpIndex(g_folderContainer, g_choiceFolderInfo.id)
            if(!upIndex)
            {
                return;
            } 
            if(sortFolderJson(g_choiceFolderInfo.id, upIndex))
             { 
                sortHttpLi(g_choiceFolderInfo.id, upIndex)
             }
            return ;
        }
        if(g_choiceFolderType == FolderType.file)  //文件
        {
            var upIndex = getLiUpIndex(g_searchContainer, g_choiceFileInfo.id)
            if(!upIndex)
            {
                return;
            } 
            if(sortFileJson(g_choiceFileInfo.id, upIndex))
             { 
                sortHttpLi(g_choiceFileInfo.id, upIndex)
             }
            return ;
        }
        return
    }  
    //删除
    if(event.target.className.indexOf('icon_delete') != -1) 
    { 
        switch(g_choiceFolderType)
        { 
            case FolderType.project://删除目录
            {  
                moveFolder(event.target)
            }break;
            case FolderType.recycleBin://彻底删除目录
            {  
               if(!deleteFolder(event.target))
               {
                  deleteFile(event.target) 
               } 
            }break;
            default: //删除 文件
            {
                moveFile(event.target) 
            }break;
        } 
        return;
    } 
    //还原
    if(event.target.className.indexOf('icon_unCrash') != -1) //还原
    {  
        if(!unMoveFolder(event.target))
        { 
            unMoveFile(event.target); 
        }
        return;
    }    
    //最近打开的项目
    if(g_choiceFolderType == FolderType.projectHistory)
    {        
        if(divCompare(event.target, "projectHistory"))
        {
            initFolderInfo();
            loadProHistory(); 
        }else 
        { 
            var id = getParentDiv(event.target).id 
            initFolderInfo();
            clearNearInfo()
            choiceHistroryPro(id)
        }
        return;
    }
    //选择文件夹
    if(setChoiceFolderLiType(event.target))    
    { 
        if(selectFoldeJson(g_choiceTag.B) && loadFiles())  //选择文件夹
        {    
            g_choiceTag.C = g_choiceFileInfo.id
            selectLiStatu(g_choiceFileInfo.id)  
        }  
        return;
    } 
    //选择文件
    if(setChoiceFileLiType(event.target))  //选择文件
    {  
        if(selectNearFile(event.target))
            return;
        unTimeOutCheckEdit()
        selectFile(g_choiceTag.C) 
        return;
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


