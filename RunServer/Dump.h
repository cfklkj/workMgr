#pragma once
#include <windows.h>
#include <DbgHelp.h>
#include <stdlib.h>
#pragma comment(lib, "dbghelp.lib")
#pragma warning(disable:4996)
#include <atltime.h>
 
 


BOOL	g_createUserID;					//false=不创建,true=创建 
FILE*	g_logFile;							//写日志文件
BOOL	g_bDebug = false;						//true=写日志,false=不写日志(默认)	  

static int GenerateMiniDump(PEXCEPTION_POINTERS pExceptionPointers)
{
	// 定义函数指针
	typedef BOOL(WINAPI * MiniDumpWriteDumpT)(
		HANDLE,
		DWORD,
		HANDLE,
		MINIDUMP_TYPE,
		PMINIDUMP_EXCEPTION_INFORMATION,
		PMINIDUMP_USER_STREAM_INFORMATION,
		PMINIDUMP_CALLBACK_INFORMATION
		);
	// 从 "DbgHelp.dll" 库中获取 "MiniDumpWriteDump" 函数
	MiniDumpWriteDumpT pfnMiniDumpWriteDump = NULL;
	HMODULE hDbgHelp = LoadLibrary(_T("DbgHelp.dll"));
	if (NULL == hDbgHelp)
	{
		return EXCEPTION_CONTINUE_EXECUTION;
	}
	pfnMiniDumpWriteDump = (MiniDumpWriteDumpT)GetProcAddress(hDbgHelp, "MiniDumpWriteDump");

	if (NULL == pfnMiniDumpWriteDump)
	{
		FreeLibrary(hDbgHelp);
		return EXCEPTION_CONTINUE_EXECUTION;
	}
	// 创建 dmp 文件件
	TCHAR szFileName[MAX_PATH] = { 0 };
	wchar_t szVersion[] = L"RunServer";
	SYSTEMTIME stLocalTime;
	GetLocalTime(&stLocalTime);
	wsprintf(szFileName, L"%s-%04d%02d%02d-%02d%02d%02d.dmp",
		szVersion, stLocalTime.wYear, stLocalTime.wMonth, stLocalTime.wDay,
		stLocalTime.wHour, stLocalTime.wMinute, stLocalTime.wSecond);
	HANDLE hDumpFile = CreateFile(szFileName, GENERIC_READ | GENERIC_WRITE,
		FILE_SHARE_WRITE | FILE_SHARE_READ, 0, CREATE_ALWAYS, 0, 0);
	if (INVALID_HANDLE_VALUE == hDumpFile)
	{
		FreeLibrary(hDbgHelp);
		return EXCEPTION_CONTINUE_EXECUTION;
	}
	// 写入 dmp 文件
	MINIDUMP_EXCEPTION_INFORMATION expParam;
	expParam.ThreadId = GetCurrentThreadId();
	expParam.ExceptionPointers = pExceptionPointers;
	expParam.ClientPointers = FALSE;
	pfnMiniDumpWriteDump(GetCurrentProcess(), GetCurrentProcessId(),
		hDumpFile, MiniDumpWithDataSegs, (pExceptionPointers ? &expParam : NULL), NULL, NULL);
	// 释放文件
	CloseHandle(hDumpFile);
	FreeLibrary(hDbgHelp);
	return EXCEPTION_EXECUTE_HANDLER;
}

LONG WINAPI ExceptionFilter(LPEXCEPTION_POINTERS lpExceptionInfo)
{
	// 这里做一些异常的过滤或提示
 	if (IsDebuggerPresent())
	{
		return EXCEPTION_CONTINUE_SEARCH;
	}
	return GenerateMiniDump(lpExceptionInfo);
}

void writeLog(const char *psrLog, ...)
{//写日志 yanwg 2012-08-20
	BOOL bDebug = false; 

	if (bDebug && g_logFile != NULL)
	{
		CTime t = CTime::GetCurrentTime();
		char srDate[256] = { 0 }, srLog[256] = { 0 }, srBuf[512] = { 0 };
		sprintf(srDate, "%02d:%02d:%02d", t.GetHour(), t.GetMinute(), t.GetSecond());
		va_list args;
		va_start(args, psrLog);
		_vsnprintf(srLog, 4000, psrLog, args);
		va_end(args);
		sprintf(srBuf, "%s-%s\n", srDate, srLog);
		fwrite(srBuf, strlen(srBuf), 1, g_logFile);
		printf(srBuf);
		fflush(g_logFile);
	}
}

//SetUnhandledExceptionFilter(ExceptionFilter); 