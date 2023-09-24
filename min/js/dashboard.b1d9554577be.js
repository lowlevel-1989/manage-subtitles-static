function sprintf(string,values){return string.replace(/{([^{}]+)}/g,(match,key)=>{return typeof values[key]!=="undefined"?values[key]:match;});}
class MCookie{constructor(prefix='default'){this._prefix=prefix}
set(name,value,ttl){let _expires="";if(ttl){let date=new Date();date.setTime(date.getTime()+(ttl*1000));_expires=date.toUTCString();}
document.cookie=sprintf("{prefix}_{name}={value}; expires={expires}; path=/",{"prefix":this._prefix,"name":name,"value":value||"","expires":_expires})}
get(name){let name_eq=sprintf("{prefix}_{name}=",{"prefix":this._prefix,"name":name,})
let ca=document.cookie.split(';');for(let i=0;i<ca.length;i++){let c=ca[i];while(c.charAt(0)==' ')c=c.substring(1,c.length);if(c.indexOf(name_eq)==0)return c.substring(name_eq.length,c.length);}
return null;}}
class MLocalStorage{constructor(prefix='default'){this._prefix=prefix}
set(name,value,ttl){let now=new Date()
let expires=-1
if(ttl>1){expires=now.getTime()+(ttl*1000)}
let item={"value":value,"expires":expires}
let s_item=JSON.stringify(item)
window.localStorage.setItem(sprintf("{prefix}-{name}",{"prefix":this._prefix,"name":name}),s_item)}
get_without_prefix(name){let now=new Date()
let s_item=window.localStorage.getItem(name)
if(!s_item){return null}
let item=JSON.parse(s_item)
if(item&&now.getTime()>item.expires&&item.expires>0){window.localStorage.removeItem(name)
return null}
return item.value}
get(name){let now=new Date()
let item=this.get_without_prefix(sprintf("{prefix}-{name}",{"prefix":this._prefix,"name":name}))
return item}}
class RLocalStorage{constructor(prefix='default',name='register',limit=0){this._prefix=prefix
this._limit=limit
this._name=name}
get_key(){return sprintf("{prefix}-{name}",{"prefix":this._prefix,"name":this._name})}
get_registers(){return JSON.parse(window.localStorage.getItem(this.get_key()))||{};}
get_first_key(){let registers=this.get_registers()
let lowest_register_key=null
let lowest_time=Infinity
for(let key in registers){let register=registers[key]
if(register.expires<lowest_time){lowest_time=register.expires
lowest_register_key=key}}
return lowest_register_key}
set(name,value,ttl){let registers=this.get_registers()
let now=new Date()
let expires=-1
if(ttl>1){expires=now.getTime()+(ttl*1000)}
let item={"value":value,"expires":expires}
if(Object.keys(registers).length>=this._limit){let _register_first_key=this.get_first_key()
if(_register_first_key){delete registers[_register_first_key]}}
registers[name]=item
let s_registers=JSON.stringify(registers)
window.localStorage.setItem(this.get_key(),s_registers)}
get(name){let now=new Date()
let s_registers=window.localStorage.getItem(this.get_key())
if(!s_registers){return null}
let registers=JSON.parse(s_registers)
let register=registers[name]||{}
if(now.getTime()>register.expires&&register.expires>0){delete registers[name]}
return register.value}};$(document).ready(()=>{let notification_storage=new MLocalStorage(sm_conf["NOTIFICATION_STORAGE_PREFIX"])
$(".toast").each((index,element)=>{if(notification_storage.get_without_prefix(element.id)==null){$(element).addClass("show animate__animated animate__fadeInUp")}})
$(".btn-toast").on("click",(event)=>{notification_id=$(event.target).data("notificationId")
notification_storage.set(notification_id,true,sm_conf["NOTIFICATION_STORAGE_TTL"])})
let imdb_storage=new RLocalStorage(sm_conf["IMDB_LIST_STORAGE_PREFIX"],sm_conf["IMDB_LIST_STORAGE_NAME"],sm_conf["IMDB_LIST_STORAGE_LIMIT"])
$(".toast-notification").each((index,element)=>{const notification=$(element).find(".toast-body")
const message=notification.text()
const s_extra=notification.data("notificationExtra").replaceAll("'","\"")
let extra={}
try{extra=JSON.parse(s_extra)}catch(e){}
let movie="undefined"
if(extra["imdb"]){movie=imdb_storage.get(extra["imdb"])
if(!movie){notification.html(message.replace("{movie}",'<div class="spinner-grow text-info" style="width: .8rem; height: .8rem" role="statue"> </div>'))
let mod="imdb"
let resource_id=extra["imdb"]
if(extra["imdb"]=="kitsu"){mod="kitsu"
resource_id=extra["season"]}
$.ajax({type:"GET",url:sprintf(sm_conf["API_EX_TITLE"],{"mod":mod,"resource_id":resource_id}),dataType:'json',success:function(data){let movie=data['title']||''
if(movie.length>100){movie=movie.substring(0,100)+"...";}
imdb_storage.set(extra["imdb"],movie,0)
notification.html(message.replace("{movie}",data["title"]))}})}else notification.html(message.replace("{movie}",movie))}})
$(".toast-notification").addClass("show animate__animated animate__fadeInUp")});$(document).ready(()=>{const URL_CURRENT=new URL(window.location.href)
const URL_PAGE=parseInt(URL_CURRENT.searchParams.get("page")||"0")
let navegation_storage=new MLocalStorage("navegation")
const SUBTITLE_ELEMENT_FIND=$("#table-subtitle tr")
const SUBTITLE_ELEMENT_CLEAR=$("#table-subtitle td")
const SUBTITLE_ITEMS=SUBTITLE_ELEMENT_FIND.length-1
const SUBTITLE_METADATA=$("#metadata")
const NAV_ITEMS=6
const NAV_ELEMENT=[$("#nav-dashboard"),$("#nav-dashboard"),$("#nav-consumer"),$("#nav-translate"),$("#nav-manual"),$("#nav-privacy"),$("#nav-credits")]
const M_SIDEBAR=0
const M_FORM=1
const M_SUBTITLES=2
const MENU=[NAV_ITEMS,0,SUBTITLE_ITEMS]
const B_LEFT=37
const B_UP=38
const B_RIGHT=39
const B_DOWN=40
const B_SELECT=13
let menu_current=M_SIDEBAR
let menu_prev=M_SIDEBAR
let select_current=0
let select_prev=0
let select_trigger=false
const NAVEGATION_ACTION=navegation_storage.get("action")
$("#id_is_public").focus()
let MENU_LEN=3
const ORIGINAL_URL_NAME=sm_conf["URL_NAME"]
if(sm_conf["URL_NAME"]=="dashboard-subtitle"){sm_conf["URL_NAME"]="dashboard"}
if(sm_conf["URL_NAME"]=="dashboard"){select_current=1}
if(sm_conf["URL_NAME"]=="consumer"){MENU_LEN=2
menu_current=1
select_current=2}
if(sm_conf["URL_NAME"]=="dashboard-translate"){MENU_LEN=2
menu_current=1
select_current=3}
if(sm_conf["URL_NAME"]=="dashboard-manual"){MENU_LEN=2
select_current=4}
if(sm_conf["URL_NAME"]=="dashboard-policy"){MENU_LEN=2
select_current=5}
if(sm_conf["URL_NAME"]=="dashboard-credits"){MENU_LEN=2
select_current=6}
if(NAVEGATION_ACTION&&sm_conf["URL_NAME"]=="dashboard"){if(NAVEGATION_ACTION=="next"){select_current=1}
else if(NAVEGATION_ACTION=="prev"){select_current=SUBTITLE_ITEMS}
menu_prev=M_SUBTITLES
menu_current=M_SUBTITLES
navegation_update()}
let _enable_change_pag=false
setTimeout(()=>{_enable_change_pag=true},1000)
function navegation_next_pag(){if($("#subtitles-pag-next").length&&_enable_change_pag){_enable_change_pag=false
navegation_storage.set("action","next",1*60)
$("#subtitles-pag-next")[0].click()}}
function navegation_prev_pag(){if($("#subtitles-pag-prev").length&&_enable_change_pag){_enable_change_pag=false
navegation_storage.set("action","prev",1*60)
$("#subtitles-pag-prev")[0].click()}}
function navegation_prev(){select_prev=select_current
if(menu_current==M_SUBTITLES&&select_current-1<1){navegation_prev_pag()}
if(select_current>0){select_current--}}
function navegation_next(){select_prev=select_current
if(menu_current==M_SUBTITLES&&select_current+1>MENU[M_SUBTITLES]){navegation_next_pag()}
if(select_current<MENU[menu_current]){select_current++}}
function navegation_next_menu(){if(menu_current<MENU_LEN-1){menu_current++}}
function navegation_prev_menu(){if(menu_current>0){menu_current--}}
function navegation_sidebar_update(){NAV_ELEMENT[select_prev].removeClass("active")
NAV_ELEMENT[select_current].addClass("active")
if(select_trigger){NAV_ELEMENT[select_current][0].click()}}
function navegation_subtitles_update(){if(select_current<1)return
if(select_trigger){if(ORIGINAL_URL_NAME=="dashboard"){let ref=$(sprintf("#table-subtitle tr:eq({item}) td",{'item':select_current})).find(".subtitle-filter")[0]
ref.click()}else{let form=$(sprintf("#table-subtitle tr:eq({item}) td",{'item':select_current})).find(".follow")
form.submit()}}
SUBTITLE_ELEMENT_CLEAR.removeClass("simulate-tr-hover")
$(sprintf("#table-subtitle tr:eq({item}) td",{'item':select_current})).addClass("simulate-tr-hover")
$(document).click()
let metadata=$(sprintf("#table-subtitle tr:eq({item}) td",{'item':select_current}))
if(metadata.length){metadata[0].click()}}
function navegation_update(){if(menu_prev!=menu_current){select_current=1
select_prev=0
if(menu_current==M_SIDEBAR){if(sm_conf["URL_NAME"]=="dashboard"){select_current=1}
if(sm_conf["URL_NAME"]=="consumer"){MENU_LEN=2
select_current=2}
if(sm_conf["URL_NAME"]=="dashboard-translate"){MENU_LEN=2
select_current=3}
if(sm_conf["URL_NAME"]=="dashboard-manual"){MENU_LEN=2
select_current=4}
if(sm_conf["URL_NAME"]=="dashboard-policy"){MENU_LEN=2
select_current=5}
if(sm_conf["URL_NAME"]=="dashboard-credits"){MENU_LEN=2
select_current=6}}
SUBTITLE_ELEMENT_CLEAR.removeClass("simulate-tr-hover")
SUBTITLE_METADATA.removeClass("d-block d-lg-none  animate__animated animate__slideInRight");if(sm_conf["DEVICE"]=="tv"){if(menu_prev==M_SIDEBAR&&menu_current==M_FORM){menu_current=M_SUBTITLES}
if(menu_prev==M_SUBTITLES&&menu_current==M_FORM){menu_current=M_SIDEBAR}}
menu_prev=menu_current
$('#id_movie').blur()
if(menu_current==M_FORM){$('#id_movie').focus()}}
$("#nav-dashboard").removeClass("active")
$("#nav-dashboard").removeClass("active")
$("#nav-consumer").removeClass("active")
$("#nav-translate").removeClass("active")
$("#nav-manual").removeClass("active")
$("#nav-privacy").removeClass("active")
$("#nav-credits").removeClass("active")
if(menu_current==M_SIDEBAR){navegation_sidebar_update()}
if(menu_current==M_SUBTITLES){navegation_subtitles_update()}}
$(document).keydown((event)=>{if(sm_conf["URL_NAME"]=="consumer")
{if(menu_current==0){event.preventDefault()}}else{if(sm_conf["DEVICE"]=='tv'){event.preventDefault()}}
if(!$("#cookieModal").is(':visible')&&!$("#id_glossary").is(":focus")){switch(event.which){case B_LEFT:navegation_prev_menu()
break
case B_RIGHT:navegation_next_menu()
break
case B_UP:navegation_prev()
break
case B_DOWN:navegation_next()
break
case B_SELECT:select_trigger=true
break}}
navegation_update()})});$(document).ready(()=>{let _cookie=new MCookie("privacy")
$("#CookiesOk").focus()
if(_cookie.get("ok")===null){setTimeout(()=>{$("#cookieModal").modal("show")},2500)}
$("#CookiesOk").on("click",()=>{_cookie.set("ok","true",365*24*60*60)
$("#cookieModal").modal("hide")})
$(document).keydown((event)=>{if($("#cookieModal").is(":visible")){if(event.which==13){_cookie.set("ok","true",365*24*60*60)
$("#cookieModal").modal("hide")}}})});var vhHeight=$("body").height();var fixHeight=vhHeight-window.innerHeight;$("body").css({overflow:'hidden'});if(vhHeight>0){$(".fix-container").css({height:(vhHeight-fixHeight)});};if($("#id_glossary").text()=="null"){$("#id_glossary").text("")};