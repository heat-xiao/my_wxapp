//获取应用实例
var app = getApp()
Page({
    data: {
        inputShowed: false,
        inputVal: "",
        searchResult: [
            { name: "深圳", id: 1 },
            { name: "广州", id: 2 },
            { name: "北京", id: 3 },
            { name: "上海", id: 4 }
        ]
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
      var destination = e.currentTarget.dataset.value;
      wx.setStorageSync('destination', destination);
      wx.navigateBack();
    }
});