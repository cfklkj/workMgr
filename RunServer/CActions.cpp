#include "stdafx.h"
#include "CActions.h"
#include "resource.h"
#include "CAddServerDlg.h"

#pragma warning(disable:4996)
#define UPDATARATE 30

HTREEITEM m_select = NULL;
bool m_isLineScroll = true;  
CRITICAL_SECTION *para = NULL;
 
CString *m_logInfo;


struct STR_TREEINFO
{
	CString filePath;
	CString serverName;
	CWnd   *pWnd;
	CEdit   *showLogInfo;
	CTreeCtrl *serverTree;
	CButton *runButton;
	CString editShowBuff;
	HTREEITEM item;
	FILE* stream;

	int  imgIndex;
	bool isRun;
	bool isExit;
	int  showLine;
};

CActions::CActions()
{
	m_configPath = ".\\config.ini";
	InitializeCriticalSection(&m_para);
	para = &m_para; 
}
CActions::~CActions()
{

}
 
void CActions::SetTreeInfo(CString serverName, CString serverPath)
{  
	STR_TREEINFO treeInfo;
	treeInfo.serverName = serverName;
	treeInfo.filePath = serverPath;
	treeInfo.stream = NULL;
	treeInfo.isRun = false;
	treeInfo.isExit = true;
	treeInfo.pWnd = m_pWnd;
	treeInfo.showLogInfo = m_EditLog;
	treeInfo.runButton = m_run; 
	treeInfo.serverTree = m_actions;
	treeInfo.showLine = 0;
	treeInfo.item = m_actions->InsertItem((LPCTSTR)treeInfo.serverName, m_hItem);
	HTREEITEM tItem = m_actions->InsertItem((LPCTSTR)getDirFromFullPath(treeInfo.filePath), treeInfo.item);
	m_actions->SetItemImage(tItem, 3, 3);
	treeInfo.imgIndex = treeInfo.isRun ? 2 : 1;
	m_actions->SetItemImage(treeInfo.item, treeInfo.imgIndex, treeInfo.imgIndex);
	m_serverBuff[treeInfo.serverName] = treeInfo;
}
void CActions::writeLogToFile(STR_TREEINFO& tInfo, const char* data)
{
	
	const int maxLogFileSize = 1024 * 1024 * 7; //7M
	if (tInfo.stream)
	{
		fprintf(tInfo.stream, "%s", data);
		fflush(tInfo.stream);
	}

	if (tInfo.stream && ftell(tInfo.stream) > maxLogFileSize) {
		CString lpDirectory = getDirFromFullPath(tInfo.filePath);

		fclose(tInfo.stream);
		CString logPath = makeLogPath(lpDirectory, tInfo.serverName, c2w(GetDateString().c_str()));
		tInfo.stream = _wfsopen(logPath, L"w", _SH_DENYNO);
	}

}
void CActions::displayData(STR_TREEINFO & tInfo, const char * data)
{
	int lineCount = 0;
	int maxLogLen = 5000; //日志最大行值
	int maxShowLogLen = 20000;  //显示最大行值   

	STR_TREEINFO* LserverInfo = &tInfo;

	UINT MaxLenth = LserverInfo->showLogInfo->GetLimitText();

	//数据内存回滚
	CString tempRead = c2w(data, lineCount);
	// LserverInfo->showLogInfo->GetLineCount();  数据到大最大值后返回的数据有误
	tInfo.showLine += lineCount;
	if (tInfo.showLine < maxShowLogLen)
	{ 
		LserverInfo->editShowBuff += tempRead;
	}
	else
	{
		//在临时内存处理数据
		tempRead = LserverInfo->editShowBuff + tempRead;
		const wchar_t* tempLog = tempRead;
		int dropLine = maxShowLogLen - maxLogLen;
		tInfo.showLine -= dropLine;
		while (*tempLog && dropLine > 0)
		{
			if (*tempLog == '\n')
				dropLine--;
			tempLog++;
		}
		//更新显示数据
		LserverInfo->editShowBuff = tempLog;
	}
	//显示数据长度越界处理
	if (LserverInfo->item == m_select && m_logInfo)
	{
		int selPos = LserverInfo->editShowBuff.GetLength();
		if (selPos > MaxLenth) //增加edit 最大长度
		{
			MaxLenth += MaxLenth;
			LserverInfo->showLogInfo->SetLimitText(MaxLenth);
		}
	}
}
bool CActions::InitTree(CWnd *pWnd, int treeid)
{
	m_pWnd = pWnd; 
	m_actions = (CTreeCtrl*)m_pWnd->GetDlgItem(treeid);
	m_EditLog = (CEdit*)m_pWnd->GetDlgItem(IDC_LOG); 
	m_run = (CButton*)m_pWnd->GetDlgItem(IDC_RUN);
	((CButton*)m_pWnd->GetDlgItem(IDC_CHECK1))->SetCheck(m_isLineScroll);
	WCHAR Rbuff[MAX_PATH] = { 0 };
	if (m_actions)
	{
		//修改风格
		/*DWORD dwOriginalStyle = m_actions->GetStyle();
		m_actions->ModifyStyle(m_actions->m_hWnd, dwOriginalStyle,
			dwOriginalStyle | TVS_HASLINES, 0);*/

		m_hItem = m_actions->InsertItem(L"服务列表:", TVI_ROOT);
		int lenth = GetPrivateProfileSectionNames(Rbuff, MAX_PATH, m_configPath);
		for (int i = 0; i < lenth; i++)
		{
			CString serverName=L"";
			if (i == 0)
			{
				serverName = &Rbuff[i];
			}
			else if (Rbuff[i] == '\0')
			{
				serverName = &Rbuff[i + 1];
			}

			if (!serverName.IsEmpty())
			{
				WCHAR Rcbuff[MAX_PATH] = { 0 };
				if (GetPrivateProfileString(serverName, L"path", L"", Rcbuff, MAX_PATH, m_configPath))
				{ 
					SetTreeInfo(serverName, Rcbuff);
				}
			}
		}
		m_actions->Expand(m_hItem, TVE_EXPAND);
		SetImageList();
	}
	return m_actions == NULL;
}

