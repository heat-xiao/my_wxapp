//获取应用实例
var app = getApp()
Page({
  data: {
    riders: [],
    insurance:true,
    insuranceUnit:10
  },
  onLoad: function () {
    var that = this
    var riders = [{ id: 1, name: "张三", idcard: "4210394844848484848", "age": "28" }]
    
    that.setData({
      riders: riders
    })
  },

  confirmOrder:function(e){
    var that = this
     wx.redirectTo({
       url: '../orderinfo/orderinfo'
     })
  }
})
