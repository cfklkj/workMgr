package notepad

import (
	"encoding/base64" //https://www.cnblogs.com/unqiang/p/6677208.html
	"fmt"
	"io/ioutil"
	"os"
	"sync"

	"../Fly_file"
	_ "github.com/typa01/go-utils"
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
	Err_null        = 200   //无错误
	Err_guid        = 20001 //id错误
	Err_guidFile    = 20005 //文件id错误
	Err_remove      = 20003 //删除文件失败
	Err_write       = 20002 //写入文件失败
	Err_read        = 20004 //读取文件失败
	Err_changeSame  = 20006 //根目录相同
	Err_NoFindIndex = 20007 //当前目录没有找到目标
	Err_swapSame    = 20008 //交换的对象相同
)

type guidInfo struct {
	data map[string]string //guid:name
}
type linkInfo struct {
	data map[string][]string //parentGuid:[]guid
}
type proTags struct {
	dirName string
	guids   guidInfo
	link    linkInfo
}

type Notebook struct {
	pro  map[string]*proTags //path:proTags
	lock sync.Mutex
}

//内存操作----------------------------------
//--data------------------------
func (c *guidInfo) init() {
	c.data = make(map[string]string)
}
func (c *guidInfo) setTag(data map[string]string) {
	c.data = data
}
func (c *guidInfo) addData(key, value string) {
	c.data[key] = value
}
func (c *guidInfo) getData(key string) *string {
	if value, ok := c.data[key]; ok {
		return &value
	}
	return nil
}
func (c *guidInfo) delData(key string) {
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
				fmt.Println("addlinks", "err", c.data)
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
func (c *linkInfo) changelink(rootA, rootB, guid string) int {
	if rootA == "" || rootB == "" || guid == "" {
		return Err_guid
	}
	if rootA == rootB {
		return Err_changeSame
	}

	indexA := c.getGuidIndex(rootA, guid)
	if indexA == -1 {
		return Err_NoFindIndex
	}
	indexB := c.getGuidIndex(rootB, guid)
	if indexB != -1 {
		return Err_NoFindIndex
	}
	c.dellink(rootA, guid)
	c.addlinks(rootB, guid)
	return Err_null
}
func swapDataInfo(a, b *string) {
	*a, *b = *b, *a
}

//交换
func (c *linkInfo) swaplink(root, guidA, guidB string) int {
	if root == "" || guidB == "" || guidA == "" {
		return Err_guid
	}
	if guidA == guidB {
		return Err_swapSame
	}
	indexA := c.getGuidIndex(root, guidA)
	if indexA == -1 {
		return Err_NoFindIndex
	}
	indexB := c.getGuidIndex(root, guidB)
	if indexB == -1 {
		return Err_NoFindIndex
	}
	swapDataInfo(&c.data[root][indexA], &c.data[root][indexB])
	return Err_null
}

//-----proTags--------------------------
func NewProTags(dirName string) *proTags {
	ret := new(proTags)
	ret.dirName = dirName
	ret.guids.init()
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
	Fly_file.ReadJsonFile(path, &c.guids.data)
	path = Fly_file.CatPath(c.dirName) + "/" + FileName_link
	Fly_file.ReadJsonFile(path, &c.link.data)
}

//--set
func (c *proTags) AddGuid(guid, name string) {
	c.guids.addData(guid, name)
	c.keepToFile(FileName_data, c.guids.data)
}
func (c *proTags) AddLink(root, guid string) bool {
	if c.link.addlinks(root, guid) {
		c.keepToFile(FileName_link, c.link.data)
		return true
	}
	return false
}
func (c *proTags) SwapLink(root, guidA, guidB string) int {
	rst := c.link.swaplink(root, guidA, guidB)
	if rst == Err_null {
		c.keepToFile(FileName_link, c.link.data)
	}
	return rst
}
func (c *proTags) ChangeLink(rootA, rootB, guid string) int {
	rst := c.link.changelink(rootA, rootB, guid)
	if rst == Err_null {
		c.keepToFile(FileName_link, c.link.data)
	}
	return rst
}

//--get
func (c *proTags) GetGuids(guid string) S2CGuidInfos {
	var rstData S2CGuidInfos
	links := c.link.getlinks(guid)
	for _, value := range links {
		dt := c.guids.getData(value)
		if dt != nil {
			rstData.Guids = append(rstData.Guids, GuidInfo{value, *dt})
		}
	}
	return rstData
}
func (c *proTags) GetGuid(guid string) GuidInfo {
	var data GuidInfo
	dt := c.guids.getData(guid)
	if dt != nil {
		data = GuidInfo{guid, *dt}
	}
	return data
}

//获取文本
func (c *proTags) GetTxtData(guid string) (int, string) {
	if c.guids.getData(guid) == nil {
		return Err_guid, ""
	}
	path := Fly_file.CatPath(c.dirName) + "/data/" + guid
	fileInfo, err := ioutil.ReadFile(path)
	if err != nil {
		return Err_read, ""
	}
	encodeString := base64.StdEncoding.EncodeToString(fileInfo)
	return Err_null, encodeString
}

//删除文本
func (c *proTags) DelTxtData(guid string) int {
	if c.guids.getData(guid) == nil {
		return Err_guid
	}
	c.guids.delData(guid)
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
	if c.guids.getData(guid) == nil {
		return Err_guidFile
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

//获取对象
func (c *Notebook) GetNoteBook(dirName string) *proTags {
	c.lock.Lock()
	defer c.lock.Unlock()
	if dirName == "" {
		dirName = "tmp"
	}
	if key, ok := c.pro[dirName]; !ok {
		c.pro[dirName] = NewProTags(dirName)
		return c.pro[dirName]
	} else {
		return key
	}
}
