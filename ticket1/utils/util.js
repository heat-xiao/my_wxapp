function formatTime(time) {
  var weekArry = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  var date = new Date(time)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var formatdate = [year, month, day].map(formatNumber).join('-');
  var weekDay = new Date(Date.parse(formatdate.replace(/-/g, "/"))); 
  return month+'月'+day+'日'+ ' '+ weekArry[weekDay.getDay()]
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getSystemInfo = (params) => {
  wx.getSystemInfo({
    success: function (res) {
      // console.log(res.model)
      // console.log(res.pixelRatio)
      // console.log(res.windowWidth)
      // console.log(res.windowHeight)
      // console.log(res.language)
      // console.log(res.version)
      params.success && params.success(res)
    }
  });
}


module.exports = {
  formatTime: formatTime,
  getSystemInfo
}
