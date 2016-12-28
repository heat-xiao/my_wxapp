import util from '../../utils/util.js'

Page({
  data: {
    ticketInfo: [],
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
    });
  },

  onLoad: function (options) {
    var that = this

    //通过url传递参数
    // that.setData({
    //   source: options.source,
    //   destination: options.destination, 
    //   date:options.date,
    //   showDate:util.formatTime(options.date)
    // })

    // 通过出发地和目的地查出相关的车票;
    var source = wx.getStorageSync('source');
    var destination = wx.getStorageSync('destination');
    var date = wx.getStorageSync('date');

    //在此模拟接口得出的json
    var ticketInfo = {
      source: source,
      destination: destination,
      date: date,
      duration:"2小时",
      tList: [
        { id: 1, start: "蛇口港", end: "香港码头", time: "12:00", "stock": "123", price: "180" },
        { id: 2, start: "罗湖口岸", end: "九龙湾", time: "16:00", "stock": "18", price: "200" },
        { id: 3, start: "福田口岸", end: "香港码头", time: "18:00", "stock": "10", price: "200" }]
    }

    //通过缓存拿到参数
    that.setData({
      date: date,
      showDate: util.formatTime(date),
      ticketInfo: ticketInfo
    })


  },
  selectType: function (e) {
    var that = this
    wx.navigateTo({
      url: '../tickettype/tickettype?id=' + e.target.dataset.id
    })
  }
})
