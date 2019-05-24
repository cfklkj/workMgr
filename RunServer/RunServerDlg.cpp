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
void CRunServerDlg::setMbtn(ActBtn btn)
{ 
	m_btn = btn;
}
bool CRunServerDlg::isFreeBtn()
{
	if (m_btn == ActBtn::FREE)
		return true;
	return false;
}
bool CRunServerDlg::isNeedCreateRoom(CString token)
{ 
	int times = GetPrivateProfileInt(token, L"heart", 0, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str());
	int tick = time(NULL) - times;
	if(tick < 35)//  心跳差  50s
		return false;
	return true;
} 

CString CRunServerDlg::getCmdStr(CString token)
{
	if (m_btn == CREATEROOM)
	{
		m_btn = FREE;
		return createRoom(token);
	}
	if (m_btn == PUSH)
	{
		m_btn = FREE;
		return startPush(token);
	}
	if (m_btn == STOP)
	{
		m_btn = FREE;
		return stopPush(token);
	} 
	m_btn = FREE;
	return CString();
}
CString CRunServerDlg::getCmdStr(CString token, ActBtn oldBtn)
{
	if (oldBtn == CREATEROOM)
	{
		return createRoom(token);
	}
	if (oldBtn == DROPROOM)
	{
		return dropRoom(token);
	}
	if (oldBtn == PUSH)
	{ 
		return startPush(token);
	}
	if (oldBtn == STOP)
	{
		return stopPush(token);
	}
	if (oldBtn == HEART)
	{
		return heartBeat(token);
	}
	return CString();
}
CString CRunServerDlg::getCmdTip(CString token, ActBtn oldBtn, bool isStart)
{ 
	if (oldBtn == CREATEROOM)
	{ 
		if (isStart)
		{
			return token + " 请求创建直播间！ 请稍后。。。。\r\n"; 
		}
		else
		{
			CString rst = token + " 结束请求创建直播间！\r\n";
			std::string logFile = g_ffmpeg.path + "\\roomInfo_" + Fly_string::w2c(token) + ".log";
			std::string logInfo = Fly_string::UTF8ToGBK(Fly_file::File::catFile(logFile).c_str());   
			if (!checkRoomOk(false))
			{ 
				forceStopPush(token, false);
				return rst + logInfo.c_str() + "\r\n 请求失败， 请稍后重试。。\r\n";
			}
			return rst + logInfo.c_str() + "\r\n 恭喜请成功，可以推流了。。。\r\n";

		}
	}
	if (oldBtn == PUSH)
	{
		if (isStart)
		{
			m_oldReqPushTime[token] = time(NULL);
			return token + " 请求推流！推流中。。。\r\n";
		}
		else
		{
			std::string timeCount = Fly_Time::TIME::TickToTimeStr(time(NULL) - m_oldReqPushTime[token]);
			return token + " 结束推流!\r\n 用时---- " + timeCount.c_str() + "\r\n";
		}
	}
	if (oldBtn == HEART)
	{
		if (isStart)
		{
			return token + " 保持心跳！。。。\r\n";
		}
		else
		{  
			return token + " 已无心跳!\r\n";
		}
	}
	if (oldBtn == STOP)
	{
		if (isStart)
		{
			return token + " 请求结束推流！\r\n";
		}
		else
		{
			return token + " 结束停止推流请求!\r\n";
		}
	} 
	return CString();
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
	ON_BN_CLICKED(IDC_RUN, &CRunServerDlg::OnBnClickedRunOrStop)
	ON_NOTIFY(NM_CLICK, IDC_TREE1, &CRunServerDlg::OnClickTree1)
	ON_WM_CTLCOLOR()
	ON_BN_CLICKED(IDC_RUN2, &CRunServerDlg::OnBnClickedClear)
	ON_BN_CLICKED(IDC_CHECK1, &CRunServerDlg::OnClickedCheck1)
	ON_BN_CLICKED(IDC_Allrun, &CRunServerDlg::OnBnClickedAllrun)
	ON_BN_CLICKED(IDC_AllStop, &CRunServerDlg::OnBnClickedAllstop) 
	ON_BN_CLICKED(IDC_CreateRoom, &CRunServerDlg::OnBnClickedCreateroom)
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
		CString token = L"";
		if (dlg.DoModal() == IDOK)
		{
			if (dlg.isTokenUp(token))
			{ 
				m_runCmd.selectItem = InsertTreeItem(m_tree, dlg.getServerName(), dlg.getToken());
				m_runCmd.status = btn_STOP;
				btnNormal(m_run);
				m_edit->SetWindowText(L"");
			} 
		} 
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_ALT) //修改服务节点
	{
		HTREEITEM item = m_runCmd.selectItem;
		int imgIndex = m_tree->GetItemData(item);
		if (imgIndex == ico_START)
		{
			MessageBox(L"请关闭推流服务后重试！", L"错误提示！");
			return 1;
		}

		CAddServerDlg dlg;
		CString token = getSelectItemChileName(m_tree);
		dlg.setToken(token);
		if (dlg.DoModal() == IDOK)
		{
			if (dlg.isTokenUp(token))
			{
				m_runCmd.selectItem = InsertTreeItem(m_tree, dlg.getServerName(), dlg.getToken());
				m_runCmd.status = btn_STOP;
				btnNormal(m_run);
				m_edit->SetWindowText(L"");
			}
			else
			{
				upSelectItemName(m_tree, dlg.getServerName());
			}
		}
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_info) //服务节点
	{
		CAddServerDlg dlg;
		CString token = getSelectItemChileName(m_tree);
		showIniSection(token);
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_DEL)  //删除服务节点
	{
		HTREEITEM item = m_runCmd.selectItem;
		int imgIndex = m_tree->GetItemData(item);
		if (imgIndex == ico_STOP || imgIndex == ico_START)
		{

			CString token = getSelectItemChileName(m_tree, item);
			dropRoom(token, false);
			forceStopPush(token, true);
			btnNormal(m_run);
			WritePrivateProfileString(token, NULL, NULL, g_configPath); 
			btnNormal(m_run); 
			m_tree->DeleteItem(item); 
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

std::map<CString, int> heartToken;

void keepHeartConsoleFFmpeg(LPARAM lParam)
{ 
	CRunServerDlg* pRun = (CRunServerDlg*)lParam;
	HTREEITEM curItem = pRun->m_runCmd.selectItem; 
	HTREEITEM chileItem = pRun->m_tree->GetChildItem(curItem);
	CString token = pRun->m_tree->GetItemText(chileItem);
	ActBtn oldBtn = HEART;
	//校验是否已有心跳
	for (auto v : heartToken)
	{
		if (v.first == token && v.second == 1)
		{
			return;
		}
	}
	heartToken[token] = 1;

	//show msg
	pRun->updateEditCtrlData(pRun->m_edit, pRun->getCmdTip(token, oldBtn, true), pRun->m_isLineScroll, false);
	pRun->btnDown(pRun->m_run);
	pRun->changeTreeIcon(pRun->m_tree, curItem, true);
	Fly_sys::Process::Run(Fly_string::w2c(pRun->getCmdStr(token, oldBtn)));
	while (!pRun->isNeedCreateRoom(token))
	{
		//request
		Sleep(30000);//  间隔30s
		Fly_sys::Process::Run(Fly_string::w2c(pRun->getCmdStr(token, oldBtn)));
	}
	//show msg
	pRun->btnNormal(pRun->m_run);
	pRun->changeTreeIcon(pRun->m_tree, curItem, false);
	pRun->updateEditCtrlData(pRun->m_edit, pRun->getCmdTip(token, oldBtn, false), pRun->m_isLineScroll, false);
	 
	pRun->forceStopPush(token, false); 
	pRun->dropRoom(token, false);

	heartToken[token] = 0;
}

void StopPush(LPARAM lParam)
{
	CRunServerDlg* pRun = (CRunServerDlg*)lParam;
	HTREEITEM curItem = pRun->m_runCmd.selectItem;
	HTREEITEM chileItem = pRun->m_tree->GetChildItem(curItem);
	CString token = pRun->m_tree->GetItemText(chileItem);
	Fly_sys::Process::Run(Fly_string::w2c(pRun->getCmdStr(token))); 
}

void useConsoleFFmpeg(LPARAM lParam)
{
	CRunServerDlg* pRun = (CRunServerDlg*)lParam;
	HTREEITEM curItem = pRun->m_runCmd.selectItem;
	CString serverName = pRun->m_tree->GetItemText(curItem);
	HTREEITEM chileItem = pRun->m_tree->GetChildItem(curItem);
	CString token = pRun->m_tree->GetItemText(chileItem);
	ActBtn oldBtn = pRun->getActBtn();
	std::string cmdStr = Fly_string::w2c(pRun->getCmdStr(token));
	//show msg
	pRun->updateEditCtrlData(pRun->m_edit, pRun->getCmdTip(token, oldBtn, true), pRun->m_isLineScroll, false);
	pRun->btnDown(pRun->m_run);
	pRun->changeTreeIcon(pRun->m_tree, curItem, true);
	if (oldBtn == PUSH)
	{
		pRun->forceStopPush(token, true);
		pRun->sendHeart(token, oldBtn); //保持心跳
	}
	//request
	Fly_sys::Process::Run(cmdStr);
	//show msg
	pRun->btnNormal(pRun->m_run);
	pRun->changeTreeIcon(pRun->m_tree, curItem, false);
	pRun->updateEditCtrlData(pRun->m_edit, pRun->getCmdTip(token, oldBtn, false), pRun->m_isLineScroll, false);
}

void GetRunInfo1(LPARAM lParam)
{
	CRunServerDlg* pRun = (CRunServerDlg*)lParam;
	HTREEITEM curItem = pRun->m_runCmd.selectItem;
	CString serverName = pRun->m_tree->GetItemText(curItem);
	HTREEITEM chileItem = pRun->m_tree->GetChildItem(curItem);
	CString token = pRun->m_tree->GetItemText(chileItem);
	CServer server;   
	if (!server.RunServer(serverName, pRun->getCmdStr(token),Fly_string::c2w( g_ffmpeg.path.c_str()).c_str()))
		return ;
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


void CRunServerDlg::sendHeart(CString token, ActBtn oldBtn)
{
	if (!isFreeBtn())
		return;
	if (oldBtn != PUSH)
		return; 
	HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)keepHeartConsoleFFmpeg, this, NULL, NULL);
	CloseHandle(hwnd);
}

void CRunServerDlg::forceStopPush(CString token, bool isWait)
{
	if (isWait)
	{ 
		Fly_sys::Process::Run(Fly_string::w2c(getCmdStr(token, STOP) + ",,1")); //结束已有
	}
	else
	{
		Fly_sys::Process::Run(Fly_string::w2c(getCmdStr(token, STOP))); //结束已有
	}
}

void CRunServerDlg::dropRoom(CString token, bool isWait)
{

	if (isWait)
	{ 
		Fly_sys::Process::Run(Fly_string::w2c(getCmdStr(token, DROPROOM) + ",,1")); //解散房间
	}
	else
	{
		Fly_sys::Process::Run(Fly_string::w2c(getCmdStr(token, DROPROOM))); //解散房间
	}
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
			if (!isFreeBtn())
				return;
			if (!checkRoomOk())
			{
				return;
			}
			setMbtn(PUSH);

			m_runCmd.status = btn_START;
			HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)useConsoleFFmpeg, this, NULL, NULL);
			CloseHandle(hwnd);
		}
		else if (imgIndex == ico_START)
		{

			int oldStatu = m_runCmd.status;
			m_runCmd.status = btn_AllPause;
			if (MessageBox(_T("确定停止推流?"), _T("警告"), MB_OKCANCEL) == IDOK) {
				m_runCmd.status = btn_STOP;
				setMbtn(STOP);
				HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)StopPush, this, NULL, NULL);
				CloseHandle(hwnd);
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
		}
		else if (imgIndex == ico_START)
		{
			m_runCmd.status = btn_SelectItem;
			if (m_runCmd.selectItem != curItem)
			{
				m_runCmd.selectItem = curItem;
				btnDown(m_run); 
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
	if (!sleepCount)
	{
		CDialogEx::OnCancel();

	}
	else if(MessageBox(_T("确定关闭服务程序?"), _T("警告"), MB_OKCANCEL) == IDOK) { 
		hCurItem = m_tree->GetChildItem(m_tree->GetRootItem());
		while (hCurItem)
		{
			int imgIndex = m_tree->GetItemData(hCurItem);
			if (imgIndex == ico_START)
			{
				CString token = getSelectItemChileName(m_tree, hCurItem);
				dropRoom(token, false);
				forceStopPush(token, true);
			}
			hCurItem = m_tree->GetNextSiblingItem(hCurItem);
		} 
		CDialogEx::OnCancel();
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
			HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)useConsoleFFmpeg, this, NULL, NULL);
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

		setMbtn(STOP);
	}
	else
	{
		m_runCmd.status = oldStatu;
	} 
}
 

