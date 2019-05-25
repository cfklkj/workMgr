#pragma once 

#include "../lib/flys/Fly_web.h"
#include "../lib/flys/Fly_string.h"
#include "../lib/flys/Fly_file.h"
#include "../lib/flys/Fly_sys.h"
#include "../lib/flys/Fly_algorithm.h"
#include "../lib/flys/Fly_time.h"

#ifdef _DEBUG
#pragma comment(lib, "../lib/flys/flylibs") 
#else
#pragma comment(lib, "../lib/flys/flylibsR") 
#endif


//本地项目头文件 

enum ActBtn {
	CREATEROOM,
	DROPROOM,
	PUSH,
	STOP,
	ALLRUN,
	ALLSTOP,
	HEART,
	FREE,
};
