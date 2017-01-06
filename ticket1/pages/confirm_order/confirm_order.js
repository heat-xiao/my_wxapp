import util from '../../utils/util.js'
import api from '../../utils/api.js'
Page({
  data: {
    needInsurance: true,
    insurancePrice: 10,
    adultNum: 0,
    childNum: 0
  },
  onLoad: function (options) {
    var that = this
    var ticketInfo = wx.getStorageSync('ticketInfo');
    // var index = parseInt(options.index);
    var index = 0;
    api.getProfile({
      data: {
        accountId: wx.getStorageSync('userInfo').accountId,
      },
      success: (res) => {
        if (res.data && res.data != {}) {
          that.setData({
            phoneNumber: res.data.resultData.phoneNumber,
            index: index,
            ticketInfo: ticketInfo,
            ticketPrice: ticketInfo.disabledTickets[index].ticketPrice / 100,
            childPrice: ticketInfo.disabledTickets[index].childPrice / 100,
            showDate: util.formatTime(ticketInfo.departureDate, 1)
          });
        }
      }
    });
  },

  onShow: function () {
    var that = this
    var selectIds = wx.getStorageSync('selectIds')
    that.getIdentityById(selectIds)
  },

  removeSelect: function (e) {
    var that = this
    var removeId = e.currentTarget.id
    var selectIds = wx.getStorageSync('selectIds')
    var selectIds = selectIds.filter(function (item) {
      return item != removeId
    });
    that.getIdentityById(selectIds)
    wx.setStorageSync('selectIds', selectIds);
  },

  getIdentityById: function (ids) {
    var that = this
    var allIdentitys = wx.getStorageSync('allIdentitys')
    var selectIdentitys = []
    if (allIdentitys) {
      ids.forEach(function (id) {
        selectIdentitys.push(allIdentitys.find(function (item) {
          return item.identityId === + id
        }))
      })
      that.setData({
        selectIdentitys: selectIdentitys
      });
    }
  },

  radioInsurance: function () {
    var that = this
    that.setData({
      needInsurance: !that.data.needInsurance
    });
  },

  confirmOrder: function (e) {
    var that = this

    wx.redirectTo({
      url: '../orderinfo/orderinfo'
    })
  }
})
