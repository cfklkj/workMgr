package main

import (
	"runtime"

	"./src/Fly_http"
)

func init() {
	runtime.GOMAXPROCS(runtime.NumCPU()) //(调整并发的运行性能)
}

func main() {
	handle := Fly_http.NewHttp()
	handle.RunAdmin()
	handle.Listen()
}
