cd /d d:\
goto %1
:1
D:\soft_bag\install\Nox\bin\7za.exe a workbook.7z "%2" -pworkbook -mhe -mx=0 -y
start explorer .
start http:\\pan.baidu.com

goto end

:2 
for /f "delims=" %%a in ('cscript -nologo %~dp0\keepDialog.vbs') do set strPath=%%a
D:\soft_bag\install\Nox\bin\7za.exe  x %strPath% -y -aos -o"%2"  -pworkbook
goto end

:end


