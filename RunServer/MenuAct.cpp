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

void MenuAct::delRoomInfo(CRunServerDlg * dlg)
{
	if (CCtrlData::instance()->isPushStatu())
	{
		dlg->MessageBox(L"��ر�������������ԣ�", L"������ʾ��");
		return;
	} 
	
	CString token = CCtrlData::instance()->getSelectItemData();
	ffmpegMgr::instance()->dropPush(token); 
	WritePrivateProfileString(token, NULL, NULL, g_configPath); 
	CCtrlData::instance()->delSelectItem();
}

void MenuAct::alterRoomInfo(CRunServerDlg *dlg)
{ 
	if (CCtrlData::instance()->isPushStatu())
	{ 
		dlg->MessageBox(L"��ر�������������ԣ�", L"������ʾ��");
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
		dlg->MessageBox(L"��ر�������������ԣ�", L"������ʾ��");
		return;
	}
	ffmpegMgr::instance()->readyPush();
}

void MenuAct::startPush(CRunServerDlg * dlg)
{
	if (CCtrlData::instance()->isPushStatu())
	{
		dlg->MessageBox(L"�Ѿ��������ˣ�", L"��ܰ��ʾ��");
		return;
	}
	ffmpegMgr::instance()->startPush();
}

void MenuAct::stopPush(CRunServerDlg * dlg)
{
	ffmpegMgr::instance()->stopPush();
}

void MenuAct::dropPush(CRunServerDlg * dlg)
{
	if (CCtrlData::instance()->isPushStatu())
	{
		dlg->MessageBox(L"��ر�������������ԣ�", L"������ʾ��");
		return;
	}
	ffmpegMgr::instance()->dropPush();
}
