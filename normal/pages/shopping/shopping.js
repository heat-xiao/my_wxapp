Page({
    data: {
        shoppingList: [],
        confirmOrderList: [],
        totalPrice: 0,
        checkValues: []
    },
    onShow: function () {
        var vm = this
        // 获取用户信息
        var accountId = wx.getStorageSync('userInfo').accountId
        console.log('accountId', accountId);
        vm.setData({
            accountId: accountId
        })
        if (accountId) {
            vm.getShoppingList();
        }
    },
    getShoppingList: function () {
        var vm = this
        console.log('获取购物车商品列表');
        wx.request({
            method: 'GET',
            url: getApp().globalData.restServer + 'v1/cart/mine',
            data: {
                accountId: vm.data.accountId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log('接口调用成功', res);
                if (res.data.resultStatus) {
                    vm.setData({
                        shoppingList: getApp().singleCommodityIcon(res.data.resultData)
                    });
                    vm.refreshList();
                } else {
                    wx.showToast({
                        title: '数据异常',
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
    },
    checkboxChange: function (e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);
        this.setData({
            checkValues: e.detail.value
        });
        this.refreshList();
    },
    refreshList: function () {
        var shoppingList = this.data.shoppingList, values = this.data.checkValues;
        for (var i = 0, lenI = shoppingList.length; i < lenI; ++i) {
            shoppingList[i].checked = false;
            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (shoppingList[i].priceId == values[j]) {
                    shoppingList[i].checked = true;
                    break;
                }
            }
        }
        this.setData({
            shoppingList: shoppingList
        });
        this.getTotalPrice();// 统计价格
        this.getConfirmOrderList(); // 用于确认订单
    },
    nagativeAmounts: function (e) {
        console.log('减少', e);
        var vm = this
        var index = parseInt(e.target.dataset.index);
        var amounts = parseInt(vm.data.shoppingList[index].amounts);
        console.log(amounts, index);
        if (amounts > 1) {
            console.log('当前数量', amounts);
            if (vm.data.shoppingList && vm.data.shoppingList[index]) {
                var tmpArr = vm.data.shoppingList;
                tmpArr[index].amounts = amounts - 1;
                vm.setData({
                    'shoppingList': tmpArr
                });
                vm.changeAmounts(vm.data.shoppingList[index].commodityId, -1, vm.data.shoppingList[index].priceId, index);
                vm.getTotalPrice();
                vm.getConfirmOrderList();
            }
        }
    },
    positiveAmounts: function (e) {
        console.log('增加', e.currentTarget.dataset);
        var vm = this
        var amounts = parseInt(e.target.dataset.amounts);
        var stock = parseInt(e.target.dataset.stock);
        var index = parseInt(e.target.dataset.index);
        if (stock > amounts + 1) {
            if (vm.data.shoppingList && vm.data.shoppingList[index]) {
                var tmpArr = vm.data.shoppingList;
                tmpArr[index].amounts = amounts + 1;
                vm.setData({
                    'shoppingList': tmpArr
                });
                vm.changeAmounts(vm.data.shoppingList[index].commodityId, 1, vm.data.shoppingList[index].priceId, index);
                vm.getTotalPrice();
                vm.getConfirmOrderList();
            }
        } else {
            wx.showToast({
                title: '库存不足',
                icon: 'loading',
                duration: 500
            })
        }
    },
    changeAmounts: function (commodityId, amounts, priceId, index) {// amounts是偏移量
        var vm = this;
        console.log('修改商品数量参数', {
            accountId: vm.data.accountId,
            commodityId: commodityId,
            amounts: amounts,
            priceId: priceId
        });
        wx.request({
            method: 'POST',
            url: getApp().globalData.restServer + 'v1/cart/edit',
            data: {
                accountId: vm.data.accountId,
                commodityId: commodityId,
                amounts: amounts,
                priceId: priceId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log('修改购物车商品数量接口调用成功', res);
                if (!res.data.resultStatus) {
                    var shoppingList = vm.data.shoppingList;
                    shoppingList[index].amounts = shoppingList[index].amounts - amounts;
                    vm.setData({
                        shoppingList: shoppingList
                    });
                    wx.showToast({
                        title: '数据异常',
                        icon: 'loading',
                        duration: 1000
                    })
                }
            },
            fail: function (res) {
                console.log('修改购物车商品数量接口调用失败', res)
                var shoppingList = vm.data.shoppingList;
                shoppingList[index].amounts = shoppingList[index].amounts - amounts;
                vm.setData({
                    shoppingList: shoppingList
                });

            }
        })
    },
    getTotalPrice: function () {
        console.log('shoppingList', this.data.shoppingList);
        var totalPrice = 0;
        for (var i = 0; i < this.data.shoppingList.length; i++) {
            if (this.data.shoppingList[i].checked) {
                totalPrice += this.data.shoppingList[i].commodityPrice * this.data.shoppingList[i].amounts;
            }
        }
        this.setData({
            totalPrice: totalPrice
        });
    },
    getConfirmOrderList: function () {
        var confirmOrderList = [];
        for (var i = 0; i < this.data.shoppingList.length; i++) {
            if (this.data.shoppingList[i].checked) {
                confirmOrderList.push(this.data.shoppingList[i]);
            }
        }
        this.setData({
            'confirmOrderList': confirmOrderList
        });
    },
    confirmOrder: function () {
        console.log('结算，保存要结算的商品', this.data.confirmOrderList);
        wx.setStorageSync('confirmOrderList', this.data.confirmOrderList);
        wx.setStorageSync('confirmOrderNo', '');
        wx.setStorageSync('fromCart', true);
    },
    deleteCommodity: function (e) {
        var vm = this
        var accountId = vm.data.accountId;
        console.log('删除购物车Id', {
            accountId: vm.data.accountId,
            cartId: parseInt(e.currentTarget.dataset.id)
        });
        wx.request({
            method: 'DELETE',
            url: getApp().globalData.restServer + 'v1/cart/remove?accountId=' + accountId + '&cartId=' + parseInt(e.currentTarget.dataset.id),
            data: {
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log('接口调用成功', res);
                if (res.data.resultStatus) {
                    wx.showToast({
                        title: '已删除',
                        icon: 'loading',
                        duration: 100
                    })
                    vm.getShoppingList();
                } else {
                    wx.showToast({
                        title: '数据异常',
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

    },
    onPullDownRefresh: function () {
        this.getShoppingList();
        wx.stopPullDownRefresh();
    }
});