import api from '../../utils/api.js'
Page({
    data: {

    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this
        that.setData({
            phoneNumber: options.phoneNumber
        });

    },

    getInputValue: function (e) {
        var that = this
        this.setData({
            phoneNumber: e.detail.value,
        });
    },

    savePhoneNumber: function () {

        var that = this
        if (!that.data.phoneNumber) {
            wx.showToast({
                title: '请输入手机号码',
                icon: 'loading',
                duration: 1000
            })
            return;
        }
        if (!(/^1[34578]\d{9}$/.test(that.data.phoneNumber))) {
            wx.showToast({
                title: '你输入的手机号码有误',
                icon: 'loading',
                duration: 1000
            })
            return;
        }
        api.editProfile({
            data: {
                accountId: wx.getStorageSync('userInfo').accountId,
                phoneNumber: that.data.phoneNumber,
            },
            method: "PUT",
            success: (res) => {
                if (res.data && res.data != {} && res.data.resultStatus) {
                    wx.navigateBack();
                }
            }
        });
    }
})