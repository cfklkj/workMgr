#include "msgHandle.h"  
#include "redisConn.h"
#include "..\util.h"

msgHandle::msgHandle()
{
}


msgHandle::~msgHandle()
{
}



void msgHandle::Init(redisConn *redis)
{
	p_redis = redis;
}


void msgHandle::onMessage(char* msg, int msgLen)
{
	char* sendMsgstr = nullptr;
	printf(msg, msgLen);
	int resId = getJsonValueInt(msg, "ResId");
	char* Url = getJsonValueString(msg, "Url");
	char* Body = getJsonValueString(msg, "Body");
	if (!Url)
		return;
	if (findSub(Url, "getJson"))
	{
		if (findSub(Body, "Project"))
		{
			sendMsgstr = setJsonValueString(msg, "Body", "NewProjectACBBDD");
		}
		if (findSub(Body, "NearFile"))
		{
			sendMsgstr = setJsonValueString(msg, "Body", "NearFile");
		}
		if (findSub(Body, "Dir"))
		{
			sendMsgstr = setJsonValueString(msg, "Body", "Dir");
		} 
	}
	RedisConn()->sendMsg(sendMsgstr);
	free(Url);
	free(Body);
	free(sendMsgstr);
}