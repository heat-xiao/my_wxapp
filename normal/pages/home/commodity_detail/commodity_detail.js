// pages/home/commodity_detail/commodity_detail.js
Page({
  data: {
    commodity: {},
    attrList: [],
    descPictureList: [],
    showModalStatus: false, // 遮罩层显示状态
    animationData: {},
    curAttrIndex: -1,//保存当前选中的属性组合序号，临时变量
    stock: 0,//保存当前库存
    count: 1,//当前数量
    maxStock: 0,//最大库存，用于取消选择后显示
    commodityPrice: 0,//商品价格
    accountId: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log('获取当前页面参数', options);
    var vm = this
    wx.getSystemInfo({
      success: function (res) {
        console.log('高度', res.windowWidth)
        vm.setData({
          windowWidth: res.windowWidth + 'px'
        });
      }
    })
    // 获取用户信息
    var accountId = wx.getStorageSync('userInfo').accountId
    console.log('accountId', accountId);
    vm.setData({
      accountId: accountId
    })
    if (accountId) {
      vm.setData({
        accountId: accountId
      });
      wx.request({
        method: 'GET',
        url: getApp().globalData.restServer + 'v1/home/commodity/detail',
        data: {
          commodityId: options.commodityId,
          accountId: accountId
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log('接口调用成功', res);
          if (res.data.resultStatus) {
            vm.setData({
              commodity: res.data.resultData,
              commodityIcon: res.data.resultData.commodityIcon.split(';'),
              commodityAttr: res.data.resultData.commodityAttr,
              commodityPrice: res.data.resultData.minDiscount == res.data.resultData.maxDiscount ? res.data.resultData.minDiscount : res.data.resultData.minDiscount + '~' + res.data.resultData.maxDiscount,
              descPictureList: res.data.resultData.descPictures.split(';')
            });
            vm.initCommodityDetail();
          }
        },
        fail: function (res) {
          console.log('接口调用失败', res)
        }
      })
    } else {
      wx.showToast({
        title: '登录信息异常',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  initCommodityDetail: function () {
    var commodityAttr = this.data.commodityAttr
    var maxStock = 0 //初始化库存，取和
    // 处理属性数组，抽取相同attrKey的值，值的初始状态都为未选中（1:选中，0:未选中，-1:不可选）
    var attrList = []; // 保存属性key的值，二维数组
    for (var i = 0, len1 = commodityAttr.length; i < len1; i++) {
      maxStock += commodityAttr[i].stock;
      for (var j = 0, len2 = commodityAttr[i].attrValueList.length; j < len2; j++) {
        if (attrList.length) {
          for (var k = 0; k < attrList.length; k++) {
            if (attrList[k].attrKey == commodityAttr[i].attrValueList[j].attrKey) {
              // 之前已push过此attrKey
              // 去重检验
              for (var m = 0, len3 = attrList[k].attrValues.length; m < len3; m++) {
                if (attrList[k].attrValues[m] == commodityAttr[i].attrValueList[j].attrValue) {
                  break;
                }
              }
              if (m >= attrList[k].attrValues.length) {
                // 如果这个值从来没push过，push
                attrList[k].attrValues.push(commodityAttr[i].attrValueList[j].attrValue);
              }
              break;
            }
          }
          if (k >= attrList.length) {
            // 第一次push attrKey
            attrList.push({
              attrKey: commodityAttr[i].attrValueList[j].attrKey,
              attrValues: [commodityAttr[i].attrValueList[j].attrValue]
            });
          }
        } else {
          // 第一个attrKey
          attrList.push({
            attrKey: commodityAttr[i].attrValueList[j].attrKey,
            attrValues: [commodityAttr[i].attrValueList[j].attrValue]
          });
        }
      }
    }
    console.log('去重后的属性数组', attrList);
    // 赋给属性值一个状态，true为可选，false为不可选，初始化都为可选
    for (var i = 0, len1 = attrList.length; i < len1; i++) {
      for (var j = 0, len2 = attrList[i].attrValues.length; j < len2; j++) {
        var tmpValue = attrList[i].attrValues[j];
        attrList[i].attrValues[j] = {
          attrValue: tmpValue,
          status: true
        }
      }
    }

    // 临时方案，当数组只有一个属性组合时，默认选中
    if (commodityAttr.length == 1) {
      console.log('默认选中只有一个属性值', commodityAttr[0]);
      this.setData({
        curAttrIndex: 0,//保存当前选中的属性组合序号，临时变量
        stock: commodityAttr[0].stock,//保存当前库存
        commodityPrice: commodityAttr[0].discount,//商品价格
        priceId: commodityAttr[0].priceId
      });
    }
    this.setData({
      attrList: attrList,
      stock: maxStock,
      maxStock: maxStock
    });
    console.log('最大库存', maxStock);
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function (e) {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  addToCart: function () {
    var vm = this
    vm.showModal();
    vm.setData({
      buyType: 'cart'
    });//判断是直接购买还是加入购物车 
  },
  buy: function () {
    var vm = this
    vm.showModal();
    vm.setData({
      buyType: 'buy'
    });//判断是直接购买还是加入购物车
  },
  showModal: function (e) {
    // 显示遮罩层
    var vm = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    vm.animation = animation
    animation.translateY(300).step()
    vm.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      vm.setData({
        animationData: animation.export()
      })
    }.bind(e), 200)
  },
  hideModal: function () {
    // 再次初始化属性数组，都可选
    // 赋给属性值一个状态，true为可选，false为不可选，初始化都为可选
    var attrList = this.data.attrList
    for (var i = 0, len1 = attrList.length; i < len1; i++) {
      for (var j = 0, len2 = attrList[i].attrValues.length; j < len2; j++) {
        attrList[i].attrValues[j].status = true
      }
    }
    this.setData({
      attrList: attrList
    });
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  selectAttr: function (e) {
    console.log('选中的属性值', e);
    var attrList = this.data.attrList;
    var commodityAttr = this.data.commodityAttr;
    var attrKey = e.currentTarget.dataset.key;
    var attrValue = e.currentTarget.dataset.value;
    var includeGroups = [];// 用于保存包含选中的属性的数组
    var minStock = this.data.stock // 显示关联属性中最大的库存
    var selectType = e.currentTarget.dataset.selectedattrvalue != attrValue; // 值相等为取消选中，即选中true取消选中false
    console.log('选中或取消选中', e.currentTarget.dataset.selectedattrvalue, attrValue);

    for (var i = 0, len1 = attrList.length; i < len1; i++) {
      for (var j = 0, len2 = attrList[i].attrValues.length; j < len2; j++) {
        if (attrList[i].attrKey == attrKey && attrList[i].attrValues[j].attrValue == attrValue) {
          if (selectType) { // 选中属性
            attrList[i].selectedAttr = {
              attrKey: attrKey,
              attrValue: attrValue
            }
          } else {// 取消属性
            attrList[i].selectedAttr = {
              attrKey: attrKey,
              attrValue: ''
            }
          }
        }
      }
    }
  },
  selectAttrTmp: function (e) {
    // 临时解决方案
    var vm = this
    console.log('点击的属性组合', e.currentTarget.dataset);
    var index = parseInt(e.currentTarget.dataset.index);
    console.log('index', index, vm.data.curAttrIndex);
    if (index == vm.data.curAttrIndex) {// 取消选中
      vm.setData({
        curAttrIndex: -1,
        stock: vm.data.maxStock,
        commodityPrice: vm.data.commodity.minDiscount == vm.data.commodity.maxDiscount ? vm.data.commodity.minDiscount : vm.data.commodity.minDiscount + '~' + vm.data.commodity.maxDiscount,
        priceId: 0
      });
    } else {// 选中
      console.log('库存和价格', vm.data.commodityAttr[index]);
      var stock = vm.data.commodityAttr[index].stock;
      var commodityPrice = vm.data.commodityAttr[index].discount;
      vm.setData({
        curAttrIndex: index,
        stock: stock,
        commodityPrice: commodityPrice,
        priceId: e.currentTarget.dataset.priceid
      });
    }

  },
  nagativeCount: function (e) {
    console.log('减少');
    var vm = this
    if (vm.data.count > 1) {
      vm.setData({
        count: vm.data.count - 1
      });
    }
  },
  positiveCount: function () {
    console.log('增加');
    var vm = this
    if (vm.data.count < this.data.stock) {
      vm.setData({
        count: vm.data.count + 1
      });
    }
  },
  confirmCommdity: function () {
    var vm = this
    console.log('确定', vm.data.buyType, {
      'commodityId': vm.data.commodity.commodityId,
      'amounts': vm.data.count,
      'priceId': parseInt(vm.data.priceId)
    });
    if (vm.data.priceId > 0) {
      if (vm.data.buyType == 'cart') {
        wx.request({
          method: 'POST',
          url: getApp().globalData.restServer + 'v1/cart/edit',
          data: {
            'accountId': vm.data.accountId,
            'commodityId': vm.data.commodity.commodityId,
            'amounts': vm.data.count,
            'priceId': parseInt(vm.data.priceId)
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log('加入购物车接口调用成功', res);
            if (res.data.resultStatus) {
              wx.showToast({
                title: '已添加到购物车',
                icon: 'success',
                duration: 1000
              })
            } else {
              wx.showToast({
                title: '数据异常',
                icon: 'loading',
                duration: 1000
              })
            }
          },
          fail: function (res) {
            console.log('加入购物车接口调用失败', res)
            wx.showToast({
              title: '网络异常',
              icon: 'loading',
              duration: 1000
            })
          }
        })
      } else {
        console.log('立即购买的商品', {
          commodityId: vm.data.commodity.commodityId,
          commodityName: vm.data.commodity.commodityName,
          amounts: vm.data.count,
          commodityPrice: vm.data.commodityPrice,
          commodityIcon: vm.data.commodityIcon[0],
          priceId: vm.data.priceId
        });
        wx.setStorageSync('confirmOrderList', [{
          commodityId: vm.data.commodity.commodityId,
          commodityName: vm.data.commodity.commodityName,
          amounts: vm.data.count,
          commodityPrice: vm.data.commodityPrice,
          commodityIcon: vm.data.commodityIcon[0],
          priceId: vm.data.priceId
        }]);
        wx.setStorageSync('confirmOrderNo', '');
        wx.setStorageSync('fromCart', false);
        wx.redirectTo({
          url: '/pages/shopping/confirm_order/confirm_order'
        })
      }
      vm.hideModal();
    } else {
      wx.showToast({
        title: '请选择商品属性',
        icon: 'loading',
        duration: 500
      })
    }
  },
  imgaeErrorHandle: function (e) {
    console.log('图片报错', e);
    var vm = this
    var descPictureList = vm.data.descPictureList;
    if (parseInt(e.currentTarget.dataset.index) >= 0) {
      descPictureList.splice(e.currentTarget.dataset.index, 1);
    }
    vm.setData({
      descPictureList: descPictureList
    });
  }
})