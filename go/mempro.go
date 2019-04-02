package main

 

var mem_buff map[string] *ProHistory;

func mem_alloc(){
	mem_buff = make(map[string] *ProHistory)
}

func mem_get(username string) *ProHistory{ 
	if mem_buff[username] == nil{
		mem_buff[username] = &ProHistory{}
	}
	return mem_buff[username];
}
func  mem_add(username string, prohistory ProHistory)  {  
	mem_buff[username] = &prohistory //ProHistory{NearProp:prohistory.NearProp, ProInfos:prohistory.ProInfos}  
} 
func  mem_alter_name(username string, key int,newProName string)  {
	mem_buff[username].ProInfos[key].ProName = newProName; 
	mem_buff[username].NearProp = mem_buff[username].ProInfos[key];
} 


func mem_del(username string) {

}