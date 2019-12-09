
 document.onkeydown= function(event){  
     console.debug("ddd", event.ctrlKey, event.keyCode) 
     if (event.keyCode == 27) {//esc
        wkList.showUI(false)
        return
     }
     if(event.keyCode == 36) //home
     {
        load()
         return
     }
     if (event.ctrlKey && event.keyCode == 72) {  //ctrl + h
         help()
         return
     }
     if (wkMenu.isEdit()) {  //rename 
        if(event.keyCode == 13 || (event.ctrlKey && event.keyCode == 83)){  // ctrl + s
            wkMenu.focusRename()
            wkClick.clickBtnAct(wkMenu.btn_rename)
            return
        } 
        return
     }
     if (wkDetail.isEdit()) {  //edit
        if(event.ctrlKey && event.keyCode == 83 ){  // ctrl + s  
            wkClick.clickBtnAct(wkMenu.btn_keepFile)
            return
        }  
        console.log("sdf")
        wkDetail.keepStatu(false)
        return
     } 
    if(event.shiftKey && event.keyCode == 68){  // shift + d
        wkClick.clickBtnAct(wkMenu.btn_addDir)
        return
    }
    if(event.shiftKey && event.keyCode == 70){  // shift + f
        wkClick.clickBtnAct(wkMenu.btn_addFile)
        return
    }    
    if (wkList.isUlFocus()) {  //ul list    
        if ((event.ctrlKey && event.keyCode == 67) && wkDrag.ondragstart(event)) {  //ctrl + c
            return
        }else if ((event.ctrlKey && event.keyCode == 86) && wkDrag.ondragend(wkDrag.typeswap) ) { //ctrl + v         
            return
        } else if ((event.shiftKey && event.keyCode == 73) && wkDrag.ondragend(wkDrag.typein) ) { //shift + i  in        
            return
        } else if ((event.shiftKey && event.keyCode == 79) && wkDrag.ondragend(wkDrag.typeout) ) { //shift + o  out         
            return
        } 
    }
    
    if(event.ctrlKey && event.keyCode == 8){  // ctrl + backspace
        wkClick.clickBtnAct(wkMenu.btn_PgUp)
        return
    }
}
 
function help()
{
    tips = "esc=显示或隐藏目录\thome=根目录\nctrl+c=选中目标\t\nctrl+v=交换\tshift+i=移入\tshift+o=移出\n"
    tips +="ctrl+s=保存--保存文件时，文件标题会改变颜色\nshift+d=建目录\tshift+f=建文件\n"
    tips +="ctrl+backspace=返回上个目录"
    alert(tips)
}
 