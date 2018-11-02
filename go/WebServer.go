package main

import (  
    "net/http" 
    "log" 
    "runtime"  
    "time"
    "strconv"
)
var realPath string
// 端口
const (
    HTTP_PORT  string = "80"
    HTTPS_PORT string = "443"
)

// 目录
const (
    CSS_CLIENT_PATH   = "/css/"
    DART_CLIENT_PATH  = "/js/"
    IMAGE_CLIENT_PATH = "/image/"

    CSS_SVR_PATH   = "web"
    DART_SVR_PATH  = "web"
    IMAGE_SVR_PATH = "web"
)

func init() {
    runtime.GOMAXPROCS(runtime.NumCPU())
}

func main() {     
     InitDBMgr();   
     LoadConfig("json/config.json");
     
     //连接redis
    connectRedis(sendBackBrowser)


     // 先把css和脚本服务上去 
     http.Handle(CSS_CLIENT_PATH, http.FileServer(http.Dir(CSS_SVR_PATH)))
     http.Handle(DART_CLIENT_PATH, http.FileServer(http.Dir(DART_SVR_PATH)))
     http.Handle(IMAGE_CLIENT_PATH, http.FileServer(http.Dir(IMAGE_SVR_PATH)))
 
     // 网址与处理逻辑对应起来
     http.HandleFunc("/", HomePage)  

    //绑定socket方法
  //  http.Handle("/webSocket", h_webSocket) 
    err := http.ListenAndServe("127.0.0.1:" + strconv.Itoa(webConfig.HttpPort), nil) //设置监听的端口
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    } 

    for 
    {
        time.Sleep(10*time.Second)
    }
}
 