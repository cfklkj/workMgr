#pragma once
class CRunServerDlg;

class MenuAct
{
public:
	MenuAct();
	~MenuAct();
	static MenuAct *instance();
public:
	//菜单一
	void AddRoomInfo(CRunServerDlg *dlg);
	void explorerThis();
	void allPush();
	void allPushStop();
	//菜单二
	void delRoomInfo(CRunServerDlg* dlg);
	void alterRoomInfo(CRunServerDlg *dlg);
	void lookRoomInfo(CRunServerDlg *dlg);
	void readyPush(CRunServerDlg *dlg); 
	void dropPush(CRunServerDlg *dlg);
	 

};

