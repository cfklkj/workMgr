package RecordInfo

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
)

func onDirlist(res http.ResponseWriter, req *http.Request) bool {

	req.ParseForm()
	if strings.Contains(req.RequestURI, "act=dirlist") {
		body, _ := ioutil.ReadAll(req.Body)
		exp := getDirlistReq(body)
		if exp.Act == "create" {
			rst := addDirlist(exp.Guid, exp.Name)
			io.WriteString(res, rst)
		} else if exp.Act == "drop" {
			rst := dropDirlist(exp.Guid, exp.Name)
			io.WriteString(res, rst)
		} else if exp.Act == "alt" {
			rst := altDirlist(exp.Guid, exp.Name)
			io.WriteString(res, rst)
		} else if exp.Act == "get" {
			rst := getDirlistTagName(exp.Guid)
			io.WriteString(res, rst)
		} else {
			io.WriteString(res, "erro msg")
		}
		return true
	}
	return false
}
func getDirlistReq(body []byte) C2SREQ_Dirlist {
	var reqs C2SREQ_Dirlist
	err := json.Unmarshal(body, &reqs)
	if err != nil {
		fmt.Println("exp body failed")
		return reqs
	}
	return reqs
}

func getDirlistTagName(guid string) string {
	var tagInfo TagInfo
	if getFolderTag(guid, &tagInfo) != true {
		if getFileTag(guid, &tagInfo) != true {
			getRootTag(guid, &tagInfo)
		}
	}
	return tagInfo.Name

}
