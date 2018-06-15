#pragma once
#include <map>

struct STR_TREEINFO;

class CServerTree
{
public:
	CServerTree();
	~CServerTree();
	//初始化
	bool InitTree(CWnd *pWnd, int treeid);
	HTREEITEM GetSelectTree();

	void PopMenu();
	//添加
	void AddInfo();
	//删除
	void DelInfo();
	//运行或停止
	void RunServer();
	//选中
	void SetSelect();
	//滚动
	void SetLineScroll(bool isScroll);
	//打开所在目录
	void Explorer();
	//结束程序
	void Close();
	//更新日志
	void UpdateLogInfo();
	//全部运行
	void AllRun();
	//全部停止
	void AllStop();
	//获取显示的日志信息
	CString getLogInfo();
	void Lock();
	void UnLock();
	//设置显示的日志
	static void SetLogInfo(CString *pLog);	
private:
	CWnd * m_pWnd;
	CTreeCtrl* m_ServerTree;
	CEdit* m_EditLog;
	CButton *m_run;
	HTREEITEM m_hItem;
	CString m_configPath;

	int m_nVertPos;
	//执行线程
	static void Run(STR_TREEINFO *serverInfo);
	static void pipeInfo(HANDLE hReadPipe, HANDLE exeHwnd, STR_TREEINFO* LserverInfo);
	//更改树状态
	static void ChangeTreeStatu(STR_TREEINFO *treeInfo, bool isRun);

	std::map<CString, STR_TREEINFO> m_serverBuff;

	//图标
	CImageList m_img;
	void SetImageList();
	//填充结构体
	void SetTreeInfo(STR_TREEINFO& tInfo);

	static void writeLogToFile(STR_TREEINFO& tInfo, const char* data);
	static void displayData(STR_TREEINFO& tInfo, const char* data);
};

