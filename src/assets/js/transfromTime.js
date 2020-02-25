export function dateFormat(date, format) {
			if(format === undefined){
			  format = date;
			  date = new Date();
			}
			var map = {
			  "M": date.getMonth() + 1, //月份
			  "d": date.getDate(), //日
			  "h": date.getHours(), //小时
			  "m": date.getMinutes(), //分
			  "s": date.getSeconds(), //秒
			  "q": Math.floor((date.getMonth() + 3) / 3), //季度
			  "S": date.getMilliseconds() //毫秒
			};
			format = format.replace(/([yMdhmsqS])+/g, function(all, t){
			  var v = map[t];
			  if(v !== undefined){
			    if(all.length > 1){
			      v = '0' + v;
			      v = v.substr(v.length-2);
			    }
			  return v;
			  }else if(t === 'y'){
			    return (date.getFullYear() + '').substr(4 - all.length);
			  }
			  return all;
			});
			return format;
		}

//对日期格式化 2017-05-12
export function formatDate(time,format='YY-MM-DD'){
  var date = time;

  var year = date.getFullYear(),
    month = date.getMonth()+1,//月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();

  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }

  var newTime=year+"-"+month+"-"+day

  return newTime;

  // formatDate(new Date().getTime());//2017-05-12 10:05:44
  // formatDate(new Date().getTime(),'YY年MM月DD日');//2017年05月12日
  // formatDate(new Date().getTime(),'今天是YY/MM/DD hh:mm:ss');//今天是2017/05/12 10:07:45

}

export function getPastFormatDate(type) {
  var date;
   if(type=='minute'){   //5分钟之前，取前一个小时
    // date = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
     date=new Date(new Date().setHours((new Date().getHours()-1)));
  }else if(type=='hours') {   //1个小时之前，取前一天
    // date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    date=new Date(new Date().setDate((new Date().getDate()-1)));
  }else if(type=='day'){    //取一个月之前的数据
    date= new Date(new Date().setMonth((new Date().getMonth()-1)));
  }else if (type == 'mouth') {  //取前一年的数据
    date= new Date(new Date().setFullYear((new Date().getFullYear()-1)));
  }else if(type=='week'){
    date = new Date(new Date().getTime() - 7 * 24 * 3600 * 1000);
  }
  // var date = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);;
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var sHours=date.getHours();
  var sMinute=date.getMinutes();
  var sec=date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if(sHours>=0 && sHours<=9){
    sHours = "0" + sHours;
  }
  if(sMinute>=0 && sMinute<=9){
    sMinute = "0" + sMinute;
  }
  if(sec>=0 && sec<=9){
    sec = "0" + sec;
  }
  var pastdate;
   var pastdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + sHours + seperator2 + sMinute + seperator2 + sec;

  /*if(type=='minute'){
    pastdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + sHours + seperator2 + "00" + seperator2 + "00";
  }else  if(type=='hours') {   //1个小时之前，取前一天
    pastdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + "00" + seperator2 + "00" + seperator2 + "00";
  }else if(type=='day'){    //取一个月之前的数据
    pastdate = date.getFullYear() + seperator1 + month + seperator1 + "01" + " " + "00" + seperator2 + "00" + seperator2 + "00";
  } else if (type == 'mouth') {  //取前一年的数据
    pastdate = date.getFullYear() + seperator1 + "01" + seperator1 + "01" + " " + "00" + seperator2 + "00" + seperator2 + "00";
  }else if(type=='week'){
    pastdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + sHours + seperator2 + sMinute + seperator2 + sec;
  }*/

  return pastdate;
}


