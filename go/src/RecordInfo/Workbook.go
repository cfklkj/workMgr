package RecordInfo

import (
	"net/http"
)

func OnWorkbook(res http.ResponseWriter, req *http.Request) {
	if getGuid(res, req) {
		return
	}

	if onProlist(res, req) {
		return
	}

	if onDirlist(res, req) {
		return
	}
	if onTxt(res, req) {
		return
	}
	if onLinkData(res, req) {
		return
	}
}
