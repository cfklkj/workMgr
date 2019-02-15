
//获取项目-------------------------------------
g_proHistory= {};
g_projectJson = {};

function onGetProHistory()
{
    g_post.getJson("proHistory", loadProHistoryJson) 
}

function loadProHistoryJson(proInfo)
{  
    g_proHistory = JSON.parse(proInfo) 
}

function onGetProject()
{     
    setChoiceDivType(g_loadFolder, true)  
    g_post.getJson("nearProject", loadProJson) 
}
function loadProJson(proInfo)
{  
    g_projectJson = JSON.parse(proInfo) 
    //没有项目
    if(g_projectJson.ProName == "")
    {
        onNewPro()
        return;
    }
    list_setProject(g_projectJson.ProPath, g_projectJson.ProName)
    //加载目录
    onLoadDirJson()
}
function UpProject()
{       
    g_post.upPro("rename", g_proName, onUpProject) 
}

function choicePro(id, proPath, proName)
{       
    g_post.choice("choice",id, proPath, proName, onUpProject) 
}
function onUpProject(info)
{
    if(info == 'ok')
    { 
        onGetProHistory()
        onGetProject()
    }else
    {
        alert(info)
    }
}
function onNewPro()
{    
    g_proName = "newPro"
    g_post.upPro("new", g_proName, newPro)
    g_creatUl.style.visibility = "hidden"
}
function onOpenPro()
{
    g_creatUl.style.visibility = "hidden"
    g_post.upPro("open", g_proName, newPro) 
}
function onOpenProExp()
{
    g_creatUl.style.visibility = "hidden"
    g_post.upPro("openExp", g_proName, onShowStatu) 
}
function newPro(proName)
{
    if(proName != ""){ 
        location.reload()
    }
}
function loadProHistory()
{  
    var jsonInfo = g_proHistory.ProInfos 
    isUpJson = false
    for(item in jsonInfo){     
        addProHistory(item, jsonInfo[item].ProName, jsonInfo[item].ProPath)  
    }    
}

function choiceHistroryPro(index)
{ 
    var jsonInfo = g_proHistory.ProInfos  
    for(item in jsonInfo){    
        if(item == index) 
        {
            choicePro(jsonInfo[index].id, jsonInfo[index].ProPath, jsonInfo[index].ProName);
            onGetProject();  
            break;
        } 
    } 
}


function onDelete()
{ 
    initFolderInfo(); 
    loadDeleteFolder();
    loadDeleteFile();
}
function onNearOpen()
{  
    initFolderInfo();
    loadNearFile();
} 