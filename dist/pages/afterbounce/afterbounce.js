//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    destination: wx.getStorageSync('destination'),
  },
  
 //时间选择
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  onLoad: function () {
    var that = this
  },
  confirmOrder:function(e){
    var that = this
     wx.redirectTo({
       url: '../myorder/myorder'
       
     })
  }
})
