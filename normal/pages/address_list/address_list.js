Page({
    data: {
        addressList: []
    },
    checkboxChange: function (e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);
        var addressList = this.data.addressList, values = e.detail.value;
        for (var i = 0, lenI = addressList.length; i < lenI; ++i) {
            addressList[i].checked = false;
        }
        console.log(e.currentTarget.dataset.index);
        var index = parseInt(e.currentTarget.dataset.index) ? parseInt(e.currentTarget.dataset.index) : 0;
        addressList[index].checked = true;
        this.setData({
            addressList: addressList
        });
    },
    onShow: function () {
        var vm = this
        vm.getMyAddressList();
        // 获取用户信息
        var accountId = wx.getStorageSync('userInfo').accountId
        console.log('accountId', accountId);
        vm.setData({
            accountId: accountId
        })
        if (accountId) {
            vm.getMyAddressList();
        } else {
            wx.showToast({
                title: '登录信息异常',
                icon: 'loading',
                duration: 1000
            })
        }
    },
    editAddressDetail: function (e) {
        // 缓存修改的地址信息
        var vm = this
        var index = parseInt(e.currentTarget.dataset.index);
        if (index >= 0) {
            console.log('缓存修改的地址信息', index, vm.data.addressList[index]);
            wx.setStorageSync('address', vm.data.addressList[index])
        } else {
            console.log('新增，清空缓存修改的地址信息');
            wx.setStorageSync('address', {})
            wx.navigateTo({
                url: 'address_detail/address_detail?addressId=0',
                success: function (res) {
                    // success
                },
                fail: function () {
                    // fail
                    wx.showToast({
                        title: '网络异常',
                        icon: 'loading',
                        duration: 1000
                    })
                },
                complete: function () {
                    // complete
                }
            })
        }
    },
    onLoad: function (options) {
        var vm = this;
        vm.setData({
            addressCheckHide: options.addressCheckHide
        });//设置单选按钮是否显示，从我的点进来就不显示
    },
    getMyAddressList: function () {
        var vm = this
        wx.showToast({
            title: '',
            icon: 'loading',
            duration: 5000
        })
        wx.request({
            method: 'GET',
            url: getApp().globalData.restServer + 'v1/account/address/mine',
            data: {
                accountId: vm.data.accountId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log('接口调用成功', res);
                wx.hideToast();
                if (res.data.resultStatus) {
                    var addressList = res.data.resultData;
                    vm.setData({
                        addressList: addressList
                    });
                    if (addressList.length) {
                        if (wx.getStorageSync('address').addressId) {
                            for (var i = 0, len = addressList.length; i < len; i++) {
                                if (wx.getStorageSync('address').addressId == addressList[i].addressId) {
                                    addressList[i].checked = true;
                                    break;
                                }
                            }
                        } else {
                            for (var i = 0, len = addressList.length; i < len; i++) {
                                if (addressList[i].addressType == "DEFAULT") {
                                    addressList[i].checked = true;
                                    break;
                                }
                            }
                            // 没有缓存也没有默认
                            if (i >= addressList.length) {
                                addressList[0].checked = true;
                            }
                        }
                        vm.setData({
                            addressList: addressList
                        });
                    }
                } else {
                    wx.showToast({
                        title: res.data.errorMessage,
                        icon: 'loading',
                        duration: 1500
                    })
                }
            },
            fail: function (res) {
                console.log('接口调用失败', res)
                wx.hideToast();
                wx.showToast({
                    title: '网络异常',
                    icon: 'loading',
                    duration: 1000
                })
            }
        })
    },
    onUnload: function () {
        var vm = this
        console.log('用户离开页面遍历当前选中的地址设为收货地址', vm.data.addressList);
        for (var i = 0, len = vm.data.addressList.length; i < len; i++) {
            if (vm.data.addressList[i].checked) {
                wx.setStorageSync('address', vm.data.addressList[i]);
                break;
            }
        }
        console.log('缓存的地址为', wx.getStorageSync('address'));
    },
    onPullDownRefresh: function () {
        this.getMyAddressList();
        wx.stopPullDownRefresh();
    },
    deleteAddress: function (e) {
        var vm = this
        console.log('要删除的id', e.currentTarget.dataset.id);
        if (vm.data.accountId) {
            wx.showModal({
                title: '确定删除？',
                content: '',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.request({
                            method: 'DELETE',
                            url: getApp().globalData.restServer + 'v1/account/address/delete?addressId=' + e.currentTarget.dataset.id + '&accountId=' + vm.data.accountId,
                            data: {},
                            header: {
                                'content-type': 'application/json'
                            },
                            success: function (res) {
                                console.log('接口调用成功', res);
                                if (res.data.resultStatus) {
                                    vm.getMyAddressList();
                                } else {
                                    wx.showToast({
                                        title: res.data.errorMessage,
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
                    }
                }
            })
        } else {
            wx.showToast({
                title: '数据异常',
                icon: 'loading',
                duration: 1000
            })
        }
    }
});