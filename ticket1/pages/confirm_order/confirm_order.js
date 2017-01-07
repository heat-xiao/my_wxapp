import util from '../../utils/util.js'
import api from '../../utils/api.js'
var allIdentitys = wx.getStorageSync('allIdentitys')

Page({
  data: {
    needInsurance: true,
    insurancePrice: 10,
    adultIdentitys: [],
    childIdentitys: []
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

  onShow: function () {
    var that = this
    var childIds = wx.getStorageSync('childIds')
    var selectIds = wx.getStorageSync('selectIds')
    if (selectIds) {
      that.getAdultIdentityById(selectIds)
    }
    if (childIds) {
      that.getChildIdentityById(childIds)
    }
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
    wx.setStorageSync('selectIds', ids);
  },

  removeAdult: function (e) {
    var that = this
    var removeId = e.currentTarget.id
    var selectIds = wx.getStorageSync('selectIds')
    selectIds = selectIds.filter(function (item) {
      return item != removeId
    });
    that.getAdultIdentityById(selectIds)
  },


  //儿童票信息处理
  getChildIdentityById: function (ids) {
    var that = this
    var childIdentitys = []
    if (allIdentitys) {
      ids.forEach(function (id) {
        childIdentitys.push(allIdentitys.find(function (item) {
          return item.identityId === + id
        }))
      })
      that.setData({
        childIdentitys: childIdentitys
      });
    }
    wx.setStorageSync('childIds', ids);
  },

  addChildTicket: function () {
    var that = this
    var childIds = wx.getStorageSync('childIds')
    var selectIds = wx.getStorageSync('selectIds')
    if (selectIds.length > 1) {
      that.setData({
        showActionSheet: true
      });
    } else if (selectIds.length == 1) {
      childIds.push(selectIds[0].identityId)
      that.getChildIdentityById(childIds)
    } else {
      return
    }
  },

  selectIdentityForChild: function (e) {
    var that = this
    var identityId = e.currentTarget.id
    var childIds = wx.getStorageSync('childIds')
    childIds.push(identityId)
    that.setData({
      showActionSheet: false
    });
    that.getChildIdentityById(childIds)
  },

  removeChild: function (e) {
    var that = this
    var removeIndex = e.currentTarget.id
    var childIds = wx.getStorageSync('childIds')
    childIds.splice(removeIndex, 1);
    that.getChildIdentityById(childIds)
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
