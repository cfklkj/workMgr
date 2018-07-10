Function SelectFile()

	Set wShell=CreateObject("WScript.Shell")

	Set oExec=wShell.Exec("mshta.exe ""about:<input type=file id=FILE><script>FILE.click();new ActiveXObject('Scripting.FileSystemObject').GetStandardStream(1).WriteLine(FILE.value);close();resizeTo(0,0);</script>""")

	SelectFile = oExec.StdOut.ReadAll

End Function

WSH.Echo SelectFile()