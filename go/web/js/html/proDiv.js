var ProDiv = ProDiv || {};
var wkDiv = ProDiv.Method = { 
  //pro 
  div_Menu: 'menu',
  div_List:'list',
  div_Detail: 'detail', 
  div_Snapshot: 'snapshot',
  //function
  addDiv: function(id){   
    return "<div id="+id +"></div>" 
  },
  //footer
  addFooter:function(user, email, version){
    return "<footer><p>posted by:" + user + "</P>" +
      '<p>Contact information:<a href="mailto:' + email + '">' + email +'</a><p>' +
      '<p>version:' + version + "</p></footer>"
  },
  //初始化div
  initDiv: function(){    
    //menu 
    eleBody = util.getEleById("body")
    util.addElement(eleBody, this.addDiv(this.div_Menu))
    util.addElement(eleBody, this.addDiv(this.div_Detail)) 
    util.addElement(eleBody, this.addDiv(this.div_List))
    util.addElement(eleBody, this.addFooter("宇文仲竹", "920667721@qq.com", "v2019.11.14"))
  }, 
  //初始化
  initProDiv: function(){
    wkDiv.initDiv()
    wkMenu.initBtn(this.div_Menu)
    wkList.initUl(this.div_List)
    wkDetail.initDetail(this.div_Detail)
  }
}
 
   