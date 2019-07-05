package RecordInfo

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
)

func onLinkData(res http.ResponseWriter, req *http.Request) bool {

	req.ParseForm()
	if strings.Contains(req.RequestURI, "act=linkData") {
		body, _ := ioutil.ReadAll(req.Body)
		exp := getDirlistReq(body)
		if exp.Act == "get" {
			rst := getLinkDataStr(exp)
			io.WriteString(res, rst)
		} else if exp.Act == "create" {
			rst := addlinkDirlist(exp.Parent, exp.Guid)
			io.WriteString(res, rst)
		} else if exp.Act == "drop" {
			rst := droplinkDirlist(exp.Parent, exp.Guid)
			io.WriteString(res, rst)
		} else if exp.Act == "swap" {
			rst := swaplinkDirlist(exp.Parent, exp.GuidA, exp.GuidB)
			io.WriteString(res, rst)
		} else if exp.Act == "mv" {
			rst := mvlinkDirlist(exp.Parent, exp.Guid, exp.ToParent)
			io.WriteString(res, rst)
		} else {
			io.WriteString(res, "erro msg")
		}
		return true
	}
	return false
}

func getLinkDataStr(req C2SREQ_Dirlist) string {
	data := getLinkData(req.Guid)
	if len(data) < 1 {
		return ""
	}
	dataStr, err := json.Marshal(&data)
	if err != nil {
		fmt.Println("getGuidInfo marsha error")
		return ""
	}
	return string(dataStr)
}
func addlinkDirlist(parentGuid string, guid string) string {
	isFind := false
	if findGuid(parentGuid) != true || findGuid(guid) != true {
		return "false -1"
	}
	//父目录必须是目录
	if findTagIndex(parentGuid, g_folderDataInfo) > -1 || findTagIndex(parentGuid, g_rootDataInfo) > -1 {

	} else {
		return "false -2"
	}
	//父目录下只能是子目录
	if findTagIndex(parentGuid, g_rootDataInfo) > -1 &&
		findTagIndex(guid, g_folderDataInfo) < 0 {
		return "false -3"
	}
	for index, value := range g_linkDataInfo {
		if value.Root == parentGuid {
			for _, chileValue := range g_linkDataInfo[index].Chile {
				if chileValue == guid {
					return "false -4"
				}
			}
			g_linkDataInfo[index].Chile = append(g_linkDataInfo[index].Chile, guid)
			isFind = true
			keepLinkData()
			break
		}
	}
	if !isFind {
		var linkInfo LinkInfo
		linkInfo.Root = parentGuid
		linkInfo.Chile = append(linkInfo.Chile, guid)
		g_linkDataInfo = append(g_linkDataInfo, linkInfo)
		keepLinkData()
	}
	return "true"
}
func droplinkDirlist(parentGuid string, guid string) string {
	//父目录必须是目录
	if findTagIndex(parentGuid, g_folderDataInfo) > -1 || findTagIndex(parentGuid, g_rootDataInfo) > -1 {

	} else {
		return "false -1"
	}
	//父目录下只能是子目录
	if findTagIndex(parentGuid, g_rootDataInfo) > -1 &&
		findTagIndex(guid, g_folderDataInfo) < 0 {
		return "false -2"
	}
	for index, value := range g_linkDataInfo {
		if value.Root == parentGuid {
			for indexChile, chileValue := range g_linkDataInfo[index].Chile {
				if chileValue == guid {
					g_linkDataInfo[index].Chile = append(g_linkDataInfo[index].Chile[:indexChile], g_linkDataInfo[index].Chile[indexChile+1:]...)
					keepLinkData()
					return "true"
				}
			}
			break
		}
	}
	return "false -0"
}

func swaplink(a, b *string) {

	*a, *b = *b, *a

}
func swaplinkDirlist(parentGuid string, guidA string, guidB string) string {
	indexParent := -1
	indexA := -1
	indexB := -1
	for index, value := range g_linkDataInfo {
		if value.Root == parentGuid {
			indexParent = index
			for indexChile, chileValue := range g_linkDataInfo[index].Chile {
				if chileValue == guidA {
					indexA = indexChile
				}
				if chileValue == guidB {
					indexB = indexChile
				}
			}
			break
		}
	}
	if indexA > -1 && indexB > -1 {
		swaplink(&g_linkDataInfo[indexParent].Chile[indexA], &g_linkDataInfo[indexParent].Chile[indexB])
		return "true"
	}
	return "false"
}

func mvlinkDirlist(parentGuid string, guid string, toParentGuid string) string {

	//父目录下只能是子目录
	if findTagIndex(toParentGuid, g_rootDataInfo) > -1 &&
		findTagIndex(guid, g_folderDataInfo) < 0 {
		return "false -4"
	}

	indexParent := findTagIndex(parentGuid, g_folderDataInfo)
	if indexParent < 0 {
		indexParent = findTagIndex(parentGuid, g_rootDataInfo)
	}
	if indexParent < 0 {
		return "false -1"
	}

	indexToParent := findTagIndex(toParentGuid, g_folderDataInfo)
	if indexToParent < 0 {
		indexToParent = findTagIndex(toParentGuid, g_rootDataInfo)
	}
	if indexToParent < 0 {
		return "false -2"
	}

	if droplinkDirlist(parentGuid, guid) != "true" {
		return "false -3"
	}

	return addlinkDirlist(toParentGuid, guid)
}
