// RunServerDlg.cpp: ʵ���ļ�
//

#include "stdafx.h"
#include "RunServer.h"
#include "RunServerDlg.h"
#include "afxdialogex.h" 
#include "CAddServerDlg.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif


// CRunServerDlg �Ի���
 

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


// CRunServerDlg ��Ϣ�������

BOOL CRunServerDlg::OnInitDialog()
{
	CDialogEx::OnInitDialog();
	// ���ô˶Ի����ͼ�ꡣ  ��Ӧ�ó��������ڲ��ǶԻ���ʱ����ܽ��Զ�
	//  ִ�д˲���
	SetIcon(m_hIcon, TRUE);			// ���ô�ͼ��
	SetIcon(m_hIcon, FALSE);		// ����Сͼ��

									// TODO: �ڴ���Ӷ���ĳ�ʼ������   
	m_tree = (CTreeCtrl*)GetDlgItem(IDC_TREE1);
	m_edit = (CEdit*)GetDlgItem(IDC_LOG);
	m_run = (CButton*)GetDlgItem(IDC_RUN);
	m_check = ((CButton*)GetDlgItem(IDC_CHECK1));
	m_check->SetCheck(m_isLineScroll);
	initTreeCtrl(m_tree);
	m_edit->SetLimitText(-1);
	btnDisable(m_run);
	return TRUE;  // ���ǽ��������õ��ؼ������򷵻� TRUE
}

// �����Ի��������С����ť������Ҫ����Ĵ���
//  �����Ƹ�ͼ�ꡣ  ����ʹ���ĵ�/��ͼģ�͵� MFC Ӧ�ó���
//  �⽫�ɿ���Զ���ɡ� 
void CRunServerDlg::OnPaint()
{
	if (IsIconic())
	{ 
		CPaintDC dc(this); // ���ڻ��Ƶ��豸������

		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);

						   // ʹͼ���ڹ����������о���
		int cxIcon = GetSystemMetrics(SM_CXICON);
		int cyIcon = GetSystemMetrics(SM_CYICON);
		CRect rect;
		GetClientRect(&rect);
		int x = (rect.Width() - cxIcon + 1) / 2;
		int y = (rect.Height() - cyIcon + 1) / 2;

		// ����ͼ��
		dc.DrawIcon(x, y, m_hIcon);

		//����ɫ
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
	// TODO:  ���Ĭ�ϵĲ������軭�ʣ��򷵻���һ������
	return hbr;
}

//���û��϶���С������ʱϵͳ���ô˺���ȡ�ù��
//��ʾ��
HCURSOR CRunServerDlg::OnQueryDragIcon()
{
	return static_cast<HCURSOR>(m_hIcon);
}

void CRunServerDlg::OnTvnSelchangedTree1(NMHDR *pNMHDR, LRESULT *pResult)
{
	LPNMTREEVIEW pNMTreeView = reinterpret_cast<LPNMTREEVIEW>(pNMHDR);
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	*pResult = 0;
}


void CRunServerDlg::OnEnChangeEdit1()
{
	// TODO:  ����ÿؼ��� RICHEDIT �ؼ���������
	// ���ʹ�֪ͨ��������д CDialogEx::OnInitDialog()
	// ���������� CRichEditCtrl().SetEventMask()��
	// ͬʱ�� ENM_CHANGE ��־�������㵽�����С�

	// TODO:  �ڴ���ӿؼ�֪ͨ����������
}

//---------------------------------------------------------tree  
void CRunServerDlg::OnRclickTree(NMHDR *pNMHDR, LRESULT *pResult)
{
	// TODO: �ڴ���ӿؼ�֪ͨ���������� 	 
	//��ʱ������Ļ���꣬��������menu
	TreePopMenu(m_tree);
	*pResult = 0;
}


BOOL CRunServerDlg::PreTranslateMessage(MSG* pMsg)
{
	// TODO: �ڴ����ר�ô����/����û���
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
	if (pMsg->hwnd == m_edit->m_hWnd &&  pMsg->message == WM_MOUSEHWHEEL || pMsg->message == WM_MOUSEWHEEL)  //edit�������
	{
		m_runCmd.status = btn_MouseScroll;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_ADD) //��ӷ���ڵ�
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
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_DEL)  //ɾ������ڵ�
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
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_exp)  //�򿪷���Ŀ¼
	{
		CString itemText = m_tree->GetItemText(m_tree->GetSelectedItem());
		ShellExecute(m_hWnd, L"open", itemText, NULL, NULL, SW_SHOW); 
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_EXEPATH) //�򿪳���Ŀ¼
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
		if (runInfo)   //�������ݵ��ڴ� 
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
		if (curItem != pRun->m_runCmd.selectItem) //����ѡ�з���ڵ�
		{
			Sleep(100);
			continue;
		} 
		if (pRun->m_runCmd.status == btn_STOP)
		{ 
			pRun->m_runCmd.status = btn_START;
			break;
		}
		//�û���ѡ����
		switch (pRun->m_runCmd.status)
		{  
		case btn_STOP:
		{ 
			pRun->m_runCmd.status = btn_START;
			useExit = true; 
		}continue;
		case btn_SelectItem://ѡ�����ڵ�  
		{
			isChangeSelect = true;
		}
		case btn_CheckAutoScroll: //ѡ���ȡ���Զ�����  
		case btn_MouseScroll://�û�������� 
		case btn_LRBtnDown: //�����
		{
			pRun->m_runCmd.status = btn_START;
			Sleep(100);
		}continue;
		case btn_Clear://�����ʾ
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
	// TODO: �ڴ���ӿؼ�֪ͨ����������
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
			if (MessageBox(_T("ȷ��ֹͣ����?"), _T("����"), MB_OKCANCEL) == IDOK) {
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
	// TODO: �ڴ���ӿؼ�֪ͨ����������  
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
	// TODO: �ڴ����ר�ô����/����û���
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
	else if(MessageBox(_T("ȷ���رշ������?"), _T("����"), MB_OKCANCEL) == IDOK) {
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
	// TODO: �ڴ���ӿؼ�֪ͨ���������� 	 
	m_isLineScroll = !m_isLineScroll;
	m_runCmd.status = btn_CheckAutoScroll; 
}





void CRunServerDlg::OnBnClickedAllrun()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
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
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	int oldStatu = m_runCmd.status;
	m_runCmd.status = btn_AllPause;
	if (MessageBox(_T("ȷ��ֹͣ���з���?"), _T("����"), MB_OKCANCEL) == IDOK) {
		m_runCmd.status = btn_AllSTOP;
	}
	else
	{
		m_runCmd.status = oldStatu;
	} 
}
 
