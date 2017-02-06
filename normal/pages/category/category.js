var sliderWidth = 0; // 需要设置slider的宽度，用于计算中间位置 96
Page({
  data: {
    activeIndex: 0,
    sliderLeft: 0,
    sliderWidth: 0,
    skewing: 0,
    tabs: [],
    categoryId: '',// 当前的类别
    commodityList: [],
    pageNo: 1,// 记录当前最新页码
    nextPageStatus: false // 是否还有下一页
  },
  tabClick: function (e) {
    var vm = this
    var categoryId = e.currentTarget.dataset.categoryid ? e.currentTarget.dataset.categoryid : '';
    vm.setData({
      activeIndex: e.currentTarget.id,
      categoryId: categoryId,
      nextPageStatus: false,
    });
    console.log("滑动距离", e.currentTarget.offsetLeft);
    console.log('tab数据', categoryId);
    vm.getCommodityList(1, categoryId);
  },
  onReachBottom: function () {
    var vm = this
    console.log('上拉加载onReachBottom', vm.data.nextPageStatus, vm.data.pageNo, vm.data.categoryId);
    if (vm.data.nextPageStatus) {
      vm.getCommodityList(vm.data.pageNo, vm.data.categoryId);
    }
  },
  onLoad: function (e) {
    console.log('初始化数据');
    this.getCommodityList(1);
    console.log('当前路由数组：分类页面', getCurrentPages());
  },
  getCommodityList: function (pageNo, categoryId) {
    var vm = this
    wx.request({
      method: 'GET',
      url: getApp().globalData.restServer + 'v1/category/commodities',
      data: {
        pageNo: pageNo ? pageNo : 1,
        pageSize: 20,
        keyword: '',
        categoryId: categoryId ? categoryId : ''
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('获取分类商品列表', res.data)
        if (res.data.resultStatus) {
          console.log('原来的商品列表', vm.data.commodityList);
          var commodityList = pageNo == 1 ? [] : vm.data.commodityList;
          commodityList = commodityList.concat(res.data.resultData.commodities);
          console.log('合并后的商品列表', commodityList);
          commodityList = getApp().singleCommodityIcon(commodityList);
          vm.setData({
            commodityList: commodityList,
            tabs: [{ categoryName: '全部', categoryId: '' }].concat(res.data.resultData.categories),
            nextPageStatus: res.data.resultData.commodities.length - 20 >= 0, // 是否还有下一页
            pageNo: res.data.resultData.commodities.length - 20 >= 0 ? pageNo + 1 : pageNo
          });
          // 设置导航栏偏移量
          wx.getSystemInfo({
            success: function (res) {
              console.log('初始化偏移量skewing', (res.windowWidth / vm.data.tabs.length) * vm.data.activeIndex);
              vm.setData({
                skewing: (res.windowWidth / vm.data.tabs.length) * vm.data.activeIndex,
                sliderWidth: res.windowWidth / vm.data.tabs.length,
                sliderLeft: (res.windowWidth / vm.data.tabs.length) * vm.data.activeIndex
              });
            }
          });
        } else {
          console.log('获取失败', res);
        }
      },
      fail: function (res) {
        console.log('接口调用失败', res)
      }
    })
  },
  onPullDownRefresh: function (e) {
    var vm = this
    console.log('下拉刷新');
    vm.getCommodityList(1, vm.data.categoryId);
    wx.stopPullDownRefresh();
  }
})