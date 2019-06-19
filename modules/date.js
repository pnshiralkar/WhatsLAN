function getdate(){
var d = new Date();
var date = "" + d.getFullYear();
if((d.getMonth()+1)/10<1)
date += "0"+(d.getMonth()+1);
else
date += (d.getMonth()+1);


if((d.getDate())/10<1)
date += "0"+(d.getDate());
else
date += (d.getDate());

if((d.getHours())/10<1)
date += "0"+(d.getHours());
else
date += (d.getHours());

if((d.getMinutes())/10<1)
date += "0"+(d.getMinutes());
else
date += (d.getMinutes());

if((d.getSeconds())/10<1)
date += "0"+(d.getSeconds());
else
date += (d.getSeconds());
return date;
}
module.exports = getdate;
