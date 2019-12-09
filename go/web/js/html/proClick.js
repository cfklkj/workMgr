var click = click || {};
var wkClick = click.Method = { 
    clickUltitle:function(event){
        id = event.srcElement.id  
        wkQueue.popTipsEndByIndex(id)
        wkPost.proGet(wkQueue.getPath(), wkQueue.getID(), wkMsg.proGet)
    },
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
                wkList.showUI(true)
            break;  
        }
    },
    clickLi: function(event){
        id = event.srcElement.id
        name = event.srcElement.innerText 
        this.clickLiAct(id, name)
    },
    clickLiAct:function(id, name){
        switch (id.slice(0,2)) {
            case "F_":
                wkPost.fileGet(wkQueue.getPath(), id, wkMsg.fileGet)
            break;
            case "D_":
                wkPost.proGet(wkQueue.getPath(), id, wkMsg.proGet)
                wkQueue.push(id)
                wkQueue.pushTips(name) 
            break; 
        }
    },
    clickBtn: function(event){
        id = event.srcElement.id 
        this.clickBtnAct(id)
    },
    clickBtnAct:function(id){
        liId = wkQueue.getID() 
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
                wkPost.fileAlt(wkQueue.getPath(), wkQueue.getFile(), wkDetail.getTextareaData(), wkMsg.fileKeep)
            break; 
            case wkMenu.btn_PgUp:
                    if (wkQueue.dataLen() > 1){ 
                        wkQueue.pop()
                        wkQueue.popTips()
                    }
                    liId = wkQueue.getID()
                    wkPost.proGet(wkQueue.getPath(), liId, wkMsg.proGet) 
            break;
            case wkMenu.btn_rename:
                wkPost.nameAlt(wkQueue.getPath(), wkQueue.getRename(), wkMenu.getRename(), wkMsg.nameAlt)
            break;

        }
    }
}