var sliderWidth = 0; // 需要设置slider的宽度，用于计算中间位置 96
Page({
    data: {
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        sliderWidth: 0,
        skewing: 0,
        tabs: ["全部", "待付款", "待发货", "待收货", "待评价"],
        orderTypes: ['', 'UNPAID', 'UNDELIVER', 'DELIVERED', 'WAITCOMMENT'],
        orderStatus: '',//当前订单状态
        orderList: [],
        pageNo: 1,// 记录当前最新页码
        nextPageStatus: false, // 是否还有下一页
        accountId: 0
    },
    onLoad: function () {
        var vm = this;
        // 获取用户信息
        var accountId = wx.getStorageSync('userInfo').accountId
        var openId = wx.getStorageSync('userInfo').openid
        console.log('accountId', accountId);
        vm.setData({
            accountId: accountId
        })
        if (accountId) {
            vm.setData({
                accountId: accountId,
                openId: openId
            });
            console.log('获取订单类型', wx.getStorageSync('orderType'));
            for (var i = 0; i < vm.data.tabs.length; i++) {
                if (vm.data.tabs[i] == wx.getStorageSync('orderType')) {
                    console.log('匹配到类型', i);
                    var orderStatus = vm.data.orderTypes[i]
                    vm.getOrderList(1, orderStatus);
                    vm.setData({
                        activeIndex: i,
                        orderStatus: orderStatus
                    })
                    break;
                }
            }
            wx.getSystemInfo({
                success: function (res) {
                    console.log('初始化偏移量skewing', (res.windowWidth / vm.data.tabs.length) * vm.data.activeIndex);
                    vm.setData({
                        skewing: (res.windowWidth / vm.data.tabs.length) * vm.data.activeIndex,
                        sliderWidth: res.windowWidth / vm.data.tabs.length,
                        sliderLeft: (res.windowWidth / vm.data.tabs.length) * vm.data.activeIndex
                        // + (res.windowWidth / vm.data.tabs.length)*vm.data.activeIndex 为初始化tab滑动条
                    });

                }
            });
        }
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft - this.data.skewing,
            activeIndex: e.currentTarget.id,
            orderStatus:
            this.data.orderTypes[e.currentTarget.dataset.index]
        });
        console.log("滑动距离", e.currentTarget.offsetLeft);
        // 点击获取不同的tab
        console.log('tab数据', e.currentTarget.dataset.index, this.data.tabs[e.currentTarget.dataset.index], this.data.orderTypes[e.currentTarget.dataset.index]);
        this.getOrderList(1, this.data.orderTypes[e.currentTarget.dataset.index]);
    },
    getOrderList: function (pageNo, orderStatus) {
        var vm = this
        console.log('获取订单列表参数', {
            accountId: vm.data.accountId,
            pageNo: pageNo ? pageNo : 1,
            pageSize: 20,
            orderStatus: orderStatus
        });
        wx.request({
            method: 'GET',
            url: getApp().globalData.restServer + 'v1/account/order/mine',
            data: {
                accountId: vm.data.accountId,
                pageNo: pageNo ? pageNo : 1,
                pageSize: 20,
                orderStatus: orderStatus
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log('获取订单列表', res.data)
                if (res.data.resultStatus) {
                    console.log('原来的订单列表', vm.data.orderList);
                    var orderList = pageNo == 1 ? [] : vm.data.orderList;
                    orderList = orderList.concat(res.data.resultData);
                    console.log('合并后的订单列表', orderList);
                    vm.setData({
                        orderList: orderList,
                        nextPageStatus: res.data.resultData.length - 20 >= 0, // 是否还有下一页
                        pageNo: res.data.resultData.length - 20 >= 0 ? pageNo + 1 : pageNo
                    });
                } else {
                    console.log('获取失败', res);
                }
            },
            fail: function (res) {
                console.log('接口调用失败', res)
            }
        })
    },
    onReachBottom: function () {
        var vm = this
        console.log('上拉加载onReachBottom', vm.data.nextPageStatus, vm.data.pageNo, vm.data.orderStatus);
        if (vm.data.nextPageStatus) {
            vm.getorderList(vm.data.pageNo, vm.data.orderStatus);
        }
    },
    onPullDownRefresh: function (e) {
        var vm = this
        console.log('下拉刷新', vm.data.orderStatus);
        vm.getOrderList(1, vm.data.orderStatus);
        wx.stopPullDownRefresh();
    },
    payOrder: function (e) {
        var vm = this;
        // 付款
        console.log('付款', e);
        var index = e.currentTarget.dataset.index;
        console.log('支付的订单', vm.data.orderList[index]);
        // 获取订单支付信息
        if (vm.data.orderList[index]) {
            wx.setStorageSync('confirmOrderList', vm.data.orderList[index].orderCommodities);
            wx.setStorageSync('confirmOrderNo', vm.data.orderList[index].orderNo);
            wx.redirectTo({
                url: '../../shopping/confirm_order/confirm_order'
            })
        } else {
            wx.showToast({
                title: '未获取到订单信息',
                icon: 'loading',
                duration: 1000
            })
        }
    },
    finishOrder: function (e) {
        var vm = this;
        // 确认收货
        console.log('确认收货', e);
        var index = e.currentTarget.dataset.index;
        console.log('确认收货的订单', vm.data.orderList[index]);
        if (vm.data.accountId) {
            if (vm.data.orderList[index].orderNo) {
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
                                    orderNo: vm.data.orderList[index].orderNo,
                                    accountId: vm.data.accountId
                                },
                                header: {
                                    'content-type': 'application/json'
                                },
                                success: function (res) {
                                    console.log('接口调用成功', res);
                                    if (res.data.resultStatus) {
                                        wx.setStorageSync('finishingOrder', vm.data.orderList[index])
                                        wx.navigateTo({
                                            url: 'order_finish/order_finish'
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
    },
    goToComment: function (e) {
        var vm = this;
        // 去评价
        console.log('去评价', e);
        var index = e.currentTarget.dataset.index;
        console.log('去评价的订单', vm.data.orderList[index]);
        if (vm.data.accountId) {
            if (vm.data.orderList[index].orderNo) {
                wx.setStorageSync('commentOrder', vm.data.orderList[index]);
                wx.redirectTo({
                    url: 'order_comment/order_comment'
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
    },
    setOrderDetailStorage: function (e) {
        var vm = this;
        var index = e.currentTarget.dataset.index;
        console.log('保存要查看的订单信息', index);
        if (index >= 0) {
            wx.setStorageSync('orderDetail', vm.data.orderList[index]);
            wx.navigateTo({
                url: 'order_detail/order_detail'
            })
        } else {
            wx.showToast({
                title: '数据异常',
                icon: 'loading',
                duration: 1000
            })
        }
    }
})
