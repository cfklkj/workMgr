package main

import(    
    "io/ioutil" 
    "encoding/json" 
    "fmt" 
    _ "code.google.com/P/odbc"  
)  
 //-------config.jso  ------
type WEB_config struct {  
    HttpPort int `json:"httpPort"`
    DefaultHtml string `json:"DefaultHtml"` 
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
//-------config.jso  ------
  