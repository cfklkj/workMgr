#include "stdafx.h"
#include "CServerTree.h"
#include "resource.h"
#include "CTreeAdd.h"

#pragma warning(disable:4996)


HTREEITEM m_select;
bool m_isLineScroll; 
CRITICAL_SECTION para;
 
CString *m_logInfo;

CServerTree::CServerTree()
{
	InitializeCriticalSection(&para);
	m_select = NULL;
	m_isLineScroll = true; 
	m_configPath = ".\\config.ini"; 
}

CServerTree::~CServerTree()
{
	DeleteCriticalSection(&para);
}
void CServerTree::SetTreeInfo(STR_TREEINFO& treeInfo)
{  
	treeInfo.isRun = false;
	treeInfo.isExit = true;
	treeInfo.pWnd = m_pWnd;
	treeInfo.showLogInfo = m_EditLog;
	treeInfo.runButton = m_run; 
	treeInfo.serverTree = m_ServerTree;
	treeInfo.item = m_ServerTree->InsertItem((LPCTSTR)treeInfo.serverName, m_hItem);
	HTREEITEM tItem = m_ServerTree->InsertItem((LPCTSTR)getDirFromFullPath(treeInfo.filePath), treeInfo.item);
	m_ServerTree->SetItemImage(tItem, 3, 3);
	treeInfo.imgIndex = treeInfo.isRun ? 2 : 1;
	m_ServerTree->SetItemImage(treeInfo.item, treeInfo.imgIndex, treeInfo.imgIndex);
	m_serverBuff[treeInfo.serverName] = treeInfo;
}
void CServerTree::writeLogToFile(STR_TREEINFO& tInfo, const char* data)
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
void CServerTree::displayData(STR_TREEINFO & tInfo, const char * data)
{
	int step = 0;
	int maxLogLen = 5000; //日志最大行值
	int maxShowLogLen = 20000;  //显示最大行值   

	STR_TREEINFO* LserverInfo = &tInfo;

	UINT MaxLenth = LserverInfo->showLogInfo->GetLimitText();

	//数据内存回滚
	CString tempRead = c2w(data);
	step = LserverInfo->showLogInfo->GetLineCount();
	if (step < maxShowLogLen)
	{
		LserverInfo->readBuff += tempRead;
	}
	else
	{
		//替换新行
		const wchar_t* tempLog = LserverInfo->readBuff;
		int dropLine = maxShowLogLen - maxLogLen;
		while (*tempLog && dropLine > 0)
		{
			if (*tempLog == '\n')
				dropLine--;
			tempLog++;
		}
		LserverInfo->readBuff = tempLog;
		LserverInfo->readBuff += tempRead;
	}
	//显示
	if (LserverInfo->item == m_select && m_logInfo)
	{
		int selPos = LserverInfo->readBuff.GetLength();
		if (selPos > MaxLenth) //增加edit 最大长度
		{
			MaxLenth += MaxLenth;
			LserverInfo->showLogInfo->SetLimitText(MaxLenth);
		}
		PostMessage(LserverInfo->pWnd->m_hWnd, WM_USER + 101, 0, 0);
	}
}
bool CServerTree::InitTree(CWnd *pWnd, int treeid)
{
	m_pWnd = pWnd; 
	m_ServerTree = (CTreeCtrl*)m_pWnd->GetDlgItem(treeid);
	m_EditLog = (CEdit*)m_pWnd->GetDlgItem(IDC_LOG); 
	m_run = (CButton*)m_pWnd->GetDlgItem(IDC_RUN);
	((CButton*)m_pWnd->GetDlgItem(IDC_CHECK1))->SetCheck(m_isLineScroll);
	WCHAR Rbuff[MAX_PATH] = { 0 };
	if (m_ServerTree)
	{
		//修改风格
		/*DWORD dwOriginalStyle = m_ServerTree->GetStyle();
		m_ServerTree->ModifyStyle(m_ServerTree->m_hWnd, dwOriginalStyle,
			dwOriginalStyle | TVS_HASLINES, 0);*/

		m_hItem = m_ServerTree->InsertItem(L"服务列表:", TVI_ROOT);
		int lenth = GetPrivateProfileSectionNames(Rbuff, MAX_PATH, m_configPath);
		for (int i = 0; i < lenth; i++)
		{
			STR_TREEINFO tInfo;
			if (i == 0)
			{
				tInfo.serverName = &Rbuff[i];
			}
			else if (Rbuff[i] == '\0')
			{
				tInfo.serverName = &Rbuff[i + 1];
			}

			if (!tInfo.serverName.IsEmpty())
			{
				WCHAR Rcbuff[MAX_PATH] = { 0 };
				GetPrivateProfileString(tInfo.serverName, L"path", L"", Rcbuff, MAX_PATH, m_configPath);
				tInfo.filePath = Rcbuff;
				SetTreeInfo(tInfo);
			}
		}
		m_ServerTree->Expand(m_hItem, TVE_EXPAND);
		SetImageList();
	}
	return m_ServerTree == NULL;
}

