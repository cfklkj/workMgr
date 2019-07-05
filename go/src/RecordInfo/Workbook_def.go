package RecordInfo

type TagInfo struct {
	Guid string
	Name string
}

type LinkInfo struct {
	Root  string
	Chile []string
}

type WORKBOOK struct {
	ProDir  string
	ProName string
}

type C2SGETTXT struct {
	ParentId       int
	FileId         int
	Unrecognizable bool
}
type C2SKEEPTXT struct {
	ParentId int
	FileId   int
	TxtInfo  string
}
type C2SGETJSON struct {
	JsonType string
}
type C2SUPJSON struct {
	JsonType string
	TxtInfo  string
}
type C2SPROINFO struct {
	ProType string
	ProName string
}

type C2SPACKAGE struct {
	Package string
	Source  string
}
type C2SREQ_Prolist struct {
	Act  string
	Guid string
	Name string
}
type C2SREQ_Txt struct {
	Act   string
	Guid  string
	Value string
}

type C2SREQ_Dirlist struct {
	Act      string
	Guid     string
	Name     string
	Type     string
	Parent   string
	GuidA    string
	GuidB    string
	ToParent string
}

var g_rootDataInfo []TagInfo
var g_folderDataInfo []TagInfo
var g_fileDataInfo []TagInfo
var g_linkDataInfo []LinkInfo

var g_documentPath = "./document"
var g_documentPathData = "./document/Data/"
var g_rootData = "./document/root.data"
var g_folderData = "./document/folder.data"
var g_fileData = "./document/file.data"
var g_linkData = "./document/link.data"