HTREEITEM CActions::GetSelectTree()
{
	CPoint pt;
	GetCursorPos(&pt);//得到当前鼠标的位置
	m_actions->ScreenToClient(&pt);//将屏幕坐标转换为客户区坐标
	HTREEITEM tree_Item = m_actions->HitTest(pt);//调用HitTest找到对应点击的树节点
	return tree_Item;
}
void CActions::PopMenu()
{
	//获取到当前鼠标选择的树节点
	HTREEITEM CurTree = GetSelectTree();
	CMenu menu;
	menu.LoadMenuW(IDR_MENU1);
	CPoint ScreenPt;
	GetCursorPos(&ScreenPt);
	if (CurTree == m_hItem)
	{
		CMenu* pPopup = menu.GetSubMenu(1);//装载第一个子菜单，即我们菜单的第一列
		pPopup->TrackPopupMenu(TPM_LEFTALIGN, ScreenPt.x, ScreenPt.y, m_pWnd);//弹出菜单
		return;
	}
	if (CurTree != NULL)
	{
		m_select = CurTree;
		CString tServerName = m_actions->GetItemText(CurTree);
		m_actions->SelectItem(CurTree); //使右键单击的树节点被选中
		if (m_serverBuff[tServerName].serverName == tServerName)
		{
			CMenu* pPopup = menu.GetSubMenu(0);//装载第一个子菜单，即我们菜单的第一列
			pPopup->TrackPopupMenu(TPM_LEFTALIGN, ScreenPt.x, ScreenPt.y, m_pWnd);//弹出菜单
		}
		else
		{

			CMenu* pPopup = menu.GetSubMenu(2);//装载第一个子菜单，即我们菜单的第一列
			pPopup->TrackPopupMenu(TPM_LEFTALIGN, ScreenPt.x, ScreenPt.y, m_pWnd);//弹出菜单
		} 

	}
	else
	{
		CMenu* pPopup = menu.GetSubMenu(1);//装载第一个子菜单，即我们菜单的第一列
		pPopup->TrackPopupMenu(TPM_LEFTALIGN, ScreenPt.x, ScreenPt.y, m_pWnd);//弹出菜单
	}
}
void CActions::SetSelect()
{ 
	HTREEITEM curItem = GetSelectTree(); 
	if (curItem != NULL)
	{
		CString tServerName = m_actions->GetItemText(curItem);
		if (curItem != m_select && m_serverBuff[tServerName].serverName == tServerName)
		{ 
			m_select = NULL;
			m_logInfo = NULL; 
			m_select = curItem;  
		}
		else
		{ 
			return;
		}
		if (m_serverBuff[tServerName].isRun)
		{
			m_nVertPos = -1; 
			m_run->EnableWindow(true);
			m_run->SetWindowText(L"Stop");
		}
		else
		{
			m_run->SetWindowText(L"Run");
			m_EditLog->SetWindowTextW(L"");
			if (!m_serverBuff[tServerName].serverName.IsEmpty())
				m_run->EnableWindow(true);
			else
				m_run->EnableWindow(false);
		}

	}
	else
	{
		m_run->EnableWindow(false);
	}
}
void CActions::RunServer()
{
	HTREEITEM CurTree = m_select; 
	if (CurTree != NULL)
	{
		CString tServerName = m_actions->GetItemText(CurTree);
		if (!tServerName.IsEmpty() && m_serverBuff[tServerName].serverName == tServerName)
		{ 
			if (!m_serverBuff[tServerName].isRun)
			{
				m_serverBuff[tServerName].item = CurTree;
				HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)Run, &m_serverBuff[tServerName], NULL, NULL);
				CloseHandle(hwnd);  
			}
			else
			{
				if(m_pWnd->MessageBox(_T("确定停止服务?"), _T("警告"), MB_OKCANCEL) == IDOK) {
					m_serverBuff[tServerName].isRun = false;
				}				
			}
		}
	}
}

