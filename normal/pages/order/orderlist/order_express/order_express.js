// pages/order/orderlist/order_express/order_express.js
Page({
  data: {
    expressInfo: {
      // orderPicture: 'http://share.30days-tech.com/daka/pictures/commodity_icon.png',
      // companyName: '圆通',
      // orderNo: '18348494039',
      // deliverList: [
      //   {
      //     time: '2016.09.01 11:21:29',
      //     desc: '客户 签收人：同事已签收 感谢使用圆通快递，期待再次为您服务'
      //   },
      //   {
      //     time: '2016.09.01 11:21:29',
      //     desc: '广东省深圳市坂田公司王＊＊正在派件'
      //   },
      //   {
      //     time: '2016.09.01 11:21:29',
      //     desc: '广东省深圳市坂田公司王＊＊正在派件'
      //   },
      //   {
      //     time: '2016.09.01 11:21:29',
      //     desc: '广东省深圳市坂田公司王＊＊正在派件'
      //   }
      // ]
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 获取物流信息
    console.log('页面参数options', options);
    this.setData({
      expressCode: options.expressCode,
      trackingNo: options.trackingNo,
      commodityIcon: options.commodityIcon
    });
    console.log('查询的信息', {
      expressCode: options.expressCode,
      trackingNo: options.trackingNo,
      commodityIcon: options.commodityIcon
    });
    if (options.expressCode && options.trackingNo) {
      this.getExpressInfon(options.expressCode, options.trackingNo);
    } else {
      wx.showToast({
        title: '数据异常',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  getExpressInfon: function () {
    var vm = this;
    wx.request({
      method: 'GET',
      url: getApp().globalData.restServer + 'v1/common/express/detail',
      data: {
        expressCode: vm.data.expressCode,
        trackingNo: vm.data.trackingNo
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('接口调用成功', res);
        if (res.data.resultStatus) {
          vm.setData({
            expressInfo: res.data.resultData
          });
        } else {
          wx.showToast({
            title: '获取物流信息失败：' + res.data.errorMessage,
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
  onPullDownRefresh: function () {
    this.getExpressInfon();
    wx.stopPullDownRefresh();
  }
})