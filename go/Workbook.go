package main

import(   
    "net/http" 
    "fmt" 
    "path"
    "path/filepath"
    "strings"  
    "os"
    "io"
    "io/ioutil"
    "os/exec"  
    "bytes"
    "encoding/json"    
)   

type C2SGETTXT struct{
    ParentId int 
    FileId int 
    Unrecognizable bool
} 
type C2SKEEPTXT struct{
    ParentId int 
    FileId int  
    TxtInfo string 
} 
type C2SGETJSON struct{
    JsonType string  
} 
type C2SUPJSON struct{
    JsonType string 
    TxtInfo string 
} 
type C2SPROINFO struct{
    ProType string 
    ProName string 
} 

type C2SPACKAGE struct{
    Package string 
    Source string 
} 
var g_dirPath = "d:\\workbook\\"
var g_ProName = "working"
var g_workbookPath = ""
func OnWorkbook(res http.ResponseWriter, req *http.Request) { 
    req.ParseForm()
    fmt.Println(req.URL.Path) 
    if strings.Contains(req.URL.Path, "&ProInfo") { 
        body, _ := ioutil.ReadAll(req.Body)
        var  c2sProInfo  C2SPROINFO     
        err := json.Unmarshal(body, &c2sProInfo)
        if err != nil {
            //   c.String(500, "decode json error")
            io.WriteString(res, "decode json error")
            return
        }   
        if(c2sProInfo.ProType == "new"){
             
            for{
                setWorkbookPath(c2sProInfo.ProName)
                err := os.Mkdir(g_workbookPath, os.ModePerm)
                if err != nil {
                    fmt.Println(err)
                }else{ 
                   break;   
                }              
                c2sProInfo.ProName += "1"
             }
            io.WriteString(res, g_ProName)
            return
        }else if(c2sProInfo.ProType == "open"){ 
            io.WriteString(res, OpenWorkBook())
            return
        }else{ 
            //重命名文件夹
            originalPath := g_workbookPath
            newPath := g_dirPath + c2sProInfo.ProName
            err := os.Rename(originalPath, newPath) 
            if err != nil {
                io.WriteString(res, "重命名失败--可能存在同命项目")
                return
            } 
            setWorkbookPath(c2sProInfo.ProName)
            io.WriteString(res, "ok")
        }
    }else if strings.Contains(req.URL.Path, "&upJson") { 
        body, _ := ioutil.ReadAll(req.Body)
        var  c2sJsonInfo  C2SUPJSON     
        err := json.Unmarshal(body, &c2sJsonInfo)
        if err != nil {
            //   c.String(500, "decode json error")
            io.WriteString(res, "decode json error")
            return
        }
        WriteWorkBookJson(c2sJsonInfo)
        io.WriteString(res, "act success")
    }else if strings.Contains(req.URL.Path, "&getJson") {      
        body, _ := ioutil.ReadAll(req.Body)
        var  c2sJsonInfo  C2SGETJSON     
        err := json.Unmarshal(body, &c2sJsonInfo)
        if err != nil {
            //   c.String(500, "decode json error")
            io.WriteString(res, "decode json error")
            return
        }
        if(c2sJsonInfo.JsonType == "Project"){
            if(g_workbookPath == ""){
                if(webConfig.WorkBook.ProDir != ""){
                    g_dirPath = webConfig.WorkBook.ProDir
                }
                setWorkbookPath(webConfig.WorkBook.ProName)
                err := os.Mkdir(g_dirPath, os.ModePerm)
                if err != nil {
                    fmt.Println(err)
                }             
            }
            io.WriteString(res, g_ProName)
        }else{ 
            io.WriteString(res, GetWorkbookJson(c2sJsonInfo))
        }
    }else if strings.Contains(req.URL.Path, "&getTxt") {      
        body, _ := ioutil.ReadAll(req.Body)
        var  c2sTxtInfo  C2SGETTXT     
        err := json.Unmarshal(body, &c2sTxtInfo)
        if err != nil {
            //   c.String(500, "decode json error")
            io.WriteString(res, "decode json error")
            return
        }
        io.WriteString(res, GetWorkbookTxt(c2sTxtInfo))
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
        var c2sFileInfo C2SKEEPTXT            
        err := json.Unmarshal(body, &c2sFileInfo)
        if err != nil {
            //   c.String(500, "decode json error")
            io.WriteString(res, "decode json error")
            return
        } 
        io.WriteString(res, KeepWorkbookTxt(c2sFileInfo))
    }else if strings.Contains(req.URL.Path, "&deleteFile") {      
        body, _ := ioutil.ReadAll(req.Body)
        var  c2sTxtInfo  C2SGETTXT     
        err := json.Unmarshal(body, &c2sTxtInfo)
        if err != nil {
            //   c.String(500, "decode json error")
            io.WriteString(res, "decode json error")
            return
        }
        io.WriteString(res, DeleteWorkbookTxt(c2sTxtInfo))
    }else if strings.Contains(req.URL.Path, "&pakage") {   
        body, _ := ioutil.ReadAll(req.Body)
        var  c2sPackInfo  C2SPACKAGE     
        err := json.Unmarshal(body, &c2sPackInfo)
        if err != nil {
            //   c.String(500, "decode json error")
            io.WriteString(res, "decode json error")
            return
        }
        if(c2sPackInfo.Package == "import"){
            io.WriteString(res, ImportWorkBook())  
        }else{
            ExportWorkBook()
        }   

    }else if strings.Contains(req.URL.Path, "&showLogDir") {    
        io.WriteString(res, ExecOpenDirLog(".\\json\\explorer.json"))
    }else {
        io.WriteString(res, "这是从后台发送的数据")
    } 
}
func setWorkbookDir(ProDir string){
    pDir,_ := filepath.Split(ProDir) 
    webConfig.WorkBook.ProDir = pDir
    g_dirPath = webConfig.WorkBook.ProDir
}
func setWorkbookPath(ProName string){    
    g_ProName = ProName
    webConfig.WorkBook.ProName = g_ProName
    g_workbookPath =  g_dirPath + ProName + "\\"
    UpLoadConfig("json/config.json");
}
//读取文本
func GetWorkbookTxt(C2STxtInfo C2SGETTXT)string{    
    dirPth := g_workbookPath + fmt.Sprint(C2STxtInfo.ParentId) + "_" + fmt.Sprint(C2STxtInfo.FileId);    
    return OpenTxt(dirPth, C2STxtInfo.Unrecognizable)
} 
//删除文本
func DeleteWorkbookTxt(C2STxtInfo C2SGETTXT)string{    
    dirPth := g_workbookPath + fmt.Sprint(C2STxtInfo.ParentId) + "_" + fmt.Sprint(C2STxtInfo.FileId);  
    err := os.Remove(dirPth) 
    if err != nil { 
        return "file remove Error!"
    } else { 
        return "file remove OK!"
    }
} 
//写入文本
func KeepWorkbookTxt(c2sFileInfo C2SKEEPTXT)string{
    dirPth := g_workbookPath + fmt.Sprint(c2sFileInfo.ParentId) + "_" + fmt.Sprint(c2sFileInfo.FileId);   
    file, err := os.OpenFile(dirPth, os.O_WRONLY|os.O_TRUNC|os.O_CREATE, 0666)
    if err != nil {
        return "open file " + dirPth + " failed.";
    }
    defer file.Close()
  //  c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&gt;", ">", -1)
  //  c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&lt;", "<", -1)
  //  c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&amp;", "=", -1)
    file.WriteString(c2sFileInfo.TxtInfo);
    return "keep file " + dirPth + " Ok";
}
//更新json文件列表
func WriteWorkBookJson(c2sJsonInfo  C2SUPJSON){ 
    dirPath := g_workbookPath
    if(c2sJsonInfo.JsonType == "Dir"){
        dirPath += "dirNames.json"
    }else if(c2sJsonInfo.JsonType == "fileName"){
        dirPath += "fileNames.json"
    }else {
        dirPath += "nearFiles.json"
    } 
    file, err := os.OpenFile(dirPath, os.O_WRONLY|os.O_TRUNC|os.O_CREATE, 0666)
    if err != nil {
        return
    }
    defer file.Close()
    file.WriteString(c2sJsonInfo.TxtInfo); 
}
//读取JSON文本
func GetWorkbookJson(c2sJsonInfo C2SGETJSON)string{   
    dirPath := g_workbookPath
    os.Mkdir(dirPath, os.ModePerm)
    if(c2sJsonInfo.JsonType == "Dir"){
        dirPath += "dirNames.json"
    }else if(c2sJsonInfo.JsonType == "fileName"){
        dirPath += "fileNames.json"
    }else {
        dirPath += "nearFiles.json"
    } 
    return OpenTxt(dirPath, true)
} 

