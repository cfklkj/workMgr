#include "stdafx.h"
#include "CCtrlData.h"
#include "MenuAct.h"
#include "RunServerDlg.h"
#include "CAddServerDlg.h"
#include "ffmpegMgr.h"

extern CString g_configPath;

MenuAct g_menuAct;
MenuAct::MenuAct()
{
}


MenuAct::~MenuAct()
{
}

MenuAct * MenuAct::instance()
{
	return &g_menuAct;
}

void MenuAct::AddRoomInfo(CRunServerDlg * dlg)
{
	CAddServerDlg adddlg;
	CString token = L"";
	if (adddlg.DoModal() == IDOK)
	{
		if (adddlg.isTokenUp(token))
		{
			CCtrlData::instance()->InsertTreeItem(adddlg.getServerName(), adddlg.getToken());
		}
	}
}

void MenuAct::explorerThis()
{ 
	WCHAR path[MAX_PATH];
	GetModuleFileName(NULL, path, MAX_PATH);
	wchar_t *wtemp = wcsrchr(path, '\\');
	*wtemp = 0;
	ShellExecute(NULL, L"open", path, NULL, NULL, SW_SHOW);
}

void MenuAct::allPush()
{
	HTREEITEM hCurItem = CCtrlData::instance()->getTreeCtrl()->GetChildItem(CCtrlData::instance()->getTreeCtrl()->GetRootItem());
	while (hCurItem)
	{
		if (!CCtrlData::instance()->isPushStatu(hCurItem))
		{
			CCtrlData::instance()->getTreeCtrl()->SelectItem(hCurItem); 
			ffmpegMgr::instance()->readyPush(hCurItem); 
		}
		hCurItem = CCtrlData::instance()->getTreeCtrl()->GetNextSiblingItem(hCurItem);
	}
}

void MenuAct::allPushStop()
{
	HTREEITEM hCurItem = CCtrlData::instance()->getTreeCtrl()->GetChildItem(CCtrlData::instance()->getTreeCtrl()->GetRootItem());
	while (hCurItem)
	{
		if (CCtrlData::instance()->isPushStatu(hCurItem))
		{ 
			ffmpegMgr::instance()->dropPush(hCurItem);
		}
		hCurItem = CCtrlData::instance()->getTreeCtrl()->GetNextSiblingItem(hCurItem);
	}
}

void MenuAct::delRoomInfo(CRunServerDlg * dlg)
{
	if (CCtrlData::instance()->isPushStatu())
	{
		dlg->MessageBox(L"请关闭推流服务后重试！", L"错误提示！");
		return;
	} 

	HTREEITEM item = CCtrlData::instance()->getSelectItem();
	CString token = CCtrlData::instance()->getSelectItemData();
	ffmpegMgr::instance()->dropPush(item);
	WritePrivateProfileString(token, NULL, NULL, g_configPath); 
	CCtrlData::instance()->delSelectItem();
}

void MenuAct::alterRoomInfo(CRunServerDlg *dlg)
{ 
	if (CCtrlData::instance()->isPushStatu())
	{ 
		dlg->MessageBox(L"请关闭推流服务后重试！", L"错误提示！");
		return ; 
	}

	CAddServerDlg adddlg;
	CString token = CCtrlData::instance()->getSelectItemData();
	adddlg.setToken(token);
	if (adddlg.DoModal() != IDOK)
		return; 
	if (adddlg.isTokenUp(token))
	{
		CCtrlData::instance()->InsertTreeItem(adddlg.getServerName(), adddlg.getToken());
	}
	else
	{
		CCtrlData::instance()->upSelectItemName(adddlg.getServerName());
	} 
}

void MenuAct::lookRoomInfo(CRunServerDlg * dlg)
{ 
	CString token = CCtrlData::instance()->getSelectItemData();
	dlg->showIniSection(token);
}

void MenuAct::readyPush(CRunServerDlg * dlg)
{
	if (CCtrlData::instance()->isPushStatu())
	{
		dlg->MessageBox(L"请关闭推流服务后重试！", L"错误提示！");
		return;
	}
	ffmpegMgr::instance()->readyPush();
}

void MenuAct::startPush(CRunServerDlg * dlg)
{
	if (CCtrlData::instance()->isPushStatu())
	{
		dlg->MessageBox(L"已经在推流了！", L"温馨提示！");
		return;
	}
	ffmpegMgr::instance()->startPush();
}
 

void MenuAct::dropPush(CRunServerDlg * dlg)
{  
	ffmpegMgr::instance()->dropPush();
}
