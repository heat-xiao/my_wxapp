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
    var index = parseInt(options.index);
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

  // onShow: function () {
  //   var that = this
  //   var selectIdentitys = wx.getStorageSync('selectIdentitys')
  //   if (selectIdentitys) {
  //     that.setData({
  //       selectIdentitys: selectIdentitys,
  //       adultNum: selectIdentitys.length
  //     });
  //   }
  // },

  onShow: function () {
    var that = this
    var allIdentitys = wx.getStorageSync('allIdentitys')
    if (allIdentitys) {
      console.log(allIdentitys.find(this.findSelectIds))
    }

  },

  findSelectIds: function (identitys) {
    var selectIds = wx.getStorageSync('selectIds')
    return identitys.identityId === 3;

  },

  removeSelect: function (e) {
    var that = this
    var removeIndex = e.currentTarget.id
    var selectIdentitys = that.data.selectIdentitys
    selectIdentitys.splice(removeIndex, 1)
    that.setData({
      selectIdentitys: selectIdentitys,
      adultNum: selectIdentitys.length
    });
    wx.setStorageSync('selectIdentitys', selectIdentitys);
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
