function JsonToTable()
{
    try
    {  
        jsonInfo = JSON.parse(results.innerHTML)
    }catch(err)
    { 
        alert("请使用正确的可转换的json格式");
        return;
    }
    results.innerHTML = '<table id="f_js2tb"/>'
    var table = document.getElementById('f_js2tb');  
    var tr,td;     
    tr = table.insertRow(0);
    tr.style.backgroundColor = "green"; 
    //head
    for(var i=0,l=jsonInfo.length;i<l;i=jsonInfo.length){
        for(var key in jsonInfo[i]){
            td = tr.insertCell(tr.cells.length);
            td.innerHTML = key;
            td.id = key;
            td.align = "center";  
        }
    } 
    //body 
    var value =0; 
    var headTd = table.getElementsByTagName("td")
    for(var info=0; jsonInfo[info];info++){  //json
        tr = table.insertRow(table.rows.length);  //row
        for (var i=0;i<headTd.length;i++) {  //table
            for(var key in jsonInfo[info])
            {                        
                if(key == headTd[i].id)  //col
                {                            
                    td = tr.insertCell(tr.cells.length);  
                    td.innerHTML = jsonInfo[info][key]; 
                    td.align = "center";
                    break;
                }
            }                        
        } 
    }
}

function onBase64De()
{    
    sqlCodeValue =  sqlCode.innerHTML
    var tbase64 = new Base64()
    try{ 
        jsonInfo = JSON.parse(sqlCodeValue)
        for(var i=0,l=jsonInfo.length;i<l;i++){
            for(var key in jsonInfo[i]){ 
                jsonInfo[i][key] = tbase64.decode(jsonInfo[i][key]);
            }
        }
        results.innerHTML  = JSON.stringify(jsonInfo);
    }catch(err){
        results.innerHTML = tbase64.decode(sqlCodeValue)
    } 
}