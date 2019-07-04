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