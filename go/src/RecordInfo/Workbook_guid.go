package RecordInfo

import (
	"crypto/md5"
	"encoding/hex"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
)

//生成32位md5字串
func GetMd5String(s string) string {
	h := md5.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}

//生成Guid字串
func makeGuid() string {
	tm := time.Now()
	return GetMd5String(tm.String())
}

func getGuid(res http.ResponseWriter, req *http.Request) bool {

	if strings.Contains(req.RequestURI, "act=guid") {
		body, _ := ioutil.ReadAll(req.Body)
		bodyStr := string(body)
		var rst string
		if strings.Contains(bodyStr, "folder") {
			rst = "D_" + makeGuid()
		} else if strings.Contains(bodyStr, "file") {
			rst = "F_" + makeGuid()
		} else if strings.Contains(bodyStr, "pro") {
			rst = "P_" + makeGuid()
		} else {
			rst = "error"
		}
		io.WriteString(res, rst)
		return true
	}
	return false
}

func findGuid(guid string) bool {
	if findTagIndex(guid, g_rootDataInfo) > -1 {
		return true
	}
	if findTagIndex(guid, g_folderDataInfo) > -1 {
		return true
	}
	if findTagIndex(guid, g_fileDataInfo) > -1 {
		return true
	}
	return false
}
