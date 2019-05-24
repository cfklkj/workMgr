#pragma once
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

public:
	//tree
	bool initTreeCtrl(CTreeCtrl *treeHwnd);
	HTREEITEM InsertTreeItem(CTreeCtrl *treeHwnd, CString serverName, CString token);
	bool changeTreeIcon(CTreeCtrl *treeHwnd, HTREEITEM treeItem, bool isIconRun);
	HTREEITEM CCtrlData::GetSelectTree(CTreeCtrl *treeHwnd);
	void TreePopMenu(CTreeCtrl *treeHwnd);
	CString getSelectItemChileName(CTreeCtrl *treeHwnd, HTREEITEM item = NULL);
	void upSelectItemName(CTreeCtrl *treeHwnd, CString name);
	//--edit 
	//��ʾ���ݸ���
	void updateEditCtrlData(CEdit *editHwnd, CString msg, bool autoScroll, bool isScrollBake);
	//�ع�����true
	int updateEditStack(CString* oldData,CString* newData, int& oldDataLine);
	void scrollEdit(CEdit *editHwnd,  bool isAuto);
	//button
	void btnNormal(CButton *btnHwnd);
	void btnDown(CButton *btnHwnd);
	void btnDisable(CButton *btnHwnd);
	HTREEITEM getSelectItem() {
		return m_selectItem;
	};
	void setSelectItem(HTREEITEM item) {
		m_selectItem = item;
	};
private:  
	int m_maxScrollLine;
	int m_dropLine; 
	HTREEITEM m_selectItem;
};

