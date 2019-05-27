#pragma once
#include <map>

// CAddServerDlg 对话框
class CAddServerDlg : public CDialogEx
{
	DECLARE_DYNAMIC(CAddServerDlg)

public:
	CAddServerDlg(CWnd* pParent = nullptr);   // 标准构造函数
	virtual ~CAddServerDlg();

	void InitCtrl();

	CString getRoomName();
	CString getToken() {
		return m_token;
	};
	void setToken(CString token) {
		m_token = token;
	};
	bool isTokenUp(CString token) { return m_token != token; };
	 
private:
	bool  getPicture(CString filePath);
	void  keepCtrlInfo();
	CString m_roomName;
	CString m_token;
	CString getUpToken();
	CString getUpRoomName();
// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_ADD };
#endif
	 
private:
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
