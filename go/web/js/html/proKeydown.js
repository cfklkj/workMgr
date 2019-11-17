
 document.onkeydown= function(event){
     console.debug(event.keyCode)
     if (wkMenu.isEdit()) {  //保存镖旗
        if(event.ctrlKey && event.keyCode == 83){  // ctrl + s
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