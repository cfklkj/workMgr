#pragma once
#include <map>

// CAddServerDlg 对话框
class CAddServerDlg : public CDialogEx
{
	DECLARE_DYNAMIC(CAddServerDlg)

public:
	CAddServerDlg(CWnd* pParent = nullptr);   // 标准构造函数
	virtual ~CAddServerDlg();

	CString getServerName();
	CString getFilePath();
	void InitCtrl();
	void setToken(CString token) {
		m_token = token;
	};
	bool isTokenUp(CString token) { return m_token != token; };
	CString getToken() {
		return m_token;
	};
	 
private:
	bool  getPicture(CString filePath);
	void  keepOtherCtl();
	CString m_token;
	CString getUpToken();
	CString getUpServerName();
// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_ADD };
#endif
	 
private:
	CString m_serverName; 
	struct TypeInfo {
		CString name;
		int type;
	};
	std::map<int, TypeInfo> m_typeCombox;
	void initTypeCombox();
	int  getComboxTypeIndex(int money);
	int getComboxType(int index);
protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV 支持

	DECLARE_MESSAGE_MAP()
public:
	afx_msg void OnSetVideo();
	afx_msg void OnBnClickedOk();
	afx_msg void OnUpImg();
	virtual BOOL OnInitDialog();
	afx_msg void OnSelchangeRtype();
	afx_msg void OnBnClickedMovvideo();
};
