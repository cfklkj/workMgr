function onGetSelFolderName(){
    var input = g_listSearch.getElementsByTagName("input") 
    return input[0].value
}

function onSetSelFolderName(guid, name){
    var input = g_listSearch.getElementsByTagName("input") 
    input[0].value = name
}

function onGetFileInfo(){

}
function onSetFileInfo(guid, name, data){

}

//--------------------------- value
function setParent(id){ 
    if(id.indexOf("P_") != -1)
     {
           g_choiceFolder.setAttribute("proIdParent", id)
           name = getParentObjName(id)
           g_choiceFolder.setAttribute("proNameParent", name)
     }  
}
function getParentID(){ 
    return   g_choiceFolder.getAttribute("proIdParent")
}
function getParentName(){ 
    return   g_choiceFolder.getAttribute("proNameParent")
}

//choice value
function setChoiceValue(guid, name)
{ 
    g_choiceFolder.setAttribute("proId", guid)
    g_choiceFolder.setAttribute("proName", name)
    g_choiceFolder.innerText= name
}
//search value
function setSearchInfo(id, value){
    g_searchName.setAttribute("proId", id)
    g_searchName.value = value 
}

function getSearchId(){
    return g_searchName.getAttribute("proId")
}
function getSearchValue(){
    return g_searchName.value
} 

function getChoiceFolderId(){
    return g_searchName.getAttribute("proId")
}

//--------------------------change tag class   

function onChangeStatu(id){
    
    if(g_choiceTag.A != null)
       unSelectDivStatu(g_choiceTag.A)
    g_choiceTag.A = id
    if(id != "")
    {
        g_choiceTag.chile='A'
    }
    selectDivStatu(id)  
}

function onChangeStatu_file(id){
    
    if(g_choiceTag.B != null)
        unSelectLiStatu(g_choiceTag.B)
    g_choiceTag.B = id
    if(id != "")
    {
        g_choiceTag.chile='B'
    }
    selectLiStatu(id)  
} 
function getChoiceTagType(){
    return g_choiceTag.chile
}

function setChileFolderStatu(id){ 
    pId = getParentObjId(document.getElementById(id))
    if(pId != null && pId == "folder-Container")
     {
        onChangeStatu(id) 
        onChangeStatu_file("") 
     }  
}
//--------------------选中菜单状态
//选中与否 在添加节点后其内存位置会变化所以要分开来
function unSelectDivStatu(divId)
{
    var obj = document.getElementById(divId) 
    if(!obj)
        return
    obj.className =  "" 
} 
function selectDivStatu(divId)
{      
    var obj = document.getElementById(divId) 
    if(!obj)
        return
    obj.className = "selected"
}
function unSelectLiStatu(divId)
{   
    obj = document.getElementById(divId)  
    if(!obj)
        return
    obj.className = ""  
}
function selectLiStatu(divId)
{ 
    obj = document.getElementById(divId)
    if(!obj)
        return 
    obj.className = "fileSelected" 
} 