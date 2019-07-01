package RecordInfo

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
)

func makeTagInfo(guid string, name string) TagInfo {
	var tagInfo TagInfo
	tagInfo.Guid = guid
	tagInfo.Name = name
	return tagInfo
}

func onProlist(res http.ResponseWriter, req *http.Request) bool {

	if strings.Contains(req.RequestURI, "act=prolist") {
		body, _ := ioutil.ReadAll(req.Body)
		exp := getProlistReq(body)
		if exp.Act == "get" {
			rst := getRootDataStr()
			io.WriteString(res, rst)
		} else if exp.Act == "create" {
			tagInfo := makeTagInfo(exp.Guid, exp.Name)
			if addRootTag(tagInfo) {
				keepRootData()
				io.WriteString(res, "true")
			} else {
				io.WriteString(res, "false -- guid错误或已存在")
			}
		} else if exp.Act == "drop" {
			tagInfo := makeTagInfo(exp.Guid, exp.Name)
			if dropRootTag(tagInfo) {
				keepRootData()
				io.WriteString(res, "true")
			} else {
				io.WriteString(res, "false")
			}
		} else if exp.Act == "alt" {
			tagInfo := makeTagInfo(exp.Guid, exp.Name)
			if altRootTag(tagInfo) {
				keepRootData()
				io.WriteString(res, "true")
			} else {
				io.WriteString(res, "false")
			}
		}
		return true
	}
	return false
}
func getProlistReq(body []byte) C2SREQ_Prolist {
	var reqs C2SREQ_Prolist
	err := json.Unmarshal(body, &reqs)
	if err != nil {
		fmt.Println("exp body failed")
		return reqs
	}
	return reqs
}
func getRootDataStr() string {
	if len(g_rootDataInfo) < 1 {
		return ""
	}
	data, _ := json.Marshal(&g_rootDataInfo)
	return string(data)
}
