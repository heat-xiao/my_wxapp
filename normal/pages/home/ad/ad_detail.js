// pages/home/ad/ad_detail.js
Page({
  data: {
    realPics:[]
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    var activityPictures = options.activityPictures.split(';');
    console.log('activityPictures',activityPictures);

    var realPics = []
    var vm = this
    for (var i = 0; i < activityPictures.length; i++) {

      if (activityPictures[i]) {
        realPics.push(activityPictures[i]);
      }
    }
    vm.setData({
      realPics: realPics
    })

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
  }
})