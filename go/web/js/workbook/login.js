

document.write('<script type="text/javascript" src="js/lib/FlyWeb.js"></script>')  //引入js 
document.write('<script type="text/javascript" src="js/workbook/post.js"></script>')   
document.write('<script type="text/javascript" src="js/lib/md5.js"></script>')   

g_post = 0
function main()
{
    initctl()
}

function initctl()
{    
    if(g_post) 
        return
    g_post = new Post()
    m_username = document.getElementById('username');  
    m_pwd = document.getElementById('pwd');  
}

function onLogin()
{
    initctl()
    if(m_username.value == "" || m_pwd.value == "")
    {
        alert("请输入用户信息！");
        return;
    }
    

    pwd = hex_md5(m_pwd.value);
    g_post.Login(m_username.value, pwd, loginStatu)
}
function loginStatu(res)
{
    if(res == "login")
    {
        location.reload() 
    }else
    {
        alert(res + "--please try again!")
    } 
}