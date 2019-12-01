var Menu =  Menu || {}; 
var wkMenu = Menu.commonMethod  = { 
    btn_addPro:'pro',
    btn_addDir:'dir',
    btn_addFile:'file',
    btn_keepFile:'kfile',
    btn_PgUp:'PgUp',
    btn_PgDn:'PgDn',
    btn_rename:"rename",
    txt_rename:"renameInput",
    //function-------
    addBtn: function(id, name){   
        return '<button type="button" id='+id +'>' + name + '</button>'
    }, 
    //textarea
    addTextarea: function(id)
    {
        textarea = "<a>重命名区：</a><textarea id=" + id  +"></textarea>"
        return textarea
    }, 
    setRename:function(name){
        if (name == null ){ 
            return
        }
        ele = util.getEleById(this.txt_rename)
        ele.innerHTML = name
    },
    getRename:function(){
        ele = util.getEleById(this.txt_rename)
        return ele.innerHTML 
    },
    //init
    initBtn: function(id){ 
        ele = util.getEleById(id) 
        util.addClass(ele, "menu-init")
        // util.addElement(ele, this.addBtn(this.btn_addPro, "AddPro"))
        // util.addElement(ele, this.addBtn(this.btn_addDir, "AddDir"))
        // util.addElement(ele, this.addBtn(this.btn_addFile, "AddFile"))
        // util.addElement(ele, this.addBtn(this.btn_keepFile, "KeepFile"))
        // util.addElement(ele, this.addBtn(this.btn_PgUp, "PgUp"))
        // util.addElement(ele, this.addBtn(this.btn_PgDn, "PgDn"))
        util.addElement(ele, this.addTextarea(this.txt_rename, "rename"))
        util.addElement(ele, this.addBtn(this.btn_rename, "rename"))
        // util.addEvent(this.btn_addPro, "wkClick.clickBtn(event)")
        // util.addEvent(this.btn_addDir, "wkClick.clickBtn(event)")
        // util.addEvent(this.btn_addFile, "wkClick.clickBtn(event)")
        // util.addEvent(this.btn_keepFile, "wkClick.clickBtn(event)")
        // util.addEvent(this.btn_PgUp, "wkClick.clickBtn(event)")
        // util.addEvent(this.btn_PgDn, "wkClick.clickBtn(event)")
        util.addEvent(this.btn_rename, "wkClick.clickBtn(event)")
        util.addEvent(this.txt_rename, "select()") //全选
    }, 
    isEdit:function(){
        ele = util.getEleById(this.txt_rename)
       if (ele == document.activeElement){
           return true
       }
       return false
    },
    focusRename:function(){
        ele = util.getEleById(this.btn_rename)
        ele.focus()
    },
    focusSetRename:function(){
        ele = util.getEleById(this.txt_rename)
        ele.focus()
    },
}   