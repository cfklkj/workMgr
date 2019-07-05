//------------------------- key  ctrl + backspace
g_actOldFolder = []  //A  -- Pro chile   B chile -chile

function pushOldFolder(id, name)
{ 
    data = {"guid":id, "name":name}
    g_actOldFolder.push(data)
}

function pullTopOldFolder()
{ 
    if(g_actOldFolder.length < 1)
        return null
    return g_actOldFolder.pop()
}  


function onBackUpFolder(){
    
    var topEle = pullTopOldFolder()
    if(topEle != null)
    { 
        id = topEle.guid
        //清理
        clearProChile()
        //从服务器获取信息
        setSearchInfo(id, topEle.name) 

        getLinkData(id)
        setChileFolderStatu(id) 
    }
}