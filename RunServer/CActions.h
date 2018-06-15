#pragma once
#include <map>

struct STR_TREEINFO;

class CActions
{
public:
	CActions();
	~CActions();
	//��ʼ��
	bool InitTree(CWnd *pWnd, int treeid);
	HTREEITEM GetSelectTree(); 

	void PopMenu();
	//���
	void AddInfo();
	//ɾ��
	void DelInfo();
	//���л�ֹͣ
	void RunServer();
	//ѡ��
	void SetSelect();
	//����
	void SetLineScroll(bool isScroll);
	//������Ŀ¼
	void Explorer();
	//��������
	void Close();
	//������־
	void UpdateLogInfo();
	//ȫ������
	void AllRun();
	//ȫ��ֹͣ
	void AllStop();
	//��ȡ��ʾ����־��Ϣ
	CString getLogInfo();
	void Lock();
	void UnLock();
	//������ʾ����־
	static void SetLogInfo(CString *pLog);	
private:
	CWnd * m_pWnd;
	CTreeCtrl* m_actions;
	CEdit* m_EditLog;
	CButton *m_run;
	HTREEITEM m_hItem;
	CString m_configPath;
	CRITICAL_SECTION m_para;
	int m_nVertPos; 
	//ִ���߳�
	static void Run(STR_TREEINFO *serverInfo);
	static void pipeInfo(HANDLE hReadPipe, HANDLE exeHwnd, STR_TREEINFO* LserverInfo);
	//������״̬
	static void ChangeTreeStatu(STR_TREEINFO *treeInfo, bool isRun);

	std::map<CString, STR_TREEINFO> m_serverBuff;

	//ͼ��
	CImageList m_img;
	void SetImageList();
	//���ṹ��
	void SetTreeInfo(CString serverName, CString serverPath); 

	static void writeLogToFile(STR_TREEINFO& tInfo, const char* data);
	static void displayData(STR_TREEINFO& tInfo, const char* data);
};

