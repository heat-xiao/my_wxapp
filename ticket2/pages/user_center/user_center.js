import api from '../../utils/api.js'
Page({
  data:{

  },

  onShow: function() {
    var that = this
    var accountId = wx.getStorageSync('userInfo').accountId
    api.getProfile({
      data: {
        accountId: accountId,
      },
      success: (res) => {
        if (res.data && res.data != {}&&res.data.resultStatus) {
          that.setData({
            profileInfo: res.data.resultData,
          });
        }
      }
    });
  }
})