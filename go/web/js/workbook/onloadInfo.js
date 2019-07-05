 
//json
function loadProlist(jsonInfo)
{
    if(!jsonInfo)
        return; 
    g_searchContainer.innerHTML = ""  
    for( let index in jsonInfo)
    {   
        if(jsonInfo[index].Guid.indexOf("F_")  == -1)
        {
            addFolder2ChileUiTag(jsonInfo[index].Guid, jsonInfo[index].Name) 

        }else
        {
            addFile2ChileUiTag(jsonInfo[index].Guid, jsonInfo[index].Name) 
        }
    } 
}
 
function loadProInfo(jsonInfo)
{
    if(!jsonInfo)
        return; 
    g_folderContainer.innerHTML = ""  
    for( let index in jsonInfo)
    {   
        addFolder2RootUiTag(jsonInfo[index].Guid, jsonInfo[index].Name) 
    } 
}


function addFolder2RootUiTag(guid, name)
{ 
    addLiTag_icoFolder(g_folderContainer, guid, name)  
}

function addFolder2ChileUiTag(guid, name)
{ 
    addLiTag_icoFolder(g_searchContainer, guid, name)  
}

function addFile2ChileUiTag(guid, name)
{ 
    addLiTag_icoFile(g_searchContainer, guid, name)  
}

function altRootUiTag(guid, name)
{

}

///---------------------------tag
function addLiTag_icoFolder(obj, dirID, dirName)
{
    Ta = '\
    <li draggable="true" ondragend="FileLeave(event)"  ondragover="InFolder(event)" ondragleave="OutFolder(event)" id=' + dirID + '>\
        <div class="slidebar-content">\
            <div class="sidebar-item search-resulMove" file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="">\
                <i class="arrow arrowB" style="visibility: hidden;"></i>\
                <i class="icon-folder folderA"></i>\
                <span class="sidebar-item-text" id = "span'+ dirID +'">' + dirName + '</span>\
            </div>\
        </div>\
    </li>'
    obj.innerHTML += Ta
    thisTag = document.getElementById(dirID)
    thisTag.setAttribute("dirName", dirName)
} 


function addLiTag_icoFile(obj, spanID, spanValue)
{ 
    deleteValue = "移到回收站"
    Ta = '\
    <li draggable="true" ondragend="FileLeave(event)" id=' + spanID +'>\
        <div class="search-content">\
            <div class="search-item search_resulMoveB" file-droppable="" filedroppablesupport="true" trackaction="click" trackcategory="recent" tracker="" onmouseenter=mouseenterFile(this) onmouseleave=mouseleaveFile() >\
                <i class="icon-Edit editA"></i>\
                <span class="search-item-text" id = "span'+ spanID +'">' + spanValue + '</span>\
                <spn title="' + deleteValue + '"><i class="icon_delete editB"></span>\
                </i>\
            </div>\
        </div>\
    </li>'
    obj.innerHTML += Ta
    thisTag = document.getElementById(spanID)
    thisTag.setAttribute("dirName", spanValue) 
}