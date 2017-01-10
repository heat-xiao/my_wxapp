import calendar from '../../utils/calendar.js'
Page({
  data: {
    todayDate: new Date(), //用于限制时间选择当天前的时间
  },

  onLoad: function () {

    var that = this
    console.log(calendar.getCalender(2))
    that.setData({
      calendar: calendar.getCalender(2),
    });
  },
})
