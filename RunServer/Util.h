#pragma once
#include <string>

std::string format(const char *formatStr, ...);
std::string GetDateString();
//char to wchar
CString c2w(const char *pcstr);
CString c2w(const char *pcstr, int& lineCount);
//ȫ·����ȡĿ¼
CString getDirFromFullPath(CString& FullPath);
void TimeDelay(DWORD WaitTime);

//����·��
CString makeLogPath(CString &homePath, CString &chilePath, CString &logName);