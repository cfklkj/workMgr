package Fly_http

import (
	//"fmt"
	"bytes"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
	"text/template"
	"time"

	"../RecordInfo"
)

// 端口
const (
	HTTP_PORT  string = "80"
	HTTPS_PORT string = "443"
)

// 目录
const (
	CSS_CLIENT_PATH   = "/css/"
	DART_CLIENT_PATH  = "/js/"
	IMAGE_CLIENT_PATH = "/image/"

	CSS_SVR_PATH   = "../../web"
	DART_SVR_PATH  = "../../web"
	IMAGE_SVR_PATH = "../../web"
)

func StartServer() {

	RecordInfo.ReadFiles()
	ReadFiles()
	// 先把css和脚本服务上去
	http.Handle(CSS_CLIENT_PATH, http.FileServer(http.Dir(CSS_SVR_PATH)))
	http.Handle(DART_CLIENT_PATH, http.FileServer(http.Dir(DART_SVR_PATH)))
	http.Handle(IMAGE_CLIENT_PATH, http.FileServer(http.Dir(IMAGE_SVR_PATH)))

	// 网址与处理逻辑对应起来
	http.HandleFunc("/", HomePage)
	http.HandleFunc("/workbook", RecordInfo.OnWorkbook)
	http.HandleFunc("/DBMgr", OnDBMgr)
	//绑定socket方法
	//  http.Handle("/webSocket", h_webSocket)
	err := http.ListenAndServe("127.0.0.1:"+strconv.Itoa(webConfig.HttpPort), nil) //设置监听的端口
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
	for {
		time.Sleep(10 * time.Second)
	}
}

func WriteTemplateToHttpResponse(res http.ResponseWriter, t *template.Template) error {
	if t == nil || res == nil {
		return errors.New("WriteTemplateToHttpResponse: t must not be nil.")
	}
	var buf bytes.Buffer
	err := t.Execute(&buf, nil)
	if err != nil {
		return err
	}
	res.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, err = res.Write(buf.Bytes())
	return err
}

func HomePage(res http.ResponseWriter, req *http.Request) {
	if req.Method == "GET" {
		fmt.Println("homepage")
		path := req.URL.Path
		if req.URL.Path == "/" {
			path = DART_SVR_PATH + "/" + webConfig.DefaultHtml
		}
		t, err := template.ParseFiles(DART_SVR_PATH + path)
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
		if strings.Contains(req.URL.Path, "/Explorer") {
			//OnExplorer(res, req)
		} else if strings.Contains(req.URL.Path, "/Workbook") {
			RecordInfo.OnWorkbook(res, req)
		} else {
			// Fly_DB.OnDBMgr(res,req)
		}
	}
}

func OnDBMgr(res http.ResponseWriter, req *http.Request) {
	if req.Method == "GET" {
		t, err := template.ParseFiles("web/workbook.html")
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
			//	io.WriteString(res, GetDBInfoOne())
		} else if strings.Contains(req.URL.Path, "&sqlExec") {
			// body, _ := ioutil.ReadAll(req.Body)
			// var c2sDBinfo C2SDBinfo
			// err := json.Unmarshal(body, &c2sDBinfo)
			// if err != nil {
			// 	//   c.String(500, "decode json error")
			// 	io.WriteString(res, "decode json error")
			// 	return
			// }
			// io.WriteString(res, ExecSql(c2sDBinfo))
		} else {
			io.WriteString(res, "这是从后台发送的数据")
		}
	}
}
