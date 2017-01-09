import api from '../../utils/api.js'
import util from '../../utils/util.js'
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
          if (wx.getStorageSync('configInfo').VALIDATE_IDENTITY) {
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
          }else{
            orderDetail.tickets.forEach(function (ticket) {
              if (ticket.ticketType == 'ADULT') {
                adultIdentitys.push(ticket)
              } else {
                childIdentitys.push(ticket)
              }
            })
          }
          var createTime = `${util.formatTime(orderDetail.createTime, 0)} ${new Date(orderDetail.createTime).getHours()}:${new Date(orderDetail.createTime).getMinutes()}`
          var departureTime = `${new Date(orderDetail.departureTime).getHours()}:${new Date(orderDetail.departureTime).getMinutes()}`

          that.setData({
            orderNo: orderNo,
            orderDetail: orderDetail,
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

  confirmBounce: function () {
    var that = this
    wx.navigateTo({
      url: `../after_bounce/after_bounce?orderNo=${that.data.orderNo}`
    })
  }
})