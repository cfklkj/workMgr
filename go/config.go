package main

import(    
    "io/ioutil" 
    "encoding/json" 
    "fmt" 
    "os"  
    "path/filepath"
)   

 //-------config.jso  ------
type WEB_config struct {  
    Ip string `json:"IP"`
    HttpPort int `json:"httpPort"`
    DefaultHtml string `json:"DefaultHtml"` 
    ProInfo ProHistory
} 
var webConfig WEB_config
var g_proPath string
func LoadConfig (filename string) {
    webConfig.HttpPort=0        
    webConfig.DefaultHtml=""
    data, err := ioutil.ReadFile(filename)
    if err != nil{
        checkWebConfig()
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
//check---------------
func checkConfig(){
    checkProPath() 
    checkConfigPro()
}
func checkWebConfig(){ 
    fmt.Println("check jsonPath:")
    if(webConfig.HttpPort == 0){
        dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
        if err != nil {
            fmt.Println("path eroo:"+dir)
            return 
        }
        dir +=  "/json" 
        os.Mkdir(dir, os.ModePerm)  
        fmt.Println("mkdir json:"+dir)
        webConfig.Ip=""
        webConfig.HttpPort = 80
        webConfig.DefaultHtml = "workbook.html"
        checkConfig()
    }
}
func checkConfigPro(){
    for index, proInfo := range webConfig.ProInfo.ProInfos{ 
        ok, _ := exists(proInfo.ProPath + "/" + proInfo.ProName)
        if !ok {
            //删除
            webConfig.ProInfo.ProInfos = append(webConfig.ProInfo.ProInfos[:index], webConfig.ProInfo.ProInfos[index+1:]...)
            
            UpLoadConfig("json/config.json");
            checkConfigPro()
            break;
        }  
    }
} 

func checkProPath(){
    fmt.Println("check documentPath:")
    dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
    if err != nil {
        fmt.Println("path eroo:"+dir)
        return 
    }
    dir +=  "/Document" 
    os.Mkdir(dir, os.ModePerm) 
    g_proPath = dir
    list, err := getDirList(dir)
	if err != nil {
		fmt.Println(err)
		return
	}
	for _, foldName := range list {
        fmt.Println(foldName)
        isFind := false
        for _, proInfo := range webConfig.ProInfo.ProInfos{ 
            if(proInfo.ProName == foldName){
                isFind = true;
                break;
            }
        }
        if(!isFind){
            setWorkbookPath(g_proPath, foldName) 
        }
	}
    fmt.Println("document path:"+dir)

}

func getDirList(dirpath string) ([]string, error) {
	var dir_list []string
	dir_err := filepath.Walk(dirpath,
		func(path string, f os.FileInfo, err error) error {
			if f == nil {
				return err
			}
			if f.IsDir() && (path != dirpath) {
				dir_list = append(dir_list, f.Name())
				return nil
			}

			return nil
		})
	return dir_list, dir_err
} 
//check end
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
  