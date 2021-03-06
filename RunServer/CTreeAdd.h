#pragma once


// CTreeAdd 对话框

struct STR_TREEINFO
{
	CString filePath;
	CString serverName;
	CWnd   *pWnd;
	CEdit   *showLogInfo; 
	CTreeCtrl *serverTree;
	CButton *runButton;
	CString readBuff;
	HTREEITEM item;
	FILE* stream;

	int  imgIndex;
	bool isRun;
	bool isExit;
};

class CTreeAdd : public CDialogEx
{
	DECLARE_DYNAMIC(CTreeAdd)

public:
	CTreeAdd(STR_TREEINFO *serverInfo, CWnd* pParent = nullptr);   // 标准构造函数
	virtual ~CTreeAdd();

// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_ADD };
#endif
	 
private:
	STR_TREEINFO * m_serverInfo; 
protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV 支持

	DECLARE_MESSAGE_MAP()
public:
	afx_msg void OnBnClickedPathopen();
	afx_msg void OnBnClickedOk();
};
