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

type ProjectInfo struct{
    ProName string
    ProPath string
    Id      int
}

type ProHistory struct{
   NearProp   ProjectInfo
   ProInfos[] ProjectInfo
}

type C2SGETTXT struct{
    ProInfo ProjectInfo 
    FileId string 
    Unrecognizable bool
} 
type C2SKEEPTXT struct{
    ProInfo ProjectInfo 
    FileId string  
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

func OnWorkbook(userName string, res http.ResponseWriter, req *http.Request) { 
    req.ParseForm()
    fmt.Println(req.URL.Path)   
    
    if strings.Contains(req.URL.Path, "&LoginStatu") { 
        io.WriteString(res, "OK") 
        return;
    }
    if strings.Contains(req.URL.Path, "&ProInfo") { 
        body, _ := ioutil.ReadAll(req.Body) 
        rst :=projectAct(userName, body); 
        io.WriteString(res, rst) 
    }else if strings.Contains(req.URL.Path, "&upJson") { 
        body, _ := ioutil.ReadAll(req.Body)
        var  c2sJsonInfo  C2SUPJSON     
        err := json.Unmarshal(body, &c2sJsonInfo)
        if err != nil { 
            io.WriteString(res, "decode json error")
            return
        }
        WriteWorkBookJson(c2sJsonInfo)
        io.WriteString(res, "act success")
    }else if strings.Contains(req.URL.Path, "&getJson") {      
        body, _ := ioutil.ReadAll(req.Body)
        rst := projectInfo(userName, body);
        io.WriteString(res, rst)
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
        if(c2sPackInfo.Package == "import"){
           
           _, _, err := req.FormFile("fileTag")
            
                if err != nil {
                    panic(err)
                }
            
            io.WriteString(res, ImportWorkBook(c2sPackInfo.ProInfo.ProPath))  
        }else{
            originalPath :=  c2sPackInfo.ProInfo.ProPath + "/" + c2sPackInfo.ProInfo.ProName  + "/" 
            ExportWorkBook(originalPath, c2sPackInfo.ProInfo.ProName)
        }     
    }else {
        io.WriteString(res, "这是从后台发送的数据")
    } 
}
func getDir(filePath string)string{
    pDir,_ := filepath.Split(filePath) 
    return pDir 
}


//读取文本
func GetWorkbookTxt(c2sTxtInfo C2SGETTXT)string{    
    dirPth := c2sTxtInfo.ProInfo.ProPath + "/" + c2sTxtInfo.ProInfo.ProName  + "/" 
    //dirPth += fmt.Sprint(c2sTxtInfo.ParentId) + "_" + fmt.Sprint(c2sTxtInfo.FileId);    
    dirPth += fmt.Sprint(c2sTxtInfo.FileId);    
    return OpenTxt(dirPth, c2sTxtInfo.Unrecognizable)
} 
//删除文本
func DeleteWorkbookTxt(c2sTxtInfo C2SGETTXT)string{    
    dirPth := c2sTxtInfo.ProInfo.ProPath + "/" + c2sTxtInfo.ProInfo.ProName  + "/" 
   // dirPth += fmt.Sprint(c2sTxtInfo.ParentId) + "_" + fmt.Sprint(c2sTxtInfo.FileId);  
    dirPth += fmt.Sprint(c2sTxtInfo.FileId);  
    err := os.Remove(dirPth) 
    if err != nil { 
        return "file remove Error!"
    } else { 
        return "file remove OK!"
    }
} 
//写入文本
func KeepWorkbookTxt(c2sFileInfo C2SKEEPTXT)string{
    dirPth := c2sFileInfo.ProInfo.ProPath + "/" + c2sFileInfo.ProInfo.ProName  + "/" 
    //dirPth += fmt.Sprint(c2sFileInfo.ParentId) + "_" + fmt.Sprint(c2sFileInfo.FileId);   
    dirPth += fmt.Sprint(c2sFileInfo.FileId); 
    return writeFile(dirPth, c2sFileInfo.TxtInfo); 
}

//更新json文件列表
func WriteWorkBookJson(c2sJsonInfo  C2SUPJSON){ 
    dirPath := c2sJsonInfo.ProInfo.ProPath + "/" + c2sJsonInfo.ProInfo.ProName  + "/" 
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
    dirPath := c2sJsonInfo.ProInfo.ProPath + "/" + c2sJsonInfo.ProInfo.ProName  + "/" 
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
 
    // proPath := OpenKeepDialog()
    // if(proPath != ""){ 
    //      _, fileName := filepath.Split(proPath)   
    //     pathName := getPathName(fileName)
    //     cmd := exec.Command("cmd", "/c", "workbook/WorkbookExport.bat 3 "+ workbookPath + "/" + pathName + " " + proPath)   
    //     var out bytes.Buffer
    //     cmd.Stdout = &out
    //     err := cmd.Start()
    //     cmd.Wait()
    //     if err != nil {
    //         return err.Error()
    //     }   
    //     setWorkbookPath(workbookPath, pathName)
    //     return "已执行--"
    // }
    return "error--" 
}

func ExportWorkBook(workbookPath string, proName string){
    // cmd := exec.Command("cmd", "/c", "workbook/WorkbookExport.bat 1 "+ workbookPath + "/ " + proName)  
    // var out bytes.Buffer
	// cmd.Stdout = &out
    // err := cmd.Start()
    // if err != nil {
    //     fmt.Println(err.Error())
    // }  
    // fmt.Println("已执行--" + out.String())
}
 

func OpenKeepDialog()string{ 

    cmd := exec.Command("cmd", "/c", "workbook/WorkbookExport.bat 2 ")   
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
        return proPath
    }
    return ""
}
func OpenWorkBook()string{ 

    // cmd := exec.Command("cmd", "/c", "workbook/WorkbookExport.bat 4")   
    // var out bytes.Buffer
	// cmd.Stdout = &out
    // err := cmd.Start()
    // cmd.Wait()
    // if err != nil {
    //     return ""
    // }  
    // outStr := strings.Split(out.String(), "\r\n");
    // if(outStr[2] != ""){  
    //     proPath := outStr[2] 
    //     ok, _ := exists(proPath + "/dirNames.json")
    //     if !ok {
    //         return ""
    //     }    
    //     _, fileName := filepath.Split(proPath)  
    //     setWorkbookPath(getDir(proPath), getPathName(fileName)) 
    //     return proPath
    // }
    return ""
}



//上传
func uploadHandle(w http.ResponseWriter, r *http.Request)bool {
	//从请求当中判断方法
	if r.Method == "GET" {
        return false
	} else {
		//获取文件内容 要这样获取
		file, head, err := r.FormFile("file")
		if err != nil {
			fmt.Println(err)
			return false
		}
		defer file.Close()
		//创建文件
		fW, err := os.Create("./" + head.Filename)
		if err != nil {
			fmt.Println("文件创建失败")
			return true
		}
		defer fW.Close()
		_, err = io.Copy(fW, file)
		if err != nil {
			fmt.Println("文件保存失败")
            return true
        }
		//io.WriteString(w, head.Filename+" 保存成功") 
		http.Redirect(w, r, "/", http.StatusFound)
        return true
	}
} 
