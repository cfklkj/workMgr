
 document.onkeydown= function(event){  
     console.debug("ddd", event.ctrlKey, event.keyCode) 
     if (event.keyCode == 27) {//esc
        wkList.showUI(false)
        return
     }
    if ((event.ctrlKey && event.keyCode == 67) && wkDrag.ondragstart(event)) {  //ctrl + c
            return
    }else if ((event.ctrlKey && event.keyCode == 86) && wkDrag.ondragend(wkDrag.typeswap) ) { //ctrl + v         
        return
    } else if ((event.shiftKey && event.keyCode == 73) && wkDrag.ondragend(wkDrag.typein) ) { //shift + i  in        
        return
    } else if ((event.shiftKey && event.keyCode == 79) && wkDrag.ondragend(wkDrag.typeout) ) { //shift + o  out         
        return
    } 
     if (wkMenu.isEdit()) {  //保存镖旗 
        if(event.keyCode == 13 || (event.ctrlKey && event.keyCode == 83)){  // ctrl + s
            wkMenu.focusRename()
            wkClick.clickBtnAct(wkMenu.btn_rename)
            return
        }
     }
     if (wkDetail.isEdit()) {
        if(event.ctrlKey && event.keyCode == 83){  // ctrl + s
            wkClick.clickBtnAct(wkMenu.btn_keepFile)
            return
        }
     }else{ 
        if(event.shiftKey && event.keyCode == 68){  // ctrl + d
            wkClick.clickBtnAct(wkMenu.btn_addDir)
            return
        }
        if(event.shiftKey && event.keyCode == 70){  // ctrl + f
            wkClick.clickBtnAct(wkMenu.btn_addFile)
            return
        }
    } 
    if(event.ctrlKey && event.keyCode == 8){  // ctrl + backspace
        wkClick.clickBtnAct(wkMenu.btn_PgUp)
        return
    }
}
 