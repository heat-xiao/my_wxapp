import util from '../../utils/util.js'
import api from '../../utils/api.js'
var allIdentitys = wx.getStorageSync('allIdentitys')
var childIdentitys = []  //从成年信息中构建
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
    util.getSystemInfo({
      success: (res) => {
        that.setData({
          deviceHeight: res.windowHeight,
          showActionSheet: false
        });
      }
    });

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
            ticketPrice: ticketInfo.enabledTickets[index].ticketPrice / 100,
            childPrice: ticketInfo.enabledTickets[index].childPrice / 100,
            showDate: util.formatTime(ticketInfo.departureDate, 1)
          });
        }
      }
    });
  },

  //成人信息处理
  getAdultIdentityById: function (ids) {
    var that = this
    var adultIdentitys = []
    if (allIdentitys) {
      ids.forEach(function (id) {
        adultIdentitys.push(allIdentitys.find(function (item) {
          return item.identityId === + id
        }))
      })
      that.setData({
        adultIdentitys: adultIdentitys
      });
    }
  },

  onShow: function () {
    var that = this
    var selectIds = wx.getStorageSync('selectIds');
    if (selectIds) {
      that.getAdultIdentityById(selectIds)
    }
  },

  removeAdult: function (e) {
    var that = this
    var removeId = e.currentTarget.id
    var selectIds = wx.getStorageSync('selectIds')
    var selectIds = selectIds.filter(function (item) {
      return item != removeId
    });
    that.getAdultIdentityById(selectIds)
    wx.setStorageSync('selectIds', selectIds);
  },


  //儿童票信息处理
  getChildIdentityById: function (id) {
    var that = this
    if (allIdentitys) {
      childIdentitys.push(allIdentitys.find(function (item) {
        return item.identityId === + id
      }))
      that.setData({
        childIdentitys: childIdentitys
      });
    }
  },

  addChildTicket: function () {
    var that = this
    if (that.data.adultIdentitys.length > 1) {
      that.setData({
        showActionSheet: true
      });
    } else {
      that.getChildIdentityById(that.data.adultIdentitys[0].identityId)
    }
  },

  selectIdentityForChild: function (e) {
    var that = this
    var identityId = e.currentTarget.id
    that.setData({
      showActionSheet: false
    });
    that.getChildIdentityById(identityId)
  },

  removeChild: function (e) {
    var that = this
    var removeIndex = e.currentTarget.id

    that.setData({
      childIdentitys: childIdentitys
    });
  },

  hideMask: function () {
    var that = this
    that.setData({
      showActionSheet: false
    });
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
