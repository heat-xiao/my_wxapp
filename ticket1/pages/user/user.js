import api from '../../utils/api.js'
Page({
  data:{

  },
  onLoad:function(){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow: function() {
    var that = this
    var accountId = wx.getStorageSync('userInfo').accountId
    api.getProfile({
      data: {
        accountId: accountId,
      },
      success: (res) => {
        if (res.data && res.data != {}) {
          that.setData({
            profileInfo: res.data.resultData,
          });
        }
      }
    });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})