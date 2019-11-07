package Fly_http

//版本
const (
	Version = "/v1"
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
	Err_null       = 0    //无错误
	Err_req        = 1002 //请求错误
	Err_MethodGet  = 1000 //协议错误
	Err_MethodPost = 1002 //协议错误
	Err_Ummarshal  = 1001 //解析错误
	Err_guidNoOpt  = 1101 //guid没有该类型
)

//返回信息通用结构体
type S2CBody struct {
	Code    int         //代码
	CodeMsg string      //代码说明
	Data    interface{} //数据
}
