// pages/about_us/about_us.js
Page({
  data: {
    storeInfo: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var vm = this;
    wx.request({
      method: 'GET',
      url: getApp().globalData.restServer + 'v1/account/about',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('接口调用成功', res);
        if (res.data.resultStatus) {
          vm.setData({
            storeInfo: res.data.resultData
          });
        } else {
          wx.showToast({
            title: '信息获取失败：' + res.data.errorMessage,
            icon: 'loading',
            duration: 1000
          })
        }
      },
      fail: function (res) {
        console.log('接口调用失败', res)
        wx.showToast({
          title: '网络异常',
          icon: 'loading',
          duration: 1000
        })
      }
    })

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})