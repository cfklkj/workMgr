package RecordInfo

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"

	_ "github.com/typa01/go-utils"
)

func onTxt(res http.ResponseWriter, req *http.Request) bool {

	if strings.Contains(req.RequestURI, "act=txt") {
		body, _ := ioutil.ReadAll(req.Body)
		exp := getTxtReq(body)
		if exp.Act == "get" {
			io.WriteString(res, getTxtData(exp.Guid))
		} else if exp.Act == "alt" {
			io.WriteString(res, altTxtData(exp))
		} else if exp.Act == "del" {
			io.WriteString(res, delTxtData(exp.Guid))
		}
		return true
	}
	return false
}
func getTxtReq(body []byte) C2SREQ_Txt {
	var reqs C2SREQ_Txt
	err := json.Unmarshal(body, &reqs)
	if err != nil {
		fmt.Println("exp body failed")
		return reqs
	}
	return reqs
}
