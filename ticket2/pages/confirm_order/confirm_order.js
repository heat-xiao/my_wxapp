import util from '../../utils/util.js'
import api from '../../utils/api.js'

Page({
  data: {
    needIndentityty: wx.getStorageSync('configInfo').VALIDATE_IDENTITY,
    insurancePrice: wx.getStorageSync('configInfo').INSURANCE_PRICE / 100,
    showActionSheet: false,
    needInsurance: true,
    adultIdentitys: [],
    childIdentitys: []
  },

  onShow: function () {
    var that = this
    var childIds = wx.getStorageSync('childIds')
    var selectIds = wx.getStorageSync('selectIds')
    if (selectIds.length) {
      that.getAdultIdentityById(selectIds)
    }
    if (childIds.length) {
      that.getChildIdentityById(childIds)
    }
  },

  onLoad: function (options) {
    var that = this
    util.getSystemInfo({
      success: (res) => {
        that.setData({
          deviceHeight: res.windowHeight,
        });
      }
    });

    //搜索出来的所有车票
    var ticketData = wx.getStorageSync('ticketData');

    //根据车票ID获取车票信息
    var ticketInfo = ticketData.enabledTickets.find(function (item) {
      return item.ticketId == parseInt(options.ticketId)
    })

    that.setData({
      hoursAway: ticketData.hoursAway,
      ticketInfo: ticketInfo,
      showDate: util.formatTime(ticketData.departureDate, 1)
    });

    //获取联系电话通过拿到用户信息
    api.getProfile({
      data: {
        accountId: wx.getStorageSync('userInfo').accountId,
      },
      success: (res) => {
        if (res.data && res.data != {} && res.data.resultStatus) {
          that.setData({
            phoneNumber: res.data.resultData.phoneNumber,
          });
        }
      }
    });

    //获取所有乘客信息(需要身份信息请求)
    if (wx.getStorageSync('configInfo').VALIDATE_IDENTITY) {


      api.getIdentitys({
        data: {
          accountId: wx.getStorageSync('userInfo').accountId,
        },
        success: (res) => {
          if (res.data && res.data != {} && res.data.resultStatus) {
            wx.setStorageSync('allIdentitys', res.data.resultData);
            var defaultId = new Array()
            var allIdentitys = res.data.resultData
            var defaultIdentity = allIdentitys.find(function (item) {
              return item.defaultStatus == '1'
            })
            if (defaultIdentity) {
              defaultId.push(defaultIdentity.identityId)
              if (defaultId.length) {
                that.getAdultIdentityById(defaultId)
              }
            } else if (res.data.resultData.length) {
              defaultId.push(res.data.resultData[0].identityId)
              if (defaultId.length) {
                that.getAdultIdentityById(defaultId)
              }
            }
          }


        }
      });
    } else {
      that.setData({
        adultAmounts: 0,
        childAmounts: 0,
      });
    }
  },

  //成人信息处理
  getAdultIdentityById: function (ids) {
    var that = this
    var allIdentitys = wx.getStorageSync('allIdentitys')
    var adultIdentitys = []
    if (allIdentitys) {
      ids.forEach(function (id) {
        adultIdentitys.push(allIdentitys.find(function (item) {
          return item.identityId === + id
        }))
      })
      console.log(adultIdentitys.length)
      that.setData({
        adultIdentitys: adultIdentitys
      });
    }
    wx.setStorageSync('selectIds', ids);
  },

  //删除成人票
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
    var allIdentitys = wx.getStorageSync('allIdentitys')
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

  //添加儿童票
  addChildTicket: function () {
    var that = this
    var childIds = wx.getStorageSync('childIds') ? wx.getStorageSync('childIds') : []
    var selectIds = wx.getStorageSync('selectIds') ? wx.getStorageSync('selectIds') : []
    if (selectIds.length > 1) {
      that.setData({
        showActionSheet: true
      });
    } else if (selectIds.length == 1) {
      childIds.push(selectIds[0])
      that.getChildIdentityById(childIds)
    } else {
      return
    }
  },

  //使用成人证件买儿童票
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

  //删除儿童票
  removeChild: function (e) {
    var that = this
    var removeIndex = e.currentTarget.id
    var childIds = wx.getStorageSync('childIds')
    childIds.splice(removeIndex, 1);
    that.getChildIdentityById(childIds)
  },

  //点击遮罩层隐藏其本身
  hideMask: function () {
    var that = this
    that.setData({
      showActionSheet: false
    });
  },

  //减少成年票
  decreaseAdult: function () {
    var that = this
    if (!that.data.adultAmounts) {
      return
    }
    that.setData({
      adultAmounts: that.data.adultAmounts - 1
    });

  },

  //增加成年票
  increaseAdult: function () {
    var that = this
    that.setData({
      adultAmounts: that.data.adultAmounts + 1
    });

  },

  //减少儿童票
  decreaseChild: function () {
    var that = this
    if (!that.data.childAmounts) {
      return
    }
    that.setData({
      childAmounts: that.data.childAmounts - 1
    });
  },

  //增加儿童票
  increaseChild: function () {
    var that = this
    that.setData({
      childAmounts: that.data.childAmounts + 1
    });
  },

  //是否买保险
  radioInsurance: function () {
    var that = this
    that.setData({
      needInsurance: !that.data.needInsurance
    });
  },

  //修改手机号
  getPhoneNumber: function (e) {
    var that = this
    if (!(/^1[34578]\d{9}$/.test(e.detail.value))) {
      wx.showToast({
        title: '请正确填写手机号码',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else {
      that.setData({
        phoneNumber: e.detail.value
      });
    }
  },

  confirmOrder: function (e) {

    var that = this
    if (that.data.needIndentityty) {
      //需要身份信息
      var adultDatas = []
      var childDatas = []
      that.data.adultIdentitys.forEach(function (item) {
        adultDatas.push({ "amounts": 1, "ticketType": "ADULT", "identityId": item.identityId })
      })
      that.data.childIdentitys.forEach(function (item) {
        childDatas.push({ "amounts": 1, "ticketType": "CHILD", "identityId": item.identityId })
      })

      var tickets = adultDatas.concat(childDatas);

      if (!tickets.length) {
        wx.showToast({
          title: '请添加乘客信息',
          icon: 'loading',
          duration: 1000
        })
        return;
      }
    } else {
      //不需要身份信息
      var tickets = [{
        "amounts": that.data.adultAmounts,
        "ticketType": "ADULT",
        "identityId": 0
      }, {
        "amounts": that.data.childAmounts,
        "ticketType": "CHILD",
        "identityId": 0
      }]
    }
    api.createOrder({
      data: {
        accountId: wx.getStorageSync('userInfo').accountId,
        ticketId: that.data.ticketInfo.ticketId,
        priceId: that.data.ticketInfo.priceId,
        phoneNumber: that.data.phoneNumber,
        needInsurance: that.data.needInsurance,
        tickets: tickets
      },
      method: "POST",
      success: (res) => {
        if (res.data && res.data != {} && res.data.resultStatus) {
          wx.navigateTo({
            url: `../order/order_detail/order_detail?orderNo=${res.data.resultData.orderNo}`
          })
        }
      }
    });
  }
})
