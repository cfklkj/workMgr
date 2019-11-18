var queue = queue || {};
var wkQueue = queue.Method = {
    data:[],
    root:"",  //根目录
    file:"",  //文件
    rename:"",  //重命名
    tips:[],//提示路径
    getTips:function(){
        str = ""
        for(index in this.tips){
            if (str != "")
            {
                str  += "/"
            }
            str += this.tips[index] 
        }
        return str
    },
    topTips:function(){
        return this.tips[this.tips.length-1]  
    },
    pushTips:function(name){
        this.tips.push(name)
    },
    popTips:function(){
        this.tips.pop() 
    },
    setRename:function(id) {
        this.rename = id
    },
    getRename:function(){
        return this.rename
    },
    setFile:function(id){
        this.file=id
    },
    getFile:function(){
        return this.file
    },
    setPath:function(path){
        this.root = path
    },
    getPath:function(){
        return this.root
    },
    push:function(id){
        this.data.push(id)
    },
    pop:function(){ 
        this.data.pop() 
    },
    getID:function(){ 
        return this.data[this.data.length-1]  
    }
} 