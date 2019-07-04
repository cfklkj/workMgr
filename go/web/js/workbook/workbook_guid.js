
function getFolderGuid(){
    g_post.guid("folder", waitGetFolderGuid)
}
function waitGetFolderGuid(res){
    console.log(res)
    resultNewFolder("guid", res)
}

function getFileGuid(){
    g_post.guid("file", waitGetFileGuid)
}

function waitGetFileGuid(res){
    console.log(res);
    resultAddFile("guid", res)
}

function getProGuid(){
    g_post.guid("pro", waitGetProGuid)
}

function waitGetProGuid(res){
    console.log(res)
    resultNewPro("guid", res)
}