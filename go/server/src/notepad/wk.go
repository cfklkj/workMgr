package notepad

import (
	"fmt"
	"io/ioutil"
	"os"
	"sync"

	"../Fly_file"
	_ "github.com/typa01/go-utils"
	"tzj.com/svr_logic/print"
)

type GuidInfo struct {
	Guid string
	Name string
}
type S2CGuidInfos struct {
	Guids []GuidInfo
}

const (
	FileName_data = "data.json"
	FileName_link = "link.json"
)
const (
	Err_null   = 0
	Err_guid   = 20001 //id错误
	Err_remove = 20003 //删除文件失败
	Err_write  = 20002 //写入文件失败
	Err_read   = 20004 //读取文件失败
)

type tagInfo struct {
	data map[string]string //guid:name
}
type linkInfo struct {
	data map[string][]string //parentGuid:[]guid
}
type proTags struct {
	dirName string
	data    tagInfo
	link    linkInfo
}

type Notebook struct {
	pro  map[string]*proTags //path:proTags
	lock sync.Mutex
}

//内存操作----------------------------------
//--data------------------------
func (c *tagInfo) init() {
	c.data = make(map[string]string)
}
func (c *tagInfo) setTag(data map[string]string) {
	c.data = data
}
func (c *tagInfo) addData(key, value string) {
	c.data[key] = value
}
func (c *tagInfo) getData(key string) *string {
	if value, ok := c.data[key]; ok {
		return &value
	}
	return nil
}
func (c *tagInfo) delData(key string) {
	delete(c.data, key)
}

//--link--------------------------
func (c *linkInfo) init() {
	c.data = make(map[string][]string)
}
func (c *linkInfo) setLinks(data map[string][]string) {
	c.data = data
}
func (c *linkInfo) addlinks(root, guid string) bool {
	if key, ok := c.data[root]; ok {
		for _, value := range key {
			if value != guid {
				continue
			} else {
				print.Println("addlinks", "err", c.data)
				return false
			}
		}
		c.data[root] = append(c.data[root], guid)
	} else {
		c.data[root] = []string{guid}
	}
	return true
}
func (c *linkInfo) getlinks(root string) []string {
	if key, ok := c.data[root]; ok {
		return key
	}
	return nil
}
func (c *linkInfo) dellink(root, guid string) {
	if key, ok := c.data[root]; ok {
		for index, value := range key {
			if value != guid {
				continue
			}
			c.data[root] = append(c.data[root][:index], c.data[root][index+1:]...)
			break
		}
	}
}
func (c *linkInfo) getGuidIndex(root, guid string) int {
	if key, ok := c.data[root]; ok {
		for index, value := range key {
			if value != guid {
				continue
			}
			return index
		}
	}
	return -1
}

//更改
func (c *linkInfo) changelink(rootA, rootB, guid string) bool {
	if rootA == rootB {
		return false
	}

	indexA := c.getGuidIndex(rootA, guid)
	if indexA == -1 {
		return false
	}
	indexB := c.getGuidIndex(rootB, guid)
	if indexB != -1 {
		return false
	}
	c.dellink(rootA, guid)
	c.addlinks(rootB, guid)
	return true
}
func swapDataInfo(a, b *string) {
	*a, *b = *b, *a
}

//交换
func (c *linkInfo) swaplink(root, guidA, guidB string) bool {
	if guidA == guidB {
		return false
	}
	indexA := c.getGuidIndex(root, guidA)
	if indexA == -1 {
		return false
	}
	indexB := c.getGuidIndex(root, guidB)
	if indexB == -1 {
		return false
	}
	swapDataInfo(&c.data[root][indexA], &c.data[root][indexB])
	return true
}

//-----proTags--------------------------
func NewProTags(dirName string) *proTags {
	ret := new(proTags)
	ret.dirName = dirName
	ret.data.init()
	ret.link.init()
	ret.loadFromFile()
	return ret
}

//file
func (c *proTags) keepToFile(file string, data interface{}) {
	path := Fly_file.CatPath(c.dirName) + "/" + file
	Fly_file.WriteJsonFile(path, data)
}
func (c *proTags) loadFromFile() {
	path := Fly_file.CatPath(c.dirName) + "/" + FileName_data
	Fly_file.ReadJsonFile(path, &c.data.data)
	path = Fly_file.CatPath(c.dirName) + "/" + FileName_link
	Fly_file.ReadJsonFile(path, &c.link.data)
}

//--set
func (c *proTags) AddGuid(guid, name string) {
	c.data.addData(guid, name)
	c.keepToFile(FileName_data, c.data.data)
}
func (c *proTags) AddLink(root, guid string) {
	if c.link.addlinks(root, guid) {
		c.keepToFile(FileName_link, c.link.data)
	}
}
func (c *proTags) SwapLink(root, guidA, guidB string) bool {
	if c.link.swaplink(root, guidA, guidB) {
		c.keepToFile(FileName_link, c.link.data)
		return true
	}
	return false
}
func (c *proTags) ChangeLink(rootA, rootB, guid string) bool {
	if c.link.changelink(rootA, rootB, guid) {
		c.keepToFile(FileName_link, c.link.data)
		return true
	}
	return false
}

