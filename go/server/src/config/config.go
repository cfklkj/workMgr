package config

import (
	"fmt"

	conf "../../util/config"
)

//-------config.jso  ------
type ConfigInfo struct {
	HttpIpPort  string `json:"httpPort"`
	DefaultHtml string `json:"DefaultHtml"`
}

type Config struct {
	info ConfigInfo
	cf   *conf.Config
}

func makeInfo() ConfigInfo {
	var info ConfigInfo
	info.HttpIpPort = "127.0.0.1:80"
	info.DefaultHtml = "workbook.html"
	return info
}

//初始化
func NewConfig() *Config {
	ret := new(Config)
	ret.cf = conf.NewConfig()
	ret.info = makeInfo()
	ret.Init()
	fmt.Println(ret.info)
	return ret
}

//初始化配置
func (c *Config) Init() {
	key := "my_http"
	if !c.cf.GetConfigInfo(key, &c.info) {
		c.cf.SetConfigInfo(key, &c.info)
	}
}

//获取配置信息
func (c *Config) GetConfigInfo() *ConfigInfo {
	return &c.info
}
