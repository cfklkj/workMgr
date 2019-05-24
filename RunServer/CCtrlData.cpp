#include "stdafx.h"
#include "CCtrlData.h"
#include "resource.h"


extern CString g_configPath;
CCtrlData::CCtrlData()
{   
	m_maxScrollLine = 2000; //��־�����ֵ  2000
	m_dropLine = m_maxScrollLine * 4 / 5; //�Ƴ�������
}


CCtrlData::~CCtrlData()
{
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
	m_img.Add(ExtractIcon(AfxGetApp()->m_hInstance, path, 50));
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
			InsertTreeItem(treeHwnd, name, token);
		} 
	}
	treeHwnd->Expand(rootItem, TVE_EXPAND);
	return lenth;
}
HTREEITEM CCtrlData::InsertTreeItem(CTreeCtrl *treeHwnd, CString serverName, CString token)
{ 
	HTREEITEM item = treeHwnd->InsertItem((LPCTSTR)serverName, treeHwnd->GetRootItem());
	HTREEITEM tItem = treeHwnd->InsertItem((LPCTSTR)token, item);
	treeHwnd->SetItemImage(tItem, 3, 3);
	treeHwnd->SetItemData(tItem, 3);
	changeTreeIcon(treeHwnd, item, false);
	return item;
} 
bool CCtrlData::changeTreeIcon(CTreeCtrl *treeHwnd, HTREEITEM treeItem, bool isIconRun )
{
	int iconIndex = isIconRun ? ico_START : ico_STOP;
	treeHwnd->SetItemImage(treeItem, iconIndex, iconIndex);
	return treeHwnd->SetItemData(treeItem, iconIndex);
}
HTREEITEM CCtrlData::GetSelectTree(CTreeCtrl *treeHwnd)
{
	CPoint pt;
	GetCursorPos(&pt);//�õ���ǰ����λ��
	treeHwnd->ScreenToClient(&pt);//����Ļ����ת��Ϊ�ͻ�������
	HTREEITEM tree_Item = treeHwnd->HitTest(pt);//����HitTest�ҵ���Ӧ��������ڵ�
	setSelectItem(tree_Item);
	return tree_Item;
}

void CCtrlData::TreePopMenu(CTreeCtrl *treeHwnd)
{
	//��ȡ����ǰ���ѡ������ڵ�
	HTREEITEM curItem = GetSelectTree(treeHwnd);
	CMenu menu;
	menu.LoadMenuW(IDR_MENU1);
	CPoint ScreenPt;
	GetCursorPos(&ScreenPt);
	if (curItem == treeHwnd->GetRootItem())
	{
		CMenu* pPopup = menu.GetSubMenu(1);//װ�ص�һ���Ӳ˵��������ǲ˵��ĵ�һ��
		pPopup->TrackPopupMenu(TPM_LEFTALIGN, ScreenPt.x, ScreenPt.y, treeHwnd->GetParent());//�����˵�
		return;
	}
	if (curItem != NULL)
	{  
		treeHwnd->SelectItem(curItem); //ʹ�Ҽ����������ڵ㱻ѡ��
		int imgIndex = treeHwnd->GetItemData(curItem);
		if (imgIndex != 3)
		{
			CMenu* pPopup = menu.GetSubMenu(0); 
			pPopup->TrackPopupMenu(TPM_LEFTALIGN, ScreenPt.x, ScreenPt.y, treeHwnd->GetParent()); 
		}
		else
		{
		//	CMenu* pPopup = menu.GetSubMenu(2);
		//	pPopup->TrackPopupMenu(TPM_LEFTALIGN, ScreenPt.x, ScreenPt.y, treeHwnd->GetParent());
		}

	}
	else
	{
		CMenu* pPopup = menu.GetSubMenu(1);
		pPopup->TrackPopupMenu(TPM_LEFTALIGN, ScreenPt.x, ScreenPt.y, treeHwnd->GetParent());
	}
}
CString CCtrlData::getSelectItemChileName(CTreeCtrl * treeHwnd, HTREEITEM item)
{ 
	HTREEITEM chileItem = item ? treeHwnd->GetChildItem(item) : treeHwnd->GetChildItem(getSelectItem());
	return treeHwnd->GetItemText(chileItem);
}
void CCtrlData::upSelectItemName(CTreeCtrl *treeHwnd, CString name)
{
	HTREEITEM curItem = getSelectItem();
	treeHwnd->SetItemText(curItem, name);
}
//---------------------------------------btn
void CCtrlData::btnDisable(CButton *btnHwnd)
{
	btnHwnd->EnableWindow(false);
	btnHwnd->SetWindowText(L"Run");
}
void CCtrlData::btnNormal(CButton *btnHwnd)
{
	btnHwnd->EnableWindow(true);
	btnHwnd->SetWindowText(L"Run");
}
void CCtrlData::btnDown(CButton *btnHwnd)
{
	btnHwnd->EnableWindow(true);
	btnHwnd->SetWindowText(L"stop");
}


//---------------------------------------edit  
void CCtrlData::updateEditCtrlData(CEdit *editHwnd, CString msg, bool autoScroll, bool isScrollBake)
{ 
	if (msg.IsEmpty())
		return;
	int line = editHwnd->GetLineCount();  
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
int CCtrlData::updateEditStack(CString* oldData, CString* newData, int& oldDataLine)
{
	if (!oldData || !newData)
		return false; 					  
	if (oldDataLine < m_maxScrollLine)
	{
		*oldData += *newData;
		return false;
	}
	else
	{
		//�����ڴ�ع�
		//����ʱ�ڴ洦������
		CString tempRead = L"";
		tempRead = *oldData + *newData;
		const wchar_t* tempLog = tempRead;  
		oldDataLine -= m_dropLine; 
		int i = 0;
		while (*tempLog && i < m_dropLine)
		{
			if (*tempLog == '\n')
				i++;
			tempLog++;
		}
		//������ʾ����
		oldData->Empty();   //�����ڴ�й©
		*oldData = tempLog;
		return true;
	}
}
//---//PostMessage(pRun->m_hWnd, WM_USER + 101, 0, keepReadBuff->GetLength()); //�����߳�ִ������ˢ��
void CCtrlData::scrollEdit(CEdit *editHwnd, bool isAuto)
{
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