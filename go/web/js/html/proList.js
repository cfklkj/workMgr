var List =  List || {}; 
var wkList = List.commonMethod  = {
    root:"Mroot",  
    name:"MrootName",
    tickTime:false,
    //function-------
    //ul
    addUl: function(id){ 
        ul = "<ul style='height:0px;' id=" + id  +"></ul>"
        return ul
    },
    //li
    addLi: function(id, value)
    {        
        li = '<li><div><a  id=' + id  +">" + value + "</a></div></li>" 
        return li
    },  
    //H4
    addH4: function(id)
    {
        li = "<h4 id=" + id  +"></h4>"
        return li
    },
    //p
    addP:function(id, name){
        p="<p id="+id + ">" + name + "</p>"
        return p
    },
    //init
    initUl: function(id){ 
        ele = util.getEleById(id)
        util.addClass(ele, "list-init")
        util.addElement(ele, this.addH4(this.name))  //添加h4
        util.addElement(ele, this.addUl(this.root))  //添加根ul
    },  
    focusUl:function(){
        ul = util.getEleById(this.name)
        ul.focus()
    },
    isUlFocus: function(){           
        ul = util.getEleById(this.root)
        return ul.style.height != "0px"
    },
    clearUlname:function(){
        ele = util.getEleById(this.name) 
        ele.innerHTML = ""
    },
    //set
    setUlName:function(index, name) { 
        if (index > 0) { 
            this.putName("", "/")
            this.putName(index, name)
        }else{
            this.putName(index, name) 
        }        
        util.addEvent(index,"wkClick.clickUltitle(event)")
    },
    showUI:function(show){ 
        h4 = util.getEleById(this.name)
        ul = util.getEleById(this.root)
        if (!this.tickTime || show) { 
            ul.style.height =  String(h4.offsetTop - ul.offsetTop)  + "px" 
            this.tickTime = true 
            ul.focus()
        }else{ 
            ul.style.height = "0px" 
            this.tickTime = false 
        }
    }, 
    setli:function(id, name){
        ele = util.getEleById(this.root)
        util.addElement(ele, this.addLi(id, name))  //添加根li 
        util.addMouseOver(id,"wkDrag.ondrag(event)")
    }, 
    setliLink:function(id, name){
        ele = util.getEleById(this.root)
        util.addElement(ele, this.addLi(id, name))  //添加根li
        util.addClass(util.getEleById(id), "list-init-folder")  
        util.addMouseOver(id,"wkDrag.ondrag(event)") 
    }, 
    clearli:function(){
        ele = util.getEleById(this.root)
        ele.innerHTML = ""
    },
    //添加目录信息 
    putName:function(index, name){
        ele = util.getEleById(this.name)
        ele.innerHTML += this.addP(index, name) 
    }
}   