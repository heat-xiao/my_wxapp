import api from '../../utils/api.js'
import util from '../../utils/util.js'
Page({
  data: {
    status: {
      "UNPAID": "待支付", "FINISHED": "已完成", "REFUNDING": "退票中", "REFUSED": "退票被拒绝", "REFUNDED": "退票完成"
    },
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
        if (res.data && res.data != {}) {
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



          var createTime = `${util.formatTime(orderDetail.createTime, 0)} ${that.checkTime(new Date(orderDetail.createTime).getHours())}:${that.checkTime(new Date(orderDetail.createTime).getMinutes())}`
          var departureTime = `${that.checkTime(new Date(orderDetail.departureTime).getHours())}:${that.checkTime(new Date(orderDetail.departureTime).getMinutes())}`

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

  checkTime: function (i) {
    if (i < 10)
    { i = "0" + i }
    return i
  },

  payOrder: function () {
    var that = this
    api.orderPay({
      data: {
        orderNo: that.data.orderNo,
        openId: wx.getStorageSync('userInfo').openId,
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