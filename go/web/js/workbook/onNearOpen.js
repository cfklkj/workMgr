
//--------------------------------btn act--- 

json_NearList = [];

function onNearOpen(){ 
    g_searchName.setAttribute("proId", "")
    g_searchName.value = ""  
    loadProlist(json_NearList)
    onChangeStatu(m_nearOpen.id)
}

function findNearIndex(guid)
{
    for(let index in json_NearList)
    {
        if(json_NearList[index].Guid == guid)
            return index;
    }
    return -1
}

function addNearOpen(guid, name)
{
    data = {"Guid":guid, "Name": name}
    if(findNearIndex(guid) > -1)
        return
    json_NearList.push(data)
}