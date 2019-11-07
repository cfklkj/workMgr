package Fly_http

import (
	"encoding/json"
	"net/http"

	"../notepad"
)

const ( //tagType
	Tag_Pro  = 10001 //项目
	Tag_Root = 10002 //项目根
	Tag_Dir  = 10003 //根下子目录
	Tag_File = 10004 //目录下文件
	Tag_Link = 10005 //标签联系
)
const (
	Tag_ProStr = "project"
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
	http.HandleFunc(Version+"/workbook/pro/create", c.wkProCreate)
	http.HandleFunc(Version+"/workbook/pro/get", c.wkProGet)
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
func (c *Http) wkProCreate(res http.ResponseWriter, req *http.Request) {
	path, _ := c.headCheck(res, req)
	if path == "" {
		return
	}
	rst, value := c.prolistCreate(path)
	c.sendBack(res, rst, value)
}

func (c *Http) wkProGet(res http.ResponseWriter, req *http.Request) {
	path, body := c.headCheck(res, req)
	if body == nil {
		return
	}
	rst, value := c.prolistGet(path)
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
	guid := c.getGuid(TypeGuid_Pro)
	c.note.SetGuid(path, guid, "newPro")
	c.note.Setlink(path, Tag_ProStr, guid)
	return 0, c.note.GetGuid(path, guid)
}

//删除
// func (c *Http) prolistDel(path string, body []byte) (int, interface{}) {
// 	guid := string(body)
// 	c.note.SetGuid(path, guid, "newPro")
// 	c.note.Setlink(path, Tag_ProStr, guid)
// 	return 0, c.note.GetGuids(path, guid)
// }
//获取
func (c *Http) prolistGet(path string) (int, interface{}) {
	return 0, c.note.GetGuids(path, Tag_ProStr)
}

//-----------------------------dir
func (c *Http) dirCreate(path string, body []byte) (int, interface{}) {
	root := string(body)
	typeGuid := c.getGuidType(root)
	if typeGuid != TypeGuid_Pro && TypeGuid_Dir != typeGuid {
		return Err_TypeGuid, nil
	}
	guid := c.getGuid(TypeGuid_Dir)
	c.note.SetGuid(path, guid, "newDir")
	c.note.Setlink(path, root, guid)
	return 0, c.note.GetGuid(path, guid)
}

//-----------------------------file
func (c *Http) fileCreate(path string, body []byte) (int, interface{}) {
	root := string(body)
	typeGuid := c.getGuidType(root)
	if TypeGuid_Dir != typeGuid {
		return Err_TypeGuid, nil
	}
	guid := c.getGuid(TypeGuid_File)
	c.note.SetGuid(path, guid, "newFile")
	c.note.Setlink(path, root, guid)
	return 0, c.note.GetGuid(path, guid)
}
func (c *Http) fileAlt(path string, body []byte) (int, interface{}) {
	var fileInfo FileInfo
	err := json.Unmarshal(body, &fileInfo)
	if err != nil {
		return Err_Ummarshal, ""
	}
	typeGuid := c.getGuidType(fileInfo.Guid)
	if typeGuid != TypeGuid_File {
		return Err_TypeGuid, nil
	}
	rst := c.note.SetTxt(path, fileInfo.Guid, fileInfo.Data)
	return 0, rst
}
func (c *Http) fileGet(path string, body []byte) (int, interface{}) {
	guid := string(body)
	typeGuid := c.getGuidType(guid)
	if typeGuid != TypeGuid_File {
		return Err_TypeGuid, nil
	}
	return c.note.GetTxt(path, guid)
}

//-----------------------------altName
//修改名称
func (c *Http) altName(path string, body []byte) (int, interface{}) {
	var guidInfo notepad.GuidInfo
	err := json.Unmarshal(body, &guidInfo)
	if err != nil {
		return Err_Ummarshal, ""
	}
	c.note.SetGuid(path, guidInfo.Guid, guidInfo.Name)
	return 0, c.note.GetGuids(path, guidInfo.Guid)
}

//-----------------------------link
//添加联系
func (c *Http) addLink(path string, body []byte) (int, interface{}) {
	var linkInfo LinkInfo
	err := json.Unmarshal(body, &linkInfo)
	if err != nil {
		return Err_Ummarshal, ""
	}
	c.note.Setlink(path, linkInfo.RootGuid, linkInfo.ChileGuid)
	return 0, c.note.GetGuids(path, linkInfo.RootGuid)
}

//修改联系
func (c *Http) swapLink(path string, body []byte) (int, interface{}) {
	var swapInfo SwapLinkInfo
	err := json.Unmarshal(body, &swapInfo)
	if err != nil {
		return Err_Ummarshal, ""
	}
	rst := c.note.Swaplink(path, swapInfo.RootGuid, swapInfo.GuidA, swapInfo.GuidB)
	return 0, rst
}

func (c *Http) changeLink(path string, body []byte) (int, interface{}) {
	var changeInfo ChangeLinkInfo
	err := json.Unmarshal(body, &changeInfo)
	if err != nil {
		return Err_Ummarshal, ""
	}
	rst := c.note.Changelink(path, changeInfo.RootGuidA, changeInfo.RootGuidB, changeInfo.Guid)
	return 0, rst
}
