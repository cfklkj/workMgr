#include "stdafx.h"
#include "Util.h"



void TimeDelay(DWORD WaitTime)
{
	DWORD timestart = GetTickCount();
	MSG msg;
	while ((GetTickCount() - timestart) < WaitTime)
	{
		PeekMessage(&msg, NULL, 0, 0, PM_REMOVE);
		DispatchMessage(&msg);
	}
}

std::string format(const char *formatStr, ...)
{
#define CC_MAX_STRING_LENGTH (1024*100)

	std::string ret;

	va_list ap;
	va_start(ap, formatStr);

	char* buf = (char*)malloc(CC_MAX_STRING_LENGTH);

	if (buf != NULL)
	{
		vsnprintf_s(buf, CC_MAX_STRING_LENGTH, CC_MAX_STRING_LENGTH, formatStr, ap);
		ret = buf;
		free(buf);
	}

	va_end(ap);

	return ret;
}


std::string GetDateString()
{
	SYSTEMTIME sys;
	GetLocalTime(&sys);
	return format("%2d%02d%02d_%02d%02d%02d", sys.wYear - 2000, sys.wMonth, sys.wDay, sys.wHour, sys.wMinute, sys.wSecond, sys.wMilliseconds);
}
//char to wchar
CString c2w(const char *pcstr, int& lineCount)
{
	CString rstStr = L"";
	if (pcstr)
	{
		size_t nu = strlen(pcstr);

		size_t nL = (size_t)MultiByteToWideChar(CP_ACP, 0, (const char *)pcstr, (int)nu, NULL, 0);

		if (nL < 1)
			return rstStr;

		wchar_t * pwstr = new wchar_t[nL + 1];
		memset(pwstr, 0, nL + 1);

		MultiByteToWideChar(CP_ACP, 0, (const char *)pcstr, (int)nu, pwstr, (int)nL);

		pwstr[nL] = 0;

		rstStr = pwstr;
		free(pwstr);

	}
	lineCount = rstStr.Replace(L"\n", L"\r\n");
	return rstStr;
}
//char to wchar
CString c2w(const char *pcstr)
{
	CString rstStr = L"";
	if (pcstr)
	{
		size_t nu = strlen(pcstr);

		size_t nL = (size_t)MultiByteToWideChar(CP_ACP, 0, (const char *)pcstr, (int)nu, NULL, 0);

		if (nL < 1)
			return rstStr;

		wchar_t * pwstr = new wchar_t[nL + 1];
		memset(pwstr, 0, nL + 1);

		MultiByteToWideChar(CP_ACP, 0, (const char *)pcstr, (int)nu, pwstr, (int)nL);

		pwstr[nL] = 0;

		rstStr = pwstr;
		free(pwstr);

	}
	rstStr.Replace(L"\n", L"\r\n");
	return rstStr;
}

//全路径提取目录
CString getDirFromFullPath(CString& FullPath)
{
	const wchar_t* tPath = FullPath;
	while (*tPath != '\0') //移到末尾
		tPath++;
	int count = 0;
	while (*tPath != '\\' && *tPath != '/')
	{
		tPath--;
		count++;
	}
	CString rstPath = FullPath.Mid(0, FullPath.GetLength() - count);
	return rstPath;
}

CString makeLogPath(CString &homePath, CString &chilePath, CString &logName)
{

	CString logPath = homePath;
	logPath += "\\";
	logPath += chilePath;
	logPath += "\\";
	CreateDirectory(logPath, NULL);
	logPath += logName;
	logPath += ".log";
	return logPath;
}