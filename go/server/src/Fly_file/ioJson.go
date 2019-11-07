package Fly_file

//模块中要导出的函数，必须首字母大写。

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

func CatPath(pathName string) string {
	dir := "./document/"
	dir += pathName
	os.MkdirAll(dir, os.ModePerm)
	return dir
}

func ReadJsonFile(filePath string, v interface{}) error {
	data, err := ioutil.ReadFile(filePath)
	if err != nil {
		return err
	}
	err = json.Unmarshal(data, &v)
	if err != nil {
		fmt.Println("LoadDBlist config decode failed")
		return err
	}
	fmt.Println("config load suceess:", data)
	return nil
}

func WriteJsonFile(filePath string, v interface{}) error {
	data, err := json.Marshal(&v)
	if err != nil {
		fmt.Println("UpLoadConfig marsha error")
		return err
	}
	err = ioutil.WriteFile(filePath, data, os.ModeAppend)
	fmt.Println("config Upload :", string(data), " err:", err)
	return nil
}
