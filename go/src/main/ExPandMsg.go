package main

import(   
    "net/http" 
    "fmt"   
    "io"
    "strings"
    "encoding/json"

)  
 
func ReadMsg(res http.ResponseWriter, req *http.Request) {
    req.ParseForm()
    fmt.Println(req.URL.Path)
    if strings.Contains(req.URL.Path, "&getProInfo") {
        m := map[string][]string{
            "proInfo":   {"1", "2", "3"},
        }       
        if data, err := json.Marshal(m); err == nil { 
            io.WriteString(res, string(data))
        }
    }else if strings.Contains(req.URL.Path, "&getSelect=0") {
        m := map[string][]string{
            "selectType":   {"收支", "日活", "用户"},
        }       
        if data, err := json.Marshal(m); err == nil { 
            io.WriteString(res, string(data))
        }
    }else if strings.Contains(req.URL.Path, "&getSelect=1") {
        m := map[string][][]string{
            "selectMenu":{{"时间", "date", "today"},{"用户ID", "int", "playerID"}},
        }       
        if data, err := json.Marshal(m); err == nil { 
            io.WriteString(res, string(data))
        }
    }else if strings.Contains(req.URL.Path, "&getSelect=2") {
        m := map[string][]string{
            "selectMenu":{"时间", "用户ID", "money"},
        }       
        if data, err := json.Marshal(m); err == nil { 
            io.WriteString(res, string(data))
        }
    }else {
        io.WriteString(res, "这是从后台发送的数据")
    }
}