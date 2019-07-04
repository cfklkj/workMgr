function getTxt(guid){
    g_post.txt("get", guid, "", waitGetTxt)
}
function waitGetTxt(res){
    console.log(res)
    resultGetTxt(res)
}

function altTxt(guid, data){
    var base64Data = data
    g_post.txt("alt", guid, base64Data, waitAltTxt)
}
function waitAltTxt(res){
    console.log(res)
}
