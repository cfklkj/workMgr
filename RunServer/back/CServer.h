#pragma once
#include <map>

#define defPIPReadBuffLen 65536   //64k
#define defPIPReadTime 500   //0.5s

class CServer
{
public:
	CServer();
	~CServer();  
	//服务是否在运行
	bool IsServerRun(CString serverName);
	//运行
	bool RunServer(CString serverName, CString lpCmd, CString lpDirector);
	//停止-清理
	void StopServer(CString serverName);
	//获取日志
	char* getPrintInfo(CString serverName);

private:
	struct STR_RUNSERVERINFO
	{
		CString fileDir;
		CString serverName;
		bool isRun;
		HANDLE hReadPipe, hWritePipe;
		PROCESS_INFORMATION pi;
		FILE* stream;
	}; 
	STR_RUNSERVERINFO m_serverBuff; 
	char m_readBuff[defPIPReadBuffLen + 1];
	//写日志
	void writeLogToFile(const char* data);
};

