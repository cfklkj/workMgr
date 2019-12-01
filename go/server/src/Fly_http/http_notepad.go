package Fly_http

import (
	"encoding/json"
	"fmt"
	"net/http"

	"../notepad"
)

const ( //tagType
	Tag_Root = 10002 //项目根
	Tag_Dir  = 10003 //根下子目录
	Tag_File = 10004 //目录下文件
	Tag_Link = 10005 //标签联系
)
const (
	Tag_rootStr = "root"
)

type GuidInfo struct {
	Guid string
	Name string
}

type LinkInfo struct {
	RootGuid  string
	ChileGuid string
}
type SwapLinkInfo struct {
	RootGuid string
	GuidA    string
	GuidB    string
}
type ChangeLinkInfo struct {
	RootGuidA string
	RootGuidB string
	Guid      string
}
type FileInfo struct {
	Guid string
	Data string
}

func (c *Http) setNotepadHandleFunc() {
	//http.HandleFunc(Version+"/workbook/pro/create", c.wkProCreate)
	http.HandleFunc(Version+"/workbook/dir/get", c.wkProGet)
	http.HandleFunc(Version+"/workbook/dir/create", c.wkDirCreate)
	http.HandleFunc(Version+"/workbook/file/create", c.wkFileCreate)
	http.HandleFunc(Version+"/workbook/file/alt", c.wkFileAlt)
	http.HandleFunc(Version+"/workbook/file/get", c.wkFileGet)
	http.HandleFunc(Version+"/workbook/name", c.wkAltName)
	http.HandleFunc(Version+"/workbook/link/add", c.wkAddlink)
	http.HandleFunc(Version+"/workbook/link/swap", c.wkSwaplink)
	http.HandleFunc(Version+"/workbook/link/change", c.wkChangelink)
}

//----------------------handle
// func (c *Http) wkProCreate(res http.ResponseWriter, req *http.Request) {
// 	path, _ := c.headCheck(res, req)
// 	if path == "" {
// 		return
// 	}
// 	rst, value := c.prolistCreate(path)
// 	c.sendBack(res, rst, value)
// }

func (c *Http) wkProGet(res http.ResponseWriter, req *http.Request) {
	path, body := c.headCheck(res, req)
	if body == nil {
		return
	}
	rst, value := c.prolistGet(path, body)
	c.sendBack(res, rst, value)
}

func (c *Http) wkDirCreate(res http.ResponseWriter, req *http.Request) {
	path, body := c.headCheck(res, req)
	if body == nil {
		return
	}
	rst, value := c.dirCreate(path, body)
	c.sendBack(res, rst, value)
}

func (c *Http) wkFileCreate(res http.ResponseWriter, req *http.Request) {
	path, body := c.headCheck(res, req)
	if body == nil {
		return
	}
	rst, value := c.fileCreate(path, body)
	c.sendBack(res, rst, value)
}

func (c *Http) wkFileAlt(res http.ResponseWriter, req *http.Request) {
	path, body := c.headCheck(res, req)
	if body == nil {
		return
	}
	rst, value := c.fileAlt(path, body)
	c.sendBack(res, rst, value)
}

func (c *Http) wkFileGet(res http.ResponseWriter, req *http.Request) {
	path, body := c.headCheck(res, req)
	if body == nil {
		return
	}
	rst, value := c.fileGet(path, body)
	c.sendBack(res, rst, value)
}

func (c *Http) wkAltName(res http.ResponseWriter, req *http.Request) {
	path, body := c.headCheck(res, req)
	if body == nil {
		return
	}
	rst, value := c.altName(path, body)
	c.sendBack(res, rst, value)
}

func (c *Http) wkAddlink(res http.ResponseWriter, req *http.Request) {
	path, body := c.headCheck(res, req)
	if body == nil {
		return
	}
	rst, value := c.addLink(path, body)
	c.sendBack(res, rst, value)
}
func (c *Http) wkSwaplink(res http.ResponseWriter, req *http.Request) {
	path, body := c.headCheck(res, req)
	if body == nil {
		return
	}
	rst, value := c.swapLink(path, body)
	c.sendBack(res, rst, value)
}
func (c *Http) wkChangelink(res http.ResponseWriter, req *http.Request) {
	path, body := c.headCheck(res, req)
	if body == nil {
		return
	}
	rst, value := c.changeLink(path, body)
	c.sendBack(res, rst, value)
}

//-----------------------------actPro
//创建
func (c *Http) prolistCreate(path string) (int, interface{}) {
	guid := c.getGuid(TypeGuid_Dir)
	c.note.GetNoteBook(path).AddGuid(guid, "newDir")
	c.note.GetNoteBook(path).AddLink(Tag_rootStr, guid)
	return Err_null, c.note.GetNoteBook(path).GetGuid(guid)
}

