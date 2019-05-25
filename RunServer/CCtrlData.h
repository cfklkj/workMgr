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
	HTREEITEM InsertTreeItem(CString serverName, CString token);
	bool changeSelectItemIcon(bool isIconRun);
	HTREEITEM CCtrlData::GetSelectTree(CTreeCtrl *treeHwnd);
	void TreePopMenu(CTreeCtrl *treeHwnd);
	CString getSelectItemChileName(HTREEITEM item = NULL);
	void upSelectItemName(CString name);
	//--edit 
	//��ʾ���ݸ���
	void updateEditCtrlData(CString msg);
	//�ع�����true
	int updateEditStack(CString* oldData,CString* newData, int& oldDataLine);
	void scrollEdit(CEdit *editHwnd,  bool isAuto);
	//button
	void btnNormal(CButton *btnHwnd);
	void btnDown(CButton *btnHwnd);
	void btnDisable(CButton *btnHwnd);
	//�жϽڵ��Ƿ�������״̬
	bool isPushStatu();
	//ɾ��ѡ�нڵ�
	void delSelectItem();
	//ѡ��ڵ�
	HTREEITEM getSelectItem() {
		return m_selectItem;
	};
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
	bool  getisScroll() {
		return m_isScroll;
	};
	void setIsScroll(bool isScroll) {
		m_isScroll = isScroll;
	};
private:
	bool initTreeCtrl(CTreeCtrl *treeHwnd);
	bool changeTreeItemIcon(HTREEITEM item, bool isIconRun);

private:  
	int m_maxScrollLine;
	int m_dropLine; 
	HTREEITEM m_selectItem =NULL;
	CTreeCtrl *m_tree;
	CEdit *m_edit;
	bool m_isScroll = true; 
	std::map<HTREEITEM, CString> m_tokenMap;
	 
};

