
function getDirlist(guid){
    g_post.dirlist("get", guid, "", waitGetDirlist)
}

function waitGetDirlist(res){
    console.log(res);
}

function newDirlist(guid, name){
    g_post.dirlist("create", guid, name, waitNewDirlist)
}

function waitNewDirlist(res){
    console.log(res)
    resultNewFolder("dirlist", res)
}


function newFilelist(guid, name){
    g_post.dirlist("create", guid, name, waitNewFilelist)
}

function waitNewFilelist(res){
    console.log(res)
    resultAddFile("dirlist", res)
}

function dropDirlist(guid){
    g_post.dirlist("drop", guid, "", waitDropDirlist)
}
function watiDropDirlist(res){
    console.log(res);
}

function altDirlist(guid, name){
    g_post.dirlist("alt", guid, name, waitAltDirlist)
}
function waitAltDirlist(res){
    console.log(res);
    resultAltDirName(res)
}
function altDirlist_file(guid, name){
    g_post.dirlist("alt", guid, name, waitAltDirlist_file)
}
function waitAltDirlist_file(res){
    console.log(res); 
}


 