
//获取项目-------------------------------------
g_projectJson = {};

function onGetProject()
{     
    g_post.getJson("Project", loadProJson) 
}
function loadProJson(proInfo)
{ 
    g_projectJson = JSON.parse(proInfo)
    list_setProject(g_projectJson.ProName)
    //加载目录
    onLoadDirJson()
}
function UpProject()
{      
    g_post.upPro("rename", g_proName, onUpProject) 
}
function onUpProject(info)
{
    if(info == 'ok')
    {
        var span = g_loadFolder.getElementsByTagName("span")
        span[0].title = g_proName
    }else
    {
        alert(info)
    }
}
function onNewPro()
{    
    g_creatUl.style.visibility = "hidden"
    g_proName = "newPro"
    g_post.upPro("new", g_proName, newPro)
}
function onOpenPro()
{
    g_creatUl.style.visibility = "hidden"
    g_post.upPro("open", g_proName, newPro) 
}
function newPro(proName)
{
    if(proName != ""){ 
        location.reload()
    }
}


function onDelete()
{ 
    selectFolde(this)
    g_choiceDirObj.thisType="crash"

    initFileInfo();
    loadDeleteFolde();
    loadDeleteFile();
}
function onNearOpen()
{
    selectFolde(m_nearOpen)
    g_choiceDirObj.thisType="unCrash"
    initFileInfo();
    loadNearFile();
} 