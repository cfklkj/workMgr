package Fly_http

import (
	"crypto/md5"
	"encoding/hex"
	"time"

	"../notepad"
)

const (
	TypeGuid_Pro  = 100
	TypeGuid_File = 101
	TypeGuid_Dir  = 102
)
const (
	Err_TypeGuid = 30001 //类型错误
)

// //监听
// func (c *Http) setGuidHandleFunc() {
// 	http.HandleFunc(define.Version+"/workbook/guidGet", c.WkGuid)
// }

// //guid
// func (c *Http) WkGuid(res http.ResponseWriter, req *http.Request) {
// 	_, body := c.headCheck(res, req)
// 	if body == nil {
// 		return
// 	}
// 	rst, value := c.getGuid(body)
// 	c.sendBack(res, rst, value)
// }

//生成32位md5字串
func (c *Http) getMd5String(s string) string {
	h := md5.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}

//生成Guid字串
func (c *Http) makeGuid() string {
	tm := time.Now()
	return c.getMd5String(tm.String())
}

//获取消息结构体
// func (c *Http) getGuidStruct(body interface{}) (bool, define.C2SGuid) {
// 	var data define.C2SGuid
// 	err := json.Unmarshal(body.([]byte), &data)
// 	if err != nil {
// 		return false, data
// 	}
// 	return true, data
// }

// //生成guid
// func (c *Http) getGuid1(body []byte) (int, interface{}) {
// 	ok, data := c.getGuidStruct(body)
// 	if !ok {
// 		return define.Err_Ummarshal, ""
// 	}
// 	var rst define.S2CGuid
// }

func (c *Http) getGuid(guidType int) string {
	Guid := ""
	switch guidType {
	case TypeGuid_Pro:
		Guid = "P_" + c.makeGuid()
	case TypeGuid_File:
		Guid = "F_" + c.makeGuid()
	case TypeGuid_Dir:
		Guid = "D_" + c.makeGuid()
	}
	return Guid
}
func (c *Http) getGuidType(guid string) int {
	if guid == "" {
		return notepad.Err_guid
	}
	switch guid[0] {
	case 'P':
		return TypeGuid_Pro
	case 'D':
		return TypeGuid_Dir
	case 'F':
		return TypeGuid_File
	default:
		return notepad.Err_guid
	}
}
