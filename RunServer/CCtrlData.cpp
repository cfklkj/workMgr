#include "stdafx.h"
#include "CCtrlData.h"
#include "resource.h"

static CCtrlData g_ctrlData;
extern CString g_configPath;
CCtrlData::CCtrlData()
{   
	m_maxScrollLine = 2000; //��־�����ֵ  2000
	m_dropLine = m_maxScrollLine * 4 / 5; //�Ƴ�������
}


CCtrlData::~CCtrlData()
{
}

CCtrlData * CCtrlData::instance()
{
	return &g_ctrlData;
}

bool CCtrlData::initCtrl(CTreeCtrl * treeHwnd, CEdit * editHwnd)
{
	setTreeCtrl(treeHwnd);
	setEditCtrl(editHwnd);
	return false;
}

//�޸ķ��
/*DWORD dwOriginalStyle = m_actions->GetStyle();
m_actions->ModifyStyle(m_actions->m_hWnd, dwOriginalStyle,
dwOriginalStyle | TVS_HASLINES, 0);*/
bool CCtrlData::initTreeCtrl(CTreeCtrl *treeHwnd)
{
	if (!treeHwnd)
		return false; 
	//https://blog.csdn.net/veryhehe2011/article/details/7964558
	//ͼ��
	static CImageList m_img;
	m_img.Create(GetSystemMetrics(SM_CXSMICON),
		GetSystemMetrics(SM_CYSMICON),
		ILC_COLOR24, 50, 50);
	m_img.SetBkColor(GetSysColor(COLOR_WINDOW));
	const wchar_t* path = L"shell32.dll ";
	m_img.Add(ExtractIcon(AfxGetApp()->m_hInstance, path, 19));
	m_img.Add(ExtractIcon(AfxGetApp()->m_hInstance, path, 20));
	m_img.Add(ExtractIcon(AfxGetApp()->m_hInstance, path, 15));
	m_img.Add(ExtractIcon(AfxGetApp()->m_hInstance, path, 4));
	treeHwnd->SetImageList(&m_img, TVSIL_NORMAL);
	//����
	WCHAR Rbuff[MAX_PATH] = { 0 };
	HTREEITEM rootItem = treeHwnd->InsertItem(L"�����б�:", TVI_ROOT);
	int lenth = GetPrivateProfileSectionNames(Rbuff, MAX_PATH, g_configPath);
	for (int i = 0; i < lenth; i++)
	{
		CString token = L"";
		if (i == 0)
		{
			token = &Rbuff[i];
		}
		else if (Rbuff[i] == '\0')
		{
			token = &Rbuff[i + 1];
		}

		WCHAR name[MAX_PATH] = { 0 };
		if (GetPrivateProfileString(token, L"name", L"", name, MAX_PATH, g_configPath))
		{ 
			i += lstrlen(name);
			InsertTreeItem(name, token);
		} 
	}
	treeHwnd->Expand(rootItem, TVE_EXPAND);
	return lenth;
} 
void CCtrlData::setItemRecord(HTREEITEM item, ActBtn act)
{
	m_tokenMap[item].act = act;
	m_tokenMap[item].item = item;
	m_tokenMap[item].token = getSelectItemData(item);
}
bool CCtrlData::changeSelectItemIcon(HTREEITEM item, bool isIconRun)
{
	int iconIndex = isIconRun ? ico_START : ico_STOP;
	getTreeCtrl()->SetItemImage(item, iconIndex, iconIndex);
	return getTreeCtrl()->SetItemData(item, iconIndex);
}
HTREEITEM CCtrlData::InsertTreeItem(CString serverName, CString token)
{
	HTREEITEM item = getTreeCtrl()->InsertItem((LPCTSTR)serverName, getTreeCtrl()->GetRootItem());

	m_tokenMap[item].token = token;  

	changeSelectItemIcon(item, false);
	setSelectItem(item); 
	return item;
}
CString CCtrlData::getSelectItemData()
{
	HTREEITEM item = getSelectItem();
	if (!item)
		return L""; 
	return m_tokenMap[item].token; 
}

CString CCtrlData::getSelectItemData(HTREEITEM item)
{
	return m_tokenMap[item].token;
}  

void CCtrlData::setSelectItem()
{ 
	CPoint pt;
	GetCursorPos(&pt);//�õ���ǰ����λ��
	getTreeCtrl()->ScreenToClient(&pt);//����Ļ����ת��Ϊ�ͻ�������
	HTREEITEM tree_Item = getTreeCtrl()->HitTest(pt);//����HitTest�ҵ���Ӧ��������ڵ�
	setSelectItem(tree_Item); 
}

