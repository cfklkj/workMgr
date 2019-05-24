
// RunServerDlg.h: 头文件
//

#pragma once
#include "CCtrlData.h"
#include "CServer.h"
 
enum ActBtn {
	CREATEROOM,
	DROPROOM,
	PUSH,
	STOP,
	ALLRUN,
	ALLSTOP,
	HEART,
	FREE,
};
// CRunServerDlg 对话框
class CRunServerDlg : public CDialogEx, public CCtrlData
{
// 构造
public:
	CRunServerDlg(CWnd* pParent = nullptr);	// 标准构造函数

	~CRunServerDlg();
	void setMbtn(ActBtn btn);
	bool isFreeBtn();
	bool isNeedCreateRoom(CString token); 
	CString getCmdStr(CString token);
	CString getCmdStr(CString token, ActBtn oldBtn);
	CString getCmdTip(CString token, ActBtn oldBtn, bool isStart);
	void    sendHeart(CString token, ActBtn oldBtn);
	void    forceStopPush(CString token, bool isWait);
	void    dropRoom(CString token, bool isWait);
	ActBtn getActBtn() { return m_btn; };
private:
	ActBtn m_btn = FREE;
	CString startPush(CString token);
	CString stopPush(CString token);
	CString dropRoom(CString token);
	CString heartBeat(CString token);
	CString createRoom(CString token);
	void showIniSection(CString token);
	bool checkRoomOk(bool isTip = true);
	void upRoomNew(CString token, bool isEnd);

	std::map<CString, time_t> m_oldReqPushTime;
// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_RUNSERVER_DIALOG };
#endif

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	// DDX/DDV 支持
	 
// 实现
protected:
	HICON m_hIcon;
	//CDumpFile m_dump;

	// 生成的消息映射函数
	virtual BOOL OnInitDialog();
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();
	DECLARE_MESSAGE_MAP()
public:
	afx_msg void OnTvnSelchangedTree1(NMHDR *pNMHDR, LRESULT *pResult); 
	// 管理日志 
	CString *m_serverLog;
	afx_msg void OnEnChangeEdit1();
	afx_msg void OnRclickTree(NMHDR *pNMHDR, LRESULT *pResult);
	virtual BOOL PreTranslateMessage(MSG* pMsg);
	afx_msg void OnBnClickedRunOrStop();
	afx_msg void OnClickTree1(NMHDR *pNMHDR, LRESULT *pResult);
	virtual void OnCancel(); 
	afx_msg HBRUSH OnCtlColor(CDC* pDC, CWnd* pWnd, UINT nCtlColor);
	afx_msg void OnBnClickedClear();
	afx_msg void OnClickedCheck1();  

	afx_msg void OnBnClickedAllrun();
	afx_msg void OnBnClickedAllstop();
public:
	//绑定控件
	CTreeCtrl * m_tree;
	CEdit* m_edit;
	CButton *m_run;
	CButton *m_check;

	//数据
	struct STR_RUNSTATUS
	{
		HTREEITEM selectItem;
		int   status;
	}m_runCmd;
	bool m_isLineScroll;   
	CString m_editStr;
private: 
	HBRUSH m_editHbrEdit;
	
public:
	afx_msg void OnBnClickedCreateroom();
};
