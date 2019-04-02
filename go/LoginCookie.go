package main

import ( 
	"net/http"
	"io"
	"io/ioutil"
	"strings"
    "encoding/json" 
) 
 
var sessionMgr *SessionMgr = nil //session管理器


type C2SUSERINFO struct{ 
    UserName string 
    Password string 
} 

func initSessionMgr(){
	//创建session管理器,”TestCookieName”是浏览器中cookie的名字，3600是浏览器cookie的有效时间（秒）  
	sessionMgr = NewSessionMgr("workbookMgr", 3600) 
}
//-----session ---------------------------- 
func test_session_valid(w http.ResponseWriter, r *http.Request) string {  
	
    var sessionID = sessionMgr.CheckCookieValid(w, r)  
  
    if sessionID == "" {  
		if login(w, r) == false { 
			gotoHtml(w, r, "login.html");
		}
		return  ""
	}  
	if userInfo, ok := sessionMgr.GetSessionVal(sessionID, "UserInfo"); ok {  
		if value, ok := userInfo.(C2SUSERINFO); ok {  
		   return  value.UserName
		}  
	}  
	return ""
}
func recordLogin(w http.ResponseWriter, r *http.Request, loginUserInfo C2SUSERINFO){
	 //创建客户端对应cookie以及在服务器中进行记录  
	 var sessionID = sessionMgr.StartSession(w, r)   

	 //踢除重复登录的  
	 var onlineSessionIDList = sessionMgr.GetSessionIDList()  

	 for _, onlineSessionID := range onlineSessionIDList {  
		 if userInfo, ok := sessionMgr.GetSessionVal(onlineSessionID, "UserInfo"); ok {  
			 if value, ok := userInfo.(C2SUSERINFO); ok {  
				 if value.UserName == loginUserInfo.UserName {  
					 sessionMgr.EndSessionBy(onlineSessionID)  
				 }  
			 }  
		 }  
	 }  

	 //设置变量值  
	 sessionMgr.SetSessionVal(sessionID, "UserInfo", loginUserInfo)  

}

//处理退出  
func logout(w http.ResponseWriter, r *http.Request) {  
    sessionMgr.EndSession(w, r) //用户退出时删除对应session  
	gotoHtml(w, r, "login.html");
    return  
}

//处理登录  
func login(res http.ResponseWriter, req *http.Request) bool{  
	
    if strings.Contains(req.URL.Path, "&Login") {  
		req.ParseForm()  
		body, _ := ioutil.ReadAll(req.Body)
		print("login info:", string(body));
        var  c2sUserInfo  C2SUSERINFO     
        err := json.Unmarshal(body, &c2sUserInfo)
        if err != nil { 
            io.WriteString(res, "decode json error")
            return true
        }  
			
        //在数据库中得到对应数据   
  
		if checkUser(c2sUserInfo.UserName, c2sUserInfo.Password) == false {
            io.WriteString(res, "user info error")
			return true
		}   
		recordLogin(res, req, c2sUserInfo); 
		io.WriteString(res, "login")
		return true;
	}  
	return false;
}
 