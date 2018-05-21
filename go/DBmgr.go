package main

import(   
    "net/http" 
    "fmt"   
    "io"
    "io/ioutil"
    "strings" 
    "text/template" 
    "encoding/json"  

)   
func InitDBMgr(){    
    LoadDBlist("json/DBlist.json"); 
}
func OnDBMgr(res http.ResponseWriter, req *http.Request) {
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
        req.ParseForm()
        fmt.Println(req.URL.Path)
        if strings.Contains(req.URL.Path, "&getDBInfo") {
            io.WriteString(res, GetDBInfoOne())
        }else if strings.Contains(req.URL.Path, "&sqlExec") {      
            body, _ := ioutil.ReadAll(req.Body)
            var c2sDBinfo C2SDBinfo            
            err := json.Unmarshal(body, &c2sDBinfo)
            if err != nil {
             //   c.String(500, "decode json error")
                io.WriteString(res, "decode json error")
                return
            } 
            io.WriteString(res, ExecSql(c2sDBinfo))
        }else {
            io.WriteString(res, "这是从后台发送的数据")
        }
    }
}

func ExecSql(body C2SDBinfo) string{ 
    db := LinkDB(body.Name, body.ChileDB)
     if(db == nil){
        return "打开数据库错误"
     }
    //封装SQL指令 
    sqlSplic :=  strings.Split(body.ExcuteSql, "go") 
    var retStr string
    for _, value := range sqlSplic{ 
        stmt, err := db.Prepare(value) 
        if( retStr != ""){  
          retStr += "<p/>"   //div  换行
        }
        if err != nil {
            retStr += "SQL指令错误"
            continue
        } 
        rows, err := stmt.Query()  
        if err != nil {   
            retStr += err.Error() 
            continue
        }       
        dataRow, err :=  getMapFromRows(rows, 20);
        rows.Close()
        ret, err := json.Marshal(&dataRow)
        if err != nil {
            //c.String(500, "encode json")
            retStr +=  err.Error() 
            continue
        } 
        retStr +=  string(ret);  
    }
    return retStr
}