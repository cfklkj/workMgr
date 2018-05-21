
window.onload = main;
 
var serverUrl = "127.0.0.1"
//var serverUrl = "https://127.0.0.1:7885"
var MyToken = ""
var g_AdPro = 0;  
function main() {  
    onDBinit(); 
}  
function onDBinit()
{
    onGetDBlist();  
    serverName = document.getElementById('serverName'); 
    serverName.onchange = onSetDBName
    DBName = document.getElementById('DBName');
    butt_exec = document.getElementById('butt_exec');
    butt_exec.onclick = submitTryit
    butt_copy = document.getElementById('butt_copy');
    butt_copy.onclick = copyResult
    sqlCode = document.getElementById('sqlCode'); 
    results = document.getElementById('results');
    butt_js2tb = document.getElementById('butt_js2tb');
    butt_js2tb.onclick = JsonToTable
    butt_base64 = document.getElementById('butt_base64');
    butt_base64.onclick = onBase64De 
} 
function copyResult()
{
    sqlCode.innerHTML = results.innerHTML
}

//获取数据库列表---start
function onGetDBlist(jsonInfo)
{ 
    if(typeof(jsonInfo) == "object")
    { 
        for(j = 0; jsonInfo[j]; j++)
        { 
            serverName.options[j]=new Option(jsonInfo[j].name,jsonInfo[j].chileDB);  
        } 
        onSetDBName();
        return;
    } 
    AjaxInfo("post", serverUrl + '/DBMgr&getDBInfo', "", "onGetDBlist")  
 }
 function onSetDBName()
 {
     
    var index = serverName.selectedIndex;  
    if(index < 0)
        return;
    DBnameValue = serverName.options[index].value.split(',')
    DBName.innerHTML = ""
    for(j = 0; DBnameValue[j]; j++)
    { 
        DBName.options[j]=new Option(DBnameValue[j], j);  
    } 
 } 
 //传入要获取其中选择文本的对象
function getSelectedText(){ 
    ranges = window.getSelection();
    if(ranges.rangeCount > 0)
    {
        start =  sqlCode.selectionStart
        end = sqlCode.selectionEnd
       return sqlCode.value.substring(start, end); 
    }
    return ""
  }

 function submitTryit()
 {
    var index = serverName.selectedIndex;  
    serverNameValue = serverName.options[index].innerHTML
    index = DBName.selectedIndex;  
    DBNameValue = DBName.options[index].innerHTML
 
    sqlCodeValue = getSelectedText()
    if(sqlCode == "") 
    { 
         sqlCodeValue =  sqlCode.innerHTML
    } 
    var c2sDBinfo = {"Name":serverNameValue, "ChileDB":DBNameValue, "ExcuteSql":sqlCodeValue};
    AjaxInfo("post", serverUrl + '/DBMgr&sqlExec', c2sDBinfo, "ShowResult")
 }

 function ShowResult(jsonInfo)
 {
    results.innerHTML = jsonInfo;
 }

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
                else if(actType == "ShowResult")
                {
                    ShowResult(xhr.responseText)
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