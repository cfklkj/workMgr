#pragma once
#include <map>
enum enum_ICONINDEX
{
	ico_STOP = 1,
	ico_START = 2,
};
enum  enum_RUNSTATUS
{
	btn_STOP = 1,
	btn_START = 2,
	btn_AllPause,
	btn_AllSTOP,
	btn_Clear,
	btn_MouseScroll,
	btn_CheckAutoScroll,
	btn_SelectItem,
	btn_LRBtnDown,
};
struct ItemRecord {
	HTREEITEM item;
	ActBtn act;
	CString token;
	bool isPush() {
		return act == PUSH;
	};
};

class CCtrlData
{
public:
	CCtrlData();
	~CCtrlData();

	static CCtrlData *instance();
public:
	//tree
	bool initCtrl(CTreeCtrl *treeHwnd, CEdit *edtiHwnd);

	CString getSelectItemData();
	CString getSelectItemData(HTREEITEM item);
	HTREEITEM InsertTreeItem(CString serverName, CString token); 
	bool changeSelectItemIcon(HTREEITEM item, bool isIconRun);
	
	void TreePopMenu();
	CString getSelectItemChileName(HTREEITEM item = NULL);
	void upSelectItemName(CString name);
	//--edit 
	//��ʾ���ݸ���
	void updateEditCtrlData(CString msg);
	//�ع�����true 
	void scrollEdit(bool isAuto); 
	//�жϽڵ��Ƿ�������״̬
	bool isPushStatu();
	bool isPushStatu(HTREEITEM item);
	//ɾ��ѡ�нڵ�
	void delSelectItem();
	//ѡ��ڵ� 
	HTREEITEM getSelectItem() {
		return m_selectItem;
	};
	void setSelectItem();
	void setSelectItem(HTREEITEM item) {
		m_selectItem = item;
	};
	//���ؼ�
	CTreeCtrl *getTreeCtrl() {
		return m_tree;
	};
	void setTreeCtrl(CTreeCtrl *treeHwnd) {
		m_tree = treeHwnd;
		initTreeCtrl(m_tree);
	};
	//�༭�ؼ�
	CEdit *getEditCtrl() {
		return m_edit;
	};
	void setEditCtrl(CEdit *editHwnd) {
		m_edit = editHwnd; 
	};
	//�Ƿ��Զ�����
	bool  getIsScroll() {
		return m_isScroll;
	};
	void setIsScroll(bool isScroll) {
		m_isScroll = isScroll;
		scrollEdit(m_isScroll);
	};

private:
	bool initTreeCtrl(CTreeCtrl *treeHwnd);

public: 
	 //��¼�ڵ�����������ͻ
	void setItemRecord(HTREEITEM item, ActBtn act);
	ItemRecord *getItemRecord(HTREEITEM item) {
		return &m_tokenMap[item];
	};
private:  
	int m_maxScrollLine;
	int m_dropLine; 
	HTREEITEM m_selectItem =NULL;
	CTreeCtrl *m_tree;
	CEdit *m_edit;
	bool m_isScroll = true; 
	std::map<HTREEITEM, ItemRecord> m_tokenMap;
	 
};

