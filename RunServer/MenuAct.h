#pragma once
class CRunServerDlg;

class MenuAct
{
public:
	MenuAct();
	~MenuAct();
	static MenuAct *instance();
public:
	//�˵�һ
	void AddRoomInfo(CRunServerDlg *dlg);
	void explorerThis();
	void allPush();
	void allPushStop();
	//�˵���
	void delRoomInfo(CRunServerDlg* dlg);
	void alterRoomInfo(CRunServerDlg *dlg);
	void lookRoomInfo(CRunServerDlg *dlg);
	void readyPush(CRunServerDlg *dlg); 
	void dropPush(CRunServerDlg *dlg);
	 

};

