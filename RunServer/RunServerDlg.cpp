// RunServerDlg.cpp: 实现文件
//

#include "stdafx.h"
#include "RunServer.h"
#include "RunServerDlg.h"
#include "afxdialogex.h" 
#include "CAddServerDlg.h" 
#include "ffmpegMgr.h"
#include "MenuAct.h"
#include "CCtrlData.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif


extern ConsoleFFmpeg g_ffmpeg;
extern CString g_configPath;

// CRunServerDlg 对话框
 

CRunServerDlg::CRunServerDlg(CWnd* pParent /*=nullptr*/)
	: CDialogEx(IDD_RUNSERVER_DIALOG, pParent)
{
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME); 
	m_isLineScroll = true;
	m_editHbrEdit = ::CreateSolidBrush(RGB(255, 255, 255));
}
CRunServerDlg::~CRunServerDlg() { 
	DeleteObject(m_editHbrEdit);
}  
 
;

void CRunServerDlg::DoDataExchange(CDataExchange* pDX)
{
	DDX_Text(pDX, IDC_LOG, m_editStr);
	m_editStr.Empty();
	CDialogEx::DoDataExchange(pDX);
}

BEGIN_MESSAGE_MAP(CRunServerDlg, CDialogEx)
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
	ON_NOTIFY(TVN_SELCHANGED, IDC_TREE1, &CRunServerDlg::OnTvnSelchangedTree1)
	ON_EN_CHANGE(IDC_LOG, &CRunServerDlg::OnEnChangeEdit1)
	ON_NOTIFY(NM_RCLICK, IDC_TREE1, &CRunServerDlg::OnRclickTree)  
	ON_WM_CTLCOLOR()
	ON_BN_CLICKED(IDC_RUN2, &CRunServerDlg::OnBnClickedClear)
	ON_BN_CLICKED(IDC_CHECK1, &CRunServerDlg::OnClickedCheck1)    
END_MESSAGE_MAP()


// CRunServerDlg 消息处理程序

BOOL CRunServerDlg::OnInitDialog()
{
	CDialogEx::OnInitDialog();
	// 设置此对话框的图标。  当应用程序主窗口不是对话框时，框架将自动
	//  执行此操作
	SetIcon(m_hIcon, TRUE);			// 设置大图标
	SetIcon(m_hIcon, FALSE);		// 设置小图标

									// TODO: 在此添加额外的初始化代码   
	m_tree = (CTreeCtrl*)GetDlgItem(IDC_TREE1);
	m_edit = (CEdit*)GetDlgItem(IDC_LOG);
	m_run = (CButton*)GetDlgItem(IDC_RUN);
	m_check = ((CButton*)GetDlgItem(IDC_CHECK1));
	m_check->SetCheck(m_isLineScroll);
	CCtrlData::instance()->initCtrl(m_tree, m_edit);
	m_edit->SetLimitText(-1); 
	 
	return TRUE;  // 除非将焦点设置到控件，否则返回 TRUE
}

// 如果向对话框添加最小化按钮，则需要下面的代码
//  来绘制该图标。  对于使用文档/视图模型的 MFC 应用程序，
//  这将由框架自动完成。 
void CRunServerDlg::OnPaint()
{
	if (IsIconic())
	{ 
		CPaintDC dc(this); // 用于绘制的设备上下文

		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);

						   // 使图标在工作区矩形中居中
		int cxIcon = GetSystemMetrics(SM_CXICON);
		int cyIcon = GetSystemMetrics(SM_CYICON);
		CRect rect;
		GetClientRect(&rect);
		int x = (rect.Width() - cxIcon + 1) / 2;
		int y = (rect.Height() - cyIcon + 1) / 2;

		// 绘制图标
		dc.DrawIcon(x, y, m_hIcon);

		//背景色
		//dc.FillSolidRect(&rect, RGB(214,211,206)); 
	}
	else
	{
		CDialogEx::OnPaint();
	}
}

HBRUSH CRunServerDlg::OnCtlColor(CDC* pDC, CWnd* pWnd, UINT nCtlColor)
{
	HBRUSH hbr = CDialogEx::OnCtlColor(pDC, pWnd, nCtlColor);

	if (pWnd->GetDlgCtrlID() == IDC_LOG)
	{ 
		pDC->SetBkColor(RGB(255, 255, 255));
		return  m_editHbrEdit;
	}
	// TODO:  如果默认的不是所需画笔，则返回另一个画笔
	return hbr;
}

//当用户拖动最小化窗口时系统调用此函数取得光标
//显示。
HCURSOR CRunServerDlg::OnQueryDragIcon()
{
	return static_cast<HCURSOR>(m_hIcon);
}

void CRunServerDlg::OnTvnSelchangedTree1(NMHDR *pNMHDR, LRESULT *pResult)
{
	LPNMTREEVIEW pNMTreeView = reinterpret_cast<LPNMTREEVIEW>(pNMHDR);
	// TODO: 在此添加控件通知处理程序代码
	*pResult = 0;
}


void CRunServerDlg::OnEnChangeEdit1()
{
	// TODO:  如果该控件是 RICHEDIT 控件，它将不
	// 发送此通知，除非重写 CDialogEx::OnInitDialog()
	// 函数并调用 CRichEditCtrl().SetEventMask()，
	// 同时将 ENM_CHANGE 标志“或”运算到掩码中。

	// TODO:  在此添加控件通知处理程序代码 
	 
}

