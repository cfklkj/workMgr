var flyUtil =  flyUtil || {}; 

var util = flyUtil.commonMethod  = {
    //ele
    getEleByTag: function(tag)
    {
        return document.getElementsByTagName(tag)
    },
    //ele
    getEleById: function(id)
    {
        return document.getElementById(id)
    },
    //value
    getEleName:function(id)
    {
        ele = this.getEleById(id)
        return ele.innerHTML
    },
    //set value
    setEleName :function(id, name)
    {
        ele = this.getEleById(id)
        ele.innerHTML = name
    },
    //添加css
    addClass: function(ele, classname)
    {   
        var oldClass = ele.className;
        var pattern = new RegExp('(^|\\s)' + classname + '(\\s|$)');      
        if (!pattern.test(oldClass))
        {         
                ele.className += ' ' + classname;   
        } 
    },    
    //删除css
    delClass: function(ele, classname){ 
      var oldClass = ele.className;
      var pattern = new RegExp('(^|\\s)' + classname + '(\\s|$)');      
      if (!pattern.test(oldClass)) {         
            ele.className = ele.className.replace(pattern, ' ');
        }else {
            if (ele.className != null) { 
                ele.className  = null
            }
        } 
    },
    dropClass:function(id, parent){ 
        ele =  util.getEleById(id)
        if (ele == null) {
            return
        }
        if (parent)
        { 
            if (ele.parentElement.className == null){
                return
            } 
             ele.parentElement.className = null
             return
        }
        if (ele.className == null)
        {
            return
        }
        ele.className = null
    },
    //添加元素
    addElement: function(ele, html){ 
     ele.innerHTML += html 
   },
   //添加方法
    addEvent: function(id, callBack){ 
        ele = util.getEleById(id)
        ele.setAttribute("onclick",callBack);  
      },
      addMouseOut:function(id, callBack){
          ele = util.getEleById(id)
          ele.setAttribute("onmouseout",callBack);   
      },
    addMouseOver:function(id, callBack){
        ele = util.getEleById(id)
        ele.setAttribute("onmouseover",callBack);   
    },
    addMouseDown:function(id, callBack){
        ele = util.getEleById(id)
        ele.setAttribute("onmousedown",callBack);   
    }

}   