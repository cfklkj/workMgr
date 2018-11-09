#pragma once
#include "workbook.h"

class redisConn;
class msgHandle {
public:
	msgHandle();
	~msgHandle();

	void Init(redisConn *redis);
	void onMessage(char* msg, int msgLen);


	redisConn* RedisConn() { return p_redis; };
	workbook* Workbook() { return &m_workBook; };
private:
	redisConn * p_redis = nullptr;
	workbook m_workBook;
};

 