#pragma once
#include <stdio.h>
#include <stdarg.h>

#include <malloc.h>

#define MALLOC_FORMAT_DATA(format, retBuff) \
{ \
char* va_dataResult = nullptr; \
int va_bufferLen = 4096; \
int va_actualLen = 0; \
va_list list; \
va_start(list, format); \
do {\
	if(va_dataResult) {\
		free(va_dataResult);	\
	}\
	va_bufferLen *= 2;\
	va_dataResult = (char*)calloc(1, va_bufferLen);\
	va_actualLen = vsnprintf(va_dataResult, va_bufferLen, format, list);\
} while(va_actualLen == va_bufferLen);	\
va_end(list); \
retBuff = va_dataResult; \
}

int strlen(const char* str);
bool strcmp(const char* A, const char* B); 
const char* findSub(const char* str, const char* substr, bool retPStart = false); 
int getJsonValueInt(const char* str, const char* section);
//返回字符串 需要 free释放
char* formatStr(const char* format, ...);
//返回字符串 需要 free释放
char* getJsonValueString(const char* str, const char* section);
//返回字符串需要 free释放
char* setJsonValueString(char* str, const char* section, const char* value);
//返回字符串需要 free释放
char* catHeadTail(const char* str, char catChar);




void setJsonValueInt(char* str, const char* section, int value);



//file
//返回字符串 需要 free释放
char* getFileText(const char* filePath);



namespace FLY_CRYPTO {
	char* base64Encde(const char* pData, int nDataLen);
	char* base64Decode(const char* pData, size_t nDataLen);
}