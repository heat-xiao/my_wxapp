// pages/order/orderlist/order_refund/order_refund.js
Page({
  data: {
    reason: '',
    radioItems: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var vm = this;
    // 获取用户信息
    var accountId = wx.getStorageSync('userInfo').accountId
    console.log('accountId', accountId);
    vm.setData({
      accountId: accountId
    })
    vm.setData({
      accountId: accountId,
      orderNo: options.orderNo
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    // 获取退款理由
    var vm = this;
    wx.request({
      method: 'GET',
      url: getApp().globalData.restServer + 'v1/account/refund/reason',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('接口调用成功', res);
        if (res.data.resultStatus) {
          vm.setData({
            'radioItems': res.data.resultData,
            'reason': res.data.resultData[0]
          });
        }
      },
      fail: function (res) {
        console.log('接口调用失败', res)
      }
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      console.log('radioItems[i]', radioItems[i] == e.detail.value)
      if (radioItems[i] == e.detail.value) {
        this.setData({
          reason: radioItems[i]
        });
        break;
      }
    }
  },
  submitRefund: function (e) {
    var vm = this
    console.log('提交退款申请', e.detail.value.remark, vm.data.reason, vm.data.orderNo);
    wx.request({
      method: 'POST',
      url: getApp().globalData.restServer + 'v1/account/order/refund',
      data: {
        orderNo: vm.data.orderNo,
        accountId: vm.data.accountId,
        refundReason: vm.data.reason,
        remark: e.detail.value.remark
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('接口调用成功', res);
        if (res.data.resultStatus) {
          wx.showToast({
            title: '申请成功',
            icon: 'success',
            duration: 1000
          })
          wx.navigateBack({
            delta: 1
          });
        } else {
          wx.showToast({
            title: res.data.errorMessage,
            icon: 'loading',
            duration: 1500
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
  }
})