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

bool strcmp(const char* A, const char* B);
const char* findSub(const char* str, const char* substr, bool retPStart = true); 
int getJsonValueInt(const char* str, const char* section);
//�����ַ��� ��Ҫ free�ͷ�
char* formatStr(const char* format, ...);
//�����ַ��� ��Ҫ free�ͷ�
char* getJsonValueString(const char* str, const char* section);
//�����ַ�����Ҫ free�ͷ�
char* setJsonValueString(char* str, const char* section, const char* value);




void setJsonValueInt(char* str, const char* section, int value);

