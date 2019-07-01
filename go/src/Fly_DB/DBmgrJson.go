package Fly_DB

import(    
    "io/ioutil" 
    "encoding/json" 
    "fmt"
	"strconv"
	"time"
	"database/sql" 	
    // "code.google.com/P/odbc"  
)  
 
type DBListStr struct { 
    S2Cinfo S2CDBlist
    Ip string `json:"ip"`
    User string `json:"user"`
    Pwd string `json:"pwd"` 
}
type S2CDBlist struct{
    Name string `json:"name"`
    ChileDB []string `json:"chileDB"`
}

type C2SDBinfo struct{
    Name string 
    ChileDB string
    ExcuteSql string
}
var Json_DBlist []DBListStr
var DBlist map[string]sql.DB

func LoadDBlist (filename string) {
    data, err := ioutil.ReadFile(filename)
    if err != nil{
    return 
    }       
    err = json.Unmarshal(data, &Json_DBlist)
    if err != nil{
		fmt.Println("json decode failed")
        return
    }  
    data2, _ := json.Marshal(&Json_DBlist) 
    fmt.Println("config load suceess:", string(data2)) 
	return 
}
 
func GetDBInfoOne() string{ 
	var arrRet []interface{}
    for i :=range Json_DBlist{   
        item := Json_DBlist[i].S2Cinfo
        arrRet = append(arrRet, item)
    }
    data, _ := json.Marshal(&arrRet)  
    return string(data) 
} 

func LinkDB(ipName string, dbName string)*sql.DB{    
    for i :=range Json_DBlist{ 
        if(ipName == Json_DBlist[i].S2Cinfo.Name){ 
       //    connStr := fmt.Sprintf("sqlserver://%v:%v@%v?database=%v", Json_DBlist[i].User, Json_DBlist[i].Pwd, Json_DBlist[i].Ip, dbName)
            connStr := fmt.Sprintf("driver={sql server};server=%v;uid=%v;pwd=%v;database=%v", Json_DBlist[i].Ip, Json_DBlist[i].User, Json_DBlist[i].Pwd, dbName) //encrypt=disable
            db, err := sql.Open("odbc", connStr)
            if err != nil {
                return nil
            }  
            return db;
        }
    }
    return nil
}

func dbClientGet(ipName string) *sql.DB {
	dbClient, ok := DBlist[ipName]
	if !ok {
		return nil
	} else {
		return &dbClient
	}
}

// 将结果集转换成map
func getMapFromRows(rows *sql.Rows, returnLen int) ([]map[string]interface{}, error) {
	var ret []map[string]interface{}
	cols, _ := rows.Columns()
	colTypes, err := rows.ColumnTypes()

	if err != nil {
		fmt.Printf("read coltype error:%v\n", err.Error())
    }
    returnLens := returnLen
	for rows.Next() {
        if(returnLens > 0){ 
            returnLens = returnLens - 1
        }
		columns := make([]interface{}, len(cols))
		columnPointers := make([]interface{}, len(cols))
		for i, _ := range columns {
			columnPointers[i] = &columns[i]
		}

		if err := rows.Scan(columnPointers...); err != nil {
			return ret, err
		}
		m := make(map[string]interface{})
		for i, colName := range cols {
			colType := colTypes[i]
			value := *columnPointers[i].(*interface{})

			if value == nil {
				m[colName] = nil
				continue
			}

			dbTypeName := colType.DatabaseTypeName()

			if dbTypeName == "MONEY" {
				arrValue := value.([]uint8)
				floatValue, _ := strconv.ParseFloat(string(arrValue), 64)
				m[colName] = floatValue
			} else if dbTypeName == "DATE" {
				timeValue := value.(time.Time)
				m[colName] = timeValue.Format("2006-01-02")
			} else if dbTypeName == "DATETIME" {
				timeValue := value.(time.Time)
				m[colName] = timeValue.Format("2006-01-02 15:04:05") 
			} else {		   
			 	m[colName] = value
			}
		}
		ret = append(ret, m)
	}
	return ret, nil
}
