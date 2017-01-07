import api from '../../utils/api.js'

Page({
  data: {
    status: {
        "UNPAID": "待支付", "FINISHED": "已完成", "REFUNDING": "退票中", "REFUSED": "退票被拒绝", "REFUNDED": "退票完成" 
    }
  },

  onLoad: function () {
    var that = this
    api.getOrderList({
      data: {
        accountId: wx.getStorageSync('userInfo').accountId,
      },
      success: (res) => {
        if (res.data && res.data != {}) {
          var orderList = res.data.resultData
          that.setData({
            orderList: orderList
          });
        }
      }
    });
  }
})
