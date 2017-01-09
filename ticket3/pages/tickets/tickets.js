import util from '../../utils/util.js'
import api from '../../utils/api.js'
Page({
  data: {
    ticketData: [],
  },

  decrease: function () {
    var that = this
    var newDate = new Date(that.data.date);
    var date = newDate.setDate(newDate.getDate() - 1);
    that.setData({
      date: date,
      showDate: util.formatTime(date, 1)
    });
    that.getTickets();
  },

  increase: function () {
    var that = this
    var newDate = new Date(that.data.date);
    var date = newDate.setDate(newDate.getDate() + 1);
    that.setData({
      date: date,
      showDate: util.formatTime(date, 1)
    });
    that.getTickets();
  },

  //时间选择
  bindDateChange: function (e) {
    var that = this
    this.setData({
      showDate: util.formatTime(e.detail.value, 1),
      date: e.detail.value
    })
    that.getTickets();
  },

  onLoad: function (options) {
    var that = this
    //通过缓存拿到参数
    that.setData({
      source: wx.getStorageSync('source'),
      destination: wx.getStorageSync('destination'),
      date: wx.getStorageSync('date'),
      showDate: util.formatTime(wx.getStorageSync('date'), 1)
    })

    that.getTickets();
  },

  getTickets: function () {
    var that = this
    api.getTickets({
      data: {
        source: that.data.source,
        destination: that.data.destination,
        departureDate: util.formatTime(that.data.date, 0)
      },
      success: (res) => {
        if (res.data && res.data != {}&&res.data.resultStatus) {
          that.setData({
            ticketData: res.data.resultData,
          });
          wx.setStorageSync('ticketData', res.data.resultData);
        }
      }
    });
  }
})
