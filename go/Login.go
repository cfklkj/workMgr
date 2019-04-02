package main

import(     
    "strings"
    "io/ioutil"   
)   

var login_userPath string;
var login_userInfos string;


//校验
func checkUser(userName string, pwd string) bool{
	if(userName == "" || pwd == ""){
		return false;
	}
	checkString := "|" + userName + " " + pwd;
	return strings.Contains(login_userInfos, checkString); 
}

func initLoginUserPath(){
	login_userPath = getThisPath() + "/json/userInfos.json";
	 
}

//加载用户信息
func loadUserInfos(){
	if(login_userPath == ""){
		initLoginUserPath();
    }
    _, err := ioutil.ReadFile(login_userPath)  
    if err != nil {
        addUserInfos("fly", "123");
    }
    login_userInfos = OpenTxt(login_userPath, false);
	print("load userInfos:", login_userInfos);
}

//添加用户
func addUserInfos(userName, pwd string) bool{
	if(userName == "" || pwd == ""){
		return false;
	}
	login_userInfos += "|" + userName + " " + MD5(pwd);
	writeFile(login_userPath, login_userInfos);
	return true;
}
  