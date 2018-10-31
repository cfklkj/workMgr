#pragma once
#include "hiredis.h"
#include "async.h"

class redisConn
{
public:
	redisConn();
	~redisConn();

	void Init();
private:
	redisContext * getConClient(const char* ip, int port, const char* auth); 
	void sendMsg(char* msg);

	char* makeMsg(char* format, ...);
	void  freeMsg(char* msgBuff);
private:
	redisContext * m_conServer;
	redisContext * m_conClient;
	bool m_isCon = false;
};

