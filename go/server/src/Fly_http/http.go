package Fly_http

import (
	//"fmt"

	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"io/ioutil"
	"net/http"

	"../config"
	"../notepad"
	"tzj.com/svr_logic/print"
)

type Http struct {
	conf *config.ConfigInfo
	note *notepad.Notebook
}

func NewHttp() *Http {
	ret := new(Http)
	ret.conf = config.NewConfig().GetConfigInfo()
	ret.note = notepad.NewNotebook()
	return ret
}

//开启服务器
func (c *Http) Listen() {
	// 设置服务文件
	http.Handle(CSS_CLIENT_PATH, http.FileServer(http.Dir(CSS_SVR_PATH)))
	http.Handle(DART_CLIENT_PATH, http.FileServer(http.Dir(DART_SVR_PATH)))
	http.Handle(IMAGE_CLIENT_PATH, http.FileServer(http.Dir(IMAGE_SVR_PATH)))
	http.HandleFunc("/", c.HomePage)

	// 网址与处理逻辑对应起来
	//绑定socket方法
	c.setNotepadHandleFunc()
	http.ListenAndServe(c.conf.HttpIpPort, nil) //设置监听的端口
}

func (c *Http) HomePage(w http.ResponseWriter, req *http.Request) {
	if req.Method != "GET" && req.Method != "get" {
		c.sendBack(w, Err_MethodGet, "")
		print.Println("HomePage", "err", req.URL.Path)
		return
	}
	path := req.URL.Path
	if req.URL.Path != "/" {
		c.sendBack(w, Err_req, "")
		return
	}
	path = DART_SVR_PATH + c.conf.DefaultHtml
	t, err := template.ParseFiles(path)
	if err != nil {
		fmt.Println(err)
		return
	}
	var buf bytes.Buffer
	err = t.Execute(&buf, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, err = w.Write(buf.Bytes())
	if err != nil {
		fmt.Println(err)
		return
	}
}

//校验
func (c *Http) headCheck(w http.ResponseWriter, req *http.Request) (string, []byte) {
	if req.Method != "POST" && req.Method != "post" {
		c.sendBack(w, Err_MethodPost, "")
		return "", nil
	}
	req.ParseForm()
	tokenStr := req.Form.Get("proid")
	proid, err1 := c.getTokensData(TokenKey, tokenStr)
	if err1 != Err_null {
		c.sendBack(w, err1, len(proid))
		return "", nil
	}
	body, err := ioutil.ReadAll(req.Body)
	if err != nil || len(proid) < 3 || len(proid) > 64 {
		c.sendBack(w, Err_Ummarshal, len(proid))
		return "", nil
	}
	print.Println("headCheck", string(body))
	return proid, body
}

//返回消息
func (c *Http) sendBack(w http.ResponseWriter, code int, data interface{}) {
	var rst S2CBody
	rst.Code = code
	rst.CodeMsg = c.getCodeStr(code)
	rst.Data = data
	dataStr, _ := json.Marshal(rst)
	print.Println("sendBack", string(dataStr))
	io.WriteString(w, string(dataStr))
}
