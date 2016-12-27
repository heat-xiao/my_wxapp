import util from '../../utils/util.js'

Page({

  data: {
    ticketInfo: {}
  },

  decrease: function () {
    var that = this
    var newDate = new Date(that.data.date);
    var date = newDate.setDate(newDate.getDate() - 1);
    that.setData({
      date: date,
      showDate: util.formatTime(date)
    })
  },

  increase: function () {
    var that = this
    var newDate = new Date(that.data.date);
    var date = newDate.setDate(newDate.getDate() + 1);
    that.setData({
      date: date,
      showDate: util.formatTime(date)
    })
  },

  onLoad: function (options) {
    var that = this
    var ticketInfo = {
      id: 1,
      start: "蛇口港",
      end: "香港码头",
      date: "2016-12-27",
      time: "12:00",
      duration: "2小时",
      ticketItem: [{ type: "头等舱", stock: "20", price: "300" }, { type: "普通舱", stock: "0", price: "180" }]
    }
    that.setData({
      ticketInfo: ticketInfo,
      date: ticketInfo.date,
      showDate: util.formatTime(ticketInfo.date),
    })
  }
})
