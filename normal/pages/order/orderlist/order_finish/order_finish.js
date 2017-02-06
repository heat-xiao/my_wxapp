// pages/order/orderlist/order_finish/order_finish.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  goToComment: function () {
    var vm = this;
    // 去评价
    var accountId = wx.getStorageSync('userInfo').accountId
    var order = wx.getStorageSync('finishingOrder');
    console.log('去评价', order);
    if (accountId) {
      if (order.orderNo) {
        wx.setStorageSync('commentOrder', order);
        wx.redirectTo({
          url: '../order_comment/order_comment'
        })
      } else {
        wx.showToast({
          title: '未获取到订单信息',
          icon: 'loading',
          duration: 1000
        })
      }
    } else {
      wx.showToast({
        title: '登录信息异常',
        icon: 'loading',
        duration: 1000
      })
    }
  }
})