void CActions::AddInfo()
{
	STR_TREEINFO tInfo;
	CAddServerDlg dlg(&tInfo); 
	if (dlg.DoModal() == IDOK)
	{  
		SetTreeInfo(tInfo.serverName, tInfo.filePath);   
		WritePrivateProfileString(tInfo.serverName, L"path", tInfo.filePath, m_configPath);
		m_run->EnableWindow(true);
		m_run->SetWindowText(L"Run"); 
	}
}

void CActions::DelInfo()
{ 
	CButton *tButton = (CButton*)m_pWnd->GetDlgItem(IDC_RUN);
	if (m_select != NULL)
	{
		CString tServerName = m_actions->GetItemText(m_select);
		if (m_serverBuff[tServerName].serverName.IsEmpty())
		{
			return;
		}
		m_actions->DeleteItem(m_select);
		m_select = NULL;
		if (m_serverBuff[tServerName].isRun)
		{
			m_serverBuff[tServerName].isRun = false;
		}
		tButton->EnableWindow(false);
		tButton->SetWindowText(L"Run");
		WritePrivateProfileString(tServerName, NULL, NULL, m_configPath);
	}
}
void CActions::Explorer()
{
	if (m_select != NULL)
	{
		CString tServerName = m_actions->GetItemText(m_select); 
		ShellExecute(m_pWnd->m_hWnd, L"open", tServerName, NULL, NULL, SW_SHOW); 
	}
}

//https://blog.csdn.net/veryhehe2011/article/details/7964558
void CActions::SetImageList()
{
	m_img.Create(GetSystemMetrics(SM_CXSMICON),
		GetSystemMetrics(SM_CYSMICON),
		ILC_COLOR24, 50, 50);
	m_img.SetBkColor(GetSysColor(COLOR_WINDOW));
	const wchar_t* path = L"shell32.dll ";
	m_img.Add(ExtractIcon(AfxGetApp()->m_hInstance, path, 19));
	m_img.Add(ExtractIcon(AfxGetApp()->m_hInstance, path, 50));
	m_img.Add(ExtractIcon(AfxGetApp()->m_hInstance, path, 15));
	m_img.Add(ExtractIcon(AfxGetApp()->m_hInstance, path, 4));
	m_actions->SetImageList(&m_img, TVSIL_NORMAL);
}
void CActions::SetLineScroll(bool isScroll)
{
	m_isLineScroll = isScroll; 
}
 
