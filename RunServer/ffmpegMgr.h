#pragma once
#include <map>

enum TOKENStatu {
	STOP_TOKEN=0,
	RUN_TOKEN,
	WAIT_TOKEN,
};

class ffmpegMgr
{
public:
	ffmpegMgr();
	~ffmpegMgr();
	static ffmpegMgr *instance();

public:
	void readyPush();
	void readyPush(HTREEITEM oldItem);
	void startPush();
	void startPush(HTREEITEM oldItem); 
	void dropPush();
	void dropPush(HTREEITEM item);
	void sendHeart(HTREEITEM item, bool isThread);
	CString getCmdStr(CString token, ActBtn oldBtn);
	CString getBtnActTip(HTREEITEM item, ActBtn oldBtn,bool isStart);
	void sendCmd(HTREEITEM oldItem, CString token, ActBtn oldBtn);

private: 
	bool isNeedCreateRoom(HTREEITEM item);
	CString getStartPushCmdStr(CString token);
	CString getStopPushCmdStr(CString token);
	CString getDropRoomCmdStr(CString token);
	CString getHeartBeatCmdStr(CString token);
	CString createRoom(CString token);
	void stopPush(HTREEITEM item);

public: 

	void setHeartTokenStatu(CString token, TOKENStatu statu) {
		m_heartToken[token] = statu;
	};
	bool isHeartTokenNeedSend(CString token) {
		return m_heartToken[token] == WAIT_TOKEN;
	};
	bool isHeartTokenForceStop(CString token) {
		return m_heartToken[token] == STOP_TOKEN;
	};
	void setCloseWindowValue() { m_isCloseWindow = true; };
	bool isCloseWindow() { return m_isCloseWindow; };
private:  
	std::map<CString, int> m_heartToken;  //保留一个心跳
	std::map<CString, time_t> m_oldReqPushTime;  //记录执行时间
	bool m_isCloseWindow = false;
};

