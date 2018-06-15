// RunServerDlg.cpp: 实现文件
//

#include "stdafx.h"
#include "RunServer.h"
#include "RunServerDlg.h"
#include "afxdialogex.h" 
#include "CAddServerDlg.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif


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
};

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
	ON_BN_CLICKED(IDC_RUN, &CRunServerDlg::OnBnClickedRunOrStop)
	ON_NOTIFY(NM_CLICK, IDC_TREE1, &CRunServerDlg::OnClickTree1)
	ON_WM_CTLCOLOR()
	ON_BN_CLICKED(IDC_RUN2, &CRunServerDlg::OnBnClickedClear)
	ON_BN_CLICKED(IDC_CHECK1, &CRunServerDlg::OnClickedCheck1)
	ON_BN_CLICKED(IDC_Allrun, &CRunServerDlg::OnBnClickedAllrun)
	ON_BN_CLICKED(IDC_AllStop, &CRunServerDlg::OnBnClickedAllstop) 
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
	initTreeCtrl(m_tree);
	m_edit->SetLimitText(-1);
	btnDisable(m_run);
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
	TreePopMenu(m_tree);
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
	if (pMsg->message == WM_LBUTTONDOWN || pMsg->message == WM_RBUTTONDOWN)
	{
		if(m_runCmd.status  == btn_START)
			m_runCmd.status = btn_LRBtnDown;
	}
	if (pMsg->hwnd == m_edit->m_hWnd &&  pMsg->message == WM_MOUSEHWHEEL || pMsg->message == WM_MOUSEWHEEL)  //edit滚动鼠标
	{
		m_runCmd.status = btn_MouseScroll;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_ADD) //添加服务节点
	{
		CAddServerDlg dlg;
		if (dlg.DoModal() == IDOK)
		{
			CServer::AddServer(dlg.getServerName(), dlg.getFilePath());
			m_runCmd.selectItem = InsertTreeItem(m_tree, dlg.getServerName(), dlg.getFilePath());
			m_runCmd.status = btn_STOP;
			btnNormal(m_run);
			m_edit->SetWindowText(L"");
		} 
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_DEL)  //删除服务节点
	{
		HTREEITEM item = m_runCmd.selectItem;
		int imgIndex = m_tree->GetItemData(item);
		if (imgIndex == ico_STOP || imgIndex == ico_START)
		{
			m_runCmd.status = btn_STOP;
			CString itemText = m_tree->GetItemText(item);
			btnNormal(m_run);
			m_edit->SetWindowText(L"");
			m_tree->DeleteItem(item);
			CServer::DelServer(itemText);
		} 
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_exp)  //打开服务目录
	{
		CString itemText = m_tree->GetItemText(m_tree->GetSelectedItem());
		ShellExecute(m_hWnd, L"open", itemText, NULL, NULL, SW_SHOW); 
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_EXEPATH) //打开程序目录
	{
		WCHAR path[MAX_PATH];
		GetModuleFileName(NULL, path, MAX_PATH);
		wchar_t *wtemp = wcsrchr(path, '\\');
		*wtemp = 0;
		ShellExecute(this->m_hWnd, L"open", path, NULL, NULL, SW_SHOW); 
	}  
	return CDialogEx::PreTranslateMessage(pMsg);
}

void GetRunInfo(LPARAM lParam)
{
	CRunServerDlg* pRun = (CRunServerDlg*)lParam;
	HTREEITEM curItem = pRun->m_runCmd.selectItem;
	CString serverName = pRun->m_tree->GetItemText(curItem);
	CServer server; 
	if (!server.RunServer(serverName))
		return;
	CString *keepReadBuff = new (CString);
	*keepReadBuff = "";
	CString *tempBuff = NULL;
	bool isChangeSelect = true;  
	bool useExit = false;
	bool isHaveData = false;
	bool isMouseMove = false;
	bool isScrollBake = false;
	int  thisStrLine = 0;
	pRun->btnDown(pRun->m_run);
	pRun->changeTreeIcon(pRun->m_tree, curItem, true);
	while (server.IsServerRun(serverName) && !useExit)
	{
		if (pRun->m_runCmd.status == btn_AllSTOP)
		{
			useExit = true;
			continue;
		}
		if (pRun->m_runCmd.status == btn_AllPause)
		{
			Sleep(100);
			continue;
		}
		char* runInfo = server.getPrintInfo(serverName);
		CString tempRead = L"";
		if (runInfo)   //更新数据到内存 
		{
			isHaveData = true;
			tempRead = runInfo;
			tempRead.Replace(L"\r\n", L"\n");
			thisStrLine += tempRead.Replace(L"\n", L"\r\n"); 
			if (pRun->updateEditStack(keepReadBuff, &tempRead, thisStrLine))
			{
				isScrollBake = true;
			}
		}
		if (curItem != pRun->m_runCmd.selectItem) //不是选中服务节点
		{
			Sleep(100);
			continue;
		} 
		if (pRun->m_runCmd.status == btn_STOP)
		{ 
			pRun->m_runCmd.status = btn_START;
			break;
		}
		//用户可选操作
		switch (pRun->m_runCmd.status)
		{  
		case btn_STOP:
		{ 
			pRun->m_runCmd.status = btn_START;
			useExit = true; 
		}continue;
		case btn_SelectItem://选择服务节点  
		{
			isChangeSelect = true;
		}
		case btn_CheckAutoScroll: //选择或取消自动滚动  
		case btn_MouseScroll://用户滚动鼠标 
		case btn_LRBtnDown: //鼠标点击
		{
			pRun->m_runCmd.status = btn_START;
			Sleep(100);
		}continue;
		case btn_Clear://清空显示
		{
			*keepReadBuff = "";
			pRun->m_runCmd.status = btn_START; 
		}continue;
		} 
		if (isScrollBake || isChangeSelect)
		{
			pRun->updateEditCtrlData(pRun->m_edit, *keepReadBuff, pRun->m_isLineScroll, isScrollBake);
			isScrollBake = false;
			isChangeSelect = false;
			continue;
		}
		if(isHaveData)
		{ 
			pRun->updateEditCtrlData(pRun->m_edit, tempRead, pRun->m_isLineScroll, isScrollBake);
			isHaveData = false; 
		}
	}
	delete keepReadBuff;
	server.StopServer(serverName);
	pRun->btnNormal(pRun->m_run);
	pRun->changeTreeIcon(pRun->m_tree, curItem, false);
}


