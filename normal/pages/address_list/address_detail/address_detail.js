Page({
    data: {
        // clickStatus: false
        addressDetail: {},
        addressId: 0,
        accountId: 0
    },
    onShow: function () {
        console.log('获取要修改的用户缓存地址信息', wx.getStorageSync('address'));
        this.setData({
            addressDetail: wx.getStorageSync('address')
        })
    },
    onLoad: function (option) {
        var vm = this
        console.log('查看页面参数', option);
        console.log('获取地址id', wx.getStorageSync('addressId'));
        var addressId = parseInt(option.addressId);
        if (addressId >= 0) {
            this.setData({
                addressId: addressId
            });
            wx.setStorageSync('addressId', addressId);
        } else if (wx.setStorageSync('addressId') >= 0) {
            this.setData({
                addressId: wx.setStorageSync('addressId')
            });
        }
        // 获取用户信息
        var accountId = wx.getStorageSync('userInfo').accountId
        console.log('accountId', accountId);
        vm.setData({
            accountId: accountId
        })
    },
    submitAddress: function (e) {
        var vm = this
        console.log('提交表单', e.detail);
        if (vm.data.accountId) {
            if (e.detail.value && e.detail.value.recipientName && e.detail.value.phoneNumber) {
                var province = wx.getStorageSync('address').province;
                var city = wx.getStorageSync('address').city;
                var district = wx.getStorageSync('address').district
                if (e.detail.value.detailAddress && province && city && district) {
                    console.log('提交参数', {
                        accountId: vm.data.accountId,
                        addressId: vm.data.addressId,
                        recipientName: e.detail.value.recipientName,
                        phoneNumber: e.detail.value.phoneNumber,
                        province: province,
                        city: city,
                        district: district,
                        detailAddress: e.detail.value.detailAddress
                    });
                    wx.request({
                        method: 'POST',
                        url: getApp().globalData.restServer + 'v1/account/address/edit',
                        data: {
                            accountId: vm.data.accountId,
                            addressId: vm.data.addressId,
                            recipientName: e.detail.value.recipientName,
                            phoneNumber: e.detail.value.phoneNumber,
                            province: province,
                            city: city,
                            district: district,
                            detailAddress: e.detail.value.detailAddress
                        },
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function (res) {
                            console.log('接口调用成功', res);
                            if (res.data.resultStatus) {
                                wx.navigateBack({
                                    delta: 1
                                })
                            } else {
                                wx.showToast({
                                    title: '提交失败：' + res.data.errorMessage,
                                    icon: 'loading',
                                    duration: 1000
                                })
                            }
                        },
                        fail: function (res) {
                            console.log('接口调用失败', res)
                            wx.showToast({
                                title: '网络异常',
                                icon: 'loading',
                                duration: 1000
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: '请完善地址信息',
                        icon: 'loading',
                        duration: 500
                    })
                }
            } else {
                wx.showToast({
                    title: '请完善用户信息',
                    icon: 'loading',
                    duration: 500
                })
            }
        } else {
            wx.showToast({
                title: '用户数据异常',
                icon: 'loading',
                duration: 500
            })
        }
    },
    setStorageName: function (e) {
        console.log('缓存收件人姓名', e.detail.value);
        var addressDetail = wx.getStorageSync('address');
        addressDetail.recipientName = e.detail.value;
        wx.setStorageSync('address', addressDetail);
    },
    setStorageTel: function (e) {
        console.log('缓存收件人电话', e.detail.value);
        var addressDetail = wx.getStorageSync('address');
        addressDetail.phoneNumber = e.detail.value;
        wx.setStorageSync('address', addressDetail);
    },
    setStorageDetailAddress: function (e) {
        console.log('缓存详细地址', e.detail.value);
        var addressDetail = wx.getStorageSync('address');
        addressDetail.detailAddress = e.detail.value;
        wx.setStorageSync('addressDetail', addressDetail);
    }
});