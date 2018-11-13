function WorkBookInit(){ 
        InitNearOpen()
        InitGlobalParame() 
        document.onkeydown=onKeydown
        document.onmousedown=onMouseDwon 
        document.onmouseup=onMouseUp 
        document.onmousemove=onMouseMove 

        // document.onkeydown=onKeyLogin     
        m_crash = document.getElementById('crash'); 
        m_crash.onclick = onDelete
        m_nearOpen = document.getElementById('nearOpen'); 
        m_nearOpen.onclick = onNearOpen
        m_saveTxt = document.getElementById('note-save-btn'); 
        m_saveTxt.onclick = onKeeptxt
        m_cmdAct = document.getElementById('note-act-btn'); 
        m_cmdAct.onclick = onCmdAct
     
        m_newFile = document.getElementById('new-file'); 
        m_newFile.onclick = onAddFile
        m_newFolder = document.getElementById('new-folder'); 
        m_newFolder.onclick = onAddFolder
        m_listImport = document.getElementById('list-import'); 
        m_listImport.onclick = onListImport
        m_listExport = document.getElementById('list-export'); 
        m_listExport.onclick = onListExport
        m_listCreate = document.getElementById('list-create'); 
        m_listCreate.onclick = onNewPro
        m_listOpen = document.getElementById('list-open'); 
        m_listOpen.onclick = onOpenPro
        g_listMenu = document.getElementById('list-menu'); 
        g_listMenu.onclick = list_menus 

        InitGlobalCtrl()
}


function InitGlobalCtrl()
{    
    g_loadFolder = document.getElementById('loadFolder'); 
    g_loadFolder.onclick = onLoadFolders
    m_create = document.getElementById('create'); 
    m_create.onclick = onCreate
    g_folderContainer = document.getElementById('folder-Container'); 
    g_searchContainer = document.getElementById('search-Container'); 
    g_listSearch = document.getElementById('list-search');  
    g_searchValue = document.getElementById('search-value'); 
    g_detailValue = document.getElementById('detail-value'); 
    g_topFileName = document.getElementById('top-fileName'); 
    g_flexibleLeft = document.getElementById('flexible-left'); 
    g_flexibleMide = document.getElementById('flexible-mide'); 
    g_flexibleRight = document.getElementById('flexible-right'); 
    g_dragMide = document.getElementById('dragMid');  
    g_dragLeft = document.getElementById('dragSide');  
}

function InitGlobalParame()
{
    g_dirCount = 0
    g_choiceDirObj = 0; 
    g_choiceDirIndex = 0;
    g_choiceFileObj = 0;
    g_choiceFileIndex = 0; 
    g_jsonDirInfo = 0;
    g_jsonFileInfo = 0;

    g_creatUl = 0;
    g_defaultDirKey = 0;
    g_defaultFileKey = 0;

    g_newFile = 0;
    g_deleteTagI = []; 
    g_proName = ""
    g_dragMove = 0;
    g_isDeleteFolder  = false;
}