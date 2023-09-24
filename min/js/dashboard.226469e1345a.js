$(document).ready(()=>{let imdb_storage=new RLocalStorage(sm_conf["IMDB_LIST_STORAGE_PREFIX"],sm_conf["IMDB_LIST_STORAGE_NAME"],sm_conf["IMDB_LIST_STORAGE_LIMIT"])
$(".t-metadata").each((index,element)=>{let imdb=$(element).data("metadataImdb")
let movie=$(element).data("metadataMovie")||""
if(movie.length>100){movie=movie.substring(0,100)+"...";}
imdb_storage.set(imdb,movie,sm_conf["IMDB_LIST_STORAGE_TTL"])})
$("#s_movie").autocomplete({source:"/api/ex/imdb/search",minLength:2,select:(event,ui)=>{$("#s_movie").val(ui.item.value)
let movie=ui.item.value||''
if(movie.length>100){movie=movie.substring(0,100)+"...";}
imdb_storage.set(ui.item.imdb,movie,0)
let qs_param=sprintf("/dashboard/subtitle/{imdb}/?movie={movie}",{"movie":encodeURIComponent(ui.item.value),"imdb":ui.item.imdb,})
$("#s_form").attr("action",qs_param);$("#s_form").submit()},});$("#form-add-subtitle").on("submit",(event)=>{event.preventDefault();let qs_param=sprintf("/dashboard/subtitle/{imdb}/?movie={movie}&season={season}",{"movie":encodeURIComponent($("#id_movie").val()),"imdb":$("#id_imdb").val(),"season":$("#id_season").val(),})
$(event.target).attr("action",qs_param);$(event.target).unbind('submit').submit();});let _cookie=new MCookie('collapse')
$('.collapse').on('show.bs.collapse',function(){_cookie.set("subtitle","show",0)});$('.collapse').on('hide.bs.collapse',function(){_cookie.set("subtitle","hide",0)});});;