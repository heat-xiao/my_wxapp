import api from '../../utils/api.js'
var app = getApp()
Page({
  data: {
  },  
  onLoad: function () {
    var that = this

    api.getTrafficGuide({
        success: (res) => {
            if (res.data && res.data.resultStatus) {
                this.setData({
                    guidePic: res.data.resultData,
                });
            }
        }
    });
  }
})
