
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
 
function loadProJson(proInfo)
{  
    if(proInfo == "")
      return;
    g_projectJson = JSON.parse(proInfo) 
    //没有项目
    if(g_projectJson.length < 1 )
        return; 
    //list_setProject(g_projectJson.ProPath, g_projectJson.ProName)
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
 
 //清理浏览历史
function clearNearInfo()
{
    g_nearOpen = []   
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