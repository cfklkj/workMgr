
//drag---------------------------------
function getStyle(obj, attr)
{  

    if(obj.currentStyle)  {  
  
      return obj.currentStyle[attr];  
  
    } else{  
  
      return getComputedStyle(obj,false)[attr];  
    }
  
} 
function onDragMid(Y)
{ 
    var widthLeft =  parseInt(getStyle(g_flexibleLeft, "width"))
    newWidth = Y - widthLeft
    if(newWidth  > 300 && newWidth < 800)
    {
        var widthMide =  parseInt(getStyle(g_flexibleMide, "width"))  
        g_flexibleMide.style.width = newWidth
        g_flexibleRight.style.left = Y + 4
        bodyWidth =  document.body.clientWidth   
        g_flexibleRight.style.width = bodyWidth - newWidth
    } 
}
function onDragLeft(Y)
{  
    if( Y <250)
    {
        Y = 251
    }
    if(Y < 500)
    {
        var widthMide =  parseInt(getStyle(g_flexibleMide, "width"))  
        g_dragLeft.style.left = Y
        g_flexibleLeft.style.width = Y
        g_flexibleMide.style.left = Y + 2
        g_flexibleRight.style.left = Y + widthMide + 2*2
        bodyWidth =  document.body.clientWidth   
        g_flexibleRight.style.width = bodyWidth - Y- widthMide
    } 
}