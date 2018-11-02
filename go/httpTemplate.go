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
    MutexId int
    Url string
    Body string
}

type MutexInfo struct{ 
    isLock bool
    mutexs sync.Mutex 
}

 
var g_Mutex [108]MutexInfo 
var g_mapMutex map[int]MutexInfo
var mutexIndex int
var g_redisBackStr string


func mapMutexInit(){ 
    index := 0
    g_mapMutex = make(map[int]MutexInfo)
    for   index < 100 {    
        g_mapMutex[index] = g_Mutex[index]
        index += 1
    } 

}

func mapMutexLock(id int){  
    for k, v := range(g_mapMutex) {
        if(k == id) {
            if( !v.isLock ){  
                v.isLock = true
                v.mutexs.Lock()
                break
            }
            
        }
    } 
}
func mapMutexUnlock(id int){ 
    for k, v := range(g_mapMutex) {
        if(k == id) {
            if( v.isLock ){ 
                v.isLock = false
                v.mutexs.Unlock()
                break
            }
            
        }
    } 
}

 var g_waitEvent sync.WaitGroup

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
        data.MutexId = mutexIndex + 1    
        mutexIndex =  data.MutexId % 100
        data.Url = req.URL.Path
        body, _ := ioutil.ReadAll(req.Body) 
        data.Body = string(body)
        jsonData, err := json.Marshal(&data) 
        if(err != nil){
            return
        }
        fmt.Printf("id-%d\n", data.MutexId)
       // mapMutexLock(data.MutexId)
        if(!redisSend(jsonData)){
            g_redisBackStr = "c++ redis miss"  
            //mapMutexUnlock(data.MutexId)
        }else
        {
            g_waitEvent.Add(1)
            g_waitEvent.Wait()
        } 
        fmt.Printf("web send info %d--%s\n",data.MutexId, g_redisBackStr)
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
    fmt.Printf("get redis info %d--%s\n",dataValue.MutexId, g_redisBackStr)
    //mapMutexUnlock(dataValue.MutexId)
    g_waitEvent.Done()
}

