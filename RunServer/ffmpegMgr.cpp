#include "stdafx.h"
#include "ffmpegMgr.h"
#include "CCtrlData.h" 

static ffmpegMgr g_ffmpegMgr;

extern ConsoleFFmpeg g_ffmpeg;

ffmpegMgr::ffmpegMgr()
{
}


ffmpegMgr::~ffmpegMgr()
{
}

ffmpegMgr * ffmpegMgr::instance()
{
	return &g_ffmpegMgr;
}

void funcPushCmd(LPARAM lParam)
{ 
	ffmpegMgr* mgr = (ffmpegMgr*)lParam;
	CString token = CCtrlData::instance()->getSelectItemData();
	ActBtn oldBtn = mgr->getActBtn();
	mgr->setMbtn(FREE);
	mgr->sendCmd(token, oldBtn);
} 

void keepHeartConsoleFFmpeg(LPARAM lParam)
{ 
	ffmpegMgr* mgr = (ffmpegMgr*)lParam;
	mgr->sendHeart(true); 
}

void ffmpegMgr::readyPush()
{ 
	if (!isFreeBtn())
		return;
	if (!isNeedCreateRoom())
	{ 
		CCtrlData::instance()->updateEditCtrlData(L"������׼���ã��뿪������������");
		return;
	}
	setMbtn(CREATEROOM);
	HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)funcPushCmd, this, NULL, NULL);
	CloseHandle(hwnd);
}

void ffmpegMgr::startPush()
{
	if (!isFreeBtn())
		return;
	if (isNeedCreateRoom())
	{
		CCtrlData::instance()->updateEditCtrlData(L"����δ׼���ã����ȴ���ֱ�����䡣����");
		return;
	} 
	sendHeart(); //�������� 
	stopPush();
	setMbtn(PUSH);
	HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)funcPushCmd, this, NULL, NULL);
	CloseHandle(hwnd);
}

void ffmpegMgr::stopPush()
{  
	CString token = CCtrlData::instance()->getSelectItemData();
	stopPush(token);
}

void ffmpegMgr::stopPush(CString token)
{
	Fly_sys::Process::Run(Fly_string::w2c(getCmdStr(token, STOP)));
}

void ffmpegMgr::dropPush()
{
	CString token = CCtrlData::instance()->getSelectItemData();
	dropPush(token);
	
}

void ffmpegMgr::dropPush(CString token)
{
	stopPush(token);
	Fly_sys::Process::Run(Fly_string::w2c(getCmdStr(token, DROPROOM)));
	m_heartToken[token] = 0;
}
void ffmpegMgr::sendHeart(bool isThread)
{
	if (!isThread)
	{
		HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)keepHeartConsoleFFmpeg, this, NULL, NULL);
		CloseHandle(hwnd);
		return;
	}
	CString token = CCtrlData::instance()->getSelectItemData();
	ActBtn oldBtn = HEART;
	//У���Ƿ���������
	for (auto v : m_heartToken)
	{
		if (v.first == token && v.second > 0)
		{
			return;
		}
	}
	m_heartToken[token] = GetCurrentThreadId(); 

	Sleep(2000);
	std::string cmdStr = Fly_string::w2c(getCmdStr(token, oldBtn));
	//show msg
	CCtrlData::instance()->updateEditCtrlData(getBtnActTip(oldBtn, token, true));
	CCtrlData::instance()->changeSelectItemIcon(true);
	//request
	Fly_sys::Process::Run(cmdStr);
	DWORD ends = GetTickCount() + 30;
	while (!isNeedCreateRoom(token))
	{
		//request
		Sleep(1000);//  ���30s
		if (m_heartToken[token] < 1)
			break;
		if (GetTickCount() >= ends)
		{
			ends += 30;
			Fly_sys::Process::Run(cmdStr);
		}
	}
	//show msg
	CCtrlData::instance()->changeSelectItemIcon(false);
	CCtrlData::instance()->updateEditCtrlData(getBtnActTip(oldBtn, token, false)); 

	m_heartToken[token] = 0;
	WritePrivateProfileString(token, L"heart", L"0", g_ffmpeg.configPath_w);
}


 

CString ffmpegMgr::getCmdStr(CString token, ActBtn oldBtn)
{
	if (oldBtn == CREATEROOM)
	{
		return createRoom(token);
	}
	if (oldBtn == DROPROOM)
	{
		return getDropRoomCmdStr(token);
	}
	if (oldBtn == PUSH)
	{
		return getStartPushCmdStr(token);
	}
	if (oldBtn == STOP)
	{
		return getStopPushCmdStr(token);
	}
	if (oldBtn == HEART)
	{
		return getHeartBeatCmdStr(token);
	}
	return CString();
}

void ffmpegMgr::sendCmd(CString token, ActBtn oldBtn)
{

	std::string cmdStr = Fly_string::w2c(getCmdStr(token, oldBtn));
	//show msg
	CCtrlData::instance()->updateEditCtrlData(getBtnActTip(oldBtn, token, true)); 
	CCtrlData::instance()->changeSelectItemIcon(true);  
	//request
	Fly_sys::Process::Run(cmdStr);
	//show msg
	CCtrlData::instance()->changeSelectItemIcon(false);
	CCtrlData::instance()->updateEditCtrlData(getBtnActTip(oldBtn, token, false));
}

