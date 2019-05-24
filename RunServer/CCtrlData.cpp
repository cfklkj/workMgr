#include "stdafx.h"
#include "CCtrlData.h"
#include "resource.h"


extern CString g_configPath;
CCtrlData::CCtrlData()
{   
	m_maxScrollLine = 2000; //日志最大行值  2000
	m_dropLine = m_maxScrollLine * 4 / 5; //移除旧内容
}


CCtrlData::~CCtrlData()
{
}

//修改风格
/*DWORD dwOriginalStyle = m_actions->GetStyle();
m_actions->ModifyStyle(m_actions->m_hWnd, dwOriginalStyle,
dwOriginalStyle | TVS_HASLINES, 0);*/
bool CCtrlData::initTreeCtrl(CTreeCtrl *treeHwnd)
{
	if (!treeHwnd)
		return false;
	//https://blog.csdn.net/veryhehe2011/article/details/7964558
	//图标
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
	//内容
	WCHAR Rbuff[MAX_PATH] = { 0 };
	HTREEITEM rootItem = treeHwnd->InsertItem(L"推流列表:", TVI_ROOT);
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
	GetCursorPos(&pt);//得到当前鼠标的位置
	treeHwnd->ScreenToClient(&pt);//将屏幕坐标转换为客户区坐标
	HTREEITEM tree_Item = treeHwnd->HitTest(pt);//调用HitTest找到对应点击的树节点
	setSelectItem(tree_Item);
	return tree_Item;
}

void CCtrlData::TreePopMenu(CTreeCtrl *treeHwnd)
{
	//获取到当前鼠标选择的树节点
	HTREEITEM curItem = GetSelectTree(treeHwnd);
	CMenu menu;
	menu.LoadMenuW(IDR_MENU1);
	CPoint ScreenPt;
	GetCursorPos(&ScreenPt);
	if (curItem == treeHwnd->GetRootItem())
	{
		CMenu* pPopup = menu.GetSubMenu(1);//装载第一个子菜单，即我们菜单的第一列
		pPopup->TrackPopupMenu(TPM_LEFTALIGN, ScreenPt.x, ScreenPt.y, treeHwnd->GetParent());//弹出菜单
		return;
	}
	if (curItem != NULL)
	{  
		treeHwnd->SelectItem(curItem); //使右键单击的树节点被选中
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
	if (autoScroll) //自动滚动
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
		if (isScrollBake && tnVertPos > m_dropLine)   //m_dropLine  与 GetScrollPos  值误差 10
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
		//数据内存回滚
		//在临时内存处理数据
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
		//更新显示数据
		oldData->Empty();   //处理内存泄漏
		*oldData = tempLog;
		return true;
	}
}
//---//PostMessage(pRun->m_hWnd, WM_USER + 101, 0, keepReadBuff->GetLength()); //让主线程执行数据刷新
void CCtrlData::scrollEdit(CEdit *editHwnd, bool isAuto)
{
	if (!isAuto) //取消自动滚动
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
	 	editHwnd->LineScroll(editHwnd->GetLineCount()); //滚动到底部 
		editHwnd->SetRedraw(true);
	}  
}