void CActions::Close()
{ 
	HTREEITEM hCurItem = m_actions->GetChildItem(m_hItem);   
	while (hCurItem)
	{ 
		CString tServerName = m_actions->GetItemText(hCurItem);
		if (!tServerName.IsEmpty() && m_serverBuff[tServerName].serverName == tServerName)
		{
			if (m_serverBuff[tServerName].isRun)
			{
				m_serverBuff[tServerName].isRun = false;  
			}
		}
		hCurItem = m_actions->GetNextSiblingItem(hCurItem);
	}
	//等待线程结束
	hCurItem = m_actions->GetChildItem(m_hItem);
	while (hCurItem)
	{
		CString tServerName = m_actions->GetItemText(hCurItem);
		if (!tServerName.IsEmpty() && m_serverBuff[tServerName].serverName == tServerName)
		{ 
			if(!m_serverBuff[tServerName].isExit)
			{
			 	LeaveCriticalSection(para);
				TimeDelay(100);
				continue;
			}
		}
		hCurItem = m_actions->GetNextSiblingItem(hCurItem);
	}
	DeleteCriticalSection(para);
	para = NULL;
}

void CActions::UpdateLogInfo()
{
	if (GetForegroundWindow() != m_pWnd->m_hWnd)
		return;
	if (!m_isLineScroll) //取消自动滚动
	{
		int tnVertPos = m_EditLog->GetScrollPos(SB_VERT);
		if (tnVertPos != m_nVertPos)
		{
			m_pWnd->UpdateData(false);
			m_EditLog->SetScrollPos(SB_VERT, tnVertPos);
			m_EditLog->LineScroll(tnVertPos);
			if (m_nVertPos == -1)
			{
				m_EditLog->SetSel(-1); //移动光标到末尾 
			}
			m_nVertPos = tnVertPos;
		}else
			m_pWnd->UpdateData();
	}
	else
	{
	 	m_pWnd->UpdateData(false); 
		m_EditLog->LineScroll(m_EditLog->GetLineCount()); //滚动到底部
	} 
}
void CActions::AllRun()
{
	HTREEITEM hCurItem = m_actions->GetChildItem(m_hItem);
	while (hCurItem)
	{
		CString tServerName = m_actions->GetItemText(hCurItem);
		if (!tServerName.IsEmpty() && m_serverBuff[tServerName].serverName == tServerName)
		{
			if (!m_serverBuff[tServerName].isRun)
			{
				m_serverBuff[tServerName].item = hCurItem;
				HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)Run, &m_serverBuff[tServerName], NULL, NULL);
				CloseHandle(hwnd);
			}
		}
		hCurItem = m_actions->GetNextSiblingItem(hCurItem);
	}
}
void CActions::AllStop()
{
	if (m_pWnd->MessageBox(_T("确定停止所有服务?"), _T("警告"), MB_OKCANCEL) != IDOK) {
		return;
	}
	HTREEITEM hCurItem = m_actions->GetChildItem(m_hItem);
	while (hCurItem)
	{
		CString tServerName = m_actions->GetItemText(hCurItem);
		if (!tServerName.IsEmpty() && m_serverBuff[tServerName].serverName == tServerName)
		{
			if (m_serverBuff[tServerName].isRun)
			{
				m_serverBuff[tServerName].isRun = false;
			}
		}
		hCurItem = m_actions->GetNextSiblingItem(hCurItem);
	}
}


