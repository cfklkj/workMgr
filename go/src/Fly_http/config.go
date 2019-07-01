package Fly_http

import (
	"../Fly_file"
	// "code.google.com/P/odbc"
)

//-------config.jso  ------
type WEB_config struct {
	HttpPort    int    `json:"httpPort"`
	DefaultHtml string `json:"DefaultHtml"`
}

var webConfig WEB_config

func getWebConfig() WEB_config {
	return webConfig
}

//-------config.jso  ------
var pathVec = []string{"config.json"}

func ReadFiles() {
	readConfig()
}

func readConfig() {
	var configPath = pathVec[0]
	err := Fly_file.ReadJsonFile(configPath, &webConfig)
	if err != nil {
		webConfig.HttpPort = 80
		webConfig.DefaultHtml = "workbook.html"
		Fly_file.WriteJsonFile(configPath, &webConfig)
	}
}

// func LoadConfig (filename string) {
//     data, err := ioutil.ReadFile(filename)
//     if err != nil{
//     return
//     }
//     err = json.Unmarshal(data, &webConfig)
//     if err != nil{
// 		fmt.Println("LoadDBlist config decode failed")
//         return
//     }
//     data2, _ := json.Marshal(&webConfig)
//     fmt.Println("config load suceess:", string(data2))
// 	return
// }

// func UpLoadConfig(fileName string){
//     data, err := json.Marshal(&webConfig)
//     if(err != nil){
//         fmt.Println("UpLoadConfig marsha error")
//         return
//     }
//     ioutil.WriteFile(fileName, data, os.ModeAppend)
//     fmt.Println("config Upload suceess:", string(data))
// }
