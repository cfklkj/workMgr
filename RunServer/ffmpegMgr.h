#pragma once
#include <map>

class ffmpegMgr
{
public:
	ffmpegMgr();
	~ffmpegMgr();
	static ffmpegMgr *instance();

public:
	void readyPush();
	void startPush();
	void stopPush();
	void stopPush(CString token);
	void dropPush();
	void dropPush(CString token);
	void sendHeart(bool isThread = false);
	CString getCmdStr(CString token, ActBtn oldBtn);
	CString getBtnActTip(ActBtn oldBtn, CString token, bool isStart);
	void sendCmd(CString token, ActBtn oldBtn);

private:
	bool isNeedCreateRoom();
	bool isNeedCreateRoom(CString token);
	CString getStartPushCmdStr(CString token);
	CString getStopPushCmdStr(CString token);
	CString getDropRoomCmdStr(CString token);
	CString getHeartBeatCmdStr(CString token);
	CString createRoom(CString token);

public:
	void setMbtn(ActBtn btn);
	bool isFreeBtn();
	ActBtn getActBtn() { return m_btn; };


private: 
	ActBtn m_btn = FREE;
	std::map<CString, int> m_heartToken;  //保留一个心跳
	std::map<CString, time_t> m_oldReqPushTime;  //记录执行时间
};

