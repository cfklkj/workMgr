// workServerC.cpp: 定义控制台应用程序的入口点。
//
 
 
#include <stdio.h>
#include <stdlib.h>
 
#include "redisConn.h"  

int main()

{
	redisConn redis;
	redis.Init();

	return 0;

}

 