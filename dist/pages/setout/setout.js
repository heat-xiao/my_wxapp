//获取应用实例
var app = getApp()
Page({
    data: {
        inputShowed: false,
        inputVal: ""
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
    selectSetout: function(e){
      var setout = e.currentTarget.dataset.value;
      wx.setStorageSync('setout', setout);
      wx.navigateBack();
    }
});