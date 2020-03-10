/*用export把方法暴露出来*/


export default {
    /*设置cookie*/
    setCookie: function(c_name,value,expire) {
      let date=new Date();
      if(expire===Infinity){
        expire = "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
        document.cookie=c_name+ "="+escape(value)+"; expires="+expire
      }else{
        date.setSeconds(date.getSeconds()+expire)
        document.cookie=c_name+ "="+escape(value)+"; expires="+date.toGMTString()
      }

      // console.log(document.cookie)
    },

    /*获取cookie*/
    getCookie: function(c_name) {
      if (document.cookie.length>0){
          let c_start=document.cookie.indexOf(c_name + "=")
          if (c_start!=-1){
              c_start=c_start + c_name.length+1
              let c_end=document.cookie.indexOf(";",c_start)
              if (c_end==-1) c_end=document.cookie.length
                  return unescape(document.cookie.substring(c_start,c_end))
              }
          }
      return ""
    },

    /*删除cookie*/
    delCookie: function(c_name) {
      setCookie(c_name, "", -1)
    },

    //清除所有cookie函数
    clearAllCookie: function() {
      let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if(keys) {
        for(var i = keys.length; i--;)
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
      }
    }
}
