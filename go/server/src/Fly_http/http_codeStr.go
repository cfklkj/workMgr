package Fly_http

var ErrStr = map[int]string{
	200:   "无错误",
	1001:  "请求错误",
	1002:  "协议错误",
	1003:  "协议错误",
	1004:  "解析错误",
	1005:  "guid没有该类型",
	1006:  "guid类型错误",
	1007:  "数据长度错误",
	1008:  "添加目录错误",
	1009:  "添加文件错误",
	1010:  "服务器token信息错误",
	1011:  "验证toen失败",
	20001: "id错误",
	20005: "文件id错误",
	20003: "删除文件失败",
	20002: "写入文件失败",
	20004: "读取文件失败",
}

func (c *Http) getCodeStr(code int) string {
	if value, ok := ErrStr[code]; ok {
		return value
	}
	return ""
}
