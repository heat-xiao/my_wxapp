var app = getApp()
Page({
    data: {
        commodityList: [],
        totalPrice: 0,
        postage: 0,//邮费
        limitPrice: '',
        score: 0,//积分
        coupon: {},//优惠券
        scoreStatus: true,//是否使用积分
        couponStatus: true//是否使用优惠券
    },
    onShow: function () {
        var vm = this
        // 获取用户信息
        var accountId = wx.getStorageSync('userInfo').accountId
        var openId = wx.getStorageSync('userInfo').openid
        console.log('accountId', accountId);
        vm.setData({
            accountId: accountId,
            openId: openId
        })
        if (accountId) {
            var accountId = accountId;
            vm.setData({
                accountId: accountId
            });
            console.log('获取要结算的订单列表', wx.getStorageSync('confirmOrderList'));
            var commodityList = wx.getStorageSync('confirmOrderList');
            var totalPrice = 0;
            for (var i = 0; i < commodityList.length; i++) {
                totalPrice += commodityList[i].commodityPrice * commodityList[i].amounts;
            }
            vm.setData({
                'commodityList': commodityList,
                'totalPrice': totalPrice
            });

            // 若有缓存则从缓存中获取，若无，则获取默认地址
            // if (wx.getStorageSync('address').addressId) {
            //     var address = wx.getStorageSync('address')
            //     console.log('获取到缓存地址', wx.getStorageSync('address'));
            //     vm.setData({
            //         address: address
            //     });
            //     // 获取用户积分优惠券信息
            //     vm.getDiscount(accountId, address.addressId);
            // } else {
            wx.request({
                method: 'GET',
                url: getApp().globalData.restServer + 'v1/account/address/mine',
                data: {
                    accountId: accountId
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    console.log('接口调用成功', res);
                    if (res.data.resultStatus) {
                        var addressList = res.data.resultData;
                        console.log('获取地址列表', addressList);
                        var address = {};
                        if (addressList.length) {
                            for (var i = 0, len = addressList.length; i < len; i++) {
                                if (addressList[i].addressType == 'DEFAULT') {
                                    address = addressList[i];
                                } else if (wx.getStorageSync('address').addressId && addressList[i].addressId == wx.getStorageSync('address').addressId) {
                                    address = addressList[i];
                                }
                            }
                            if (!address.addressId) {
                                address = addressList[0];
                            }
                            vm.setData({
                                address: address
                            });
                            wx.setStorageSync('address', address)
                            // 获取优惠券信息
                            vm.getDiscount(accountId, address.addressId);
                        } else {
                            vm.setData({
                                address: {}
                            });
                        }
                    }
                },
                fail: function (res) {
                    console.log('获取地址接口调用失败', res)
                }
            })
        }
        //}

    },
    getDiscount: function (accountId, addressId) {
        console.log('获取用户是否有优惠信息');
        var vm = this
        wx.request({
            method: 'POST',
            url: getApp().globalData.restServer + 'v1/home/order/discount',
            data: {
                "accountId": accountId,
                "commodities": vm.data.commodityList,
                "addressId": addressId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log('获取优惠券信息接口调用成功', res);
                if (res.data.resultStatus) {
                    var coupon = res.data.resultData.coupon
                    coupon.deductPrice = coupon.deductPrice ? coupon.deductPrice : 0
                    vm.setData({
                        postage: res.data.resultData.postage,
                        score: res.data.resultData.score ? res.data.resultData.score : 0,
                        coupon: coupon
                    });
                }
            },
            fail: function (res) {
                console.log('获取优惠券信息接口调用失败', res)
            }
        })
    },
    onLoad: function () {

    },
    changeScore: function (e) {
        console.log('是否使用积分', e.detail.value);
        this.setData({
            scoreStatus: e.detail.value
        });
    },
    changeCoupon: function (e) {
        console.log('是否使用优惠券', e.detail.value);
        this.setData({
            couponStatus: e.detail.value
        });
    },
    payOrder: function (e) {
        var vm = this
        if (vm.data.address && vm.data.address.addressId) {
            console.log('下订单参数', e, {
                "accountId": vm.data.accountId,
                "orderCommodities": vm.data.commodityList,
                "remark": e.detail.value.remark,
                "addressId": vm.data.address.addressId,
                "fromCart": wx.getStorageSync('fromCart')
            });
            if (vm.data.openId) {
                if (wx.getStorageSync('confirmOrderNo')) {
                    // 从订单列表获取的订单号，不需要下订单
                    console.log('微信预支付参数，直接从订单列表获取订单号', {
                        orderNo: wx.getStorageSync('confirmOrderNo'),
                        openId: vm.data.openId,
                        scoreCost: vm.data.score,
                        receiveId: vm.data.coupon.receiveId
                    });
                    wx.request({
                        method: 'POST',
                        url: getApp().globalData.restServer + 'v1/home/order/pay',
                        data: {
                            orderNo: wx.getStorageSync('confirmOrderNo'),
                            openId: vm.data.openId,
                            scoreCost: vm.data.scoreCost,
                            receiveId: vm.data.coupon.receiveId
                        },
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function (res) {
                            console.log('微信预支付接口调用成功', res);
                            if (res.data.resultStatus) {
                                // 发起微信支付
                                wx.requestPayment({
                                    'timeStamp': res.data.resultData.timeStamp.toString(),
                                    'nonceStr': res.data.resultData.nonceStr,
                                    'package': res.data.resultData.package,
                                    'signType': 'MD5',
                                    'paySign': res.data.resultData.sign,
                                    'success': function (res) {
                                        console.log('支付成功');
                                        console.log(res);
                                        wx.redirectTo({
                                            url: '/pages/shopping/pay_success/pay_success'
                                        })
                                    },
                                    'fail': function (res) {
                                        console.log('支付失败');
                                    }
                                })
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
                        }
                    })
                } else {// 如果不是从订单列表来的，没有订单号，需要下单
                    // 下订单
                    wx.request({
                        method: 'POST',
                        url: getApp().globalData.restServer + 'v1/home/order/create',
                        data: {
                            "accountId": vm.data.accountId,
                            "orderCommodities": vm.data.commodityList,
                            "remark": e.detail.value.remark,
                            "addressId": vm.data.address.addressId,
                            "fromCart": wx.getStorageSync('fromCart')
                        },
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function (res) {
                            console.log('下订单接口调用成功', res);
                            if (res.data.resultStatus) {
                                // 微信预支付
                                console.log('微信预支付参数', {
                                    orderNo: res.data.resultData.orderNo,
                                    openId: vm.data.openId,
                                    scoreCost: vm.data.score,
                                    receiveId: vm.data.coupon.receiveId
                                });
                                wx.request({
                                    method: 'POST',
                                    url: getApp().globalData.restServer + 'v1/home/order/pay',
                                    data: {
                                        orderNo: res.data.resultData.orderNo,
                                        openId: vm.data.openId,
                                        scoreCost: vm.data.scoreCost,
                                        receiveId: vm.data.coupon.receiveId
                                    },
                                    header: {
                                        'content-type': 'application/json'
                                    },
                                    success: function (res) {
                                        console.log('微信预支付接口调用成功', res);
                                        if (res.data.resultStatus) {
                                            // 发起微信支付
                                            wx.requestPayment({
                                                'timeStamp': res.data.resultData.timeStamp.toString(),
                                                'nonceStr': res.data.resultData.nonceStr,
                                                'package': res.data.resultData.package,
                                                'signType': 'MD5',
                                                'paySign': res.data.resultData.sign,
                                                'success': function (res) {
                                                    console.log('支付成功');
                                                    wx.redirectTo({
                                                        url: '/pages/shopping/pay_success/pay_success'
                                                    })
                                                },
                                                'fail': function (res) {
                                                    console.log('支付失败');
                                                }
                                            })
                                        }
                                    },
                                    fail: function (res) {
                                        console.log('接口调用失败', res)
                                    }
                                })
                            } else {
                                wx.showToast({
                                    title: '下单失败：' + res.data.errorMessage,
                                    icon: 'loading',
                                    duration: 1000
                                })
                            }
                        },
                        fail: function (res) {
                            console.log('下订单接口调用失败', res)
                            wx.showToast({
                                title: '网络异常，下单失败',
                                icon: 'loading',
                                duration: 1000
                            })
                        }
                    })
                }
            } else {
                wx.showToast({
                    title: '登录超时',
                    icon: 'loading',
                    duration: 1000
                })
            }
        } else {
            wx.showToast({
                title: '未获取到地址信息',
                icon: 'loading',
                duration: 1000
            })
        }
    }
});