package main

import(    
    "io/ioutil" 
    "encoding/json" 
    "fmt" 
    "os" 
)   
 //-------config.jso  ------
type WEB_config struct {  
    HttpPort int `json:"httpPort"`
    DefaultHtml string `json:"DefaultHtml"` 
    ProInfo ProHistory
} 
var webConfig WEB_config
func LoadConfig (filename string) {
    data, err := ioutil.ReadFile(filename)
    if err != nil{
    return 
    }       
    err = json.Unmarshal(data, &webConfig)
    if err != nil{
		fmt.Println("LoadDBlist config decode failed")
        return
    }  
    data2, _ := json.Marshal(&webConfig) 
    fmt.Println("config load suceess:", string(data2))  
	return 
}

func checkConfigPro(){
    for index, proInfo := range webConfig.ProInfo.ProInfos{ 
        ok, _ := exists(proInfo.ProPath + "\\" + proInfo.ProName)
        if !ok {
            webConfig.ProInfo.ProInfos = append(webConfig.ProInfo.ProInfos[:index], webConfig.ProInfo.ProInfos[index+1:]...)
            
            UpLoadConfig("json/config.json");
            checkConfigPro()
            break;
        }  
    }
}

func UpLoadConfig(fileName string){ 
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
//-------config.jso  ------
  