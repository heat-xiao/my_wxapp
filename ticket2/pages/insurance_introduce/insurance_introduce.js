import api from '../../utils/api.js'
Page({
  data: {
  },  
  onLoad: function () {
    var that = this

    api.getInsuranceIntroduce({
        success: (res) => {
             if (res.data && res.data != {}&&res.data.resultStatus) {
                this.setData({
                    introducePic: res.data.resultData,
                });
            }
        }
    });
  }
})
