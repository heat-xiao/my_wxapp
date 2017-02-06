// pages/home/commodity_detail/commodity_comment_list.js
Page({
  data: {
    commentList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log('获取用户评论列表', options.commodityId);
    this.setData({
      'commodityId': options.commodityId
    });
    this.getCommentList(1);
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  getCommentList: function (pageNo) {
    var vm = this
    wx.request({
      method: 'GET',
      url: getApp().globalData.restServer + 'v1/home/commodity/commentList',
      data: {
        pageNo: pageNo ? pageNo : 1,
        pageSize: 20,
        commodityId: vm.data.commodityId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('接口调用成功', res);
        if (res.data.resultStatus) {
          var commentList = pageNo == 1 ? [] : vm.data.commentList;
          commentList = commentList.concat(res.data.resultData);
          console.log('合并后的商品列表', commentList);
          vm.setData({
            commentList: commentList,
            nextPageStatus: res.data.resultData.length - 20 >= 0, // 是否还有下一页
            pageNo: res.data.resultData.length - 20 >= 0 ? pageNo + 1 : pageNo
          });
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
    vm.getCommentList(1);
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    var vm = this
    console.log('上拉加载onReachBottom', vm.data.nextPageStatus, vm.data.pageNo);
    if (vm.data.nextPageStatus) {
      vm.getCommentList(vm.data.pageNo);
    }
  }
})