HTREEITEM CServerTree::GetSelectTree()
{
	CPoint pt;
	GetCursorPos(&pt);//得到当前鼠标的位置
	m_ServerTree->ScreenToClient(&pt);//将屏幕坐标转换为客户区坐标
	HTREEITEM tree_Item = m_ServerTree->HitTest(pt);//调用HitTest找到对应点击的树节点
	return tree_Item;
}
void CServerTree::PopMenu()
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
		CString tServerName = m_ServerTree->GetItemText(CurTree);
		m_ServerTree->SelectItem(CurTree); //使右键单击的树节点被选中
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
void CServerTree::SetSelect()
{
	HTREEITEM curItem = GetSelectTree(); 
	if (curItem != NULL)
	{
		CString tServerName = m_ServerTree->GetItemText(curItem);
		if (curItem != m_select)
		{
			if (m_serverBuff[tServerName].serverName == tServerName)
			{
				m_select = NULL;
				m_logInfo = NULL; 
				m_select = curItem;  
			}
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
void CServerTree::RunServer()
{
	HTREEITEM CurTree = m_select; 
	if (CurTree != NULL)
	{
		CString tServerName = m_ServerTree->GetItemText(CurTree);
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

void CServerTree::AddInfo()
{
	STR_TREEINFO tInfo;
	CTreeAdd dlg(&tInfo); 
	if (dlg.DoModal() == IDOK)
	{  
		SetTreeInfo(tInfo);   
		WritePrivateProfileString(tInfo.serverName, L"path", tInfo.filePath, m_configPath);
		m_run->EnableWindow(true);
		m_run->SetWindowText(L"Run"); 
	}
}

void CServerTree::DelInfo()
{ 
	CButton *tButton = (CButton*)m_pWnd->GetDlgItem(IDC_RUN);
	if (m_select != NULL)
	{
		CString tServerName = m_ServerTree->GetItemText(m_select);
		if (m_serverBuff[tServerName].serverName.IsEmpty())
		{
			return;
		}
		m_select = NULL;
		if (m_serverBuff[tServerName].isRun)
		{
			m_serverBuff[tServerName].isRun = false;
		}
		tButton->EnableWindow(false);
		tButton->SetWindowText(L"Run");
		WritePrivateProfileString(tServerName, NULL, NULL, m_configPath);
		m_ServerTree->DeleteItem(m_select);
	}
}
void CServerTree::Explorer()
{
	if (m_select != NULL)
	{
		CString tServerName = m_ServerTree->GetItemText(m_select); 
		ShellExecute(m_pWnd->m_hWnd, L"open", tServerName, NULL, NULL, SW_SHOW); 
	}
}

//https://blog.csdn.net/veryhehe2011/article/details/7964558
void CServerTree::SetImageList()
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
	m_ServerTree->SetImageList(&m_img, TVSIL_NORMAL);
}
void CServerTree::SetLineScroll(bool isScroll)
{
	m_isLineScroll = isScroll; 
}
 
void CServerTree::Close()
{ 
	HTREEITEM hCurItem = m_ServerTree->GetChildItem(m_hItem);   
	while (hCurItem)
	{ 
		CString tServerName = m_ServerTree->GetItemText(hCurItem);
		if (!tServerName.IsEmpty() && m_serverBuff[tServerName].serverName == tServerName)
		{
			if (m_serverBuff[tServerName].isRun)
			{
				m_serverBuff[tServerName].isRun = false;  
			}
		}
		hCurItem = m_ServerTree->GetNextSiblingItem(hCurItem);
	}
	//等待线程结束
	hCurItem = m_ServerTree->GetChildItem(m_hItem);
	while (hCurItem)
	{
		CString tServerName = m_ServerTree->GetItemText(hCurItem);
		if (!tServerName.IsEmpty() && m_serverBuff[tServerName].serverName == tServerName)
		{ 
			if(!m_serverBuff[tServerName].isExit)
			{
			 	LeaveCriticalSection(&para);
				TimeDelay(100);
				continue;
			}
		}
		hCurItem = m_ServerTree->GetNextSiblingItem(hCurItem);
	}
}

void CServerTree::UpdateLogInfo()
{
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
void CServerTree::AllRun()
{
	HTREEITEM hCurItem = m_ServerTree->GetChildItem(m_hItem);
	while (hCurItem)
	{
		CString tServerName = m_ServerTree->GetItemText(hCurItem);
		if (!tServerName.IsEmpty() && m_serverBuff[tServerName].serverName == tServerName)
		{
			if (!m_serverBuff[tServerName].isRun)
			{
				m_serverBuff[tServerName].item = hCurItem;
				HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)Run, &m_serverBuff[tServerName], NULL, NULL);
				CloseHandle(hwnd);
			}
		}
		hCurItem = m_ServerTree->GetNextSiblingItem(hCurItem);
	}
}
void CServerTree::AllStop()
{
	if (m_pWnd->MessageBox(_T("确定停止所有服务?"), _T("警告"), MB_OKCANCEL) != IDOK) {
		return;
	}
	HTREEITEM hCurItem = m_ServerTree->GetChildItem(m_hItem);
	while (hCurItem)
	{
		CString tServerName = m_ServerTree->GetItemText(hCurItem);
		if (!tServerName.IsEmpty() && m_serverBuff[tServerName].serverName == tServerName)
		{
			if (m_serverBuff[tServerName].isRun)
			{
				m_serverBuff[tServerName].isRun = false;
			}
		}
		hCurItem = m_ServerTree->GetNextSiblingItem(hCurItem);
	}
}


CString CServerTree::getLogInfo()
{
	if (m_logInfo)
		return *m_logInfo;
	else
		return L"";
} 
void CServerTree::Lock()
{
	EnterCriticalSection(&para);
}
void CServerTree::UnLock()
{
	LeaveCriticalSection(&para);
}
void CServerTree::SetLogInfo(CString *pLog)
{
	EnterCriticalSection(&para);
	m_logInfo = pLog;
	LeaveCriticalSection(&para);
}
void CServerTree::Run(STR_TREEINFO *serverInfo)
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

void CServerTree::pipeInfo(HANDLE hReadPipe, HANDLE exeHwnd, STR_TREEINFO* LserverInfo)
{ 
	const int readBuffLen = 2048;
	char readBuf[readBuffLen + 1];
	DWORD bytesRead = 0;
	DWORD selPos = 0;
	
	LserverInfo->readBuff = "";
	while (LserverInfo->isRun) {
		bytesRead = 0;
		if (!hReadPipe || !PeekNamedPipe(hReadPipe, readBuf, 1, &bytesRead, NULL, NULL))
			break;

		// 切换节点
		if (LserverInfo->item == m_select && !m_logInfo)
		{ 
			CServerTree::SetLogInfo(&LserverInfo->readBuff);
			PostMessage(LserverInfo->pWnd->m_hWnd, WM_USER + 101, 0, 0);
		}

		if (bytesRead && ReadFile(hReadPipe, readBuf, readBuffLen, &bytesRead, NULL)) {
			readBuf[bytesRead] = 0;
			writeLogToFile(*LserverInfo, readBuf);
			displayData(*LserverInfo, readBuf);
		}
		else if (!exeHwnd || WaitForSingleObject(exeHwnd, 0) == WAIT_OBJECT_0)  // 进程退出
		{
			LserverInfo->isRun = false;
			break;			
		}
		else { // 没有读到新的日志
			Sleep(100);
		}
	}
}

void CServerTree::ChangeTreeStatu(STR_TREEINFO *treeInfo, bool isRun)
{
	treeInfo->isRun = isRun;
	treeInfo->imgIndex = treeInfo->isRun ? 2 : 1;
	treeInfo->serverTree->SetItemImage(treeInfo->item, treeInfo->imgIndex, treeInfo->imgIndex);
	if (treeInfo->item == m_select)
		treeInfo->runButton->SetWindowText(isRun ? L"Stop" : L"Run");
	treeInfo->isExit = !isRun;
}