export function getPastFormatDateBySelect(type,time) {
  var date;
  if(type=='minute'){   //5分钟之前，取前一个小时
                        // date = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
    date=new Date(new Date().setHours((new Date().getHours()-1)));
  }else if(type=='hours') {   //1个小时之前，取前一天
                              // date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    date=new Date(new Date().setDate((new Date().getDate()-1)));
  }else if(type=='day'){    //取一个月之前的数据
    date= new Date(new Date().setMonth((new Date().getMonth()-1)));
  }else if (type == 'mouth') {  //取前一年的数据
    date= new Date(new Date().setFullYear((new Date().getFullYear()-1)));
  }else if(type=='week'){
    date = new Date(new Date().getTime() - 7 * 24 * 3600 * 1000);
  }
  // var date = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);;
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var sHours=date.getHours();
  var sMinute=date.getMinutes();
  var sec=date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if(sHours>=0 && sHours<=9){
    sHours = "0" + sHours;
  }
  if(sMinute>=0 && sMinute<=9){
    sMinute = "0" + sMinute;
  }
  if(sec>=0 && sec<=9){
    sec = "0" + sec;
  }
  var pastdate;
  var pastdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + sHours + seperator2 + sMinute + seperator2 + sec;

  /*if(type=='minute'){
    pastdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + sHours + seperator2 + "00" + seperator2 + "00";
  }else  if(type=='hours') {   //1个小时之前，取前一天
    pastdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + "00" + seperator2 + "00" + seperator2 + "00";
  }else if(type=='day'){    //取一个月之前的数据
    pastdate = date.getFullYear() + seperator1 + month + seperator1 + "01" + " " + "00" + seperator2 + "00" + seperator2 + "00";
  } else if (type == 'mouth') {  //取前一年的数据
    pastdate = date.getFullYear() + seperator1 + "01" + seperator1 + "01" + " " + "00" + seperator2 + "00" + seperator2 + "00";
  }else if(type=='week'){
    pastdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + sHours + seperator2 + sMinute + seperator2 + sec;
  }*/

  return pastdate;
}

export function getNowFormatDate(type) {
  var date;
  if(type=='minute'){   //5分钟之前，取前一个小时
    date=new Date(new Date().setMinutes((new Date().getMinutes())));
  }else if(type=='hours') {   //1个小时之前，取前一天
    date=new Date(new Date().setHours((new Date().getHours())));
  }else if(type=='day'){    //取一个月之前的数据
    date= new Date(new Date().setDate((new Date().getDate())));
  }else if(type == 'mouth') {  //取前一年的数据
    date= new Date(new Date().setMonth((new Date().getMonth())));
  }else if(type=='week'){
    date = new Date(new Date().getTime());
  }
    // var date = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);;
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var sHours=date.getHours();
    var sMinute=date.getMinutes();
    var sec=date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if(sHours>=0 && sHours<=9){
      sHours = "0" + sHours;
    }
    if(sMinute>=0 && sMinute<=9){
      sMinute = "0" + sMinute;
    }
    if(sec>=0 && sec<=9){
      sec = "0" + sec;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + sHours + seperator2 + sMinute + seperator2 + sec;
 /* var currentdate;

  if(type=='minute'){
    currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + sHours + seperator2 + "00" + seperator2 + "00";
  }else  if(type=='hours') {   //1个小时之前，取前一天
    currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + "00" + seperator2 + "00" + seperator2 + "00";
  }else if(type=='day'){    //取一个月之前的数据
    currentdate = date.getFullYear() + seperator1 + month + seperator1 + "01" + " " + "00" + seperator2 + "00" + seperator2 + "00";
  }else if (type == 'mouth') {  //取前一年的数据
    currentdate = date.getFullYear() + seperator1 + "01" + seperator1 + "01" + " " + "00" + seperator2 + "00" + seperator2 + "00";
  }else if(type=='week'){
    currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + sHours + seperator2 + sMinute + seperator2 + sec;
  }*/
    return currentdate;
}



export function getFormatDateBySelect(type,time) {
  var date;
  date= new Date(time.replace(/-/,"/"))
  // var date = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);;
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var sHours=date.getHours();
  var sMinute=date.getMinutes();
  var sec=date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if(sHours>=0 && sHours<=9){
    sHours = "0" + sHours;
  }
  if(sMinute>=0 && sMinute<=9){
    sMinute = "0" + sMinute;
  }
  if(sec>=0 && sec<=9){
    sec = "0" + sec;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + sHours + seperator2 + sMinute + seperator2 + sec;
  /*var currentdate;

  if(type=='minute'){
    currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + sHours + seperator2 + "00" + seperator2 + "00";
  }else  if(type=='hours') {   //1个小时之前，取前一天
    currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + "00" + seperator2 + "00" + seperator2 + "00";
  }else if(type=='day'){    //取一个月之前的数据
    currentdate = date.getFullYear() + seperator1 + month + seperator1 + "01" + " " + "00" + seperator2 + "00" + seperator2 + "00";
  }else if (type == 'mouth') {  //取前一年的数据
    currentdate = date.getFullYear() + seperator1 + "01" + seperator1 + "01" + " " + "00" + seperator2 + "00" + seperator2 + "00";
  }else if(type=='week'){
    currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + sHours + seperator2 + sMinute + seperator2 + sec;
  }*/
  return currentdate;
}

