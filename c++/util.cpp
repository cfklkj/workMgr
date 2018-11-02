#include "util.h"



char* formatStr(const char* format, ...)
{
	char* str = nullptr;
	MALLOC_FORMAT_DATA(format, str);
	return str;
}

bool strcmp(const char* A, const char* B)
{
	while (A && B && *A++ == *B++);

	if (A == B)
		return true;
	if (!A || !B)
		return false;
	return true;
}

const char* findSub(const char* str, const char* substr, bool retPStart)
{
	bool isStart = false;
	const char* pStart = nullptr;
	const char* pEnd = nullptr;
	for (;*str; str++)
	{
		if (!isStart && *substr == *str)
		{
			isStart = true;
			pStart = str; 
			pEnd = substr;
		}
		if (!isStart)
			continue;
		if (*pEnd != *str)
		{
			isStart = false;
			continue;
		}
		pEnd++;
		if (!*pEnd)
			break;
	}
	if (isStart)
	{
		return retPStart ? pStart : str;
	}
	return nullptr;
}

//查找json字段是否存在
const char* findJsonSection(const char* str, const char* substr)
{
	bool isStart = false;
	const char* temp = nullptr;
	for (;*str; str++)
	{
		if (*str == '"')
		{
			isStart = !isStart;
			if (isStart)
			{
				temp = substr;
			}
			continue;
		}
		if (!isStart)
			continue;
		if (*temp != *str)
		{
			isStart = false;
			continue;
		}
		temp++;
		if (!*temp)
			break;
	}
	if (isStart)
	{
		return str;
	}
	return nullptr;
} 

//获取json字段值
char* findJsonSectionValue(const char* str, const char* section)
{ 
	//获取值
	const char* pStart = nullptr, *pEnd = nullptr;
	for (str++;*str; str++)  //start
	{
		if (*str == ':')
		{
			pStart = ++str;
			break;
		}
	}
	if (!pStart)
		return nullptr;
	char split = 0;
	for (str;!split && *str; str++)  //split
	{
		if (*str == ' ')
			continue;
		switch (*str)
		{
		case '\r':
		case '\n':
		case '}':
			return nullptr;
		case '{':
		case '[':
		case '"':
			split = *str;
			break;
		default:
			split = ',';
			break;
		}
	}
	int splitCount = 0;
	for (;*str; str++)  //end
	{
		if (*(str - 1) == '\\') // 判断是否为转义符号 
			continue;
		if (split == '{')
		{
			if (*str == '}')
			{
				if (!splitCount)
				{
					pEnd = str;
					break;
				}
				splitCount--;
			}
			if (*str == split)
			{
				splitCount++;
			}
		}
		if (split == '[')
		{
			if (*str == ']')
			{
				if (!splitCount)
				{
					pEnd = str;
					break;
				}
				splitCount--;
			}
			if (*str == split)
			{
				splitCount++;
			}
		}
		if ((split == ',' || split == '"') && *str == split)
		{

			pEnd = str;
			break;
		}
	}
	if (!pEnd)
		return nullptr;
	__int64 size = pEnd - pStart + 1;
	char* va_dataResult = (char*)calloc(1, size + 1);
	for (;pEnd + 1 != pStart; pStart++, va_dataResult++)
	{
		*va_dataResult = *pStart;
	}
	*va_dataResult = 0;
	va_dataResult -= size;
	return va_dataResult; 
}

int strLen(const char* str)
{
	if (!str)
	{
		return 0;
	}
	int len = 0;
	for (;*str; str++, len++);
	return len;
}

int getJsonValueInt(const char* str, const char* section)
{
	return 1;
}
char* getJsonValueString(const char* str, const char* section)
{
	str = findJsonSection(str, section);
	if (!str)
		return nullptr;
	return findJsonSectionValue(str, section);
}
void setJsonValueInt(char* str, const char* section, int value)
{

}
char* setJsonValueString(char* str, const char* section, const char* value)
{
	char* oldstr = str;

	char* Jvalue = getJsonValueString(str, section);
	if (Jvalue)
	{
		const char* formatStrInfo = "%s\"%s\"%s";
		if (*section >= 0 && *section <= 9)
		{
			formatStrInfo = "%s%s%s";
		}

		const char* pJavalue = findSub(str, Jvalue, true);
		for (;*oldstr; oldstr++)   //移动到值开头
		{
			if (oldstr != pJavalue)
				continue;
			*oldstr = 0;   //开头处赋值零
			break;
		}
		for (;*Jvalue;Jvalue++, oldstr++);  //移动到的值末尾末尾

		return formatStr(formatStrInfo, str, value, oldstr);
	}
	else
	{

		const char* formatStrInfo = "{\"%s\":\"%s\",%s";
		if (*section >= 0 && *section <= 9)
		{
			formatStrInfo = "{\"%s\":%s,%s";
		} 
		return formatStr(formatStrInfo, section, value, ++oldstr);
	}
}
