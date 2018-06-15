#pragma once
#include <string>

std::string format(const char *formatStr, ...);
std::string GetDateString();
//char to wchar
CString c2w(const char *pcstr);
CString c2w(const char *pcstr, int& lineCount);
//全路径提取目录
CString getDirFromFullPath(CString& FullPath);
void TimeDelay(DWORD WaitTime);

//创建路径
CString makeLogPath(CString &homePath, CString &chilePath, CString &logName);