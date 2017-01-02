import api from '../../utils/api.js'
import util from '../../utils/util.js'
Page({
  data: {
    status: {
        "UNPAID": "待支付", "FINISHED": "已完成", "REFUNDING": "退票中", "REFUSED": "退票被拒绝", "REFUNDED": "退票完成" 
    }
  },

  onLoad: function (options) {
    var orderNo = options.orderNo;
    var that = this
    api.getOrderDetial({
      data: {
        orderNo:orderNo
      },
      success: (res) => {
        if (res.data && res.data != {}) {
          var orderDetail = res.data.resultData
          that.setData({
            orderNo:orderNo,
            orderDetail: orderDetail,
            showDate: util.formatTime(orderDetail.departureTime, 1)
          });
        }
      }
    });
  },
  payOrder: function(){
    var that = this
    api.orderPay({
      data: {
        orderNo:that.data.orderNo,
        openId:wx.getStorageSync('userInfo').openId,
      },
      method: "POST",
      success: (res) => {
        if (res.data && res.data != {}) {
         console.log(res)
        }
      }
    });
  }
})