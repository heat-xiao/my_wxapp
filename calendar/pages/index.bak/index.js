import calendar from '../../utils/calendar.js'
Page({
  data: {
    todayDate: new Date(), //用于限制时间选择当天前的时间
  },
  onLoad: function () {
    var that = this
    var selectedDate = '2017-12-08'
    var calendarData = calendar.getCalender(8)
    console.log(calendarData)
    that.setData({
      selectedDate,
      calendarData
    });
  },

  selectDate:function(e){
    var that = this
    console.log(e.currentTarget.dataset.date)
    that.setData({
      selectedDate:e.currentTarget.dataset.date
    });
  }
})
