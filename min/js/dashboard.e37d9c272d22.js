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
return register.value}};