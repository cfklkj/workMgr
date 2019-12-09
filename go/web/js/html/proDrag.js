
 /*参考-reference
 https://blog.csdn.net/weixin_41910848/article/details/82218243
 https://www.cnblogs.com/lidabo/archive/2012/12/04/2801301.html
 */  
  

var ProDrag = ProDrag || {};
var wkDrag = ProDrag.Method = { 
     isDrag:false,
     isMouseDown:false, 
     diffX:0,
     diffY:0,  
     src:"",
     des:"",  
     typein:1,
     typeout:2,
     typeswap:0,
     ondragstart:function(event){   
          if (this.src != this.des){     
               util.dropClass(this.src, true)   
               this.src = this.des 
               util.addClass(util.getEleById(this.src).parentElement,  "choiceReady") 
               return true
          }
          return false
     },
     ondrag:function(event){ 
          this.des = event.srcElement.id 
          if ( this.src == ""){
               util.dropClass(this.des, true)                 
               return
          }else{    
               if (this.des != this.src){  
                    util.getEleById(this.des).parentElement.className =  "choice"
               } 
          } 
     },
     ondragCancel:function(){
          if ( this.src != ""){
               util.dropClass(this.src, true) 
               this.src = ""
          }
     },
     ondragend:function(event){ 
          if (this.src == "") {
               return
          }
          util.dropClass(this.des, true)
          util.dropClass(this.src, true)  
          des = this.des
          src = this.src
          this.des = ""
          this.src = ""  
          switch(event){
               case this.typein:
                    root = wkQueue.getID()
                    wkPost.linkChange(wkQueue.getPath(), root,  des, src, wkMsg.linkSwap)
                    break
               case this.typeout:
                    root = wkQueue.getID()
                    des = wkQueue.getIDpre()  
                    wkPost.linkChange(wkQueue.getPath(), root, des,  src, wkMsg.linkSwap)
                    break;
               case this.typeswap:
                    wkPost.linkSwap(wkQueue.getPath(), wkQueue.getID(),  src, des, wkMsg.linkSwap)
                    break
          } 
          return true 
     },
     ondragover:function(event){
          console.log("ondragover", event)
     },
     ondragleave:function(event){
          console.log("ondragleave", event)
     },
     ondrop:function(event){
          console.log("ondrop", event)
     },
}
   