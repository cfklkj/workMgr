package main

import (  
    "net/http" 
    "log" 
    "runtime"  
    "time"
    "strconv"
    "fmt"
    "os"
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
    webserver()
    lenth :=  len(os.Args)
    for i := 1; i < lenth; i++ { 
        if(os.Args[i] == "webServer"){
            webserver()
            return
        }
        if(os.Args[i] == "sendEmail"){
            if(i+1 == lenth) {
                fmt.Printf("sendEmail address pass toAddress sub body attach")
            }else{ 
                sendEmail("smtp.163.com", 465, os.Args[i + 1],os.Args[i + 2],os.Args[i + 3],os.Args[i + 4],os.Args[i + 5],os.Args[i + 6])
            }
            return
        }
    }     
    
    fmt.Printf("webServer-web服务器\nsendEmail-发送邮件")
}
 
func webserver(){ 
    LoadConfig("json/config.json");
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