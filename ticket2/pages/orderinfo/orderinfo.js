//获取应用实例
var app = getApp()
Page({
  data: {
  },
  onLoad: function () {
    var that = this
  },
  payOrder:function(e){
    var that = this
     wx.redirectTo({
       url: '../ordered/ordered'
     })
  }
})
