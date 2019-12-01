 
var postReturn =  postReturn || {}; 
var wkMsg = postReturn.commonMethod  = {
    print: function(res){
        console.debug(res)     
    },
    //列表 
    proGet: function(data){  
        
        liId = wkQueue.getID()
        if (liId != "root") { 
            wkList.setUlName(wkQueue.getTips())
        }else{  
            wkList.setUlName("根---")
            wkMenu.setRename("") 
        }

        guids = data.Data.Guids  
        wkList.clearli()
        wkClick.clickTitleEvent(wkList.name)  
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
    //重新获取
    proReGet: function(data){ 
        wkMsg.proGet(data) 
    },
    //添加
    proAdd: function(data){ 
        id = data.Data.Guid
        name = data.Data.Name
        if (id != ""){ 
            if(id.slice(0,2) == "F_") { 
                wkList.setli(id, name)    
                wkPost.fileGet(wkQueue.getPath(), id, wkMsg.fileGet)
                util.addEvent(id, "wkClick.clickLi(event)")  
            } else{  
                wkClick.clickLiAct(id, name)
                wkMenu.focusSetRename()
            }
        }
    },
    //获取文件
    fileGet: function(data){ 
        id = data.Data.Guid 
        var base = new Base64(); 
        data = base.decode(data.Data.Data)
        wkQueue.setFile(id)
        name = util.getEleName(id)
        wkDetail.setH4Name(name)      
        wkDetail.setTextareaData(data)  
        wkClick.clickTitleEvent(wkDetail.name)
    },
    //修改名称
    nameAlt:function(data){
        id = data.Data.Guid 
        name = data.Data.Name
        switch (id.slice(0,2)) {
            case "F_":
                wkDetail.setH4Name(name) 
                util.setEleName(id, name)
            break;
            case "D_":                
                wkQueue.popTips() 
                wkQueue.pushTips(name)
                wkList.setUlName(wkQueue.getTips())  
            break; 
        }
    },
    //变更
    linkSwap:function(data){ 
        if(data.Data) {  
            liId = wkQueue.getID()
            wkPost.proGet(wkQueue.getPath(), liId, wkMsg.proReGet)
        } 
    },
    linkChangeIn:function(data){ 
        if(data.Data) {  
            wkQueue.push(this.des)
            liId = wkQueue.getID()
            wkPost.proGet(wkQueue.getPath(), liId, wkMsg.proReGet)
        } 
    },
    linkChangeOut:function(data){  
        if(data.Data) {  
            wkQueue.pop()
            liId = wkQueue.getID()
            wkPost.proGet(wkQueue.getPath(), liId, wkMsg.proReGet)
        } 
    }
}   