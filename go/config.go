package main

import(    
    "io/ioutil" 
    "encoding/json" 
    "fmt" 
    "os"   
)   

 //-------config.jso  ------
type WEB_config struct {  
    Ip string `json:"IP"`
    HttpPort int `json:"httpPort"`
    DefaultHtml string `json:"DefaultHtml"`  
} 
var webConfig WEB_config;
var ini_pathDoc, ini_pathJson string; 

func initWorkBook(){
    mem_alloc();
    initPath();
    LoadWebConfig(ini_pathJson + "/config.json"); 
    loadUserInfos();
    initSessionMgr();
}

func initPath(){ 
    ini_pathJson =  getThisPath() + "/Json"
    ok, _ := exists(ini_pathJson)
    if !ok { 
        os.Mkdir(ini_pathJson, os.ModePerm) 
    }     
    ini_pathDoc =  getThisPath() + "/Document"
    ok, _ = exists(ini_pathDoc)
    if !ok { 
        os.Mkdir(ini_pathDoc, os.ModePerm) 
    }     
}

func appendDocment(chilePath string)string{
    newPath := ini_pathDoc + "/" + chilePath; 
    ok, _ := exists(newPath)
    if !ok { 
        os.Mkdir(newPath, os.ModePerm) 
    }    
    return newPath
}

func initWebConfig(){ 
    fmt.Println("check jsonPath:") 
    webConfig.Ip=""
    webConfig.HttpPort = 80
    webConfig.DefaultHtml = "workbook.html"  
    UpLoadWebConfig(ini_pathJson + "/config.json");
}

//加载配置
func LoadWebConfig (filename string) {
    fmt.Println("load config");
    webConfig.HttpPort=0        
    webConfig.DefaultHtml=""
    data, err := ioutil.ReadFile(filename)
    if err != nil{
        initWebConfig()
        return 
    }       
    err = json.Unmarshal(data, &webConfig)
    if err != nil{
		fmt.Println("LoadJson config decode failed")
        return
    }  
    data2, _ := json.Marshal(&webConfig) 
    fmt.Println("config load suceess:", string(data2))  
	return 
}
//更新信息
func UpLoadWebConfig(fileName string){ 
    data, err := json.Marshal(&webConfig) 
    if(err != nil){
        fmt.Println("UpLoadConfig marsha error")
        return
    }
    ioutil.WriteFile(fileName, data, os.ModeAppend)
}
func printfConfig(){
    data, _ := json.Marshal(&webConfig) 
    fmt.Println("config Upload suceess:", string(data))  
}
//-------config.json  ------
  