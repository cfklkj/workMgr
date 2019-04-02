package main

import(  
	"fmt"  
	"os" 
	"io/ioutil"
	"github.com/axgle/mahonia"
	"crypto/md5"
	"encoding/hex"
	"path/filepath"
)   

//读取文件
func OpenTxt(filePath string, isUnrecognizable bool)string{
    fileInfo, err := ioutil.ReadFile(filePath) 
    if err != nil {
        return  err.Error()
    }  
    if(isUnrecognizable){
        return string(fileInfo); 
    } else {        
        decoder := mahonia.NewDecoder("gb18030")
        return decoder.ConvertString(string(fileInfo));
    } 
}

//写文件
func writeFile(dirPth string, value string)string{
    file, err := os.OpenFile(dirPth, os.O_WRONLY|os.O_TRUNC|os.O_CREATE, 0666)
    if err != nil {
        return "open file " + dirPth + " failed.";
    }
    defer file.Close()
  //  c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&gt;", ">", -1)
  //  c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&lt;", "<", -1)
  //  c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&amp;", "=", -1)
    file.WriteString(value);
    return "keep file " + dirPth + " Ok";

}

//显示打印信息
func print(head, info string){ 
	fmt.Println(head);
	fmt.Printf(info);
	fmt.Println("");
}

// 生成32位MD5
func MD5(text string) string {
	ctx := md5.New()
	ctx.Write([]byte(text))
	return hex.EncodeToString(ctx.Sum(nil))
 }

 //文件路径
 func getThisPath() string{ 
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		fmt.Println("path eroo:"+dir)
		return "" 
	}
	return dir;
 }

 //创建目录
 func appendThisPath(chilePath string)string{
	 newPath := getThisPath() + "/" + chilePath;
	 os.Mkdir(newPath, os.ModePerm)
	 return newPath;
 }
 //获取目录信息 
func getDirList(dirpath string) ([]string, error) {
	var dir_list []string
	dir_err := filepath.Walk(dirpath,
		func(path string, f os.FileInfo, err error) error {
			if f == nil {
				return err
			}
			if f.IsDir() && (path != dirpath) {
				dir_list = append(dir_list, f.Name())
				return nil
			}

			return nil
		})
	return dir_list, dir_err
} 