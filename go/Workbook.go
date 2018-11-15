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
    "github.com/axgle/mahonia"
)   

type ProjectInfo struct{
    ProName string
    ProPath string
}

type C2SGETTXT struct{
    ProInfo ProjectInfo
    ParentId int 
    FileId int 
    Unrecognizable bool
} 
type C2SKEEPTXT struct{
    ProInfo ProjectInfo
    ParentId int 
    FileId int  
    TxtInfo string 
} 
type C2SGETJSON struct{
    ProInfo ProjectInfo
    JsonType string  
} 
type C2SUPJSON struct{
    ProInfo ProjectInfo
    JsonType string 
    TxtInfo string 
} 
type C2SPROINFO struct{
    ProInfo ProjectInfo
    ProType string 
    ProName string 
} 

type C2SPACKAGE struct{
    ProInfo ProjectInfo
    Package string 
    Source string 
}   

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
                setWorkbookPath(c2sProInfo.ProInfo.ProName, c2sProInfo.ProName)
                originalPath :=  c2sProInfo.ProInfo.ProPath + "\\" + c2sProInfo.ProName
                err := os.Mkdir(originalPath, os.ModePerm)
                if err != nil {
                    fmt.Println(err)
                }else{ 
                   break;   
                }              
                c2sProInfo.ProName += "1"
             }
             var proInfo ProjectInfo
             proInfo.ProPath = webConfig.WorkBook.ProDir
             proInfo.ProName = webConfig.WorkBook.ProName
             data, _ := json.Marshal(&proInfo) 
             io.WriteString(res, string(data))
            return
        }else if(c2sProInfo.ProType == "open"){ 
            io.WriteString(res, OpenWorkBook())
            return
        }else if(c2sProInfo.ProType == "rename"){ 
            //重命名文件夹
            originalPath :=  c2sProInfo.ProInfo.ProPath + "\\" + c2sProInfo.ProInfo.ProName  + "\\" 
            newPath := c2sProInfo.ProInfo.ProPath + "\\"  + c2sProInfo.ProName
            err := os.Rename(originalPath, newPath) 
            if err != nil {
                io.WriteString(res, "重命名失败--可能存在同命项目")
                return
            } 
            setWorkbookPath(c2sProInfo.ProInfo.ProPath, c2sProInfo.ProName)
            io.WriteString(res, "ok")
        }else{ 
            io.WriteString(res, "error command")
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
            io.WriteString(res, "decode json error -- "+ string(body))
            return
        }
        if(c2sJsonInfo.JsonType == "Project"){ 
            if(webConfig.WorkBook.ProDir == ""){ 
                setWorkbookPath("d:\\workBook", "NewFolder")
                err := os.Mkdir(webConfig.WorkBook.ProDir + "\\" + webConfig.WorkBook.ProName, os.ModePerm)
                if err != nil {
                    fmt.Println(err)
                }    
            }  
            var proInfo ProjectInfo
            proInfo.ProPath = webConfig.WorkBook.ProDir
            proInfo.ProName = webConfig.WorkBook.ProName
            data, _ := json.Marshal(&proInfo) 
            io.WriteString(res, string(data))
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
        originalPath :=  c2sPackInfo.ProInfo.ProPath + "\\" + c2sPackInfo.ProInfo.ProName  + "\\" 
        if(c2sPackInfo.Package == "import"){
            io.WriteString(res, ImportWorkBook(originalPath))  
        }else{
            ExportWorkBook(originalPath)
        }    
    }else if strings.Contains(req.URL.Path, "&cmdAct") {   
        body, _ := ioutil.ReadAll(req.Body)
        var  c2sJsonInfo  C2SUPJSON     
        err := json.Unmarshal(body, &c2sJsonInfo)
        if err != nil {
            //   c.String(500, "decode json error")
            io.WriteString(res, "decode json error")
            return
        }
        cmdAct(c2sJsonInfo.TxtInfo)
        io.WriteString(res, "已执行-"+c2sJsonInfo.TxtInfo)
    }else {
        io.WriteString(res, "这是从后台发送的数据")
    } 
}
func getDir(filePath string)string{
    pDir,_ := filepath.Split(filePath) 
    return pDir 
}
func setWorkbookPath(ProDir string, ProName string){    
    webConfig.WorkBook.ProName = ProName
    webConfig.WorkBook.ProDir = ProDir 
    UpLoadConfig("json/config.json");
}

