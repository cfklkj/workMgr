package main

import(  
	//"fmt"
    "net/http" 
    "fmt"  
	"text/template" 
	"errors"	
    "bytes" 
  //  "strings"
    "io/ioutil"
    "encoding/json" 
)  
type Callback func (data []byte)

type SendRequest struct{
    ResId int
    Url string
    Body string
}
var m_mapRes map[int]http.ResponseWriter = map[int]http.ResponseWriter{}

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

func sendBackBrowser(data []byte){

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
        data.ResId = mapBuff(res)
        data.Url = req.URL.Path
        body, _ := ioutil.ReadAll(req.Body) 
        data.Body = string(body)
        jsonData, err := json.Marshal(&data) 
        if(err != nil){
            return
        }
        redisSend(jsonData)
    }    
}

func mapBuff(res http.ResponseWriter) int{
    m_mapRes[0] = res
    return 0
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
    OnDBMgr(res,req)
} 