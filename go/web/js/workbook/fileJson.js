 

//文件列表---------------------------------
g_sortLimit = 9  //默认重新排序限制数量
g_choiceFileInfo = []   //选择的文件信息
g_choiceFileLi = "" //选择的标签 
g_isChoiceFile = false  //是否处于选择中
  

function initFileJson(responseText)
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
        g_jsonFileInfo = [];// JSON.parse('{"101":[{"id":1,"name":"hello"}]}') 
    }     
}
   
function deleteJsonNode(jsonInfo, index)
{    
    jsonInfo.splice(index,1)    //删除json 节点 
}
   
//-----------------json
function getFileJsonObj()
{ 
   var jsonInfo = g_jsonFileInfo    
   if(!jsonInfo)
   { 
       jsonInfo = g_jsonFileInfo = []  
   } 
   return  jsonInfo;
} 
 
function addFileJson(parentId, id)
{ 
    var newNode = { 
        "folderId":parentId,
        "id":id,
        "type":FolderType.file,
        "name":"无标题文件" + id
    }   
    var jsonInfo = getFileJsonObj()    
   for(item in jsonInfo)
   {
       if(jsonInfo[item].id == newNode.id)
       {
           return false
       }
   }
   jsonInfo.push(newNode);  
   upFileJson()
   return  true;
}
 
function sortFileJson(thisId, changeId)  //交换
{   
    var thisIndex = -1;
    var chageIndex = -1; 
    var jsonInfo = getFileJsonObj()  
    for(var index =0; index < jsonInfo.length; index ++)
    {         
        if(jsonInfo[item].type != FolderType.file)
       {
           continue;  
       } 
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
        if(jsonInfo[item].type != FolderType.file)
       {
           continue;  
       } 
        if(jsonInfo[index].id == changeId)
        { 
            chageIndex = index; 
            break;
        }
    }   
    jsonInfo = swapItems(jsonInfo, thisIndex,  chageIndex);   
    upFileJson()
    return true
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

   