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
	ItemRecord itemRecord = *(ItemRecord*)lParam;    
	ffmpegMgr::instance()->sendCmd(itemRecord.item, itemRecord.token, itemRecord.act);
} 

void keepHeartConsoleFFmpeg(LPARAM lParam)
{
	ItemRecord itemRecord = *(ItemRecord*)lParam;
	ffmpegMgr::instance()->sendHeart(itemRecord.item, true);
}

void ffmpegMgr::readyPush()
{   
	readyPush(CCtrlData::instance()->getSelectItem());
}

void ffmpegMgr::readyPush(HTREEITEM oldItem)
{ 
	if (!isNeedCreateRoom(oldItem))
	{
		startPush(oldItem);
		return;
	} 
	CCtrlData::instance()->setItemRecord(oldItem, CREATEROOM);
	HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)funcPushCmd, CCtrlData::instance()->getItemRecord(oldItem), NULL, NULL);
	CloseHandle(hwnd);
}

void ffmpegMgr::startPush()
{  
	startPush(CCtrlData::instance()->getSelectItem());
}

void ffmpegMgr::startPush(HTREEITEM oldItem)
{
	if (isNeedCreateRoom(oldItem))
	{
		CCtrlData::instance()->updateEditCtrlData(L"����δ׼���ã����ȴ���ֱ�����䡣����\r\n");
		return;
	}
	CCtrlData::instance()->setItemRecord(oldItem, PUSH);
	sendHeart(oldItem, false);   //��������  
	HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)funcPushCmd, CCtrlData::instance()->getItemRecord(oldItem), NULL, NULL);
	CloseHandle(hwnd);
}
 
void ffmpegMgr::stopPush(HTREEITEM item)
{
	CString token = CCtrlData::instance()->getSelectItemData(item);
	Fly_sys::Process::Run(Fly_string::w2c(getCmdStr(token, STOP)));
}

void ffmpegMgr::dropPush()
{ 
	dropPush(CCtrlData::instance()->getSelectItem()); 
}

void ffmpegMgr::dropPush(HTREEITEM item)
{
	CString token = CCtrlData::instance()->getSelectItemData(item);
	stopPush(item);
	Fly_sys::Process::Run(Fly_string::w2c(getCmdStr(token, DROPROOM)));
	setHeartTokenStatu(token, STOP_TOKEN);
}
void ffmpegMgr::sendHeart(HTREEITEM item, bool isThread)
{
	if (!isThread)
	{ 
		HANDLE hwnd = CreateThread(NULL, NULL, (LPTHREAD_START_ROUTINE)keepHeartConsoleFFmpeg, CCtrlData::instance()->getItemRecord(item), NULL, NULL);
		CloseHandle(hwnd);
		return;
	}
	ItemRecord itemRecord = *CCtrlData::instance()->getItemRecord(item);
	CString token = itemRecord.token;
	ActBtn oldBtn = HEART;
	//У���Ƿ���������
	for (auto v : m_heartToken)
	{
		if (v.first == token && isHeartTokenNeedSend(v.first))
		{
			return;
		}
	}
	setHeartTokenStatu(token, RUN_TOKEN);

	Sleep(2000);
	std::string cmdStr = Fly_string::w2c(getCmdStr(token, oldBtn));
	//show msg
	CCtrlData::instance()->updateEditCtrlData(getBtnActTip(item, oldBtn, true)); 
	//request 
	DWORD ends = GetTickCount() + 30000;  //1000 = 1s
	while (!isNeedCreateRoom(item))
	{
		//request
		Sleep(1000);//  ���30s
		if (isHeartTokenForceStop(token))
			break;
		if (GetTickCount() >= ends)
		{
			ends += 30000;
			Fly_sys::Process::Run(cmdStr);
		}
	}
	if (isCloseWindow())
		return;
	//show msg 
	CCtrlData::instance()->updateEditCtrlData(getBtnActTip(item, oldBtn, false)); 

	dropPush(item);
	setHeartTokenStatu(token, STOP_TOKEN);
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

void ffmpegMgr::sendCmd(HTREEITEM oldItem, CString token, ActBtn oldBtn)
{

	std::string cmdStr = Fly_string::w2c(getCmdStr(token, oldBtn));
	//show msg
	CCtrlData::instance()->updateEditCtrlData(getBtnActTip(oldItem, oldBtn, true)); 
	CCtrlData::instance()->changeTreeItemIcon(oldItem, true);
	//request
	Fly_sys::Process::Run(cmdStr);
	if (isCloseWindow())
		return;
	//show msg
	CCtrlData::instance()->changeTreeItemIcon(oldItem, false);
	CCtrlData::instance()->updateEditCtrlData(getBtnActTip(oldItem, oldBtn, false));
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
 
CString ffmpegMgr::getBtnActTip(HTREEITEM item, ActBtn oldBtn,  bool isStart)
{
	CString token = CCtrlData::instance()->getSelectItemData(item);
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
			if (isNeedCreateRoom(item))
			{
				stopPush(item);
				dropPush(item);
				return rst + logInfo.c_str() + "\r\n ����ʧ�ܣ� ���Ժ����ԡ���\r\n";
			}
			this->startPush(item);
			return rst + logInfo.c_str() + "\r\n " + Fly_Time::TIME::GetDateTimeString().c_str() + "��ϲ��Ҫ�����ˡ�����\r\n";

		}
	}
	if (oldBtn == PUSH)
	{
		if (isStart)
		{
			m_oldReqPushTime[token] = time(NULL);
			return token + " ����ֱ��������ֱ���������С�����\r\n";
		}
		else
		{
			std::string timeCount = Fly_Time::TIME::TickToTimeStr((time(NULL) - m_oldReqPushTime[token]));
			dropPush(item);
			return token + " ����ֱ������!\r\n" +  Fly_Time::TIME::GetDateTimeString().c_str() + " ��ʱ---- " + timeCount.c_str() + "\r\n";
		}
	}
	if (oldBtn == HEART)
	{
		if (isStart)
		{
			return token + " ����ֱ����������������\r\n";
		}
		else
		{
			return token + " ֱ������������!--ֱ���������٣�\r\n";
		}
	}
	if (oldBtn == STOP)
	{
		if (isStart)
		{
			return token + " �����²���\r\n";
		}
		else
		{
			return token + " ���²�!\r\n";
		}
	}
	return CString();
}

 

bool ffmpegMgr::isNeedCreateRoom(HTREEITEM item)
{
	CString token = CCtrlData::instance()->getSelectItemData(item);
	int times = GetPrivateProfileInt(token, L"heart", 0, g_ffmpeg.configPath_w);
	int tick = time(NULL) - times;
	if (tick < 35)//  ������  50s
		return false; 
	stopPush(item);
	dropPush(item);
	return true;
}
  