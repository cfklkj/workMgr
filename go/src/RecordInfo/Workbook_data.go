package RecordInfo

import (
	"fmt"
	"io/ioutil"
	"os"
	"strings"

	"../Fly_file"
	"github.com/axgle/mahonia"
	_ "github.com/typa01/go-utils"
)

func ReadFiles() {
	checkDocumentPath(g_documentPath)
	checkDocumentPath(g_documentPathData)
	loadRootData()
	loadFolderData()
	loadFileData()
	loadLinkData()
}
func findTagIndex(guid string, tagInfo []TagInfo) int {
	for i, it := range tagInfo {
		if it.Guid == guid {
			return i
		}
	}
	return -1
}
func checkDocumentPath(path string) {
	_, err := os.Stat(path)
	if err == nil {
		return
	}
	err = os.Mkdir(path, os.ModePerm)
	if err != nil {
		fmt.Printf("mkdir failed![%v]\n", err)
	} else {
		fmt.Printf("mkdir success!\n")
	}
}

//keep
func keepRootData() {
	Fly_file.WriteJsonFile(g_rootData, &g_rootDataInfo)
}
func keepFolderData() {
	Fly_file.WriteJsonFile(g_folderData, &g_folderDataInfo)
}
func keepFileData() {
	Fly_file.WriteJsonFile(g_fileData, &g_fileDataInfo)
}
func keepLinkData() {
	Fly_file.WriteJsonFile(g_linkData, &g_linkDataInfo)
}

//load
func loadRootData() {
	err := Fly_file.ReadJsonFile(g_rootData, &g_rootDataInfo)
	if err != nil {
		fmt.Println("config load rootData failed")
	}
}
func loadFolderData() {
	err := Fly_file.ReadJsonFile(g_folderData, &g_folderDataInfo)
	if err != nil {
		fmt.Println("config load g_folderData failed")
	}
}
func loadFileData() {
	err := Fly_file.ReadJsonFile(g_fileData, &g_fileDataInfo)
	if err != nil {
		fmt.Println("config load g_fileData failed")
	}
}
func loadLinkData() {
	err := Fly_file.ReadJsonFile(g_linkData, &g_linkDataInfo)
	if err != nil {
		fmt.Println("config load g_linkData failed")
	}
}

//add tag
func addFolderTag(tagInfo TagInfo) bool {
	if strings.Contains(tagInfo.Guid, "D_") {
		if findTagIndex(tagInfo.Guid, g_folderDataInfo) > -1 {
			return false
		}
		g_folderDataInfo = append(g_folderDataInfo, tagInfo)
		return true
	}
	return false
}
func addFileTag(tagInfo TagInfo) bool {
	if strings.Contains(tagInfo.Guid, "F_") {
		if findTagIndex(tagInfo.Guid, g_fileDataInfo) > -1 {
			return false
		}
		g_fileDataInfo = append(g_fileDataInfo, tagInfo)
		return true
	}
	return false
}
func addRootTag(tagInfo TagInfo) bool {
	if strings.Contains(tagInfo.Guid, "P_") {
		if findTagIndex(tagInfo.Guid, g_rootDataInfo) > -1 {
			return false
		}
		g_rootDataInfo = append(g_rootDataInfo, tagInfo)
		return true
	}
	return false
}

//drop
func dropFolderTag(tagInfo TagInfo) bool {
	if strings.Contains(tagInfo.Guid, "D_") {
		index := findTagIndex(tagInfo.Guid, g_folderDataInfo)
		if index < 0 {
			return false
		}
		g_folderDataInfo = append(g_folderDataInfo[:index], g_folderDataInfo[index+1:]...)
		return true
	}
	return false
}
func dropFileTag(tagInfo TagInfo) bool {
	if strings.Contains(tagInfo.Guid, "F_") {
		index := findTagIndex(tagInfo.Guid, g_fileDataInfo)
		if index < 0 {
			return false
		}
		g_fileDataInfo = append(g_fileDataInfo[:index], g_fileDataInfo[index+1:]...)
		return true
	}
	return false
}
func dropRootTag(tagInfo TagInfo) bool {
	if strings.Contains(tagInfo.Guid, "P_") {
		index := findTagIndex(tagInfo.Guid, g_rootDataInfo)
		if index < 0 {
			return false
		}
		g_rootDataInfo = append(g_rootDataInfo[:index], g_rootDataInfo[index+1:]...)
		return true
	}
	return false
}