//---------------------------------------------------------tree  
void CRunServerDlg::OnRclickTree(NMHDR *pNMHDR, LRESULT *pResult)
{ 
	// TODO: 在此添加控件通知处理程序代码 	 
	//临时鼠标的屏幕坐标，用来弹出menu
	CCtrlData::instance()->TreePopMenu(m_tree);
	 
	*pResult = 0;
}


BOOL CRunServerDlg::PreTranslateMessage(MSG* pMsg)
{
	// TODO: 在此添加专用代码和/或调用基类
	if (pMsg->message == WM_KEYDOWN && (pMsg->wParam == VK_RETURN || pMsg->wParam == VK_ESCAPE))
		return 1;
	if ((pMsg->message == WM_KEYDOWN || pMsg->message == WM_CHAR) && pMsg->hwnd == m_edit->m_hWnd)
	{
		return 1;
	} 
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_ADD) //添加服务节点
	{
		MenuAct::instance()->AddRoomInfo(this);
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_DEL)  //删除服务节点
	{	
		MenuAct::instance()->delRoomInfo(this);
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_ALT) //修改服务节点
	{
		MenuAct::instance()->alterRoomInfo(this);
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_info) //查看节点信息
	{
		MenuAct::instance()->lookRoomInfo(this);
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_create)  //准备-开播
	{
		MenuAct::instance()->readyPush(this);
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_drop)  //停止-销毁
	{ 
		MenuAct::instance()->dropPush(this);
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU2_allPush)  //停止-销毁
	{
		MenuAct::instance()->allPush();
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU2_allPushStop)  //停止-销毁
	{
		MenuAct::instance()->allPushStop();
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_EXEPATH) //打开程序目录
	{
		MenuAct::instance()->explorerThis();
	}  
	return CDialogEx::PreTranslateMessage(pMsg);
}  

void CRunServerDlg::OnCancel()
{
	// TODO: 在此添加专用代码和/或调用基类
	HTREEITEM hCurItem = m_tree->GetChildItem(m_tree->GetRootItem());
	int sleepCount = 0; 
	while (hCurItem)
	{ 
		if (CCtrlData::instance()->isPushStatu(hCurItem))
		{ 
			sleepCount++;
		}
		hCurItem = m_tree->GetNextSiblingItem(hCurItem);
	} 
	if (!sleepCount)
	{
		CDialogEx::OnCancel();

	}
	else if(MessageBox(_T("有房间正在开播，确定关闭?"), _T("警告"), MB_OKCANCEL) == IDOK) {
		ffmpegMgr::instance()->setCloseWindowValue();
		hCurItem = m_tree->GetChildItem(m_tree->GetRootItem());
		while (hCurItem)
		{
			if (CCtrlData::instance()->isPushStatu(hCurItem))
			{ 
				ffmpegMgr::instance()->dropPush(hCurItem);
			}
			hCurItem = m_tree->GetNextSiblingItem(hCurItem);
		}  
		CDialogEx::OnCancel();
	} 
} 

void CRunServerDlg::OnBnClickedClear()
{ 
	m_editStr = "";
	UpdateData(false); 
}


void CRunServerDlg::OnClickedCheck1()
{
	// TODO: 在此添加控件通知处理程序代码 	 
	m_isLineScroll = !m_isLineScroll; 
	CCtrlData::instance()->setIsScroll(m_isLineScroll);
}
 

void CRunServerDlg::showIniSection(CString token)
{
	CString showMsg = L"token:";
	showMsg.Append(token);

	wchar_t groupid[512] = { 0 };
	if (GetPrivateProfileString(token, L"groupid", L"", groupid, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		showMsg.Append(L"\r\ngroupid:");
		showMsg.Append(groupid);
	}

	wchar_t key[512] = { 0 };
	if (GetPrivateProfileString(token, L"key", L"", key, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{ 
		showMsg.Append(L"\r\n签名key:");
		showMsg.Append(key);
	}
	wchar_t name[512] = { 0 };
	if (GetPrivateProfileString(token, L"name", L"", name, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		showMsg.Append(L"\r\n房间名:");
		showMsg.Append(name);
	}

	wchar_t pay[512] = { 0 };
	if (GetPrivateProfileString(token, L"pay", L"", pay, 10, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{ 

		showMsg.Append(L"\r\n收费值:");
		showMsg.Append(pay);
	}

	wchar_t type[512] = { 0 };
	if (GetPrivateProfileString(token, L"type", L"", type, 10, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()) )
	{ 

		showMsg.Append(L"\r\n房间类型:");
		showMsg.Append(type);
	}



	wchar_t picture[512] = { 0 };
	if (GetPrivateProfileString(token, L"picture", L"", picture, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		showMsg.Append(L"\r\n网络图片路径:");
		showMsg.Append(picture);
	}

	wchar_t push[512] = { 0 };
	if (GetPrivateProfileString(token, L"push", L"", push, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{

		showMsg.Append(L"\r\n推流地址:");
		showMsg.Append(push);
	}

	wchar_t video[512] = { 0 };
	if (GetPrivateProfileString(token, L"video", L"", video, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		showMsg.Append(L"\r\n本地视频地址:");
		showMsg.Append(video);
		
	}



	wchar_t count[512] = { 0 };
	if (GetPrivateProfileString(token, L"count", L"", count, 10, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		showMsg.Append(L"\r\n循环推流次数:");
		showMsg.Append(count);
	}

	MessageBox(showMsg, L"房间信息...");
}
 
