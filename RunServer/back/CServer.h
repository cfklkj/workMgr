#pragma once
#include <map>

#define defPIPReadBuffLen 65536   //64k
#define defPIPReadTime 500   //0.5s

class CServer
{
public:
	CServer();
	~CServer();  
	//�����Ƿ�������
	bool IsServerRun(CString serverName);
	//����
	bool RunServer(CString serverName, CString lpCmd, CString lpDirector);
	//ֹͣ-����
	void StopServer(CString serverName);
	//��ȡ��־
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
	//д��־
	void writeLogToFile(const char* data);
};

