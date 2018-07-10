package main

import(   
    "net/http" 
    "fmt"   
    "os"
    "io"
    "io/ioutil"
    "os/exec"  
    "bytes"
    "strings"  
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

type C2SPACKAGE struct{
    Package string 
    Source string 
} 
var g_workbookPath = "d:\\workbook\\"
var g_dirPath = g_workbookPath
func OnWorkbook(res http.ResponseWriter, req *http.Request) { 
    req.ParseForm()
    fmt.Println(req.URL.Path) 
    if strings.Contains(req.URL.Path, "&upJson") { 
        body, _ := ioutil.ReadAll(req.Body)
        var  c2sJsonInfo  C2SUPJSON     
        err := json.Unmarshal(body, &c2sJsonInfo)
        if err != nil {
            //   c.String(500, "decode json error")
            io.WriteString(res, "decode json error")
            return
        }
        WriteWorkBookJson(c2sJsonInfo)
    }else if strings.Contains(req.URL.Path, "&getJson") {      
        body, _ := ioutil.ReadAll(req.Body)
        var  c2sJsonInfo  C2SGETJSON     
        err := json.Unmarshal(body, &c2sJsonInfo)
        if err != nil {
            //   c.String(500, "decode json error")
            io.WriteString(res, "decode json error")
            return
        }
        io.WriteString(res, GetWorkbookJson(c2sJsonInfo))
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
            io.WriteString(res, ImportWorkBook(c2sPackInfo.Source))  
        }else{
            ExportWorkBook()
        }   

    }else if strings.Contains(req.URL.Path, "&showLogDir") {    
        io.WriteString(res, ExecOpenDirLog(".\\json\\explorer.json"))
    }else {
        io.WriteString(res, "这是从后台发送的数据")
    } 
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
    c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&gt;", ">", -1)
    c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&lt;", "<", -1)
    c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&amp;", "=", -1)
    file.WriteString(c2sFileInfo.TxtInfo);
    return "keep file " + dirPth + " Ok";
}
//更新json文件列表
func WriteWorkBookJson(c2sJsonInfo  C2SUPJSON){ 
    dirPath := g_dirPath
    if(c2sJsonInfo.JsonType == "Dir"){
        dirPath += "dirNames.json"
    }else{
        dirPath += "fileNames.json"
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
    dirPath := g_dirPath
    os.Mkdir(dirPath, os.ModePerm)
    if(c2sJsonInfo.JsonType == "Dir"){
        dirPath += "dirNames.json"
    }else{
        dirPath += "fileNames.json"
    } 
    return OpenTxt(dirPath, true)
} 

//导入 导出
func ImportWorkBook(path string)string{ 

    cmd := exec.Command("cmd", "/c", "workbook\\WorkbookExport.bat 2 "+ g_workbookPath )  
    var out bytes.Buffer
	cmd.Stdout = &out
    err := cmd.Start()
    cmd.Wait()
    if err != nil {
        return err.Error()
    }  
    return "已执行--" + out.String(); 
}

func ExportWorkBook(){
    cmd := exec.Command("cmd", "/c", "workbook\\WorkbookExport.bat 1 "+ g_workbookPath)  
    var out bytes.Buffer
	cmd.Stdout = &out
    err := cmd.Start()
    if err != nil {
        fmt.Println(err.Error())
    }  
    fmt.Println("已执行--" + out.String())
}