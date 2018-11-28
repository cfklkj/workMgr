
//list-search
function list_setProject(projectName)
{
    g_proName = projectName
    var span = g_listSearch.getElementsByTagName("span")
    var input = g_listSearch.getElementsByTagName("input")
    span[1].className = "icon-oFolde"
    input[0].value = g_proName
    var span = g_loadFolder.getElementsByTagName("span")
    span[0].title = g_proName
}
function list_UpProject()
{  
    var input = g_listSearch.getElementsByTagName("input") 
   if(g_proName !=  input[0].value)
   {
        g_proName =  input[0].value 
        UpProject()
   }
}
function list_setOpenDir(innerText)
{
    var span = g_listSearch.getElementsByTagName("span")
    var input = g_listSearch.getElementsByTagName("input")
    span[1].className = "icon-oFolde"
    input[0].value = innerText
}
function list_upDirName()
{ 
    var span = g_choiceFolderLi.getElementsByTagName("span") 
    var input = g_listSearch.getElementsByTagName("input")
    if(span[0].innerText != input[0].value && upDirJson(input[0].value))
    {             
        span[0].innerText = input[0].value         
    }  
}


function list_menus()
{ 
    var ul = g_listSearch.getElementsByTagName("ul") 
    if(g_creatUl && g_creatUl.style.visibility == "visible")
    {           
        if(g_creatUl == ul[0]) 
        { 
            g_creatUl.style.visibility = "hidden"
        }else
        {
            g_creatUl.style.visibility = "hidden" 
            g_creatUl = ul[0]
            g_creatUl.style.visibility = "visible"
        }
    }else
    {
        g_creatUl = ul[0]
        g_creatUl.style.visibility = "visible"
    } 
} 

function onListImport(responseText)
{   
    g_post.import() 
}

function listImport()
{
    location.reload() 
}

function onListExport()
{      
    g_creatUl.style.visibility = "hidden"
    g_post.export()
}
 

