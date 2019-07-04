
function getProlist(){
    g_post.prolist("get", "", "", waitGetProlist)
}

function waitGetProlist(res){
    console.log(res);
    resultGetProlist(res)
}

function newProlist(guid, name){
    g_post.prolist("create", guid, name, waitNewProlist)
}

function waitNewProlist(res){
    console.log(res)
    resultNewPro("prolist", res)
}

function dropProlist(guid){
    g_post.prolist("drop", guid, "", waitDropProlist)
}
function watiDropProlist(res){
    console.log(res);
}

function altProlist(guid, name){
    g_post.prolist("alt", guid, name, waitAltProlist)
}
function waitAltProlist(res){
    console.log(res);
    resultAltProName(res)
}