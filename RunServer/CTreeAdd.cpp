// CTreeAdd.cpp: 实现文件
//

#include "stdafx.h"
#include "RunServer.h"
#include "CTreeAdd.h"
#include "afxdialogex.h"


// CTreeAdd 对话框

IMPLEMENT_DYNAMIC(CTreeAdd, CDialogEx)

CTreeAdd::CTreeAdd(STR_TREEINFO *serverInfo, CWnd* pParent /*=nullptr*/)
	: CDialogEx(IDD_ADD, pParent)
{
	m_serverInfo = serverInfo;
	if (PathFileExists(m_serverInfo->filePath))
	{
		GetDlgItem(IDC_PATH)->SetWindowText(m_serverInfo->filePath);
	}
	if(!m_serverInfo->serverName.IsEmpty())
		GetDlgItem(IDC_NAME)->SetWindowText(m_serverInfo->serverName); 
}

CTreeAdd::~CTreeAdd()
{
}

void CTreeAdd::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
}


BEGIN_MESSAGE_MAP(CTreeAdd, CDialogEx)
	ON_BN_CLICKED(IDC_PathOpen, &CTreeAdd::OnBnClickedPathopen)
	ON_BN_CLICKED(IDOK, &CTreeAdd::OnBnClickedOk)
END_MESSAGE_MAP()


// CTreeAdd 消息处理程序


void CTreeAdd::OnBnClickedPathopen()
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

void CTreeAdd::OnBnClickedOk()
{
	// TODO: 在此添加控件通知处理程序代码
	GetDlgItem(IDC_NAME)->GetWindowText(m_serverInfo->serverName);
	GetDlgItem(IDC_PATH)->GetWindowText(m_serverInfo->filePath);
	if (m_serverInfo->serverName.IsEmpty() || m_serverInfo->filePath.IsEmpty())
	{
		MessageBox(L"填写信息错误！请重试");
		return;
	}
	CDialogEx::OnOK();
}
