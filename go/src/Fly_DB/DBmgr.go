package Fly_DB

import(    
    "strings"  
    "encoding/json"  
    "database/sql"  
)   
func InitDBMgr(){    
    LoadDBlist("json/DBlist.json"); 
}
func ExeSqls(db *sql.DB, strSql string) string{
    stmt, err := db.Prepare(strSql) 
    if err != nil {
        return "SQL指令错误" 
    } 
    rows, err := stmt.Query()  
    if err != nil {   
        return err.Error()  
    }       
    dataRow, err :=  getMapFromRows(rows, 20);
    rows.Close()
    ret, err := json.Marshal(&dataRow)
    if err != nil {
        //c.String(500, "encode json")
       return err.Error()  
    } 
    return string(ret)
}
func ExecSql(body C2SDBinfo) string{ 
    db := LinkDB(body.Name, body.ChileDB)
     if(db == nil){
        return "打开数据库错误"
     }
    //封装SQL指令 
    sqlSplic :=  strings.Split(body.ExcuteSql, "go\n") 
    var retStr string
    for _, value := range sqlSplic{   
        if(value == ""){
            continue
        }
        if( retStr != ""){  
            retStr += "<p/>"   //div  换行
        }
        retStr +=  ExeSqls(db, value)
    }
    return retStr
}