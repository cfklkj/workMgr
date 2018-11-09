package main

import(  
	//"fmt"
    "net/http" 
    "fmt"  
	"text/template" 
	"errors"	
    "bytes" 
    "io" 
  //  "strings"
    "io/ioutil"
    "encoding/json" 
    "sync" 
)  
type Callback func (data []byte)

type SendRequest struct{  
    Url string
    Body string
}
   
var g_redisBackStr string 
 var g_waitEvent sync.WaitGroup
 var g_waitEventCount int

func WriteTemplateToHttpResponse(res http.ResponseWriter, t *template.Template) error {
    if t == nil || res == nil {
        return errors.New("WriteTemplateToHttpResponse: t must not be nil.")
    }
    var buf bytes.Buffer
    err := t.Execute(&buf, nil)
    if err != nil {
        return err
    }
    res.Header().Set("Content-Type", "text/html; charset=utf-8")
    _, err = res.Write(buf.Bytes())
    return err
}

func HomePage(res http.ResponseWriter, req *http.Request) {
    if req.Method == "GET" { 
        fmt.Println("homepage")
        path := req.URL.Path
        if req.URL.Path == "/" {
            path = "/" + webConfig.DefaultHtml
        }
        t, err := template.ParseFiles(DART_SVR_PATH + path)
        if err != nil {
            fmt.Println(err)
            return
        }
        err = WriteTemplateToHttpResponse(res, t)
        if err != nil {
            fmt.Println(err)
            return
        }
    } else if req.Method == "POST" { 
      /*  if strings.Contains(req.URL.Path, "/Explorer") { 
            OnExplorer(res, req)
        }else if strings.Contains(req.URL.Path, "/Workbook"){
            OnWorkbook(res, req)
        }else{ 
            OnDBMgr(res,req)
        }*/       
        var data SendRequest     
        data.Url = req.URL.Path
        body, _ := ioutil.ReadAll(req.Body) 
        data.Body = string(body)
        jsonData, err := json.Marshal(&data) 
        if(err != nil){
            return
        } 
        if(!redisSend(jsonData)){
            g_redisBackStr = "c++ redis miss"   
        }else
        {
            g_waitEvent.Add(1)
            g_waitEventCount += 1
            g_waitEvent.Wait()
        }  
        io.WriteString(res, g_redisBackStr) 
    }    
}
 

func OnAjax(res http.ResponseWriter, req *http.Request) { 
    if req.Method == "GET" {   
        t, err := template.ParseFiles(DART_SVR_PATH + "/DBMgr.html")
        if err != nil {
            fmt.Println(err)
            return
        }
        err = WriteTemplateToHttpResponse(res, t)
        if err != nil {
            fmt.Println(err)
            return
        }
    } else if req.Method == "POST" {
        ReadMsg(res,req)
    }    
    OnExplorer(res, req)
    OnDBMgr(res,req)
} 
func sendBackBrowser(data []byte){
    var dataValue SendRequest 
    err := json.Unmarshal(data, &dataValue) 
    if(err != nil){ 
        g_redisBackStr = "error info"
    } else
    { 
        g_redisBackStr = dataValue.Body;
    }  
    if(g_waitEventCount > 0) { 
        g_waitEventCount -= 1
        g_waitEvent.Done()
    }
}

