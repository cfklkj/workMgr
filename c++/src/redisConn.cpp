#include "redisConn.h"
#include <stdio.h> 
#include <malloc.h>
const char* ip = "127.0.0.1";
int port = 6379;
const char* auth = "test123";
const char* subscribe = "cplusplus";
const char* publish = "webServer";

redisConn::redisConn()
{
}


redisConn::~redisConn()
{
	if (!m_isCon)
		return;
	redisFree(m_conServer);
	redisFree(m_conClient);
} 

redisContext* redisConn::getConClient(const char* ip, int port, const char* auth)
{

	redisContext *conn = redisConnect(ip, port);

	if (conn != NULL && conn->err)

	{

		printf("connection error: %s\n", conn->errstr);

		return NULL;

	} 
	redisReply *reply = (redisReply*)redisCommand(conn, "auth %s", auth);

	printf("%s\n", reply->str);
	freeReplyObject(reply);

	m_isCon = true;
	return conn;
} 

void redisConn::sendMsg(char* msg)
{ 
	redisReply *replys = (redisReply*)redisCommand(m_conClient, "publish %s %s", publish, msg);
	freeReplyObject(replys); 
}

static void cliFormatReplyRaw(redisReply *r) { 
	size_t i; 
	switch (r->type) {
	case REDIS_REPLY_NIL:
		/* Nothing... */
		break;
	case REDIS_REPLY_ERROR:
		printf(r->str, r->len); 
		break;
	case REDIS_REPLY_STATUS:
	case REDIS_REPLY_STRING:
		printf(r->str, r->len);
		break;
	case REDIS_REPLY_INTEGER:
		printf("%lld", r->integer);
		break;
	case REDIS_REPLY_ARRAY:
		for (i = 0; i < r->elements; i++) {
			printf("\n");
			cliFormatReplyRaw(r->element[i]); 
		}
		break;
	default:
		fprintf(stderr, "Unknown reply type: %d\n", r->type); 
		break;
	} 
}

void redisConn::Init()
{  
	m_conServer = getConClient(ip, port, auth);
	m_conClient = getConClient(ip, port, auth);
	if (!m_isCon)
		return; 
	redisReply *reply = (redisReply*)redisCommand(m_conServer, "SUBSCRIBE %s", subscribe);
	freeReplyObject(reply); 
	void *_reply; 
	while (redisGetReply(m_conServer, &_reply) == REDIS_OK)
	{ 
		redisReply* reply = (redisReply*)_reply;
		cliFormatReplyRaw(reply); 
		freeReplyObject(reply); 

		sendMsg("I receive");

	}
	 getchar();
}

 