 
var postReturn =  postReturn || {}; 
var wkMsg = postReturn.commonMethod  = {
    print: function(res){
        console.debug(res)     
    },
    //请求头 
    proGet: function(data){  
        guids = data.Data.Guids  
        wkList.clearli()
        for( let index in guids)
        {    
            id = guids[index].Guid
            name = guids[index].Name
            ele = util.getEleById(id) 
            switch (id.slice(0,2)) {
                case "F_": 
                    wkList.setli(id, name)    
                    util.addEvent(id, "wkClick.clickLi(event)")  
                    util.addClass(ele, "icon-file")
                break;
                case "D_": 
                    wkList.setliLink(id, name)    
                    util.addEvent(id, "wkClick.clickLi(event)")  
                break; 
            }
        }         
    },
    proAdd: function(data){ 
        id = data.Data.Guid
        name = data.Data.Name
        if (id != ""){ 
            if(id.slice(0,2) == "F_") { 
                wkList.setli(id, name)    
                wkPost.fileGet(wkQueue.getPath(), id, wkMsg.fileGet)
            } else{ 
                wkList.addLiLink(id,name)
            }
            util.addEvent(id, "wkClick.clickLi(event)")  
        }
    },
    fileGet: function(data){ 
        id = data.Data.Guid 
        var base = new Base64(); 
        data = base.decode(data.Data.Data)
        wkQueue.setFile(id)
        name = util.getEleName(id)
        wkDetail.setH4Name(name)
        wkDetail.setTextareaData(data)
    },
    nameAlt:function(data){
        id = data.Data.Guid 
        name = data.Data.Name
        switch (id.slice(0,2)) {
            case "F_":
                wkDetail.setH4Name(name) 
                util.setEleName(id, name)
            break;
            case "D_":
                wkList.setUlName(name)  
            break; 
        }
    },
}   