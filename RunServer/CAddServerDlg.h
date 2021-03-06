#pragma once


// CAddServerDlg 对话框
class CAddServerDlg : public CDialogEx
{
	DECLARE_DYNAMIC(CAddServerDlg)

public:
	CAddServerDlg(CWnd* pParent = nullptr);   // 标准构造函数
	virtual ~CAddServerDlg();

	CString getServerName();
	CString getFilePath();
// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_ADD };
#endif
	 
private:
	CString m_serverName;
	CString m_filePath;
protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV 支持

	DECLARE_MESSAGE_MAP()
public:
	afx_msg void OnBnClickedPathopen();
	afx_msg void OnBnClickedOk();
};
