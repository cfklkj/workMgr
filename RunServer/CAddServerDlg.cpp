// CAddServerDlg.cpp: 实现文件
//

#include "stdafx.h"
#include "RunServer.h"
#include "CAddServerDlg.h"
#include "afxdialogex.h"


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
	ON_BN_CLICKED(IDC_PathOpen, &CAddServerDlg::OnBnClickedPathopen)
	ON_BN_CLICKED(IDOK, &CAddServerDlg::OnBnClickedOk)
END_MESSAGE_MAP()


// CAddServerDlg 消息处理程序


void CAddServerDlg::OnBnClickedPathopen()
{
	// TODO: 在此添加控件通知处理程序代码
	CFileDialog dlg(TRUE, L"执行程序(*.exe)|*.exe", NULL,

		OFN_HIDEREADONLY | OFN_OVERWRITEPROMPT,

		L"执行程序(*.exe)|*.exe||", this);
	if (dlg.DoModal() == IDOK)
	{
		CString filePath = dlg.GetPathName();
		if (PathFileExists(filePath))
		{ 
			GetDlgItem(IDC_PATH)->SetWindowText(filePath);
		}
	}
} 

void CAddServerDlg::OnBnClickedOk()
{
	// TODO: 在此添加控件通知处理程序代码
	GetDlgItem(IDC_NAME)->GetWindowText(m_serverName);
	GetDlgItem(IDC_PATH)->GetWindowText(m_filePath);
	if (m_serverName.IsEmpty() || (!m_filePath.IsEmpty() && !PathFileExists(m_filePath)))
	{ 
		MessageBox(L"填写信息错误！请重试");
		return;
	}
	CDialogEx::OnOK();
}
CString CAddServerDlg::getServerName()
{
	return m_serverName;
}
CString CAddServerDlg::getFilePath()
{
	return m_filePath;
}
