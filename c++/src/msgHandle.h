#pragma once

class redisConn;
class msgHandle {
public:
	msgHandle();
	~msgHandle();

	void Init(redisConn *redis);
	void onMessage(char* msg, int msgLen);

	
	redisConn* RedisConn() { return p_redis; };
private:
	redisConn * p_redis = nullptr;
};

 