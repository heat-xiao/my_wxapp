//获取应用实例
var app = getApp()
Page({
    data: {
        inputShowed: false,
        inputVal: "",
        direction: "",
        searchResult: ["深圳", "广州", "北京", "上海"]
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: options.direction == "source" ? "选择出发地" : "选择目的地",
            success: function (res) {
                // success
            }
        });
        this.setData({
            direction: options.direction,
        })
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
    selectPlace: function (e) {
        wx.setStorageSync(this.data.direction, e.currentTarget.dataset.place);
        wx.navigateBack();
    }
});