// pages/home/home.js
//获取应用实例
var app = getApp()
Page({
  data: {
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    pageNo: 2,
    homeData: {
    },
    hotsale: [],
    nextPageStatus: false
  },
  onLoad: function (options) {
    var vm = this
    // 获取用户信息
    var userInfo = wx.getStorageSync('userInfo')

    console.log('userInfo', userInfo);
    vm.setData({
      userInfo: userInfo
    })

    // 页面初始化 options为页面跳转所带来的参数
    console.log('onLoad')
    vm.getHomeData();
    //调用应用实例的方法获取全局数据
    app.getSystemInfo(function (systemInfo) {
      //更新数据
      vm.setData({
        systemInfo: systemInfo
      })

      // 获取屏幕高度，设置店铺背景图高度
      var storeBgHeight = systemInfo.windowWidth * systemInfo.pixelRatio / 4
      if (!storeBgHeight) {
        storeBgHeight = 200
      }
      vm.setData({
        storeBgHeight: 200
      })
      console.log('storeBgHeight:' + storeBgHeight);
    })
  },
  getHomeData: function () {
    var vm = this;
    wx.request({
      url: app.globalData.restServer + 'v1/home',
      success: function (res) {
        console.log('onShow data:', res.data)
        vm.setData({
          nextPageStatus: res.data.resultData.hotsale.length == 20
        });
        var homeData = res.data.resultData;
        for (var i = 0; i < homeData.recommendArea.length; i++) {
          homeData.recommendArea[i].commodities = getApp().singleCommodityIcon(homeData.recommendArea[i].commodities);
        }
        vm.setData({
          homeData: homeData,
          hotsale: getApp().singleCommodityIcon(res.data.resultData.hotsale)
        })
      }
    })

  },
  onReady: function () {
    console.log('ready')
    // 页面渲染完成
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onPullDownRefresh: function (e) {
    console.log('pull down refresh');
    this.getHomeData();
  },
  onReachBottom: function (e) {
    var vm = this
    var nextPageStatus = vm.data.nextPageStatus
    console.log('reach bottom');
    if (vm.data.nextPageStatus) {
      wx.request({
        url: app.globalData.restServer + 'v1/home/hotsale',
        data: {
          pageNo: vm.data.pageNo
        },
        success: function (res) {
          console.log('home data:', res.data)
          var hotsales = res.data.resultData;
          if (hotsales.length < 20) {
            nextPageStatus = false;
          } else {
            nextPageStatus = true
          }
          vm.data.hotsale = vm.data.hotsale.concat(hotsales)
          vm.setData({
            hotsale: getApp().singleCommodityIcon(vm.data.hotsale),
            nextPageStatus: nextPageStatus
          })
        }
      })
    }
  },
  getCoupon: function (e) {

    var vm = this
    var accountId = vm.data.userInfo.accountId
    var couponId = parseInt(e.currentTarget.dataset.id)

    console.log('accountId', accountId);
    wx.request({
      url: app.globalData.restServer + 'v1/home/coupon/receive',
      method: 'POST',
      data: {
        couponId: couponId,
        accountId: accountId

      },
      success: function (res) {
        if (res.data.resultStatus) {
          console.log('home data:', res.data)
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 1000
          })
        }
        else {
          wx.showToast({
            title: res.data.errorMessage,
            icon: 'loading',
            duration: 1000
          })
        }

      }
    })

  },
  onShareAppMessage: function () {
    return {
      title: '星巴克-三十天科技',
      desc: '小程序开发的星巴克电商',
      path: '/pages/home?id=123'
    }
  }
})