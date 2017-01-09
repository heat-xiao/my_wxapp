import api from '../../../utils/api.js'
import util from '../../../utils/util.js'
Page({
  data: {
    status: {
      "UNPAID": "待支付", "FINISHED": "已完成", "REFUNDING": "退票中", "REFUSED": "退票被拒绝", "REFUNDED": "退票完成"
    },
    REFUND_INTRODUCE: wx.getStorageSync('configInfo').REFUND_INTRODUCE,
    needIndentityty: wx.getStorageSync('configInfo').VALIDATE_IDENTITY,
  },

  onLoad: function (options) {
    var orderNo = options.orderNo;
    var that = this
    api.getOrderDetial({
      data: {
        orderNo: orderNo
      },
      success: (res) => {
        if (res.data && res.data != {}&&res.data.resultStatus) {
          var orderDetail = res.data.resultData
          var adultIdentitys = []
          var childIdentitys = []
          if (orderDetail.tickets[0].identityId) {
            orderDetail.tickets.forEach(function (ticket) {
              if (ticket.ticketType == 'ADULT') {
                adultIdentitys.push(orderDetail.tickets.find(function (item) {
                  return item.identityId === + ticket.identityId
                }))
              } else {
                childIdentitys.push(orderDetail.tickets.find(function (item) {
                  return item.identityId === + ticket.identityId
                }))
              }
            })
          } else {
            orderDetail.tickets.forEach(function (ticket) {
              if (ticket.ticketType == 'ADULT') {
                adultIdentitys.push(ticket)
              } else {
                childIdentitys.push(ticket)
              }
            })
          }
          var createTime = `${util.formatTime(orderDetail.createTime, 0)} ${that.checkTime(new Date(orderDetail.createTime).getHours())}:${that.checkTime(new Date(orderDetail.createTime).getMinutes())}`
          var departureTime = `${that.checkTime(new Date(orderDetail.departureTime).getHours())}:${that.checkTime(new Date(orderDetail.departureTime).getMinutes())}`

          that.setData({
            orderNo: orderNo,
            orderDetail: orderDetail,
            needIndentityty: orderDetail.tickets[0].identityId,
            adultIdentitys: adultIdentitys,
            childIdentitys: childIdentitys,
            showDate: util.formatTime(orderDetail.departureTime, 1),
            departureTime: departureTime,
            createTime: createTime
          });
        }
      }
    });
  },

  checkTime: function (i) {
    if (i < 10)
    { i = "0" + i }
    return i
  },

  applyRefund: function () {
    var that = this
    api.applyRefund({
      data: {
        orderNo: that.data.orderNo,
        accountId: wx.getStorageSync('userInfo').accountId,
      },
      method: "POST",
      success: (res) => {
         if (res.data && res.data != {}&&res.data.resultStatus) {
          if (res.data.resultStatus) {
            wx.showToast({
              title: '申请成功',
              icon: 'success',
              duration: 1000
            })
            wx.navigateTo({
              url: `../../order/order_finish/order_finish?orderNo=${that.data.orderNo}`
            })
          } 

        }
      }
    });
  }
})