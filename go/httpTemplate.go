package main

import(  
	//"fmt"
    "net/http" 
    "fmt"  
	"text/template" 
	"errors"	
    "bytes" 
    "strings"
    "io"
)  

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

func gotoHtml(res http.ResponseWriter, req *http.Request, htmlFile string){
    
    if req.Method == "GET" { 
        fmt.Println("homepage")
        path := req.URL.Path
        if req.URL.Path == "/" {
            path = "/" + htmlFile
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
    }else
    {        
		io.WriteString(res, "login") 
    }
}

func HomePage(res http.ResponseWriter, req *http.Request) {    
    var userName = test_session_valid(res, req);
    if userName == "" {
        return;
    }
    if req.Method == "GET" { 
        fmt.Println("homepage")
        gotoHtml(res, req, webConfig.DefaultHtml); 
    } else if req.Method == "POST" {
      //  if(uploadHandle(res, req)){
      //      return
      //  } 
        if strings.Contains(req.URL.Path, "/Workbook"){
            OnWorkbook(userName, res, req)
        } 
    }    
}
 