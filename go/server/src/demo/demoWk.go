package main

import "fmt"

import "../notepad"

func main() {
	book := notepad.NewNotebook()
	dirName := "test"
	ret := book.GetGuids(dirName, "project")
	fmt.Println("getPros", ret)
	book.SetGuid(dirName, "P_1", "Hello")
	book.SetGuid(dirName, "D_1", "bbb")
	book.SetGuid(dirName, "D_2", "HHsd")
	book.Setlink(dirName, "D_1", "D_2")
	book.Setlink(dirName, "D_1", "D_1")
	book.Setlink(dirName, "D_1", "D_3")
	ret = book.GetGuids(dirName, "P_1")
	fmt.Println("GetGuids-P_1", ret)
	ret = book.GetGuids(dirName, "D_1")
	fmt.Println("GetGuids-D_1", ret)
}
