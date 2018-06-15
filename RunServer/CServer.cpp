#include "stdafx.h"
#include "CServer.h"

extern CString g_configPath = L".\\config.ini";
CServer::CServer()
{
	m_serverBuff = { 0 }; 
	m_readBuff[defPIPReadBuffLen] = 0;
}

CServer::~CServer()
{
}

void CServer::AddServer(CString serverName, CString filePath)
{
	WritePrivateProfileString(serverName, L"path", filePath, g_configPath);
}

void CServer::DelServer(CString serverName)
{  
	WritePrivateProfileString(serverName, NULL, NULL, g_configPath);
}

bool CServer::RunServer(CString serverName)
{
	if (m_serverBuff.isRun)
		return true;
	WCHAR Rcbuff[MAX_PATH] = { 0 };
	if (!GetPrivateProfileString(serverName, L"path", L"", Rcbuff, MAX_PATH, g_configPath))
		return false;
	CString lpCmd = Rcbuff;
	CString lpDirectory = getDirFromFullPath(lpCmd);
	m_serverBuff.serverName = serverName;
	m_serverBuff.fileDir = lpDirectory;
	bool nShow = FALSE;
	bool isWait = TRUE;

	LPPROCESS_INFORMATION lppi;
	SECURITY_ATTRIBUTES lsa; // 安全属性
	STARTUPINFO myStartup;
	lsa.nLength = sizeof(SECURITY_ATTRIBUTES);
	lsa.lpSecurityDescriptor = NULL;
	lsa.bInheritHandle = true;

	lppi = &m_serverBuff.pi;
	// 创建管道
	if (!CreatePipe(&m_serverBuff.hReadPipe, &m_serverBuff.hWritePipe, &lsa, 0))
	{
		printf("no pipe");
		return false;
	}

	memset(&myStartup, 0, sizeof(STARTUPINFO));
	myStartup.cb = sizeof(STARTUPINFO);
	myStartup.dwFlags = STARTF_USESHOWWINDOW | STARTF_USESTDHANDLES;
	myStartup.wShowWindow = nShow;
	myStartup.hStdOutput = m_serverBuff.hWritePipe;

	if (lpDirectory.IsEmpty() ? !CreateProcess(NULL, (LPWSTR)(LPCWSTR)lpCmd, NULL, NULL, true, CREATE_NEW_CONSOLE, NULL, NULL, &myStartup, lppi) :
		!CreateProcess(NULL, (LPWSTR)(LPCWSTR)lpCmd, NULL, NULL, true, CREATE_NEW_CONSOLE, NULL, lpDirectory, &myStartup, lppi)) {
		int a = GetLastError();
		return false;
	}
	m_serverBuff.isRun = true;
	return true;
}
void CServer::StopServer(CString serverName)
{
	if (!serverName.IsEmpty() && m_serverBuff.serverName == serverName && m_serverBuff.isRun)
	{
		if(m_serverBuff.stream) fclose(m_serverBuff.stream);
		TerminateProcess(m_serverBuff.pi.hProcess, 0);
		CloseHandle(m_serverBuff.hReadPipe);
		CloseHandle(m_serverBuff.pi.hThread);
		CloseHandle(m_serverBuff.pi.hProcess);
		CloseHandle(m_serverBuff.hWritePipe);
		m_serverBuff.isRun = false; 
		m_serverBuff.pi = { 0 };
		m_serverBuff.hWritePipe = NULL;
		m_serverBuff.hReadPipe = NULL;
	} 
}
bool CServer::IsServerRun(CString serverName)
{
	if (!serverName.IsEmpty() && m_serverBuff.serverName == serverName && m_serverBuff.isRun)
	{
		if (WaitForSingleObject(m_serverBuff.pi.hProcess, 0) == WAIT_OBJECT_0)  // 进程退出
		{ 
			return false;
		} 
		return true;
	}
	return false;
}
void CServer::writeLogToFile(const char* data)
{
	const int maxLogFileSize = 1024 * 1024 * 7; //7M
	if (!m_serverBuff.stream)
	{
		CString logPath = makeLogPath(m_serverBuff.fileDir, m_serverBuff.serverName, c2w(GetDateString().c_str()));
		m_serverBuff.stream = _wfsopen(logPath, L"w", _SH_DENYNO);
	}
	else if(ftell(m_serverBuff.stream) > maxLogFileSize) { 
		fclose(m_serverBuff.stream);
		CString logPath = makeLogPath(m_serverBuff.fileDir, m_serverBuff.serverName, c2w(GetDateString().c_str()));
		m_serverBuff.stream = _wfsopen(logPath, L"w", _SH_DENYNO);
	}

	if (m_serverBuff.stream)
	{
		fprintf(m_serverBuff.stream, "%s", data);
		fflush(m_serverBuff.stream);
	}
}
char* CServer::getPrintInfo(CString serverName)
{ 
	if (serverName.IsEmpty() || m_serverBuff.serverName != serverName || !m_serverBuff.isRun)
	{
		return NULL;
	}
	clock_t start, finish;
	start = finish = clock();
	DWORD bytesWrite = 0;
	while (finish - start < defPIPReadTime && bytesWrite < defPIPReadBuffLen)
	{
		DWORD bytesRead = 0;
		if (!m_serverBuff.hReadPipe || !PeekNamedPipe(m_serverBuff.hReadPipe, m_readBuff, 1, &bytesRead, NULL, NULL))
		{
			goto finishs;
		}
		if (bytesRead && ReadFile(m_serverBuff.hReadPipe, &m_readBuff[bytesWrite], defPIPReadBuffLen - bytesWrite, &bytesRead, NULL)) {
			m_readBuff[bytesWrite + bytesRead] = 0;
			writeLogToFile(&m_readBuff[bytesWrite]);
			bytesWrite += bytesRead;
		}
	finishs: 
		Sleep(10);
		finish = clock();
	} 
	if (bytesWrite)
	{
		return m_readBuff;
	}
	return NULL; 
} 