package main

import(   
    "net/http" 
    "fmt"   
    "io" 
    "os"
    "io/ioutil"
    "strings"  
    "encoding/json"    
    "os/exec"  
    "path/filepath"
    "github.com/axgle/mahonia"
)   

type C2SDirInfo struct{
    HomePath string 
    ChilPath string 
} 
type C2STxtInfo struct{
    HomePath string 
    ChilPath string 
    FileType string
}
type C2SFileInfo struct{
    FilePath string 
    TxtInfo string 
} 
type C2SOpenDir struct{
    DirPath string  
} 
type S2CDirInfo struct{
    HomePath string  `json:"homePath"`  //需要这个才能转json
    Chils []DirInfo `json:"chils"`
}
type DirInfo struct{
    FileType string `json:"fileType"`
    Path    string `json:"path"`
}

func OnExplorer(res http.ResponseWriter, req *http.Request) { 
    req.ParseForm()
    fmt.Println(req.URL.Path)
    if strings.Contains(req.URL.Path, "&getDir1") {
        io.WriteString(res, GetDBInfoOne())
    }else if strings.Contains(req.URL.Path, "&getTxt") {      
        body, _ := ioutil.ReadAll(req.Body)
        var c2sTxtInfo C2STxtInfo            
        err := json.Unmarshal(body, &c2sTxtInfo)
        if err != nil {
            //   c.String(500, "decode json error")
            io.WriteString(res, "decode json error")
            return
        }
        io.WriteString(res, ExecTxt(c2sTxtInfo))
    }else if strings.Contains(req.URL.Path, "&getDir") {      
        body, _ := ioutil.ReadAll(req.Body)
        var c2sDirinfo C2SDirInfo            
        err := json.Unmarshal(body, &c2sDirinfo)
        if err != nil {
            //   c.String(500, "decode json error")
            io.WriteString(res, "decode json error")
            return
        }
        io.WriteString(res, ExecDir(c2sDirinfo))
    }else if strings.Contains(req.URL.Path, "&keepTxt") {      
        body, _ := ioutil.ReadAll(req.Body)
        var c2sFileInfo C2SFileInfo            
        err := json.Unmarshal(body, &c2sFileInfo)
        if err != nil {
            //   c.String(500, "decode json error")
            io.WriteString(res, "decode json error")
            return
        }
        io.WriteString(res, ExecFile(c2sFileInfo))
    }else if strings.Contains(req.URL.Path, "&openDir") {      
        body, _ := ioutil.ReadAll(req.Body)
        var c2sOpenDir C2SOpenDir            
        err := json.Unmarshal(body, &c2sOpenDir)
        if err != nil {
            //   c.String(500, "decode json error")
            io.WriteString(res, "decode json error")
            return
        }
        io.WriteString(res, ExecOpenDir(c2sOpenDir))
    }else if strings.Contains(req.URL.Path, "&editDir") {    
        io.WriteString(res, ExecEditDir())
    }else if strings.Contains(req.URL.Path, "&showLogDir") {    
        io.WriteString(res, ExecOpenDirLog(".\\explorer.json"))
    }else {
        io.WriteString(res, "这是从后台发送的数据")
    } 
}
func getCurrentDirectory() string {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		 return "";
	}
	return strings.Replace(dir, "\\", "/", -1)
}
//打开目录文件
func ExecOpenDirLog(dirPth string) string{ 
    fileInfo, err := ioutil.ReadFile(dirPth)
    if err != nil {
        return  err.Error()
    } 
    return string(fileInfo);
}
//修改目录信息
func ExecEditDir() string{
    filePath := ".\\explorer.json"; 
    cmd := exec.Command("notepad", filePath)  
    err := cmd.Start()
    if err != nil {
        return err.Error()
    }  
    return "修改文件后请刷新网页"; 
}
//读取文本
func ExecTxt(C2STxtInfo C2STxtInfo)string{    
    dirPth := C2STxtInfo.HomePath + "\\" + C2STxtInfo.ChilPath; 
    fileInfo, err := ioutil.ReadFile(dirPth)
    if err != nil {
        return  err.Error()
    } 
    if((fileInfo[0] == 49 && fileInfo[1] == 46 && fileInfo[2] == 230) || //&& fileInfo[3] == 184
     (fileInfo[0] == 108 && fileInfo[1] == 111 && fileInfo[2] == 99 && fileInfo[3] ==97 ) || 
     (fileInfo[0] == 239 && fileInfo[1] == 187 && fileInfo[2] == 191 && fileInfo[3] ==112 ) ){ //未编码文本
        return string(fileInfo); 
    } else {        
        decoder := mahonia.NewDecoder("gb18030")
        return decoder.ConvertString(string(fileInfo));
    } 
} 
//写入文本
func ExecFile(c2sFileInfo C2SFileInfo)string{
    filename := c2sFileInfo.FilePath;
    file, err := os.OpenFile(filename, os.O_WRONLY|os.O_TRUNC|os.O_CREATE, 0666)
    if err != nil {
        return "open file failed.";
    }
    defer file.Close()
    c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&gt;", ">", -1)
    c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&lt;", "<", -1)
    c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&amp;", "=", -1)
    file.WriteString(c2sFileInfo.TxtInfo);
    return "keep file Ok";
}
//打开目录
func ExecOpenDir(c2sOpenDir C2SOpenDir)string{
    dirPath := c2sOpenDir.DirPath;
    dirPath = strings.Replace(dirPath, "\\\\\\", "\\", -1)
    dirPath = strings.Replace(dirPath, "/", "\\", -1)
    cmd := exec.Command("explorer", dirPath) 
    err := cmd.Start()
    if err != nil {
        return err.Error()
    }
    return "open file " + dirPath +" Ok";
}
//遍历目录文件
func ExecDir(c2sDirinfo C2SDirInfo)string{
    dirPth :=  c2sDirinfo.HomePath + "\\" + c2sDirinfo.ChilPath;
    dir, err := ioutil.ReadDir(dirPth)
    if err != nil {
    return  err.Error()
    } 
    var s2cInfo  S2CDirInfo
    s2cInfo.HomePath = dirPth 
    for _, fi := range dir {
        var tDirInfo DirInfo
        if fi.IsDir() { // 忽略目录   
            tDirInfo.FileType = "dir"
        }else{ 
            tDirInfo.FileType = "file"
        }
        tDirInfo.Path = fi.Name()
        s2cInfo.Chils = append(s2cInfo.Chils,  tDirInfo)
    }  
	ret, err := json.Marshal(&s2cInfo)
	if err != nil {
		//c.String(500, "encode json")
		return err.Error()
    } 
    return string(ret); 
}