
//drag---------------------------------
function getStyle(obj, attr)
{  

    if(obj.currentStyle)  {  
  
      return obj.currentStyle[attr];  
  
    } else{  
  
      return getComputedStyle(obj,false)[attr];  
    }
  
} 
function resetFolderHeigh()
{ 
     g_folderContainer.style.height =  "auto"
}
function limitFolderHeigh()
{ 
    var height = parseInt(getStyle(g_folderContainer, "height")) 
    if(height > document.body.clientHeight / 2)
    { 
        g_folderContainer.style.height =  document.body.clientHeight / 2;
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
 

function tagMoveUp( parentId, parentGuid, actid){ 
    var upIndex = getLiUpIndex(parentId, actid)
    if(!upIndex)
    {
        return;
    }   
    sortHttpLi(actid, upIndex)  
    swapLinkData(parentGuid, actid, upIndex)
    return ;
}

function tagMoveDown(parentId, parentGuid,  actid){ 
    var upIndex = getLiDownIndex(parentId, actid)
    if(!upIndex)
    {
        return;
    }   
    sortHttpLi(upIndex, actid) 
    swapLinkData(parentGuid, upIndex, actid)
    return ;
}



function tagUp( parentId, actid){ 
    var upIndex = getLiUpIndex(parentId, actid)
    if(!upIndex)
    {
        return;
    }   
    //子文件
    if(onShowTxt(upIndex))
        return;
    //子目录
    if(onLoadFolderChile(upIndex))
        return
    return ;
}

function tagDown(parentId, actid){ 
    var upIndex = getLiDownIndex(parentId, actid)
    if(!upIndex)
    {
        return;
    }   
    //子文件
    if(onShowTxt(upIndex))
        return;
    //子目录
    if(onLoadFolderChile(upIndex))
        return
    return ;
}



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
//下层节点
function getLiDownIndex(choiceFolder, thisId)
{
    var liObj = choiceFolder.getElementsByTagName("li")
    var downObj = null
    var thisObj = null 
    for(var item = 0; item < liObj.length; item ++)
    { 
        if(!liObj[item])
            continue; 
        if(liObj[item].id == thisId)
        {
            thisObj = liObj[item]
            if(item == liObj.length) //底部不处理
            {
                return 0;
            }
            if(!liObj[item + 1])
                return 0
             downObj = liObj[item + 1]
             break;
        }
        downObj = liObj[item]
    } 
    if(thisObj && downObj && downObj != thisObj)
    {
        return downObj.id
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
 

//--------------------------------------------------drag to
//----获取选择类型
g_moveInFolder = 0
tempEvent = 0
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
function divCompare(obj, divId)
{
    if(getParentDiv(obj).id == divId)
        return true;
    return false;
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

function InFolder(event)
{
    parId = getParentDiv(event.target).id;  
     if(parId ==  g_loadFolder.id)  //根
    {
        parId = getParentID()
    }
    
    pId = getChoiceFolderId()
    if(pId == parId)
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
    pId = getParentObjId(document.getElementById(event.target.id)) 
    if(pId ==  g_folderContainer.id)  //根
    {
        pId = getParentID()
    }else{
        pId = getChoiceFolderId();
    } 
    if(g_moveInFolder < 1 || g_moveInFolder == pId)
        return;
    moveIn = g_moveInFolder 
    tempEvent = event
    mvLinkData(pId, event.target.id, moveIn)
}
function resultMvFile(res){
    if(res == "true")
    {
        id = tempEvent.target.id
        name = document.getElementById('span'+id).innerText
        tempEvent.target.remove()  //移除  
        if(g_moveInFolder == getParentID()) 
        {
            addFolder2RootUiTag(id, name)
        }      
    }
}