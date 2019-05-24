// CAddServerDlg.cpp: 实现文件
//

#include "stdafx.h"
#include "RunServer.h"
#include "CAddServerDlg.h"
#include "afxdialogex.h"
 


extern ConsoleFFmpeg g_ffmpeg =  ConsoleFFmpeg("ConsoleFFmpeg.exe");

//std::string path = "C:\\Users\\fly\\Downloads\\ffmpegDemo\\ffmpegDemo\\ConsoleFFmpeg\\bin\\";

extern CString g_configPath = Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str();
// CAddServerDlg 对话框

IMPLEMENT_DYNAMIC(CAddServerDlg, CDialogEx)

CAddServerDlg::CAddServerDlg(CWnd* pParent /*=nullptr*/)
	: CDialogEx(IDD_ADD, pParent)
{  
}

CAddServerDlg::~CAddServerDlg()
{
}

void CAddServerDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
}


BEGIN_MESSAGE_MAP(CAddServerDlg, CDialogEx)
	ON_BN_CLICKED(IDC_PathOpen, &CAddServerDlg::OnSetVideo)
	ON_BN_CLICKED(IDOK, &CAddServerDlg::OnBnClickedOk)
	ON_BN_CLICKED(IDC_PathOpen2, &CAddServerDlg::OnUpImg)
END_MESSAGE_MAP()


// CAddServerDlg 消息处理程序


void CAddServerDlg::OnSetVideo()
{
	// TODO: 在此添加控件通知处理程序代码
	CFileDialog dlg(TRUE, L"音频文件(*.wmv)|*.wmv", NULL,

		OFN_HIDEREADONLY | OFN_OVERWRITEPROMPT,

		L"音频文件(*.wmv)|*.wmv|(*.mp4)|*.mp4|(*.flv)|*.flv||", this);
	if (dlg.DoModal() == IDOK)
	{
		CString filePath = dlg.GetPathName();
		if (PathFileExists(filePath))
		{ 
			GetDlgItem(IDC_Video)->SetWindowText(filePath);
			WritePrivateProfileString(getToken(), L"video", filePath, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str());
		}
	}
} 

void CAddServerDlg::OnBnClickedOk()
{
	// TODO: 在此添加控件通知处理程序代码 
	if (getUpServerName().IsEmpty())
	{ 
		MessageBox(L"填写信息错误！请重试");
		return;
	}
	keepOtherCtl(); 
	CDialogEx::OnOK();
}
CString CAddServerDlg::getServerName()
{
	return m_serverName;
} 
void CAddServerDlg::InitCtrl()
{
	GetDlgItem(IDC_Token)->SetWindowText(m_token);

	wchar_t picture[512] = { 0 };
	if (GetPrivateProfileString(getToken(), L"picture", L"", picture, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		GetDlgItem(IDC_Picture)->SetWindowText(picture);
	}

	wchar_t name[512] = { 0 };
	if (GetPrivateProfileString(getToken(), L"name", L"", name, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		GetDlgItem(IDC_Rname)->SetWindowText(name);
	}

	wchar_t pay[512] = { 0 };
	if (GetPrivateProfileString(getToken(), L"pay", L"", pay, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		GetDlgItem(IDC_Pay)->SetWindowText(pay);
	}

	wchar_t type[512] = { 0 };
	if (GetPrivateProfileString(getToken(), L"type", L"", type, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		GetDlgItem(IDC_Rtype)->SetWindowText(type);
	}

	wchar_t key[512] = { 0 };
	if (GetPrivateProfileString(getToken(), L"key", L"", key, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		GetDlgItem(IDC_Key)->SetWindowText(key);
	}

	wchar_t count[512] = { 0 };
	if (GetPrivateProfileString(getToken(), L"count", L"", count, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		GetDlgItem(IDC_Pcount)->SetWindowText(count);
	}

	wchar_t video[512] = { 0 };
	if (GetPrivateProfileString(getToken(), L"video", L"", video, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		GetDlgItem(IDC_Video)->SetWindowText(video);
	}
}

bool CAddServerDlg::getPicture(CString filePath)
{   
	std::string params =  Fly_string::w2c(getToken()) + " " + Fly_string::w2c(filePath);
	std::string cmdUrl = g_ffmpeg.name;
	cmdUrl.append(",");
	cmdUrl.append(" -u ");
	cmdUrl.append(params);
	cmdUrl.append(",");
	cmdUrl.append(g_ffmpeg.path);
	cmdUrl.append(",");
	cmdUrl.append(",");  
	cmdUrl.append("1");
	Fly_sys::Process::Run(cmdUrl); 

	wchar_t picture[512] = { 0 };
	if (GetPrivateProfileString(getToken(), L"picture", L"", picture, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()) < 4)
	{
		MessageBox(L"上传图片失败-请重试！", L"错误提示！");
		return false;
	}
	GetDlgItem(IDC_Picture)->SetWindowText(picture);
	return true;
}

void CAddServerDlg::keepOtherCtl()
{ 
	GetDlgItem(IDC_Token)->GetWindowText(m_token); 

	CString t_name;
	GetDlgItem(IDC_Rname)->GetWindowText(t_name);
	WritePrivateProfileString(getToken(), L"name", t_name, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str());


	CString t_pay;
	GetDlgItem(IDC_Pay)->GetWindowText(t_pay);
	WritePrivateProfileString(getToken(), L"pay", t_pay, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str());


	CString t_type;
	GetDlgItem(IDC_Rtype)->GetWindowText(t_type);
	WritePrivateProfileString(getToken(), L"type", t_type, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str());


	CString t_key;
	GetDlgItem(IDC_Key)->GetWindowText(t_key);
	WritePrivateProfileString(getToken(), L"key", t_key, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str());


	CString t_count;
	GetDlgItem(IDC_Pcount)->GetWindowText(t_count);
	WritePrivateProfileString(getToken(), L"count", t_count, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str());

	CString t_picture;
	GetDlgItem(IDC_Picture)->GetWindowText(t_picture);
	WritePrivateProfileString(getToken(), L"picture", t_picture, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str());

	CString t_video;
	GetDlgItem(IDC_Video)->GetWindowText(t_video);
	WritePrivateProfileString(getToken(), L"video", t_video, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str());
	 

}

CString CAddServerDlg::getUpToken()
{
	CString t_token;
	GetDlgItem(IDC_Token)->GetWindowText(t_token);
	return t_token;
}

CString CAddServerDlg::getUpServerName()
{ 
	GetDlgItem(IDC_Rname)->GetWindowText(m_serverName);
	return m_serverName;
}


void CAddServerDlg::OnUpImg()
{
	// TODO: 在此添加控件通知处理程序代码
	if (getUpToken().IsEmpty())
	{
		MessageBox(L"请先填写token", L"提示！");
		return;
	}

	// TODO: 在此添加控件通知处理程序代码
	CFileDialog dlg(TRUE, L"图片(*.jpg)|*.jpg", NULL,

		OFN_HIDEREADONLY | OFN_OVERWRITEPROMPT,

		L"图片(*.jpg)|*.jpg||", this);
	if (dlg.DoModal() == IDOK)
	{
		CString filePath = dlg.GetPathName();
		if (PathFileExists(filePath))
		{
			getPicture(filePath); 
		}
	}
}


BOOL CAddServerDlg::OnInitDialog()
{
	CDialogEx::OnInitDialog();

	// TODO:  在此添加额外的初始化
	InitCtrl();
	return TRUE;  // return TRUE unless you set the focus to a control
				  // 异常: OCX 属性页应返回 FALSE
}
