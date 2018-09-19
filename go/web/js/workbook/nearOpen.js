
//--------------------------------
//nearOpen
function Queue(size) {
    var list = [];

    //向队列中添加数据
    this.push = function(data) {
        if (data==null) {
            return false;
        }
        var index = this.find(data);
        if(index > -1)
        {
            return false;
        }
        //如果传递了size参数就设置了队列的大小
        if (size != null && !isNaN(size)) {
            if (list.length == size) {
                this.pop();
            }
        }
        list.unshift(data);
        return true;
    }

    //从队列中取出数据
    this.pop = function() {
        return list.pop();
    }

    //从队列移除数据
    this.move = function(value) { 
        var index = this.find(value);
        if(index > -1)
        {
            return list.splice(index,1);
        }   
    }
    //查找队列值
    this.find = function(value){
        for(i = 0; i<list.length; i++)
        {
            if(list[i].ParentId == value.ParentId && list[i].ChileId == value.ChileId)
            {
                return i;
            }  
        } 
        return -1;
    }
    //返回队列的大小
    this.size = function() {
        return list.length;
    }

    //返回队列的内容
    this.quere = function() {
        return list;
    }
}

function InitNearOpen()
{
    var size = 10
    g_queue = new Queue(size) 
    g_post.getJson("NearFile", onAddNearOpen)
} 
function onAddNearOpen(responseText)
{
    try
    {
        JsonInfo = JSON.parse(responseText)
    }catch(err)
    { 
        JsonInfo = 0
    }
    if(JsonInfo)
    { 
        for(var i = JsonInfo.length-1; JsonInfo[i]; i--)
        {
            AddNearOpen(JsonInfo[i].ParentId, JsonInfo[i].ChileId, false)
        }
    }
}
function AddNearOpen(pId, cId, isUp = true)
{ 
    var value = {"ParentId":pId, "ChileId":cId}  
    g_queue.push(value)  
    if(isUp)
    {
        g_post.upJson("NearFile", JSON.stringify(g_queue.quere()))
    }
}

function getNearFileJson(pId, cId)
{
    jsonInfo =  g_jsonFileInfo[Math.abs(pId)]  
    for(var i = 0; jsonInfo[i]; i++)
    {     
        if(jsonInfo[i].id == cId)
            return jsonInfo[i];
    }
    return null;
}

function loadNearFile()
{  
    var setDefault = false
    g_defaultFileKey = 0
    var quer = g_queue.quere() 
    var size = g_queue.size()
    for(i = 0; i < size; i++)
    {
        pId = quer[i].ParentId
        cId = quer[i].ChileId
        var fJson = getNearFileJson(pId, cId)
        if(fJson)
        {
            if(!setDefault)
            {
                setDefault = true
                g_defaultFileKey = fJson.id
            }
            if(fJson["isDelete"])
            {
               // addCrashFile(pId, cId, fJson.fName)  
            }else
            {
                addFile(pId, cId, fJson.fName) 
            }
        }
    }
}