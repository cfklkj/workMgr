
document.write('<script type="text/javascript" src="js/lib/FlyWeb.js"></script>')  //引入js 
window.onload = main
  
var serverUrl = "127.0.0.1"
var MyToken = "1111" 
function Post(){
    //请求数据
    this.request =  FlyWeb  //-----------调用Flyweb里的request
} 
    
function main() {   
   g_linkInfo = []
   m_toolsOnline = document.getElementById("toolsOnline")
   addLinkInfo("test", "123123", "测试")
   addLinkInfo("test", "222222", "青蛙")
   delLinkInfo(100, "测试")
   showLinkInfo()
}    
function delLinkInfo(Pid, linkName)
{
    for(var index in g_linkInfo)
    {
        if(g_linkInfo[index].id == Pid)
        {              
            for(var chileLink in g_linkInfo[index].links)
            {      
                g_linkInfo[index].links.unshift(g_linkInfo[index].links[chileLink])
                g_linkInfo[index].links.splice(i+1,1); 
                return
            }
            return
        }
    }
}

function addLinkInfo(name, link, linkName)
{
    //插入新子节点
    for(var index in g_linkInfo)
    {
        if(g_linkInfo[index].name == name)
        {            
            var newNode = {
                "link":link,
                "name":linkName
            } 
            g_linkInfo[index].links.push(newNode)
            return
        }
    }
    //获得新节点id
    newId = 100
    for(ID = 100; ID<1000; ID++)
    {   newId = ID
        for(var index in g_linkInfo)
        {
            if(g_linkInfo[index].id == ID)
            {                
                var newNode = {
                    "link":link,
                    "name":linkName
                }
                g_linkInfo[index].name = name 
                g_linkInfo[index].links.push(newNode)
               return
            }
        }        
    } 
    var newParentNode = {
        "id":newId,
        "name":name,
        "links":[]
    }
    g_linkInfo.push(newParentNode)   //添加新节点
    addLinkInfo(name, link, linkName)  //添加子节点
}

function showLinkInfo()
{
    for(var index in g_linkInfo)
    { 
        for(var chileLink in g_linkInfo[index].links)
        {      
            addLink(g_linkInfo[index].id, g_linkInfo[index].name, g_linkInfo[index].links[chileLink].link,g_linkInfo[index].links[chileLink].name)  
        }
    }

}

function addLink(Pid, name, link, linkName)
{
    chileDiv = document.getElementById(Pid)
    if(chileDiv)
    {
        chileDiv.innerHTML += '&emsp;<a href="' + link + '" target="_blank">' + linkName + '</a>'
    }else
    {
        objP = "<p>"+name+"</p>"
        objDiv = "<div id=" + Pid + ">" + '<a href="' + link + '" target="_blank">' + linkName + '</a>'
        m_toolsOnline.innerHTML += objP + objDiv
    }
}