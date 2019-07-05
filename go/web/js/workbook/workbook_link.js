function getLinkData(guid){
    g_post.linkData("get", guid, "", waitGetLinkData)
}
function waitGetLinkData(res){
    console.log(res)
    resultGetLinklist("link", res)
}

function getChileLinkData(guid){
    g_post.linkData("get", guid, "", waitGetChileLinkData)
}
function waitGetChileLinkData(res){
    console.log(res)
    resultGetChileLinklist("link", res)
}


function  addLinkData(guid, parentGuid){
    g_post.linkData("create", guid, parentGuid, waitAddLinkData)
}
function waitAddLinkData(res){
    console.log(res)
    resultNewFolder("link", res)
}

function  addLinkData_file(guid, parentGuid){
    g_post.linkData("create", guid, parentGuid, waitAddLinkData_file)
}
function waitAddLinkData_file(res){
    console.log(res)
    resultAddFile("link", res)
}
 
 
function dropLinkData(guid, parentGuid){
    g_post.linkData("drop", guid, parentGuid, watiDropLinkData)
}
function waitDropLinkData(res){
    console.log(res)
}


function swapLinkData(parentGuid, guidA, guidB){
    g_post.linkDataSwap("swap", parentGuid, guidA, guidB, waitSwapLinkData)
}
function waitSwapLinkData(res){
    console.log(res)
}

function mvLinkData(parentGuid, guid, toParentGuid){
    g_post.linkDataMv("mv", parentGuid, guid, toParentGuid, waitMvLinkData)
}
function waitMvLinkData(res){
    console.log(res)
    resultMvFile(res)
}