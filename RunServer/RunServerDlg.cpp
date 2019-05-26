// RunServerDlg.cpp: ʵ���ļ�
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
	CCtrlData::instance()->initCtrl(m_tree, m_edit);
	m_edit->SetLimitText(-1); 
	 
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
	CCtrlData::instance()->TreePopMenu(m_tree);
	 
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
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_ADD) //��ӷ���ڵ�
	{
		MenuAct::instance()->AddRoomInfo(this);
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_DEL)  //ɾ������ڵ�
	{	
		MenuAct::instance()->delRoomInfo(this);
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_ALT) //�޸ķ���ڵ�
	{
		MenuAct::instance()->alterRoomInfo(this);
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_info) //�鿴�ڵ���Ϣ
	{
		MenuAct::instance()->lookRoomInfo(this);
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_create)  //׼��-����
	{
		MenuAct::instance()->readyPush(this);
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_drop)  //ֹͣ-����
	{ 
		MenuAct::instance()->dropPush(this);
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU2_allPush)  //ֹͣ-����
	{
		MenuAct::instance()->allPush();
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU2_allPushStop)  //ֹͣ-����
	{
		MenuAct::instance()->allPushStop();
		return 1;
	}
	if (pMsg->message == WM_COMMAND && pMsg->wParam == ID_MENU_EXEPATH) //�򿪳���Ŀ¼
	{
		MenuAct::instance()->explorerThis();
	}  
	return CDialogEx::PreTranslateMessage(pMsg);
}  

void CRunServerDlg::OnCancel()
{
	// TODO: �ڴ����ר�ô����/����û���
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
	else if(MessageBox(_T("�з������ڿ�����ȷ���ر�?"), _T("����"), MB_OKCANCEL) == IDOK) {
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
	// TODO: �ڴ���ӿؼ�֪ͨ���������� 	 
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
		showMsg.Append(L"\r\nǩ��key:");
		showMsg.Append(key);
	}
	wchar_t name[512] = { 0 };
	if (GetPrivateProfileString(token, L"name", L"", name, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		showMsg.Append(L"\r\n������:");
		showMsg.Append(name);
	}

	wchar_t pay[512] = { 0 };
	if (GetPrivateProfileString(token, L"pay", L"", pay, 10, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{ 

		showMsg.Append(L"\r\n�շ�ֵ:");
		showMsg.Append(pay);
	}

	wchar_t type[512] = { 0 };
	if (GetPrivateProfileString(token, L"type", L"", type, 10, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()) )
	{ 

		showMsg.Append(L"\r\n��������:");
		showMsg.Append(type);
	}



	wchar_t picture[512] = { 0 };
	if (GetPrivateProfileString(token, L"picture", L"", picture, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		showMsg.Append(L"\r\n����ͼƬ·��:");
		showMsg.Append(picture);
	}

	wchar_t push[512] = { 0 };
	if (GetPrivateProfileString(token, L"push", L"", push, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{

		showMsg.Append(L"\r\n������ַ:");
		showMsg.Append(push);
	}

	wchar_t video[512] = { 0 };
	if (GetPrivateProfileString(token, L"video", L"", video, 510, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		showMsg.Append(L"\r\n������Ƶ��ַ:");
		showMsg.Append(video);
		
	}



	wchar_t count[512] = { 0 };
	if (GetPrivateProfileString(token, L"count", L"", count, 10, Fly_string::c2w(g_ffmpeg.configPath.c_str()).c_str()))
	{
		showMsg.Append(L"\r\nѭ����������:");
		showMsg.Append(count);
	}

	MessageBox(showMsg, L"������Ϣ...");
}
 
