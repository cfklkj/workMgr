
window.onload = main
  
var serverUrl = "127.0.0.1"
var MyToken = ""
var MylistArray = new Array()
var listArrayCount = 0


function AjaxInfo(GOrP, URL, data, actType)
{ 
   var xhr = new XMLHttpRequest();
   xhr.open(GOrP, URL, true);
   if(MyToken != "")
     xhr.setRequestHeader("token", MyToken); 
   if(data == "")
   {
       xhr.send();
   }else
   {
       xhr.send(JSON.stringify(data));
   }
   xhr.onreadystatechange = function () {;
       if (xhr.readyState == 4) { // 读取完成
           if (xhr.status == 200) { 
               if(actType == "onGetDBlist")
               {
                   onGetDBlist(JSON.parse(xhr.responseText))
               }
               else if(actType == "onShowDir")
               {
                    onShowDir(JSON.parse(xhr.responseText))
               } 
               else if(actType == "onShowTxt")
               {
                    onShowTxt(xhr.responseText)
               } 
               else if(actType == "onAddDirs")
               {
                    onAddDirs(JSON.parse(xhr.responseText))
               } 
               else if(actType == "showStatu")
               {
                    showStatu(xhr.responseText)
               } 
           }
           if(xhr.status == 500){
               if(xhr.responseText == "token timeout")
               {
                   window.location.reload();
               }else
                   alert(xhr.responseText);
           }
       }
   }
}
    
function main() {   
   // document.onkeydown=onKeyLogin    
   butt_up = document.getElementById('butt_up'); 
   butt_up.onclick = onUpDir
   explist = document.getElementById('explist'); 
   explistLog = document.getElementById('explistLog');  
   results = document.getElementById('results'); 
   butt_add = document.getElementById('butt_add'); 
   butt_add.onclick = onAddDir 
   butt_openDir = document.getElementById('butt_openDir'); 
   butt_openDir.onclick = onOpenDir 
   butt_keep = document.getElementById('butt_keep'); 
   butt_keep.onclick = onKeeptxt 
   onLoadLogDir()
}  
function doword() { 
    window.open("c:\\skill.xlsx"); 
}

function onLoadLogDir()
{
    AjaxInfo("post",serverUrl + '/Explorer&showLogDir', "", "onAddDirs")
}
//目录列表--start
function onAddDir()
{        
    AjaxInfo("post",serverUrl + '/Explorer&editDir', "", "showStatu")
}
//文件列表---start
function onOpenDir()
{
    var data = {"dirPath":explist.value} 
    AjaxInfo("post",serverUrl + '/Explorer&openDir', data, "showStatu")
}
function onUpDir()
{
    if(listArrayCount -1 < 1)
    { 
        return 
    } 
    listArrayCount = listArrayCount -1
    butt_up.values = MylistArray[listArrayCount -1]
    var data = {"HomePath":butt_up.values, "ChilPath":""}
    AjaxInfo("post",serverUrl + '/Explorer&getDir', data, "onShowDir")
} 
function onAddDirs(jsonInfo)
{
    for( i = 0; jsonInfo[i] && jsonInfo[i].dir; i++)
    { 
        Ta = '<a href="javascript:void(0);" onclick="HrefDirParent(this)">' + jsonInfo[i].dir + "</a><p/>";
        explistLog.innerHTML += Ta
    }
}
//文件列表---点击事件
function HrefDirParent(chilPath)
{ 
    listArrayCount = 0;
    MylistArray[listArrayCount] = chilPath.innerHTML;
    listArrayCount = listArrayCount + 1;
    explist.value = chilPath.innerHTML
    var data = {"HomePath":explist.value, "ChilPath":""}
    showStatu(explist.value)
    AjaxInfo("post",serverUrl + '/Explorer&getDir', data, "onShowDir")
} 
function HrefDir(chilPath)
{  
    MylistArray[listArrayCount] = MylistArray[listArrayCount-1] + "\\" + chilPath.innerHTML;
    listArrayCount = listArrayCount + 1;
    showStatu(explist.value+chilPath.innerHTML)
    var data = {"HomePath":explist.value, "ChilPath":chilPath.innerHTML}
    AjaxInfo("post",serverUrl + '/Explorer&getDir', data, "onShowDir")
}
function HrefTxt(obj)
{     
    var data = {"HomePath":explist.value, "ChilPath":obj.innerHTML, "FileType":obj.valueType}
    explist.filePath = explist.value + "\\" + obj.innerHTML
    showStatu(explist.filePath)
    AjaxInfo("post",serverUrl + '/Explorer&getTxt', data, "onShowTxt")
}
//文件列表---显示服务器信息
function onShowDir(jsonInfo)
{
    if(!jsonInfo) 
        return;
    explist.value = jsonInfo.homePath
    explist.innerHTML = "";
    for(i = 0; jsonInfo.chils && jsonInfo.chils[i]; i++)
    {
        if(jsonInfo.chils[i].fileType == "dir")
          {
            Ta_A = '<a href="javascript:void(0);" onclick="HrefDir(this)">' + jsonInfo.chils[i].path + "</a><p/>";

          } else
          {
              if(jsonInfo.chils[i].path.indexOf(".txt") > 0 || jsonInfo.chils[i].path.indexOf(".ini") > 0 
              || jsonInfo.chils[i].path.indexOf(".lua") > 0 || jsonInfo.chils[i].path.indexOf(".json") > 0)
                 Ta_A = '<a href="javascript:void(0);" onclick="HrefTxt(this)" valueType="txt" style="color: rgb(75, 18, 141)">' + jsonInfo.chils[i].path + "</a><p/>";
              else
                 Ta_A = '<a>' + jsonInfo.chils[i].path + "</a><p/>";

          }
        explist.innerHTML += Ta_A;
    } 
}
//详情----start
function onShowTxt(txtInfo)
{
    Texts = '<textarea id="txtInfo">' + txtInfo + "</textarea>"
    results.innerHTML = Texts
}

function onKeeptxt()
{
    txtInfo = document.getElementById("txtInfo")
    var data = {"filePath":explist.filePath, "txtInfo":txtInfo.innerHTML} 
    showStatu("保存文件:" +explist.filePath)
    AjaxInfo("post",serverUrl + '/Explorer&keepTxt', data, "showStatu")
}
//状态----start
function showStatu(statusInfo)
{    
    status = document.getElementById("status")
    status.innerHTML = statusInfo
}
