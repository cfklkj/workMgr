package main

import(    
    "io/ioutil" 
    "encoding/json" 
    "fmt" 
    "os"
    _ "code.google.com/P/odbc"  
)  
type WORKBOOK struct{
    ProDir string
    ProName string
}
 //-------config.jso  ------
type WEB_config struct {  
    HttpPort int `json:"httpPort"`
    DefaultHtml string `json:"DefaultHtml"` 
    WorkBook WORKBOOK
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

func UpLoadConfig(fileName string){ 
    data, err := json.Marshal(&webConfig) 
    if(err != nil){
        fmt.Println("UpLoadConfig marsha error")
        return
    }
    ioutil.WriteFile(fileName, data, os.ModeAppend)
    fmt.Println("config Upload suceess:", string(data))  
}
//-------config.jso  ------
  