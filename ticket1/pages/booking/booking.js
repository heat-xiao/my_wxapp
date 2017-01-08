import util from '../../utils/util.js'
Page({
  data: {
    todayDate: new Date(),
    showDate: util.formatTime(new Date(),1),
    date:new Date()
  },
  
  //切换方向
  toggleDirection: function () {
    var that = this
    that.setData({
      source: that.data.destination,
      destination: that.data.source
    })
  },

  onShow: function () {
    var that = this
    that.setData({
      source: wx.getStorageSync('source'),
      destination: wx.getStorageSync('destination'),
    })
  },

  //时间选择
  bindDateChange: function (e) {
    var that = this
    this.setData({
      showDate: util.formatTime(e.detail.value, 1),
      date: e.detail.value
    })
  },

  

  // 通过缓存传递参数
  searchTicket: function (e) {
    var that = this
    if (!that.data.source) {
      wx.showToast({
        title: '请选择出发地',
        icon: 'loading',
        duration: 1000
      })
      return;
    };
    if (!that.data.destination) {
      wx.showToast({
        title: '请选择目的地',
        icon: 'loading',
        duration: 1000
      })
      return;
    };
    wx.setStorageSync('destination', that.data.destination);
    wx.setStorageSync('source', that.data.source);
    wx.setStorageSync('date', '2017-01-31');
    wx.navigateTo({
      url: '../tickets/tickets'
    })
  }
})