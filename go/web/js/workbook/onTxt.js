 
function onAddFile(){
    if(isSelFolder() != true)
    {
        alert("创建文件需要先选中目录，无法在根目录里创建！")
        return
    }   
     
    getFileGuid()
    g_creatUl.style.visibility = "hidden"
}

function upFileName()
{           
    guid = g_topFileName.getAttribute("fileId")
    altDirlist_file(guid, g_topFileName.value)  
    obj = document.getElementById( "span" + guid)
    obj.innerText = g_topFileName.value   
}
 

function resultAddFile(type, res){
    if(type == "guid")
    {
        if(res == ""){
            alert("创建文件失败 -1")
            return
        }
        temp_newInfo.guid = res;
        temp_newInfo.name = "newFile" 
        newFilelist(res, temp_newInfo.name) 
    }else if(type == "dirlist")
    {
        if(res == "true")
        {
            addLinkData_file(temp_newInfo.guid, getChoiceFolderId())
        } 
    }else
    {
        if(res == "true")
        {
            addFile2ChileUiTag(temp_newInfo.guid, temp_newInfo.name)
        }
    }
}

function onShowTxt(id){
    if(id.indexOf("F_") == -1)
        return false
    obj = document.getElementById( "span" + id) 
    g_topFileName.value = obj.innerText;
    g_topFileName.setAttribute("fileId", id) 
    onChangeStatu_file(id) 
    getTxt(id)
    return true
}
function resultGetTxt(res){ 
    txtInfo = res
    try{
        g_detailValue.innerHTML =  unzip(txtInfo) 
    }catch(err){ 
         console.log(err)
         g_detailValue.innerHTML = txtInfo
    }
    if(g_newFile)
    { 
        g_newFile = 0
        g_detailValue.select()
        g_detailValue.focus()        
    }
    //onChangeMode()
}


function onKeeptxt()
{       
    guid = g_topFileName.getAttribute("fileId")
    altTxt(guid, g_detailValue.innerHTML) 
    return true
}
