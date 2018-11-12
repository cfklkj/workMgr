#include "util.h"



char* formatStr(const char* format, ...)
{
	char* str = nullptr;
	MALLOC_FORMAT_DATA(format, str);
	return str;
}

int strlen(const char* str)
{
	if (!str)
		return 0;
	int iLen = 0;
	for (;*str++;iLen++);
	return iLen;
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
		if (*(str - 1) == '\\' && *(str - 2) != '\\') // 判断是否为转义符号 
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
		if (split == ',' && *str == split)
		{

			pEnd = --str;
			break;
		}
		if (split == '"' && *str == split)
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

char* catHeadTail(const char* str, char catChar)
{
	if (catChar != *str)
		return nullptr;
	char keepChar = 0;
	char* strHead = formatStr("%s", ++str);
	char*  strEnd = strHead;
	for (;*strEnd != 0; strEnd++);  //移动到值末尾
	for (;*(--strEnd) != catChar;); 
	*strEnd-- = 0;   //开头处赋值零 
	return strHead;
}
char* setJsonValueString(char* str, const char* section, const char* value)
{
	if (!str || !value || !section)
	{
		return nullptr;
	}
	char* ret = nullptr;
	char* oldstr = str;

	char* oldJvalue = getJsonValueString(str, section);
	const char*  Jvalue = oldJvalue;

	if (!Jvalue)
	{
		Jvalue = "{";
		char keepChar = 0;
		const char* formatStrInfo = *str == '"' ?   "%s\\\"%s\\\":\\\"%s\\\",%c%s" : "%s\"%s\":\"%s\",%c%s";
		if (*value >= 0 && *value <= 9)
		{
			formatStrInfo = *str == '"' ? "%s\\\"%s\\\":%s,%c%s" : "%s\"%s\":%s,%c%s";
		} 
		
		const char* pJavalue = findSub(str, Jvalue);
		for (;*oldstr; oldstr++)   //移动到值开头
		{
			if (oldstr != pJavalue)
				continue;
			keepChar = *(++oldstr);

			*oldstr = 0;   //开头处赋值零
			break;
		}
		for (;*Jvalue;Jvalue++, oldstr++);  //移动到的值末尾末尾 
		ret = formatStr(formatStrInfo, str, section, value, keepChar, oldstr);
	}
	else
	{  
		const char* formatStrInfo = "%s\"%s\"%s";
		if (*value >= 0 && *value <= 9 || *value == '"')
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
		ret = formatStr(formatStrInfo, str, value, oldstr);
		 
		free(oldJvalue); 
	}
	return ret; 
}

char* getFileText(const char* filePath)
{
	FILE *file = nullptr;
	file = fopen(filePath, "rb");
	if (!file)
		return nullptr;
	char rBuff[BUFSIZ + 1] = { 0 };
	int rSize = 0;
	char* rstBuff = nullptr;
	while ((rSize = fread(rBuff, 1, BUFSIZ, file)) > 0)
	{
		rBuff[rSize] = 0;
		char *tempBuff = formatStr("%s", rBuff);
		if (rstBuff)
		{
			char* tempRst = formatStr("%s%s", rstBuff, tempBuff);
			free(rstBuff);
			rstBuff = tempRst;
		}
		else
		{
			rstBuff = tempBuff;
		}
	}
	return rstBuff;
}

 
namespace FLY_CRYPTO {
	char* base64Encde(const char* pData, int nDataLen) 
	{
		static const char cEncodeTable[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		unsigned char ch1, ch2;
		char szEncode[4] = { 0 };
		int nHead = nDataLen / 3;
		char* encdeHead = new char[nHead * 4 + 1];
		char* encdeTemp = encdeHead;
		for (int i = 0; i < nHead; ++i)
		{
			ch1 = *pData++;
			ch2 = *pData++;

			szEncode[0] = cEncodeTable[ch1 >> 2];
			szEncode[1] = cEncodeTable[((ch1 << 4) | (ch2 >> 4)) & 0x3F];

			ch1 = *pData++;

			szEncode[2] = cEncodeTable[((ch2 << 2) | (ch1 >> 6)) & 0x3f];
			szEncode[3] = cEncodeTable[ch1 & 0x3f]; 
			for (auto iter : szEncode)
			{
				*encdeTemp++ = iter;
			}

		}
		*encdeTemp = 0; 

		int nTail = nDataLen % 3; 
		char* encdeTail = new char[nTail*4 +1]; 
		encdeTemp = encdeTail;
		if (nTail == 1)
		{
			ch1 = *pData++;
			szEncode[0] = cEncodeTable[(ch1 >> 2) & 0x3f];
			szEncode[1] = cEncodeTable[(ch1 << 4) & 0x30];
			szEncode[2] = '=';
			szEncode[3] = '=';
			for (auto iter : szEncode)
			{
				*encdeTemp++ = iter;
			}
		}
		else if (nTail == 2)
		{
			ch1 = *pData++;
			ch2 = *pData++;
			szEncode[0] = cEncodeTable[(ch1 >> 2) & 0x3f];
			//szEncode[1] = cEncodeTable[((ch1<<4)&0x30)|((ch2>>4)&0xf)];
			szEncode[1] = cEncodeTable[((ch1 << 4) & 0x30) | ((ch2 >> 4) & 0xf)];
			szEncode[2] = cEncodeTable[(ch2 << 2) & 0x3c];
			szEncode[3] = '=';
			for (auto iter : szEncode)
			{
				*encdeTemp++ = iter;
			} 
		}
		*encdeTemp = 0;

		char* rstEncde = formatStr("%s%s",encdeHead, encdeTail);
		delete []encdeHead;
		delete []encdeTail;
		return rstEncde;
	}

	char* base64Decode(const char* pData, size_t nDataLen)
	{
		const unsigned char cDecodeTable[] =
		{
			0, 0, 0, 0, 0, 0, 0, 0,	0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0,	0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0,	0, 0, 0,62, 0, 0, 0,63,
			52,53,54,55,56,57,58,59,60,61, 0, 0, 0, 0, 0, 0,
			0, 0, 1, 2, 3, 4, 5, 6,7, 8, 9,10,11,12,13,14,
			15,16,17,18,19,20,21,22,23,24,25, 0, 0, 0, 0, 0,
			0,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,
			41,42,43,44,45,46,47,48,49,50,51, 0, 0, 0, 0, 0,
		};

		if (pData == NULL || nDataLen % 4 || pData == NULL)
			return "";
		typedef unsigned char BYTE;
		char* decdeStr = (char*)malloc(nDataLen);
		char* decdeTemp = decdeStr;
		BYTE cTemp[4];

		for (size_t i = 0; i < nDataLen;)
		{

			cTemp[0] = cDecodeTable[*(pData + i)];
			cTemp[1] = cDecodeTable[*(pData + i + 1)];

			if (*(pData + i + 2) != '=')
				cTemp[2] = cDecodeTable[*(pData + i + 2)];
			else
				cTemp[2] = 0;

			if (*(pData + i + 3) != '=')
				cTemp[3] = cDecodeTable[*(pData + i + 3)];
			else
				cTemp[3] = 0;

			*decdeTemp++ = static_cast<char>((cTemp[0] << 2) + (cTemp[1] >> 4));
			*decdeTemp++ = static_cast<char>(((cTemp[1] & 0xf) << 4) + (cTemp[2] >> 2));
			*decdeTemp++ = static_cast<char>(cTemp[3] + (cTemp[2] << 6));

			i += 4;
		}
		*decdeTemp = 0;

		return decdeStr;
	}
}
 
