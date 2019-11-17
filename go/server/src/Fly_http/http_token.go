package Fly_http

import (
	"bufio"
	"fmt"
	"os"
)

//服务器生成token
func (c *Http) makeToken(proName string) string {
	value, _ := c.generateToken(proName, TokenKey)
	return value
}

func (c *Http) RunAdmin() {
	go c.runAdmin()
}

func (c *Http) runAdmin() {
	input := bufio.NewScanner(os.Stdin)
	fmt.Println("you can input to make a token")
	for input.Scan() {
		data := input.Text()
		if len(data) < 3 || len(data) > 32 {
			fmt.Println("please input proname -- len > 3 and len < 32")
			continue
		}
		fmt.Println(c.makeToken(data))
	}
}
