package Fly_http

//版本
const (
	Version  = "/v1"
	TokenKey = "WSLKL10191112Fly"
)

// 目录
const (
	CSS_CLIENT_PATH   = "/css/"
	DART_CLIENT_PATH  = "/js/"
	IMAGE_CLIENT_PATH = "/image/"
	CSS_SVR_PATH      = "../web/"
	DART_SVR_PATH     = "../web/"
	IMAGE_SVR_PATH    = "../web/"
)

//Err
const (
	Err_null       = 200  //无错误
	Err_req        = 1001 //请求错误
	Err_MethodGet  = 1002 //协议错误
	Err_MethodPost = 1003 //协议错误
	Err_Ummarshal  = 1004 //解析错误
	Err_guidNoOpt  = 1005 //guid没有该类型
	Err_TypeGuid   = 1006 //guid类型错误
	Err_dataLen    = 1007 //数据长度错误
	Err_addDir     = 1008 //添加目录错误
	Err_addFile    = 1009 //添加文件错误
	Err_svrToken   = 1010 //服务器token信息错误
	Err_token      = 1011 //验证toen失败
)

//返回信息通用结构体
type S2CBody struct {
	Code    int         //代码
	CodeMsg string      //代码说明
	Data    interface{} //数据
}
