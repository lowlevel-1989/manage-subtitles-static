var vhHeight=$("body").height();var fixHeight=vhHeight-window.innerHeight;$("body").css({overflow:'hidden'});if(vhHeight>0){$(".fix-container").css({height:(vhHeight-fixHeight)});};