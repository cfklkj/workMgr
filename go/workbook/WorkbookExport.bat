echo off
cd /d d:\
goto %1
:1
D:\soft_bag\install\Nox\bin\7za.exe a "%3.7z" "%2" -pworkbook -mhe -mx=0 -y
start explorer .
start http:\\pan.baidu.com

goto end

:2 
for /f "delims=" %%a in ('cscript -nologo %~dp0\keepDialog.vbs') do set strPath=%%a
echo %strPath%
goto end

:3
echo y|del "%2\*"
D:\soft_bag\install\Nox\bin\7za.exe  x "%3" -y -aos -o"%2"  -pworkbook
goto end

:4
for /f "delims=" %%a in ('cscript -nologo %~dp0\openDialog.vbs') do set strPath=%%a
echo %strPath%
goto end

:end