//读取文件
func OpenTxt(filePath string, isUnrecognizable bool)string{
    fileInfo, err := ioutil.ReadFile(filePath) 
    if err != nil {
        return  err.Error()
    }  
    if(isUnrecognizable){
        return string(fileInfo); 
    } else {        
        decoder := mahonia.NewDecoder("gb18030")
        return decoder.ConvertString(string(fileInfo));
    } 
}

//读取文本
func GetWorkbookTxt(c2sTxtInfo C2SGETTXT)string{    
    dirPth := c2sTxtInfo.ProInfo.ProPath + "\\" + c2sTxtInfo.ProInfo.ProName  + "\\" 
    dirPth += fmt.Sprint(c2sTxtInfo.ParentId) + "_" + fmt.Sprint(c2sTxtInfo.FileId);    
    return OpenTxt(dirPth, c2sTxtInfo.Unrecognizable)
} 
//删除文本
func DeleteWorkbookTxt(c2sTxtInfo C2SGETTXT)string{    
    dirPth := c2sTxtInfo.ProInfo.ProPath + "\\" + c2sTxtInfo.ProInfo.ProName  + "\\" 
    dirPth += fmt.Sprint(c2sTxtInfo.ParentId) + "_" + fmt.Sprint(c2sTxtInfo.FileId);  
    err := os.Remove(dirPth) 
    if err != nil { 
        return "file remove Error!"
    } else { 
        return "file remove OK!"
    }
} 
//写入文本
func KeepWorkbookTxt(c2sFileInfo C2SKEEPTXT)string{
    dirPth := c2sFileInfo.ProInfo.ProPath + "\\" + c2sFileInfo.ProInfo.ProName  + "\\" 
    dirPth += fmt.Sprint(c2sFileInfo.ParentId) + "_" + fmt.Sprint(c2sFileInfo.FileId);   
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
    dirPath := c2sJsonInfo.ProInfo.ProPath + "\\" + c2sJsonInfo.ProInfo.ProName  + "\\" 
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
    dirPath := c2sJsonInfo.ProInfo.ProPath + "\\" + c2sJsonInfo.ProInfo.ProName  + "\\" 
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
    return strings.TrimSuffix(filenameWithSuffix, fileSuffix)  
}

func exists(path string) (bool, error) {
    _, err := os.Stat(path)
    if err != nil { return false, err }
    if os.IsNotExist(err) { return false, nil }
    return true, err
}
func ImportWorkBook(workbookPath string)string{ 
 
    proPath := OpenKeepDialog()
    if(proPath != ""){ 
        cmd := exec.Command("cmd", "/c", "workbook\\WorkbookExport.bat 3 "+ workbookPath + " " + proPath)   
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

func ExportWorkBook(workbookPath string){
    cmd := exec.Command("cmd", "/c", "workbook\\WorkbookExport.bat 1 "+ workbookPath)  
    var out bytes.Buffer
	cmd.Stdout = &out
    err := cmd.Start()
    if err != nil {
        fmt.Println(err.Error())
    }  
    fmt.Println("已执行--" + out.String())
}

func cmdAct(cmdArg string){
    cmd := exec.Command("cmd", "/c", cmdArg)  
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
       // _, fileName := filepath.Split(proPath)  
        //setWorkbookPath(getPathName(fileName)) 
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
        setWorkbookPath(getDir(proPath), getPathName(fileName)) 
        return proPath
    }
    return ""
}

