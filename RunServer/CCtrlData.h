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
	bool changeSelectItemIcon(bool isIconRun);
	bool changeTreeItemIcon(HTREEITEM item, bool isIconRun);
	HTREEITEM CCtrlData::GetSelectTree(CTreeCtrl *treeHwnd);
	void TreePopMenu(CTreeCtrl *treeHwnd);
	CString getSelectItemChileName(HTREEITEM item = NULL);
	void upSelectItemName(CString name);
	//--edit 
	//显示数据更新
	void updateEditCtrlData(CString msg);
	//回滚返回true
	int updateEditStack(CString* oldData,CString* newData, int& oldDataLine);
	void scrollEdit(CEdit *editHwnd,  bool isAuto);
	//button
	void btnNormal(CButton *btnHwnd);
	void btnDown(CButton *btnHwnd);
	void btnDisable(CButton *btnHwnd);
	//判断节点是否在推流状态
	bool isPushStatu();
	bool isPushStatu(HTREEITEM item);
	//删除选中节点
	void delSelectItem();
	//选择节点
	HTREEITEM getSelectItem() {
		return m_selectItem;
	};
	void setSelectItem(HTREEITEM item) {
		m_selectItem = item;
	};
	//树控件
	CTreeCtrl *getTreeCtrl() {
		return m_tree;
	};
	void setTreeCtrl(CTreeCtrl *treeHwnd) {
		m_tree = treeHwnd;
		initTreeCtrl(m_tree);
	};
	//编辑控件
	CEdit *getEditCtrl() {
		return m_edit;
	};
	void setEditCtrl(CEdit *editHwnd) {
		m_edit = editHwnd; 
	};
	//是否自动滚动
	bool  getisScroll() {
		return m_isScroll;
	};
	void setIsScroll(bool isScroll) {
		m_isScroll = isScroll;
	};

private:
	bool initTreeCtrl(CTreeCtrl *treeHwnd);

public: 
	 
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

