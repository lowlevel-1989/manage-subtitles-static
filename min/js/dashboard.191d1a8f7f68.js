$(document).ready(()=>{let _cookie=new MCookie("privacy")
$("#CookiesOk").focus()
if(_cookie.get("ok")===null){setTimeout(()=>{$("#cookieModal").modal("show")},2500)}
$("#CookiesOk").on("click",()=>{_cookie.set("ok","true",365*24*60*60)
$("#cookieModal").modal("hide")})
$(document).keydown((event)=>{if($("#cookieModal").is(":visible")){if(event.which==13){_cookie.set("ok","true",365*24*60*60)
$("#cookieModal").modal("hide")}}})});