#pragma once
#include "hiredis.h"
#include "async.h"
#include "msgHandle.h"

class redisConn
{
public:
	redisConn();
	~redisConn();

	void Init();
	void sendMsg(char* msg);
private:
	redisContext * getConClient(const char* ip, int port, const char* auth); 
	 
private:
	redisContext * m_conServer;
	redisContext * m_conClient;
	msgHandle  m_msgHandle;
	bool m_isCon = false;
};

