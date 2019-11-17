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
        li = "<li><a  id=" + id  +">" + value + "</a></li>" 
        return li
    },  
    //H4
    addH4: function(id)
    {
        li = "<h4 id=" + id  +"></h4>"
        return li
    }, 
    //init
    initUl: function(id){ 
        ele = util.getEleById(id)
        util.addClass(ele, "list-init")
        util.addElement(ele, this.addH4(this.name))  //添加h4
        util.addElement(ele, this.addUl(this.root))  //添加根ul
        util.addEvent(this.name,"wkClick.clickTitle(event)")
        util.addMouseOut(this.root,"wkList.setUlHeigth(event)" )
    }, 
    //set
    setUlName:function(name) {
        ele = util.getEleById(this.name)
        ele.innerHTML = name
    },
    forkUl:function(event){
        h4 = util.getEleById(this.name)
        ul = util.getEleById(this.root)
        if (!this.tickTime) { 
            ul.style.height =  String(h4.offsetTop - ul.offsetTop)  + "px" 
            this.tickTime = true 
        }else{ 
            ul.style.height = "0px" 
            this.tickTime = false 
        }
    },
    setUlHeigth:function(event){  
        if (this.tickTime) { 
            this.tickTime = false 
        }
        console.log(event); 
        var wy = event.clientY; 
        ul = util.getEleById(this.root)
        h4 = util.getEleById(this.name)
        if (wy < ul.offsetTop || wy > h4.offsetBottom) {
            ul.style.height = "0px" 
        }
    },
    setli:function(id, name){
        ele = util.getEleById(this.root)
        util.addElement(ele, this.addLi(id, name))  //添加根li
    }, 
    setliLink:function(id, name){
        ele = util.getEleById(this.root)
        util.addElement(ele, this.addLi(id, name))  //添加根li
        util.addClass(util.getEleById(id), "list-init-folder")
    }, 
    clearli:function(){
        ele = util.getEleById(this.root)
        ele.innerHTML = ""
    }
}   