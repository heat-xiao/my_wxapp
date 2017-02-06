Page({
  data: {
    nonPaymentCount: 0,//待付款
    waitDeliverCount: 0,//待发货
    waitReceiverCount: 0,//待收货
    waitCommentCount: 0,//待评价
    userInfo: {}
  },
  setOrderType: function (e) {
    console.log('设置订单类型', e.currentTarget.dataset.type);
    wx.setStorageSync('orderType', e.currentTarget.dataset.type);
  },
  onShow: function () {
    var vm = this
    // 获取用户信息
    // 获取用户信息
    var accountId = wx.getStorageSync('userInfo').accountId
    console.log('accountId', accountId);
    vm.setData({
      accountId: accountId
    })
    if (accountId) {
      wx.request({
        method: 'GET',
        url: getApp().globalData.restServer + 'v1/account/profile',
        data: {
          accountId: accountId
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log('接口调用成功', res);
          if (res.data.resultStatus) {
            vm.setData({
              userInfo: res.data.resultData.detail,
              nonPaymentCount: res.data.resultData.order.UNPAID,//待付款
              waitDeliverCount: res.data.resultData.order.UNDELIVER,//待发货
              waitReceiverCount: res.data.resultData.order.DELIVERED,//待收货
              waitCommentCount: res.data.resultData.order.WAITCOMMENT,//待评价
            });
          }
        },
        fail: function (res) {
          console.log('接口调用失败', res)
        }
      })
    }
  }
})
