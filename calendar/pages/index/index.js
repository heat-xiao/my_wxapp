import calendar from '../../utils/calendar.js'
Page({
  data: {
    todayDate: new Date(),
  },
  onLoad: function () {
    const that = this
    const clockDate = [{
      date: '2017-12-08',
      clockStatus: true,
      clockTime:'6:00'
    },{
      date: '2017-12-07',
      clockStatus: false,
      clockTime:'7:00'
    },{
      date: '2017-11-26',
      clockStatus: true,
      clockTime: null
    }]
    const monthNum = this.getMonthNumber(clockDate[clockDate.length-1].date,clockDate[0].date);
    const calendarData = calendar.getCalender(monthNum)
    clockDate.forEach(i1=>{
      calendarData.map(i2=>{
        return i2.dateItem.map(i3=>{
          if(i3.date==i1.date){
            i3.clockStatus = i1.clockStatus
            i3.clockTime = i1.clockTime
            return i3
          }
        })   
      })      
    })
    console.log(calendarData)
    
    that.setData({
      calendarData,
      clockDate
    });
  },
  getMonthNumber(sDate, eDate){
    var y1 = new Date(sDate).getFullYear();
    var y2 = new Date(eDate).getFullYear()
    var m1 = new Date(sDate).getMonth();
    var m2 = new Date(eDate). getMonth()
    var len = (y2 - y1) * 12 + (m2 - m1) + 1;
    return len;
  }
})
