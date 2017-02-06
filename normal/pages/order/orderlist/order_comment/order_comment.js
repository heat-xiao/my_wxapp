// pages/order/orderlist/order_comment/order_comment.js
Page({
  data: {
    windowHeight: 'auto',
    commentList: [
      // {
      //   url: 'http://share.30days-tech.com/daka/pictures/commodity_icon.png',
      //   id: 1
      // },
      // {
      //   url: 'http://share.30days-tech.com/daka/pictures/commodity_icon.png',
      //   id: 2
      // },
      // {
      //   url: 'http://share.30days-tech.com/daka/pictures/commodity_icon.png',
      //   id: 3
      // }
    ]
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var vm = this
    wx.getSystemInfo({
      success: function (res) {
        console.log('高度', res.windowHeight)
        vm.setData({
          windowHeight: res.windowHeight + 'px'
        });
      }
    })
    var commentList = wx.getStorageSync('commentOrder').orderCommodities ? wx.getStorageSync('commentOrder').orderCommodities : [];
    var orderNo = wx.getStorageSync('commentOrder').orderNo;
    // 初始化评论选项为好评
    for (var i = 0, len = commentList.length; i < len; i++) {
      commentList[i].commentType = 'GOOD';
    }
    console.log('从缓存中获取待评价的商品', commentList);
    // 获取用户信息
    var accountId = wx.getStorageSync('userInfo').accountId
    console.log('accountId', accountId);
    vm.setData({
      commentList: commentList,
      orderNo: orderNo,
      accountId: accountId
    });
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  selectCommentType: function (e) {
    console.log('选中的是第几条评论的哪一种类型', e.currentTarget.dataset);
    var commentList = this.data.commentList;
    var index = parseInt(e.currentTarget.dataset.index);
    commentList[index].commentType = e.currentTarget.dataset.type;
    this.setData({
      'commentList': commentList
    });
  },
  submitComment: function (e) {
    var vm = this;
    console.log('查看表单e', e.detail.value);
    var commentList = [];
    for (var i = 0, len = vm.data.commentList.length; i < len; i++) {
      commentList.push({
        commodityId: vm.data.commentList[i].commodityId,
        content: e.detail.value['content_' + i],
        score: vm.data.commentList[i].commentType
      });
    }
    console.log('提交评价参数', {
      accountId: vm.data.accountId,
      orderNo: vm.data.orderNo,
      comments: commentList
    });
    if (vm.data.orderNo && vm.data.accountId && commentList.length) {
      wx.request({
        method: 'POST',
        url: getApp().globalData.restServer + 'v1/account/order/comment',
        data: {
          accountId: vm.data.accountId,
          orderNo: vm.data.orderNo,
          comments: commentList
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log('接口调用成功', res);
          if (res.data.resultStatus) {
            wx.showToast({
              title: '评价成功',
              icon: 'success',
              duration: 1000
            })
            wx.navigateBack({
              delta: 2
            })
          } else {
            wx.showToast({
              title: '评价失败：' + res.data.errorMessage,
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
    } else {
      wx.showToast({
        title: '数据异常',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  saveContent: function (e) {
    console.log('保存评论到列表', e.detail.value, e.currentTarget.dataset.index);
    var vm = this;
    var commentList = vm.data.commentList;
    var index = e.currentTarget.dataset.index;
    commentList[index].content = e.detail.value;
    vm.setData({
      commentList: commentList
    });
  }
})