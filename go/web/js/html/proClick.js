var click = click || {};
var wkClick = click.Method = { 
    clickTitle: function(event){
        id = event.srcElement.id 
        this.clickTitleEvent(id)
    },
    clickTitleEvent: function(id){ 
        switch (id) {
            case wkDetail.name:
                wkQueue.setRename(wkQueue.getFile())
                wkMenu.setRename(util.getEleName(id))
            break;  
            case wkList.name:
                wkQueue.setRename(wkQueue.getID())
                wkMenu.setRename(wkQueue.topTips())
                wkList.forkUl()
            break;  
        }
    },
    clickLi: function(event){
        id = event.srcElement.id
        name = event.srcElement.innerText
        console.debug("clickLi",  event.srcElement.innerText, event.srcElement.id)
        switch (id.slice(0,2)) {
            case "F_":
                wkPost.fileGet(wkQueue.getPath(), id, wkMsg.fileGet)
            break;
            case "D_":
                wkPost.proGet(wkQueue.getPath(), id, wkMsg.proGet)
                wkQueue.push(id)
                wkQueue.pushTips(name)
                wkList.setUlName(wkQueue.getTips())
            break; 
        }
    },
    clickBtn: function(){
        id = event.srcElement.id 
        this.clickBtnAct(id)
    },
    clickBtnAct:function(id){
        liId = wkQueue.getID()
        console.debug("clickBtn",  event.srcElement.innerText, event.srcElement.id, liId)
        switch (id) { 
            case wkMenu.btn_addPro:
            break;
            case wkMenu.btn_addDir:
                wkPost.dirCreate(wkQueue.getPath(), liId, wkMsg.proAdd) 
            break;
            case wkMenu.btn_addFile:
                wkPost.fileCreate(wkQueue.getPath(), liId, wkMsg.proAdd)
            break; 
            case wkMenu.btn_keepFile:
                wkPost.fileAlt(wkQueue.getPath(), wkQueue.getFile(), wkDetail.getTextareaData(), wkMsg.print)
            break; 
            case wkMenu.btn_PgUp:
                    wkQueue.pop()
                    wkQueue.popTips()
                    liId = wkQueue.getID()
                    if (liId) {
                        name = util.getEleName(liId)
                        wkList.setUlName(wkQueue.getTips())
                        wkPost.proGet(wkQueue.getPath(), id, wkMsg.proGet) 
                    }else{ 
                        name =  wkQueue.getPath()
                        wkList.setUlName("根---")
                        wkPost.proGet(name, "", wkMsg.proGet)
                    }
            break;
            case wkMenu.btn_rename:
                wkPost.nameAlt(wkQueue.getPath(), wkQueue.getRename(), wkMenu.getRename(), wkMsg.nameAlt)
            break;

        }
    }
}