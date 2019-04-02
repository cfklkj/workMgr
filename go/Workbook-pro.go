package main

import(
	"fmt"
	"os"
	"strings"
    "encoding/json"  
) 


//------projectInfo
func projectAct(userName string, body []byte)string{ 
    
    var  c2sProInfo  C2SPROINFO     
    err := json.Unmarshal(body, &c2sProInfo)
    if err != nil { 
        return "decode json error"; 
    }  
    if(c2sProInfo.ProType == "new"){      
		c2sProInfo.ProInfo.ProPath = appendDocment(userName); 
		c2sProInfo.ProName = "NewPro" 
        for{
            originalPath :=  c2sProInfo.ProInfo.ProPath + "/" + c2sProInfo.ProName
            err := os.Mkdir(originalPath, os.ModePerm)
            if err != nil {
                fmt.Println(err)
            }else{ 
               break;   
            }     
            c2sProInfo.ProName += "1"         
         }  
		 proInfo := addProInfo(userName, c2sProInfo.ProInfo.ProPath, c2sProInfo.ProName) 
         data, _ := json.Marshal(&proInfo) 
         return string(data);
    }else if(c2sProInfo.ProType == "open"){ 
        return OpenWorkBook(); 
    }else if(c2sProInfo.ProType == "rename"){ 
        //重命名文件夹
        originalPath :=  c2sProInfo.ProInfo.ProPath + "/" + c2sProInfo.ProInfo.ProName  + "/" 
        newPath := c2sProInfo.ProInfo.ProPath + "/"  + c2sProInfo.ProName
        err := os.Rename(originalPath, newPath) 
        if err != nil { 
            return "重命名失败--可能存在同命项目";
        } 
        changeProInfo(userName, c2sProInfo.ProInfo, c2sProInfo.ProName)
        return "ok";
    }else if(c2sProInfo.ProType == "choice"){  
        addProInfo(userName, c2sProInfo.ProInfo.ProPath, c2sProInfo.ProName)
        return "ok";
    }else{ 
        return  "error command";
    }
}
func projectInfo(userName string, body [] byte)string{    
    var  c2sJsonInfo  C2SGETJSON     
    err := json.Unmarshal(body, &c2sJsonInfo)
    if err != nil { 
        return "decode json error -- "+ string(body)
	}
	
    if(c2sJsonInfo.JsonType == "proHistory"){  
        proInfo := getProInfo(userName) 
        data, _ := json.Marshal(&proInfo) 
        return string(data); 
    }
    if(c2sJsonInfo.JsonType == "nearProject"){  
        proInfo := getProInfo(userName) 
        data, _ := json.Marshal(&proInfo.NearProp) 
        return string(data);
    }else{ 
        return GetWorkbookJson(c2sJsonInfo);
    }
}

//--end


//获取用户项目
func getProInfo(userName string) *ProHistory{
    fmt.Println("check documentPath:")  

    proInfo := mem_get(userName) 
    if  proInfo.NearProp.Id != 0 {
        return proInfo;
    }

    dir :=  appendDocment(userName);     
    list, err := getDirList(dir)
	if err != nil {
		fmt.Println(err)
		return proInfo;
	}
    index := 1
    proInfo.ProInfos =  nil
	for _, foldName := range list {
        fmt.Println(foldName)   
        index ++; 
        proInfo.NearProp.Id = index
        proInfo.NearProp.ProName = foldName
        proInfo.NearProp.ProPath = dir   
        proInfo.ProInfos = append(proInfo.ProInfos, proInfo.NearProp);
    } 
    return mem_get(userName);
}

//新增项目
func addProInfo(userName, ProDir, ProName string) ProHistory{    
    isFind := false;
	index := 0
	proInfo := getProInfo(userName);
    for _, proHistory := range proInfo.ProInfos {
        if(strings.Compare(proHistory.ProPath,ProDir) == 0  &&  strings.Compare(proHistory.ProName,ProName) == 0) {
            isFind = true;
            break;
        }
        index ++
    }
    proInfo.NearProp.Id = index
    proInfo.NearProp.ProName = ProName
    proInfo.NearProp.ProPath = ProDir 
    if(!isFind){
        proInfo.ProInfos = append(proInfo.ProInfos, proInfo.NearProp)
	} 
	return *proInfo;
}
//变更项目信息
func changeProInfo(userName string, proInfo ProjectInfo,  newProName string){   
	getPro := getProInfo(userName);
    for key, proHistory := range getPro.ProInfos {
        if(proInfo.Id == proHistory.Id) {
            mem_alter_name(userName, key, newProName)  
            break;
        } 
    }  
}
