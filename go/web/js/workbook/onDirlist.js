
json_dirList = {};
temp_newInfo ={"guid":"","name":""};

function onNewFolder()
{     
    if(isSelProDir() != true)
    {
        alert("选择项目后才能创建目录")
        return
    }
    getFolderGuid()
    g_creatUl.style.visibility = "hidden"
}
function resultNewFolder(type, res){
    if(type == "guid"){
        if(res == ""){
            alert("创建项目失败 -1") 
            return
        } 
        temp_newInfo.guid = res;
        temp_newInfo.name = "newFolder"      
        newDirlist(res, temp_newInfo.name)
    }else if(type == "dirlist")
    {
        if(res == "true"){  
            addLinkData(temp_newInfo.guid, getChoiceFolderId())  
        } 
    }else if(type == "link")
    {
        if(res == "true"){  
            if(getChoiceFolderId().indexOf("D_") != -1 )
            {
                addFolder2ChileUiTag(temp_newInfo.guid, temp_newInfo.name ) 

            }else{
                addFolder2RootUiTag(temp_newInfo.guid, temp_newInfo.name ) 
            }  
            onChangeStatu(temp_newInfo.guid)  
           // limitFolderHeigh()
           // var bObj = document.getElementById(temp_newInfo.guid);
            //setChoiceFolderLiType(bObj) 
            //selectFoldeJson()
        } 

    }
} 

function onGetProlist(){ 
    setChoiceDivType(g_loadFolder, true)  
    getProlist()
}
function resultGetProlist(res){ 
    if(res == "")
      return;
    json_proList = JSON.parse(res) 
    //没有项目
    if(g_projectJson.length < 1 )
        return;
    //加载目录
    loadProlist(g_projectJson)
}