//alt
func altFolderTag(tagInfo TagInfo) bool {
	if strings.Contains(tagInfo.Guid, "D_") {
		index := findTagIndex(tagInfo.Guid, g_folderDataInfo)
		if index < 0 {
			return false
		}
		g_folderDataInfo[index] = tagInfo
		return true
	}
	return false
}
func altFileTag(tagInfo TagInfo) bool {
	if strings.Contains(tagInfo.Guid, "F_") {
		index := findTagIndex(tagInfo.Guid, g_fileDataInfo)
		if index < 0 {
			return false
		}
		g_fileDataInfo[index] = tagInfo
		return true
	}
	return false
}
func altRootTag(tagInfo TagInfo) bool {
	if strings.Contains(tagInfo.Guid, "P_") {
		index := findTagIndex(tagInfo.Guid, g_rootDataInfo)
		if index < 0 {
			return false
		}
		g_rootDataInfo[index] = tagInfo
		return true
	}
	return false
}

//get tag
func getFolderTag(guid string, rstInfo *TagInfo) bool {
	if strings.Contains(guid, "D_") {
		index := findTagIndex(guid, g_folderDataInfo)
		if index < 0 {
			return false
		}
		*rstInfo = g_folderDataInfo[index]
		return true
	}
	return false
}
func getFileTag(guid string, rstInfo *TagInfo) bool {
	if strings.Contains(guid, "F_") {
		index := findTagIndex(guid, g_fileDataInfo)
		if index < 0 {
			return false
		}
		*rstInfo = g_fileDataInfo[index]
		return true
	}
	return false
}
func getRootTag(guid string, rstInfo *TagInfo) bool {
	if strings.Contains(guid, "P_") {
		index := findTagIndex(guid, g_rootDataInfo)
		if index < 0 {
			return false
		}
		*rstInfo = g_rootDataInfo[index]
		return true
	}
	return false
}

//--linkdata
func getLinkData(guid string) []TagInfo {
	var tagInfo []TagInfo
	for _, value := range g_linkDataInfo {
		if value.Root == guid {
			for _, chileValue := range value.Chile {
				var tmpTag TagInfo
				if getFolderTag(chileValue, &tmpTag) {
					tagInfo = append(tagInfo, tmpTag)
				} else if getFileTag(chileValue, &tmpTag) {
					tagInfo = append(tagInfo, tmpTag)
				}
			}
			break
		}
	}
	return tagInfo
}

//--dirlist data
func addDirlist(guid string, name string) string {
	tagInfo := makeTagInfo(guid, name)
	if addFileTag(tagInfo) {
		keepFileData()
		return "true"
	}
	if addFolderTag(tagInfo) {
		keepFolderData()
		return "true"
	}
	return "false"
}
func dropDirlist(guid string, name string) string {
	tagInfo := makeTagInfo(guid, name)
	if dropFileTag(tagInfo) {
		keepFileData()
		return "true"
	}
	if dropFolderTag(tagInfo) {
		keepFolderData()
		return "true"
	}
	return "false"
}
func altDirlist(guid string, name string) string {
	tagInfo := makeTagInfo(guid, name)
	if altFileTag(tagInfo) {
		keepFileData()
		return "true"
	}
	if altFolderTag(tagInfo) {
		keepFolderData()
		return "true"
	}
	return "false"
}

//--txt
func OpenTxt(filePath string, isUnrecognizable bool) string {
	fileInfo, err := ioutil.ReadFile(filePath)
	if err != nil {
		return err.Error()
	}
	if isUnrecognizable {
		return string(fileInfo)
	} else {
		decoder := mahonia.NewDecoder("gb18030")
		return decoder.ConvertString(string(fileInfo))
	}
}

//get
func getTxtData(guid string) string {
	dirPth := g_documentPathData + guid
	return OpenTxt(dirPth, true)
}

//删除文本
func delTxtData(guid string) string {
	dirPth := g_documentPathData + guid
	err := os.Remove(dirPth)
	if err != nil {
		return "file remove Error!"
	} else {
		return "file remove OK!"
	}
}

//写入文本
func altTxtData(reqInfo C2SREQ_Txt) string {
	if findGuid(reqInfo.Guid) != true {
		return "false -1"
	}
	dirPth := g_documentPathData + reqInfo.Guid
	file, err := os.OpenFile(dirPth, os.O_WRONLY|os.O_TRUNC|os.O_CREATE, 0666)
	if err != nil {
		return "false -2"
	}
	defer file.Close()
	//  c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&gt;", ">", -1)
	//  c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&lt;", "<", -1)
	//  c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&amp;", "=", -1)
	file.WriteString(reqInfo.Value)
	return "true"
}