void CRunServerDlg::OnBnClickedRunOrStop()
{
	// TODO: 在此添加控件通知处理程序代码
	HTREEITEM curItem = m_runCmd.selectItem;
	if (curItem != NULL)
	{
		int imgIndex = m_tree->GetItemData(curItem);
		if (imgIndex == ico_STOP)
		{
			m_runCmd.status = btn_START;
			HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)GetRunInfo, this, NULL, NULL);
			CloseHandle(hwnd);
		}
		else if (imgIndex == ico_START)
		{
			int oldStatu = m_runCmd.status;
			m_runCmd.status = btn_AllPause;
			if (MessageBox(_T("确定停止服务?"), _T("警告"), MB_OKCANCEL) == IDOK) {
				m_runCmd.status = btn_STOP;
			}
			else
			{
				m_runCmd.status = oldStatu;
			}
		}
	}
}


void CRunServerDlg::OnClickTree1(NMHDR *pNMHDR, LRESULT *pResult)
{
	// TODO: 在此添加控件通知处理程序代码  
	*pResult = 0;
	HTREEITEM curItem = GetSelectTree(m_tree);
	if (curItem != NULL)
	{
		int oldStatu = m_runCmd.status;  
		int imgIndex = m_tree->GetItemData(curItem);
		if (imgIndex == ico_STOP)
		{
			if (m_runCmd.selectItem != curItem)
			{
				m_runCmd.selectItem = curItem;
			}
			btnNormal(m_run);
			m_edit->SetWindowText(L""); 
		}
		else if (imgIndex == ico_START)
		{
			m_runCmd.status = btn_SelectItem;
			if (m_runCmd.selectItem != curItem)
			{
				m_runCmd.selectItem = curItem;
				btnDown(m_run);
				m_edit->SetWindowText(L"");
			}
			else
			{
				m_runCmd.status = oldStatu;
			} 
		}
		else
			btnDisable(m_run);

	}else
		btnDisable(m_run);
}


void CRunServerDlg::OnCancel()
{
	// TODO: 在此添加专用代码和/或调用基类
	HTREEITEM hCurItem = m_tree->GetChildItem(m_tree->GetRootItem());
	int sleepCount = 0;
	while (hCurItem)
	{
		int imgIndex = m_tree->GetItemData(hCurItem);
		if (imgIndex == ico_START)
		{
			sleepCount++;
		}
		hCurItem = m_tree->GetNextSiblingItem(hCurItem);
	}
	int oldStatu = m_runCmd.status;
	m_runCmd.status = btn_AllPause;
	if (!sleepCount)
	{
		CDialogEx::OnCancel();

	}
	else if(MessageBox(_T("确定关闭服务程序?"), _T("警告"), MB_OKCANCEL) == IDOK) {
		m_runCmd.status = btn_AllSTOP;
		TimeDelay(100 * sleepCount);
		CDialogEx::OnCancel();
	}
	else
	{
		m_runCmd.status = oldStatu;
	}
}





void CRunServerDlg::OnBnClickedClear()
{
	m_runCmd.status = btn_Clear;
	m_editStr = "";
	UpdateData(false); 
}


void CRunServerDlg::OnClickedCheck1()
{
	// TODO: 在此添加控件通知处理程序代码 	 
	m_isLineScroll = !m_isLineScroll;
	m_runCmd.status = btn_CheckAutoScroll; 
}





void CRunServerDlg::OnBnClickedAllrun()
{
	// TODO: 在此添加控件通知处理程序代码
	HTREEITEM hCurItem = m_tree->GetChildItem(m_tree->GetRootItem());
	while (hCurItem)
	{
		int imgIndex = m_tree->GetItemData(hCurItem);
		if (imgIndex == ico_STOP)
		{
			m_runCmd.selectItem = hCurItem;
			m_runCmd.status = btn_START;
			HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)GetRunInfo, this, NULL, NULL);
			TimeDelay(100);
			CloseHandle(hwnd);
		}
		hCurItem = m_tree->GetNextSiblingItem(hCurItem);
	}
	btnDisable(m_run);
}


void CRunServerDlg::OnBnClickedAllstop()
{
	// TODO: 在此添加控件通知处理程序代码
	int oldStatu = m_runCmd.status;
	m_runCmd.status = btn_AllPause;
	if (MessageBox(_T("确定停止所有服务?"), _T("警告"), MB_OKCANCEL) == IDOK) {
		m_runCmd.status = btn_AllSTOP;
	}
	else
	{
		m_runCmd.status = oldStatu;
	} 
}
 
