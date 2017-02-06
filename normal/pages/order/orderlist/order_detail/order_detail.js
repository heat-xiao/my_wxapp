Page({
    data: {
        orderDetail: {},
        commodityList: []
    },
    onShow: function () {
        console.log('获取要查看的订单详情', wx.getStorageSync('orderDetail'));
        var orderDetail = wx.getStorageSync('orderDetail');
        var commodityList = wx.getStorageSync('orderDetail').orderCommodities;
        var totalPrice = 0;
        for (var i = 0; i < commodityList.length; i++) {
            totalPrice += commodityList[i].price * commodityList[i].count;
        }
        this.setData({
            'orderDetail': orderDetail,
            'commodityList': commodityList
        });
    },
     finishOrder: function () {
        var vm = this;
        // 确认收货
          // 获取用户信息
        var accountId = wx.getStorageSync('userInfo').accountId
        var openId = wx.getStorageSync('userInfo').openid
        console.log('accountId', accountId);
        vm.setData({
            accountId: accountId
        })
        if (accountId) {
            if (vm.data.orderDetail.orderNo) {
                wx.showModal({
                    title: '确认收货？',
                    content: '请确保您已收到宝贝哦~',
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                            wx.request({
                                method: 'PUT',
                                url: getApp().globalData.restServer + 'v1/account/order/receive',
                                data: {
                                    orderNo: vm.data.orderDetail.orderNo,
                                    accountId: accountId
                                },
                                header: {
                                    'content-type': 'application/json'
                                },
                                success: function (res) {
                                    console.log('接口调用成功', res);
                                    if (res.data.resultStatus) {
                                        wx.navigateTo({
                                            url: './order_finish/order_finish'
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
                    title: '未获取到订单信息',
                    icon: 'loading',
                    duration: 1000
                })
            }
        } else {
            wx.showToast({
                title: '登录信息异常',
                icon: 'loading',
                duration: 1000
            })
        }
    }
});