
import api from '../../utils/api.js'

Page({
    data: {
        inputShowed: false,
        inputVal: "",
        direction: "",
        searchResult: []
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
    searchPlace: function (e) {
        var that = this;
        api.getPlaceByKeyword({
            data: {
                keyword: e.detail.value,
            },
            success: (res) => {
                console.log(res)
                 if (res.data && res.data != {}&&res.data.resultStatus) {
                    // success
                    that.setData({
                        inputVal: e.detail.value,
                        searchResult: res.data.resultData,
                    });
                }
            }
        });
    },
    selectPlace: function (e) {
        wx.setStorageSync(this.data.direction, e.currentTarget.dataset.place);
        wx.navigateBack();
    }
});