CString CActions::getLogInfo()
{
	if (m_logInfo)
		return *m_logInfo;
	else
		return L"";
} 
void CActions::Lock()
{ 
	EnterCriticalSection(para);
}
void CActions::UnLock()
{
	LeaveCriticalSection(para);
}
void CActions::SetLogInfo(CString *pLog)
{
	EnterCriticalSection(para);
	m_logInfo = pLog;
	LeaveCriticalSection(para);
}
void CActions::Run(STR_TREEINFO *serverInfo)
{ 
	STR_TREEINFO* LserverInfo = serverInfo; 
	if (LserverInfo->isRun)
		return;
	CString lpCmd = LserverInfo->filePath;
	CString lpDirectory = getDirFromFullPath(LserverInfo->filePath); 
	bool nShow = FALSE; 
	bool isWait = TRUE;

	HANDLE hReadPipe, hWritePipe;
	PROCESS_INFORMATION pi;
	LPPROCESS_INFORMATION lppi;
	SECURITY_ATTRIBUTES lsa; // 安全属性
	STARTUPINFO myStartup;
	lsa.nLength = sizeof(SECURITY_ATTRIBUTES);
	lsa.lpSecurityDescriptor = NULL;
	lsa.bInheritHandle = true; 

	lppi = &pi;
	// 创建管道
	if (!CreatePipe(&hReadPipe, &hWritePipe, &lsa, 0))
	{
		printf("no pipe");
		return ;
	}

	memset(&myStartup, 0, sizeof(STARTUPINFO));
	myStartup.cb = sizeof(STARTUPINFO);
	myStartup.dwFlags = STARTF_USESHOWWINDOW | STARTF_USESTDHANDLES;
	myStartup.wShowWindow = nShow;
	myStartup.hStdOutput = hWritePipe;

	if (lpDirectory.IsEmpty() ? !CreateProcess(NULL, (LPWSTR)(LPCWSTR)lpCmd, NULL, NULL, true, CREATE_NEW_CONSOLE, NULL, NULL, &myStartup, &pi):
		!CreateProcess(NULL, (LPWSTR)(LPCWSTR)lpCmd, NULL, NULL, true, CREATE_NEW_CONSOLE, NULL, lpDirectory, &myStartup, &pi)) {
		int a = GetLastError();
		return ;
	}
	//列表状态
	ChangeTreeStatu(LserverInfo, true);

	CString logPath = makeLogPath(lpDirectory, LserverInfo->serverName, c2w(GetDateString().c_str()));
	LserverInfo->stream = _wfsopen(logPath, L"w", _SH_DENYNO);

	// 处理管道数据
	pipeInfo(hReadPipe, pi.hProcess, LserverInfo);

	TerminateProcess(pi.hProcess, 0);
	CloseHandle(hReadPipe);
	CloseHandle(pi.hThread);
	CloseHandle(pi.hProcess);
	CloseHandle(hWritePipe);
	//列表状态
	ChangeTreeStatu(LserverInfo, false);
}

void CActions::pipeInfo(HANDLE hReadPipe, HANDLE exeHwnd, STR_TREEINFO* LserverInfo)
{ 
	const int readBuffLen = 2048;
	char readBuf[readBuffLen + 1];
	DWORD bytesRead = 0;
	DWORD selPos = 0;
	int DataRate = UPDATARATE;
	bool isUpdate = false;
	
	LserverInfo->editShowBuff = "";
	while (LserverInfo->isRun) {
		bytesRead = 0;
		if (!hReadPipe || !PeekNamedPipe(hReadPipe, readBuf, 1, &bytesRead, NULL, NULL))
			break;

		// 切换节点
		if (LserverInfo->item == m_select && !m_logInfo)
		{ 
			CActions::SetLogInfo(&LserverInfo->editShowBuff);
			PostMessage(LserverInfo->pWnd->m_hWnd, WM_USER + 101, 0, 0); 
		} 
		if (bytesRead && ReadFile(hReadPipe, readBuf, readBuffLen, &bytesRead, NULL)) {
			readBuf[bytesRead] = 0;
			isUpdate = true;
			writeLogToFile(*LserverInfo, readBuf);
			displayData(*LserverInfo, readBuf);
		}
		else if (!exeHwnd || WaitForSingleObject(exeHwnd, 0) == WAIT_OBJECT_0)  // 进程退出
		{
			LserverInfo->isRun = false;
			break;			
		}
		else { // 没有读到新的日志 
			if (isUpdate && LserverInfo->item == m_select && DataRate++ > UPDATARATE)
			{
				DataRate = 0;
				PostMessage(LserverInfo->pWnd->m_hWnd, WM_USER + 101, 0, 0);
				isUpdate = false;
			}
			Sleep(100);
		}
	}
}

void CActions::ChangeTreeStatu(STR_TREEINFO *treeInfo, bool isRun)
{
	treeInfo->isRun = isRun;
	treeInfo->imgIndex = treeInfo->isRun ? 2 : 1;
	treeInfo->serverTree->SetItemImage(treeInfo->item, treeInfo->imgIndex, treeInfo->imgIndex);
	if (treeInfo->item == m_select)
		treeInfo->runButton->SetWindowText(isRun ? L"Stop" : L"Run");
	treeInfo->isExit = !isRun;
}