CString CRunServerDlg::startPush(CString token)
{
	std::string lpCmd = g_ffmpeg.name; //Fly_string::c2w(g_ffmpeg.name.c_str()).c_str();
	lpCmd.append(",-s ");
	lpCmd.append(Fly_string::w2c(token));
	lpCmd.append(",");
	lpCmd.append(g_ffmpeg.path);
	lpCmd.append(",");
	lpCmd.append(",");
	lpCmd.append("1"); 

	return Fly_string::c2w(lpCmd.c_str()).c_str();
}

CString CRunServerDlg::stopPush(CString token)
{
	std::string lpCmd = g_ffmpeg.name; //Fly_string::c2w(g_ffmpeg.name.c_str()).c_str();
	lpCmd.append(",-e ");
	lpCmd.append(Fly_string::w2c(token));
	lpCmd.append(",");
	lpCmd.append(g_ffmpeg.path);
	return Fly_string::c2w(lpCmd.c_str()).c_str(); 
}

CString CRunServerDlg::heartBeat(CString token)
{
	std::string lpCmd = g_ffmpeg.name; //Fly_string::c2w(g_ffmpeg.name.c_str()).c_str();
	lpCmd.append(",-h ");
	lpCmd.append(Fly_string::w2c(token));
	lpCmd.append(",");
	lpCmd.append(g_ffmpeg.path);
	lpCmd.append(",");
	lpCmd.append(",1");
	return Fly_string::c2w(lpCmd.c_str()).c_str(); 
}
CString CRunServerDlg::dropRoom(CString token)
{
	std::string lpCmd = g_ffmpeg.name; //Fly_string::c2w(g_ffmpeg.name.c_str()).c_str();
	lpCmd.append(",-d ");
	lpCmd.append(Fly_string::w2c(token));
	lpCmd.append(",");
	lpCmd.append(g_ffmpeg.path);
	return Fly_string::c2w(lpCmd.c_str()).c_str();
}
CString CRunServerDlg::createRoom(CString token)
{ 
	std::string lpCmd = g_ffmpeg.name; //Fly_string::c2w(g_ffmpeg.name.c_str()).c_str();
	lpCmd.append(",-c ");
	lpCmd.append(Fly_string::w2c(token)); 
	lpCmd.append(",");
	lpCmd.append(g_ffmpeg.path);
	lpCmd.append(",");
	lpCmd.append(",");
	lpCmd.append("1");

	return Fly_string::c2w(lpCmd.c_str()).c_str(); 
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

bool CRunServerDlg::checkRoomOk(bool isTip)
{

	CString token = getSelectItemChileName(m_tree);  
	if (isNeedCreateRoom(token))
	{ 
		forceStopPush(token, false);
		dropRoom(token, false);
		isTip ?	MessageBox(L"请先创建直播间再重试！", L"提示") :0;
		return false;
	} 
	return true;
}

void CRunServerDlg::upRoomNew(CString token, bool isEnd)
{ 
}


void CRunServerDlg::OnBnClickedCreateroom()
{
	// TODO: 在此添加控件通知处理程序代码
	if (!isFreeBtn())
		return;
	if (checkRoomOk(false))
	{
		MessageBox(L"直播间已存在，无需创建！", L"提示");
		return;
	}
	setMbtn(CREATEROOM);
	HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)useConsoleFFmpeg, this, NULL, NULL);
	CloseHandle(hwnd); 
}