//导入 导出
func getPathName(fullFilename string)string{  
    var filenameWithSuffix string 
    filenameWithSuffix = path.Base(fullFilename) 
    var fileSuffix string
    fileSuffix = path.Ext(filenameWithSuffix)   
    g_ProName = strings.TrimSuffix(filenameWithSuffix, fileSuffix)  
    return g_ProName
}

func exists(path string) (bool, error) {
    _, err := os.Stat(path)
    if err != nil { return false, err }
    if os.IsNotExist(err) { return false, nil }
    return true, err
}
func ImportWorkBook()string{ 
 
    proPath := OpenKeepDialog()
    if(proPath != ""){ 
        cmd := exec.Command("cmd", "/c", "workbook\\WorkbookExport.bat 3 "+ g_workbookPath + " " + proPath)   
        var out bytes.Buffer
        cmd.Stdout = &out
        err := cmd.Start()
        cmd.Wait()
        if err != nil {
            return err.Error()
        }  
        return "已执行--"
    }
    return "error--" 
}

func ExportWorkBook(){
    cmd := exec.Command("cmd", "/c", "workbook\\WorkbookExport.bat 1 "+ g_workbookPath + "\\ " + g_ProName)  
    var out bytes.Buffer
	cmd.Stdout = &out
    err := cmd.Start()
    if err != nil {
        fmt.Println(err.Error())
    }  
    fmt.Println("已执行--" + out.String())
}


