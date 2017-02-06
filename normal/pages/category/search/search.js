Page({
  data: {
    inputShowed: true,
    inputVal: "",
    nextPageStatus: true
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  onLoad: function () {

  },
  searchInput: function (e) {
    var vm = this;
    console.log('搜索关键词', e.detail.value.keyword);
    vm.setData({
      pageNo: 1,
      keyword: e.detail.value.keyword
    });
    vm.getCommodityList(1, e.detail.value.keyword);
  },
  getCommodityList: function (pageNo, keyword) {
    var vm = this;
    wx.request({
      method: 'GET',
      url: getApp().globalData.restServer + 'v1/category/commodities',
      data: {
        pageNo: pageNo ? pageNo : 1,
        keyword: keyword
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('接口调用成功', res);
        if (res.data.resultStatus) {
          var commodityList = pageNo == 1 ? [] : vm.data.commodityList;
          commodityList = commodityList.concat(res.data.resultData.commodities);
          console.log('合并后的商品列表', commodityList);
          vm.setData({
            commodityList: commodityList,
            nextPageStatus: res.data.resultData.length - 20 >= 0, // 是否还有下一页
            pageNo: res.data.resultData.length - 20 >= 0 ? pageNo + 1 : pageNo
          });
        } else {
          wx.showToast({
            title: '数据异常：' + res.data.errorMessage,
            icon: 'loading',
            duration: 1000
          })
        }
      },
      fail: function (res) {
        console.log('接口调用失败', res)
        wx.showToast({
          title: '网络异常',
          icon: 'loading',
          duration: 1000
        })
      }
    })
  },
  onReachBottom: function () {
    var vm = this
    console.log('上拉加载onReachBottom', vm.data.nextPageStatus, vm.data.pageNo);
    if (vm.data.nextPageStatus) {
      vm.getCommodityList(vm.data.pageNo, vm.data.keyword);
    }
  }
})