//--get
func (c *proTags) GetGuids(guid string) S2CGuidInfos {
	var rstData S2CGuidInfos
	links := c.link.getlinks(guid)
	for _, value := range links {
		dt := c.data.getData(value)
		if dt != nil {
			rstData.Guids = append(rstData.Guids, GuidInfo{value, *dt})
		}
	}
	return rstData
}
func (c *proTags) GetGuid(guid string) GuidInfo {
	var data GuidInfo
	dt := c.data.getData(guid)
	if dt != nil {
		data = GuidInfo{guid, *dt}
	}
	return data
}

//获取文本
func (c *proTags) GetTxtData(guid string) (int, []byte) {
	if c.data.getData(guid) == nil {
		return Err_guid, nil
	}
	path := Fly_file.CatPath(c.dirName) + "/data/" + guid
	fileInfo, err := ioutil.ReadFile(path)
	if err != nil {
		return Err_read, nil
	}
	return Err_null, fileInfo
}

//删除文本
func (c *proTags) DelTxtData(guid string) int {
	if c.data.getData(guid) == nil {
		return Err_guid
	}
	c.data.delData(guid)
	path := Fly_file.CatPath(c.dirName) + "/data/" + guid
	err := os.Remove(path)
	if err != nil {
		return Err_remove
	} else {
		return Err_null
	}
}

//写入文本
func (c *proTags) SetTxtData(guid, data string) int {
	if c.data.getData(guid) == nil {
		return Err_guid
	}
	path := Fly_file.CatPath(c.dirName+"/data/") + guid
	file, err := os.OpenFile(path, os.O_WRONLY|os.O_TRUNC|os.O_CREATE, 0666)
	if err != nil {
		return Err_write
	}
	defer file.Close()
	//  c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&gt;", ">", -1)
	//  c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&lt;", "<", -1)
	//  c2sFileInfo.TxtInfo = strings.Replace(c2sFileInfo.TxtInfo , "&amp;", "=", -1)
	file.WriteString(data)
	return Err_null
}

//--notebook------------------------------
func NewNotebook() *Notebook {
	ret := new(Notebook)
	ret.pro = make(map[string]*proTags)
	return ret
}

//获取列表
func (c *Notebook) GetGuids(dirName, guid string) S2CGuidInfos {
	c.lock.Lock()
	defer c.lock.Unlock()
	key, ok := c.pro[dirName]
	if !ok { //没有需要初始化
		key = NewProTags(dirName)
		c.pro[dirName] = key
		print.Println("GetGuids", dirName)
		return key.GetGuids(guid)
	}
	return key.GetGuids(guid)
}

//设置guid信息
func (c *Notebook) SetGuid(dirName, guid, name string) bool {
	c.lock.Lock()
	defer c.lock.Unlock()
	key, ok := c.pro[dirName]
	if !ok {
		fmt.Println("setguid", "false")
		return false
	}
	key.AddGuid(guid, name)
	return true
}

//获取guid信息
func (c *Notebook) GetGuid(dirName, guid string) GuidInfo {
	c.lock.Lock()
	defer c.lock.Unlock()
	key, ok := c.pro[dirName]
	if !ok {
		fmt.Println("setguid", "false")
		return GuidInfo{}
	}
	return key.GetGuid(guid)
}

//设置联系
func (c *Notebook) Setlink(dirName, root, guid string) bool {
	c.lock.Lock()
	defer c.lock.Unlock()
	key, ok := c.pro[dirName]
	if !ok {
		print.Println("setlink", "false")
		return false
	}
	if root != guid {
		key.AddLink(root, guid)
		return true
	}
	fmt.Println("setlink", "false-2")
	return false
}

//交换联系
func (c *Notebook) Swaplink(dirName, root, guidA, guidB string) bool {
	c.lock.Lock()
	defer c.lock.Unlock()
	key, ok := c.pro[dirName]
	if !ok {
		fmt.Println("setlink", "false")
		return false
	}
	return key.SwapLink(root, guidA, guidB)
}

//改变联系
func (c *Notebook) Changelink(dirName, rootA, rootB, guid string) bool {
	c.lock.Lock()
	defer c.lock.Unlock()
	key, ok := c.pro[dirName]
	if !ok {
		fmt.Println("setlink", "false")
		return false
	}
	return key.ChangeLink(rootA, rootB, guid)
}

//设置文本
func (c *Notebook) SetTxt(dirName, guid, data string) int {
	c.lock.Lock()
	defer c.lock.Unlock()
	key, ok := c.pro[dirName]
	if !ok {
		fmt.Println("setlink", "false")
		return Err_guid
	}
	return key.SetTxtData(guid, data)
}

//删除
func (c *Notebook) DelTxt(dirName, guid string) {
	c.lock.Lock()
	defer c.lock.Unlock()
	key, ok := c.pro[dirName]
	if !ok {
		fmt.Println("setlink", "false")
		return
	}
	key.DelTxtData(guid)

}

//获取
func (c *Notebook) GetTxt(dirName, guid string) (int, interface{}) {
	c.lock.Lock()
	defer c.lock.Unlock()
	key, ok := c.pro[dirName]
	if !ok {
		fmt.Println("setlink", "false")
		return Err_guid, nil
	}
	return key.GetTxtData(guid)
}