CString ffmpegMgr::getStartPushCmdStr(CString token)
{
	std::string lpCmd = g_ffmpeg.name; //Fly_string::c2w(g_ffmpeg.name.c_str()).c_str();
	lpCmd.append(",-s ");
	lpCmd.append(Fly_string::w2c(token));
	lpCmd.append(",");
	lpCmd.append(g_ffmpeg.path);
	lpCmd.append(",");
	lpCmd.append(",");
	lpCmd.append("1");

	return Fly_string::c2w(lpCmd.c_str()).c_str();
}

CString ffmpegMgr::getStopPushCmdStr(CString token)
{
	std::string lpCmd = g_ffmpeg.name; //Fly_string::c2w(g_ffmpeg.name.c_str()).c_str();
	lpCmd.append(",-e ");
	lpCmd.append(Fly_string::w2c(token));
	lpCmd.append(",");
	lpCmd.append(g_ffmpeg.path);
	return Fly_string::c2w(lpCmd.c_str()).c_str();
}

CString ffmpegMgr::getHeartBeatCmdStr(CString token)
{
	std::string lpCmd = g_ffmpeg.name; //Fly_string::c2w(g_ffmpeg.name.c_str()).c_str();
	lpCmd.append(",-h ");
	lpCmd.append(Fly_string::w2c(token));
	lpCmd.append(",");
	lpCmd.append(g_ffmpeg.path);
	lpCmd.append(",");
	lpCmd.append(",1");
	return Fly_string::c2w(lpCmd.c_str()).c_str();
}
CString ffmpegMgr::getDropRoomCmdStr(CString token)
{
	std::string lpCmd = g_ffmpeg.name; //Fly_string::c2w(g_ffmpeg.name.c_str()).c_str();
	lpCmd.append(",-d ");
	lpCmd.append(Fly_string::w2c(token));
	lpCmd.append(",");
	lpCmd.append(g_ffmpeg.path);
	lpCmd.append(",");
	lpCmd.append(",1");
	return Fly_string::c2w(lpCmd.c_str()).c_str();
}
CString ffmpegMgr::createRoom(CString token)
{
	std::string lpCmd = g_ffmpeg.name; //Fly_string::c2w(g_ffmpeg.name.c_str()).c_str();
	lpCmd.append(",-c ");
	lpCmd.append(Fly_string::w2c(token));
	lpCmd.append(",");
	lpCmd.append(g_ffmpeg.path);
	lpCmd.append(",");
	lpCmd.append(",");
	lpCmd.append("1");

	return Fly_string::c2w(lpCmd.c_str()).c_str();
}
 
CString ffmpegMgr::getBtnActTip(ActBtn oldBtn, CString token, bool isStart)
{
	if (oldBtn == CREATEROOM)
	{
		if (isStart)
		{
			return token + " ���󴴽�ֱ���䣡 ���Ժ󡣡�����\r\n";
		}
		else
		{
			CString rst = token + " �������󴴽�ֱ���䣡\r\n";
			std::string logFile = g_ffmpeg.path + "\\roomInfo_" + Fly_string::w2c(token) + ".log";
			std::string logInfo = Fly_string::UTF8ToGBK(Fly_file::File::catFile(logFile).c_str());
			if (isNeedCreateRoom(token))
			{
				stopPush(token);
				return rst + logInfo.c_str() + "\r\n ����ʧ�ܣ� ���Ժ����ԡ���\r\n";
			}
			return rst + logInfo.c_str() + "\r\n ��ϲ��ɹ������������ˡ�����\r\n";

		}
	}
	if (oldBtn == PUSH)
	{
		if (isStart)
		{
			m_oldReqPushTime[token] = time(NULL);
			return token + " ���������������С�����\r\n";
		}
		else
		{
			std::string timeCount = Fly_Time::TIME::TickToTimeStr(time(NULL) - m_oldReqPushTime[token]);
			return token + " ��������!\r\n ��ʱ---- " + timeCount.c_str() + "\r\n";
		}
	}
	if (oldBtn == HEART)
	{
		if (isStart)
		{
			return token + " ����������������\r\n";
		}
		else
		{
			return token + " ��������!--ֱ���������٣�\r\n";
		}
	}
	if (oldBtn == STOP)
	{
		if (isStart)
		{
			return token + " �������������\r\n";
		}
		else
		{
			return token + " ����ֹͣ��������!\r\n";
		}
	}
	return CString();
}


bool ffmpegMgr::isNeedCreateRoom()
{
	CString token = CCtrlData::instance()->getSelectItemData();
	return isNeedCreateRoom(token); 
}

bool ffmpegMgr::isNeedCreateRoom(CString token)
{ 
	int times = GetPrivateProfileInt(token, L"heart", 0, g_ffmpeg.configPath_w);
	int tick = time(NULL) - times;
	if (tick < 35)//  ������  50s
		return false; 
	dropPush(token);
	return true;
}
 
void ffmpegMgr::setMbtn(ActBtn btn)
{
	m_btn = btn;
}

bool ffmpegMgr::isFreeBtn()
{
	if (m_btn == ActBtn::FREE)
		return true;
	return false;
}
