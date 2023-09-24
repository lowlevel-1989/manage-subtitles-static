$(document).ready(()=>{const URL_CURRENT=new URL(window.location.href)
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
navegation_update()})});