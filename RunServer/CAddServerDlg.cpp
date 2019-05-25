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

void CAddServerDlg::initTypeCombox()
{
	CComboBox * combox = (CComboBox*)GetDlgItem(IDC_Rtype);
	TypeInfo info;
	info.name = "后台直播公开群";
	info.type = 30;
	m_typeCombox[0] = info;
	combox->InsertString(0, info.name);
	info.name = "后台直播单次收费";
	info.type = 40;
	m_typeCombox[1] = info;
	combox->InsertString(1, info.name);
	info.name = "后台直播分钟收费";
	info.type = 46;
	m_typeCombox[2] = info;
	combox->InsertString(2, info.name); 
}

int CAddServerDlg::getComboxTypeIndex(int type)
{
	for (auto v : m_typeCombox)
	{
		if (v.second.type == type)
		{
			return v.first;
		}
	}
	return 0;
}

int CAddServerDlg::getComboxType(int index)
{
	for (auto v : m_typeCombox)
	{
		if (v.first == index)
		{
			return v.second.type;
		}
	}
	return 30;
}

void CAddServerDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
}


BEGIN_MESSAGE_MAP(CAddServerDlg, CDialogEx)
	ON_BN_CLICKED(IDC_PathOpen, &CAddServerDlg::OnSetVideo)
	ON_BN_CLICKED(IDOK, &CAddServerDlg::OnBnClickedOk)
	ON_BN_CLICKED(IDC_PathOpen2, &CAddServerDlg::OnUpImg)
	ON_CBN_SELCHANGE(IDC_Rtype, &CAddServerDlg::OnSelchangeRtype)
	ON_BN_CLICKED(IDC_MovVideo, &CAddServerDlg::OnBnClickedMovvideo)
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

			CListBox *listBox = (CListBox*)GetDlgItem(IDC_Video);
			int count = listBox->GetCount();
			listBox->InsertString(count, filePath); 
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
	if (m_token.IsEmpty())
		return;
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
		CComboBox * combox = (CComboBox*)GetDlgItem(IDC_Rtype);
		int index = atoi(Fly_string::w2c(type).c_str());
		combox->SetCurSel(getComboxTypeIndex(index)); 
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

	wchar_t video[10242] = { 0 };
	if (GetPrivateProfileString(getToken(), L"video", L"", video, 10240, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		CListBox *listBox = (CListBox*)GetDlgItem(IDC_Video); 
		std::string tempBuff = Fly_string::w2c(video);
		for (int i = 1; ; i++)
		{
			CString value = L"";
			value = Fly_string::GetSubStr(tempBuff.c_str(), ",", i).c_str();
			if (value.IsEmpty())
				break;
			listBox->InsertString(i-1, value);
		}

	}
}

bool CAddServerDlg::getPicture(CString filePath)
{   
	std::string params =  Fly_string::w2c(getUpToken()) + " " + Fly_string::w2c(filePath);
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
		CString tip = L"上传图片失败-请重新填写 token key 等参数后重试！\r\n";
		tip += cmdUrl.c_str();
		MessageBox(tip, L"错误提示！");
		return false;
	}
	GetDlgItem(IDC_Picture)->SetWindowText(picture);
	return true;
}

void CAddServerDlg::keepOtherCtl()
{ 
	GetDlgItem(IDC_Token)->GetWindowText(getUpToken());

	CString t_name;
	GetDlgItem(IDC_Rname)->GetWindowText(t_name);
	WritePrivateProfileString(getToken(), L"name", t_name, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str());


	CString t_pay;
	GetDlgItem(IDC_Pay)->GetWindowText(t_pay);
	WritePrivateProfileString(getToken(), L"pay", t_pay, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str());


	CString t_type; 
	CComboBox * combox = (CComboBox*)GetDlgItem(IDC_Rtype);
	int index = combox->GetCurSel();
	t_type = Fly_string::format("%d", getComboxType(index)).c_str(); 
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


	CListBox *listBox = (CListBox*)GetDlgItem(IDC_Video);
	int count = listBox->GetCount(); 
	CString videoStr = L"";
	for (int i = 0; i < count; i++)
	{
		CString temp;
		listBox->GetText(i, temp);
		if (i > 0)
		{
			videoStr += ",";
		}
		videoStr += temp;
	} 
	WritePrivateProfileString(getToken(), L"video", videoStr, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()); 	 

}

CString CAddServerDlg::getUpToken()
{ 
	GetDlgItem(IDC_Token)->GetWindowText(m_token); 
	return m_token;
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
	initTypeCombox();
	InitCtrl(); 
	OnSelchangeRtype();
	return TRUE;  // return TRUE unless you set the focus to a control
				  // 异常: OCX 属性页应返回 FALSE
}


void CAddServerDlg::OnSelchangeRtype()
{
	// TODO: 在此添加控件通知处理程序代码
	CComboBox * combox = (CComboBox*)GetDlgItem(IDC_Rtype);
	int index = combox->GetCurSel();
	if (index == 0)
	{
		GetDlgItem(IDC_Pay)->SetWindowText(L"0");
		GetDlgItem(IDC_Pay)->EnableWindow(false);
	}
	else
	{ 
		GetDlgItem(IDC_Pay)->EnableWindow(true);
	}
}


void CAddServerDlg::OnBnClickedMovvideo()
{
	// TODO: 在此添加控件通知处理程序代码

	CListBox * combox = (CListBox*)GetDlgItem(IDC_Video);
	int index = combox->GetCurSel(); 
	if (index < 0)
	{
		MessageBox(L"请选择要移除的视频！", L"提示！");
		return;
	}
	combox->DeleteString(index);
}
