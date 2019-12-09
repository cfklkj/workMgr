 
document.write('<script  type="text/javascript" src="js/html/util.js"></script>')  
document.write('<script  type="text/javascript" src="js/lib/base64.js"></script>')   
document.write('<script type="text/javascript" src="js/html/proIdQueue.js"></script>') 
document.write('<script type="text/javascript" src="js/html/proDetail.js"></script>') 
document.write('<script type="text/javascript" src="js/html/proClick.js"></script>') 
document.write('<script type="text/javascript" src="js/html/proMenu.js"></script>') 
document.write('<script type="text/javascript" src="js/html/proList.js"></script>') 
document.write('<script type="text/javascript" src="js/html/proDiv.js"></script>') 
document.write('<script type="text/javascript" src="js/html/proKeydown.js"></script>') 
document.write('<script type="text/javascript" src="js/html/proDrag.js"></script>') 
document.write('<script type="text/javascript" src="js/workbook/proActPost.js"></script>')   
document.write('<script type="text/javascript" src="js/workbook/proActHtml.js"></script>') 
window.onload = main 
TokenStr = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9OYW1lIjoidHpqIn0.0fcFC2FdkTobilP-4xkEd2zHdDfOqITqWaZ119lxHyo"

function main() {        
    wkDiv.initProDiv() 
    load() 
}   
 
function load (){
    wkQueue.setPath(TokenStr) 
    wkQueue.push("root")
    wkPost.proGet(TokenStr, "", wkMsg.proGet)
   // wkPost.proCreate("test", wkMsg.proAdd) 
  // wkPost.fileCreate("test", wkMsg.proAdd) 
  //  g_proAct.proGet("test", g_proActDo.print)

}