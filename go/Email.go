package main

import(    
    "github.com/go-gomail/gomail" 
    "log"
)   
 
//host "smtp.qq|163.com" port 465
func sendEmail(host string, port int, address string, password string, sendToAddress string, subject string, body string, attach string) {
    m := gomail.NewMessage()

    m.SetAddressHeader("From", address /*"发件人地址"*/, "发件人") // 发件人

    m.SetHeader("To",                                                            
        m.FormatAddress(sendToAddress, "收件人")) // 收件人
     m.SetHeader("Cc",
        m.FormatAddress(address, "收件人")) //抄送
    m.SetHeader("Bcc",
        m.FormatAddress(sendToAddress, "收件人")) //暗送

    m.SetHeader("Subject", subject)     // 主题

    //m.SetBody("text/html",xxxxx ") // 可以放html..还有其他的
    m.SetBody("text/html", body) // 正文
 
    if(attach != ""){
        m.Attach(attach)  //添加附件 
    }

    d := gomail.NewPlainDialer(host, port, address, password) // 发送邮件服务器、端口、发件人账号、发件人密码
    if err := d.DialAndSend(m); err != nil {
        log.Println("发送失败", err)
        return
    }

    log.Println("done.发送成功")
} 