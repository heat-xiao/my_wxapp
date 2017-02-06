// pages/order/my_coupon/my_coupon.js
Page({
  data: {
    couponList: [],
    accountId: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    // 获取优惠券列表
    var vm = this
     // 获取用户信息
    var accountId = wx.getStorageSync('userInfo').accountId
    console.log('accountId', accountId);
    vm.setData({
      accountId: accountId
    })
    if (accountId) {
      vm.getCouponList();
    } else {
      wx.showToast({
        title: '登录信息异常',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  getCouponList: function () {
    var vm = this
    if (vm.data.accountId) {
      wx.request({
        method: 'GET',
        url: getApp().globalData.restServer + 'v1/account/coupons',
        data: {
          accountId: vm.data.accountId
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log('接口调用成功', res);
          if (res.data.resultStatus) {
            vm.setData({
              couponList: res.data.resultData
            });
          }
        },
        fail: function (res) {
          console.log('接口调用失败', res)
        }
      })
    } else {
      wx.showToast({
        title: '数据异常',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onPullDownRefresh: function () {
    this.getCouponList();
    wx.stopPullDownRefresh();
  }
})