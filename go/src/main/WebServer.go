package main

import (
	"runtime"

	"../Fly_http"
)

var realPath string

func init() {
	runtime.GOMAXPROCS(runtime.NumCPU())
}

func main() {
	// LoadConfig("json/config.json");
	Fly_http.StartServer()
}