void CCtrlData::TreePopMenu()
{
	//��ȡ����ǰ���ѡ������ڵ�
	HTREEITEM curItem = getSelectItem();
	CTreeCtrl * treeHwnd = getTreeCtrl();
	CMenu menu;
	menu.LoadMenuW(IDR_MENU1);
	CPoint ScreenPt;
	GetCursorPos(&ScreenPt);
	if (curItem == treeHwnd->GetRootItem())
	{
		CMenu* pPopup = menu.GetSubMenu(1);//װ�ص�һ���Ӳ˵��������ǲ˵��ĵ�һ��
		pPopup->TrackPopupMenu(TPM_LEFTALIGN, ScreenPt.x, ScreenPt.y, getTreeCtrl()->GetParent());//�����˵�
		return;
	}
	if (curItem != NULL)
	{
		treeHwnd->SelectItem(curItem); //ʹ�Ҽ����������ڵ㱻ѡ��
		if (CCtrlData::instance()->isPushStatu(curItem)) //STOP
		{
			CMenu* pPopup = menu.GetSubMenu(2); 
			pPopup->TrackPopupMenu(TPM_LEFTALIGN, ScreenPt.x, ScreenPt.y, treeHwnd->GetParent()); 
		}
		else  //START
		{
		 	CMenu* pPopup = menu.GetSubMenu(0);
		 	pPopup->TrackPopupMenu(TPM_LEFTALIGN, ScreenPt.x, ScreenPt.y, treeHwnd->GetParent());
		}

	}
	else  //ADD
	{
		CMenu* pPopup = menu.GetSubMenu(1);
		pPopup->TrackPopupMenu(TPM_LEFTALIGN, ScreenPt.x, ScreenPt.y, treeHwnd->GetParent());
	}
}
CString CCtrlData::getSelectItemChileName(HTREEITEM item)
{ 
	CTreeCtrl * treeHwnd = getTreeCtrl();
	HTREEITEM chileItem = item ? treeHwnd->GetChildItem(item) : treeHwnd->GetChildItem(getSelectItem());
	return treeHwnd->GetItemText(chileItem);
}
void CCtrlData::upSelectItemName(CString name)
{
	HTREEITEM curItem = getSelectItem();
	getTreeCtrl()->SetItemText(curItem, name);
} 
bool CCtrlData::isPushStatu()
{
	return isPushStatu(getSelectItem()); 
}
bool CCtrlData::isPushStatu(HTREEITEM item)
{
	if (item)
	{
		int imgIndex = m_tree->GetItemData(item);
		if (imgIndex == ico_START)
			return true;
	}
	return false;
}
void CCtrlData::delSelectItem()
{
	if (getSelectItem())
	{
		 m_tree->DeleteItem(getSelectItem()); 
		 setSelectItem(NULL);
	}
} 


//---------------------------------------edit  
void CCtrlData::updateEditCtrlData(CString msg)
{ 
	if (msg.IsEmpty())
		return;
	CEdit *editHwnd = getEditCtrl();
	int line = editHwnd->GetLineCount();  
	bool autoScroll = getIsScroll();
	bool isScrollBake = false; 
	if (autoScroll) //�Զ�����
	{
		if (isScrollBake)
		{
			editHwnd->SetRedraw(false);  
			editHwnd->SetSel(0, -1);
			editHwnd->Clear(); 
		} 
		editHwnd->SetSel(-1, isScrollBake ? false : autoScroll);
		editHwnd->ReplaceSel(msg);
		SendMessage(editHwnd->m_hWnd, WM_VSCROLL, SB_BOTTOM, NULL);
		if (isScrollBake)
		{
			editHwnd->SetRedraw(true);
		} 
	}
	else
	{
		editHwnd->SetRedraw(false);
		int tnVertPos = 0;
		if (isScrollBake)
		{
			tnVertPos = editHwnd->GetScrollPos(SB_VERT); 
			editHwnd->SetSel(0, -1);  //editHwnd->SetSel(0, dropBack, autoScroll);
			editHwnd->Clear(); 
		}  
		editHwnd->SetSel(-1);
		editHwnd->ReplaceSel(msg);
		if (isScrollBake && tnVertPos > m_dropLine)   //m_dropLine  �� GetScrollPos  ֵ��� 10
		{
			editHwnd->SetScrollPos(SB_VERT, tnVertPos - m_dropLine - 10);
			editHwnd->LineScroll(tnVertPos - m_dropLine - 10);
		}
		editHwnd->SetRedraw(true);
	}  
} 
//---//PostMessage(pRun->m_hWnd, WM_USER + 101, 0, keepReadBuff->GetLength()); //�����߳�ִ������ˢ��
void CCtrlData::scrollEdit(bool isAuto)
{
	CEdit * editHwnd = getEditCtrl();
	if (!isAuto) //ȡ���Զ�����
	{ 
		int tnVertPos = editHwnd->GetScrollPos(SB_VERT);
		editHwnd->SetRedraw(false);
		editHwnd->GetParent()->UpdateData(false); 
		editHwnd->SetScrollPos(SB_VERT, tnVertPos);
		editHwnd->LineScroll(tnVertPos);
		editHwnd->SetRedraw(true);
	}
	else
	{
		editHwnd->SetRedraw(false);
		editHwnd->GetParent()->UpdateData(false);
	 	editHwnd->LineScroll(editHwnd->GetLineCount()); //�������ײ� 
		editHwnd->SetRedraw(true);
	}  
}