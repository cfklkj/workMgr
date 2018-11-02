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
	char* sendMsgstr = nullptr, *value = nullptr;
	int resId = getJsonValueInt(msg, "ResId");
	char* Url = getJsonValueString(msg, "Url");
	char* Body = getJsonValueString(msg, "Body");
	if (!Url)
		return;
	if (findSub(Url, "getJson"))
	{
		if (findSub(Body, "Project"))
		{
			value = setJsonValueString(Body, "value", "NewProjectACBBDD");
		}
		if (findSub(Body, "NearFile"))
		{
			value = setJsonValueString(Body, "value", "NearFileHHHHH");
		}
		if (findSub(Body, "Dir"))
		{
			value = setJsonValueString(Body, "value", "Dir");
		} 
	} 
	if (!value)
	{
		value = setJsonValueString(Body, "value", "error action!");
	}
	sendMsgstr = setJsonValueString(msg, "Body", value);
	printf("%s\n", sendMsgstr);
	RedisConn()->sendMsg(sendMsgstr);
	free(Url);
	free(Body);
	free(value);
	free(sendMsgstr);
}