func OpenKeepDialog()string{ 

    cmd := exec.Command("cmd", "/c", "workbook\\WorkbookExport.bat 2 ")   
    var out bytes.Buffer
	cmd.Stdout = &out
    err := cmd.Start()
    cmd.Wait()
    if err != nil {
        return ""
    }  
    outStr := strings.Split(out.String(), "\r\n");
    if(outStr[2] != ""){  
        proPath := outStr[2]
        ok, _ := exists(proPath)
        if !ok {
            return ""
        }    
        _, fileName := filepath.Split(proPath)  
        setWorkbookPath(getPathName(fileName)) 
        return proPath
    }
    return ""
}
func OpenWorkBook()string{ 

    cmd := exec.Command("cmd", "/c", "workbook\\WorkbookExport.bat 4")   
    var out bytes.Buffer
	cmd.Stdout = &out
    err := cmd.Start()
    cmd.Wait()
    if err != nil {
        return ""
    }  
    outStr := strings.Split(out.String(), "\r\n");
    if(outStr[2] != ""){  
        proPath := outStr[2] 
        ok, _ := exists(proPath + "\\dirNames.json")
        if !ok {
            return ""
        }    
        _, fileName := filepath.Split(proPath) 
        setWorkbookDir(proPath)
        setWorkbookPath(getPathName(fileName)) 
        return proPath
    }
    return ""
}

