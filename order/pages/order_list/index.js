const App = getApp()
Page({
  data: {
    orderList: [],
    pageNo: 1,
    nextPageStatus: !0,
    prompt: {
      hidden: !0,
      text: "您还没有订单",
      buttons: [
        {
          text: '先逛逛',
          bindtap: 'toHome',
        },
      ],
    },
  },
  onShow() {
    this.getOrderListByPageNo(1)
  },

  getOrderListByPageNo(pageNo) {
    const token = App.WxService.getStorageSync('token')
    App.HttpService.getOrderList({
      accountId: token.accountId,
      storeId: App.WxService.getStorageSync('storeId'),
      pageNo: pageNo ? pageNo : 1,
    }).then(data => {
      if (!data.resultStatus) {
        App.WxService.showToast({
          title: r0.errorMessage,
          icon: 'loading',
          duration: 2000
        })
        return
      }
      if (pageNo == 1 && data.resultData.length == 0) {
        this.setData({
          'prompt.hidden': 0
        })
        return;
      }
      var orderList = pageNo == 1 ? [] : this.data.orderList;
      orderList = orderList.concat(data.resultData);
      this.setData({
        orderList: orderList,
        nextPageStatus: data.resultData.length - 20 >= 0, // 是否还有下一页
        pageNo: data.resultData.length - 20 >= 0 ? pageNo + 1 : pageNo
      });
    })
  },
  onPullDownRefresh(e) {
    this.getOrderListByPageNo(1);
    App.WxService.stopPullDownRefresh();
  },

  onReachBottom() {
    if (this.data.nextPageStatus) {
      this.getorderList(this.data.pageNo);
    }
  },

  addSameOrder(e) {
    const token = App.WxService.getStorageSync('token')
    App.HttpService.addSameOrder({
      accountId: token.accountId,
      storeId: App.WxService.getStorageSync('storeId'),
      orderNo: e.currentTarget.dataset.orderno
    }).then(data => {
      if (data.resultStatus) {
        App.WxService.showToast({
          title: '已加入菜篮子',
          icon: 'success',
          duration: 2000
        })
        App.WxService.redirectTo('/pages/index/index');
      }
    })
  },

  orderPay(e) {
    const token = App.WxService.getStorageSync('token')
    const orderNo = e.currentTarget.dataset.orderno
    App.HttpService.orderPay({
      openId: token.openId,
      orderNo: orderNo
    }).then(r1 => {
      return App.WxService.requestPayment({
        'timeStamp': r1.resultData.timeStamp.toString(),
        'nonceStr': r1.resultData.nonceStr,
        'package': r1.resultData.package,
        'signType': 'MD5',
        'paySign': r1.resultData.sign,
      })
    }).then(r2 => {
      App.WxService.redirectTo('/pages/msg/pay_success/index')
    })
      .catch(function (error) {
        App.WxService.showToast({
          title: '取消支付',
          icon: 'loaddging',
          duration: 2000
        })
      });
  },

  toHome() {
    App.WxService.redirectTo('/pages/index/index');
  },

  toComment(e) {
    const orderNo = e.currentTarget.dataset.orderno;
    const commentOrder = this.data.orderList.find(function (item) {
      return item.orderNo == orderNo
    })
    App.WxService.setStorageSync('commentOrder', commentOrder);
    App.WxService.navigateTo('/pages/order_comment/index');
  }
})