var Detail =  Detail || {}; 
var wkDetail = Detail.commonMethod  = { 
    //function-------
    name:"fileName",
    data:"fileDetail",
    //ul
    addH4: function(id){
        ul = "<h4 id=" + id  +"></ul>"
        return ul
    },
    //textarea
    addTextarea: function(id)
    {
        textarea = "<textarea id=" + id  +"></textarea>"
        return textarea
    }, 
    //init
    initDetail: function(id){ 
        ele = util.getEleById(id)
        util.addClass(ele, "detail-init")
        util.addElement(ele, this.addH4(this.name))  //添加表头
        util.addElement(ele, this.addTextarea(this.data))  //添加内容
        util.addEvent(this.name,"wkClick.clickTitle(event)")
        util.addMouseOver(this.data,"wkDrag.ondragCancel(event)") 
    },
    //set
    setH4Name:function(name){
        ele = util.getEleById(this.name)
        ele.innerHTML = name        
    },
    setTextareaData:function(data) {
        ele = util.getEleById(this.data)
        ele.innerHTML = data
    },
    getTextareaData:function() {
        ele = util.getEleById(this.data) 
        return ele.innerHTML
    },
    isEdit:function(){
        ele = util.getEleById(this.data)
       if (ele == document.activeElement){
           return true
       }
       return false
    },
    blurEdit:function(){
        ul = util.getEleById(this.data)
        ul.blur()
    },
    keepStatu:function(keep){
        if (keep) {
            util.addClass(util.getEleById(this.name),  "keepFile") 
        }else{
            util.delClass(util.getEleById(this.name),  "keepFile") 
        }
    }
}   

