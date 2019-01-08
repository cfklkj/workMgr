//主文档类型
var  FolderType = {};
FolderType.nochoice = 0;
FolderType.recycleBin = 1;
FolderType.nearView = 2; 
FolderType.project = 3; 
FolderType.document = 4;
FolderType.file = 5; 
FolderType.detail = 6; 
FolderType.create = 7; 
    

g_choiceFolderType = FolderType.nochoice  //选择的文档类型
g_choiceFolderInfo = []; //选择的文件夹信息
g_choiceTag = []  //选择的标签
g_choiceTag.A = 0   //一级菜单
g_choiceTag.B = 0   //二级文档
g_choiceTag.C = 0   //三级文件

g_jsonDirInfo = []//JSON.parse('[{"name":"c++","id":101},{"name":"java","id":102}]')
  
//初始化
function initDirJson(responseText)
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
//-----------------json
function getFolderJsonObj(type)
{
    jsonInfo = g_jsonDirInfo[type] 
    if(!jsonInfo)
    {
        jsonInfo = g_jsonDirInfo[type] = []
    } 
    return jsonInfo;
}
function getFolderJson(type, parentId)
{   
    jsonInfo = getFolderJsonObj(type)
   for(item in jsonInfo)
   { 
       if(jsonInfo[item].id == parentId)
       {
           return jsonInfo[item]
       }
   }  
   return  null;
} 
function getDocumentJson()
{
    return getFolderJsonObj(FolderType.document)
}
function getNearViewJson()
{
    return getFolderJsonObj(FolderType.nearView)
} 
//添加
function addFolderJson(newNode)
{ 
    var jsonInfo = getDocumentJson()
    for(item in jsonInfo)
    {   
        if(jsonInfo[item].id == newNode.id)
        {
            return false;
        }  
    } 
    newNode.type = FolderType.document 
    jsonInfo.push(newNode);  
    upDirJson()
    return  true;
}
//删除
function movFolderJson(parentId)
{  
    var jsonInfo = getFolderJson(FolderType.document, parentId)    
    if(!jsonInfo)
    {   
        return false
    }   
    if(jsonInfo.id != parentId) 
        return false;
    if(jsonInfo.type == FolderType.recycleBin )
        return false
    jsonInfo.type = FolderType.recycleBin 
    upDirJson()
    return true
} 
//还原
function unMovFolderJson(parentId)
{ 
    var jsonInfo = getFolderJson(FolderType.document, parentId)    
    if(!jsonInfo)
    {   
        return false
    }   
    if(jsonInfo.id != parentId) 
        return false;
    if(jsonInfo.type == FolderType.document )
        return false
    jsonInfo.type = FolderType.document 
    upDirJson()
    return true
} 
//彻底删除
function delFolderJson(parentId)
{  
    var jsonInfo = getDocumentJson()
   for(item in jsonInfo)
   { 
       if(jsonInfo[item].id == parentId)
       {
          jsonInfo.splice(item,1)    //删除json 节点 
          upDirJson()
          return true 
       }
   }   
   return false
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


 
function selectFoldeJson(choiceId)
{    
    if(g_choiceFolderInfo.id == choiceId)
    { 
        list_setOpenDir(g_choiceFolderInfo.name) 
        return false;  
    }   
    var jsonInfo = getDocumentJson()
    for(item in jsonInfo)
    {  
        if(jsonInfo[item].id == choiceId)
        { 
            g_choiceFolderInfo = jsonInfo[item] 
            list_setOpenDir(g_choiceFolderInfo.name) 
           return true;
        }
    }  
    return false; 
}
 
 
function upDirJson()
{   
    g_post.upJson("Dir", JSON.stringify(g_jsonDirInfo))  
    return true
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

//获取上层节点
function getLiUpIndex(choiceFolder, thisId)
{
    var liObj = choiceFolder.getElementsByTagName("li")
    var upObj = null
    var thisObj = null 
    for(var item = 0; item < liObj.length; item ++)
    { 
        if(!liObj[item])
            continue; 
        if(liObj[item].id == thisId)
        {
            thisObj = liObj[item]
            if(item == 0) //顶点不处理
            {
                return 0;
            }
             break;
        }
        upObj = liObj[item]
    } 
    if(thisObj && upObj && upObj != thisObj)
    {
        return upObj.id
    }
    return 0
}

function sortFolderJson(thisId, changeId)  //交换
{   
    var thisIndex = -1;
    var chageIndex = -1;
    var jsonInfo = getDocumentJson()
    for(var index =0; index < jsonInfo.length; index ++)
    { 
        if(jsonInfo[index].id == thisId)
        { 
            if(index == 0)  //已经到顶点
                return false;
            thisIndex = index; 
            break;
        } 
    }  
    for(var index =0; index < jsonInfo.length; index ++)
    {  
        if(jsonInfo[index].id == changeId)
        { 
            chageIndex = index; 
            break;
        }
    }   
    jsonInfo = swapItems(jsonInfo, thisIndex,  chageIndex);    
    upDirJson()
    return true
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
    if( getParentDiv(par) == null)
    {
        return false;
    }  
    if(getParentDiv(par).id != "folder-Container")
    { 
        return false
    }  
    //直接切换
    if(g_choiceFolderType == FolderType.nearView || g_choiceFolderType == FolderType.recycleBin )
    {
        onLoadFolder()
    }
    g_choiceFolderType =  FolderType.document
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
        return true
    g_choiceFolderType =  FolderType.file 
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