//获取
func (c *Http) prolistGet(path string, body []byte) (int, interface{}) {
	root := string(body)
	if root == "" {
		root = Tag_rootStr
	}
	return Err_null, c.note.GetNoteBook(path).GetGuids(root)
}

//-----------------------------dir
func (c *Http) dirCreate(path string, body []byte) (int, interface{}) {
	root := string(body)
	if root == "" {
		return c.prolistCreate(path)
	}
	guid := c.getGuid(TypeGuid_Dir)
	c.note.GetNoteBook(path).AddGuid(guid, "newDir")
	if c.note.GetNoteBook(path).AddLink(root, guid) {
		return Err_null, c.note.GetNoteBook(path).GetGuid(guid)
	} else {
		return Err_addDir, nil
	}
}

//-----------------------------file
func (c *Http) fileCreate(path string, body []byte) (int, interface{}) {
	root := string(body)
	if root == "" {
		root = Tag_rootStr
	}
	guid := c.getGuid(TypeGuid_File)
	c.note.GetNoteBook(path).AddGuid(guid, "newFile")
	c.note.GetNoteBook(path).AddLink(root, guid)
	rst := c.note.GetNoteBook(path).SetTxtData(guid, "")
	if rst != Err_null {
		return rst, ""
	}
	return Err_null, c.note.GetNoteBook(path).GetGuid(guid)
}
func (c *Http) fileAlt(path string, body []byte) (int, interface{}) {
	var fileInfo FileInfo
	err := json.Unmarshal(body, &fileInfo)
	fmt.Println("fileAlt", string(body))
	if err != nil {
		return Err_Ummarshal, ""
	}
	typeGuid := c.getGuidType(fileInfo.Guid)
	if typeGuid != TypeGuid_File {
		return Err_TypeGuid, nil
	}
	rst := c.note.GetNoteBook(path).SetTxtData(fileInfo.Guid, fileInfo.Data)
	return Err_null, rst
}
func (c *Http) fileGet(path string, body []byte) (int, interface{}) {
	guid := string(body)
	typeGuid := c.getGuidType(guid)
	if typeGuid != TypeGuid_File {
		return Err_TypeGuid, nil
	}
	err, data := c.note.GetNoteBook(path).GetTxtData(guid)
	var rst FileInfo
	rst.Guid = guid
	rst.Data = data
	return err, rst
}

//-----------------------------altName
//修改名称
func (c *Http) altName(path string, body []byte) (int, interface{}) {
	var guidInfo notepad.GuidInfo
	err := json.Unmarshal(body, &guidInfo)
	if err != nil {
		return Err_Ummarshal, ""
	}
	if len(guidInfo.Name) < 3 || len(guidInfo.Name) > 32 {
		return Err_dataLen, ""
	}
	if guidInfo.Guid == "" || c.note.GetNoteBook(path).GetGuid(guidInfo.Guid).Guid != guidInfo.Guid {
		return Err_TypeGuid, nil
	}
	c.note.GetNoteBook(path).AddGuid(guidInfo.Guid, guidInfo.Name)
	return Err_null, c.note.GetNoteBook(path).GetGuid(guidInfo.Guid)
}

//-----------------------------link
//添加联系
func (c *Http) addLink(path string, body []byte) (int, interface{}) {
	var linkInfo LinkInfo
	err := json.Unmarshal(body, &linkInfo)
	if err != nil {
		return Err_Ummarshal, ""
	}
	c.note.GetNoteBook(path).AddLink(linkInfo.RootGuid, linkInfo.ChileGuid)
	return Err_null, c.note.GetNoteBook(path).GetGuids(linkInfo.RootGuid)
}

//修改联系
func (c *Http) swapLink(path string, body []byte) (int, interface{}) {
	var swapInfo SwapLinkInfo
	err := json.Unmarshal(body, &swapInfo)
	if err != nil {
		return Err_Ummarshal, ""
	}
	rst := c.note.GetNoteBook(path).SwapLink(swapInfo.RootGuid, swapInfo.GuidA, swapInfo.GuidB)
	return rst, swapInfo.RootGuid
}

func (c *Http) changeLink(path string, body []byte) (int, interface{}) {
	var changeInfo ChangeLinkInfo
	err := json.Unmarshal(body, &changeInfo)
	if err != nil {
		return Err_Ummarshal, ""
	}
	rst := c.note.GetNoteBook(path).ChangeLink(changeInfo.RootGuidA, changeInfo.RootGuidB, changeInfo.Guid)
	return rst, changeInfo.Guid
}
