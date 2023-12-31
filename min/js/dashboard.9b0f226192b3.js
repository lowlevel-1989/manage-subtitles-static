$(document).ready(()=>{var metadata=$("#metadata")
template_html="<li> <b>user</b>: {user}</li>            \
									 <li> <b>imdb</b>: {imdb}</li>            \
									 <li> <b>hash</b>: {hash}</li>            \
									 <li> <b>name</b>: {name}</li>            \
									 <li> <b>consumers</b>: {consumers}</li>"
template_content=$("#metadata-ul")
$(".metadata").click((event)=>{var parent=$(event.target).parent()
var position=parent.offset()
var width=$("#metadata-size").width()
template_content.empty()
template_content.append(sprintf(template_html,{user:parent.data("metadataUser"),consumers:parent.data("metadataConsumers"),imdb:parent.data("metadataImdb"),hash:parent.data("metadataHash"),name:parent.data("metadataFilename")}))
var height=metadata.height()
metadata.css({left:position.left,top:position.top-height})
metadata.css({width:width+"px"})
metadata.toggleClass("d-block d-lg-none  animate__animated animate__slideInRight")})
$(document).on("click",(event)=>{if(!$(event.target).is(".metadata")){metadata.removeClass("d-block d-lg-none animate__animated animate__slideInRight")}})});