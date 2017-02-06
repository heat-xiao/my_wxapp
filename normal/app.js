//app.js
App({
  onLaunch: function () {
    console.log('启动小程序了~~~');

    // 小程序启动首先需要获取用户信息
    // 首先获取缓存的用户信息
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      console.log('user exist');
      return
    }
    var restServer = "https://xcxhn.30days-tech.com/mall_node/"

    // 缓存不存在，则需要login
    wx.login({
      success: function (r0) {
        console.log('wx login result', r0);

        // 根据code获取用户信息，
        wx.request({
          url: restServer + 'v1/account/wx/info',
          data: {
            code: r0.code
          },
          success: function (r1) {
            console.log('code info:', r1.data)

            //  判断用户是否首次登录，若是还需要进一步获取用户信息的密文然后提交服务端解密
            if (!r1.data.resultData.accountId) {

              console.log('first login');
              // 获取用户信息
              wx.getUserInfo({
                success: function (r2) {
                  wx.request({
                    url: restServer + 'v1/account/register',
                    method: 'POST',
                    data: {
                      encryptedData: r2.encryptedData,
                      openid: r1.data.resultData.openid,
                      iv: r2.iv
                    },
                    success: function (r3) {
                      console.log('register', r3);
                      /**
                       * 存储用户信息，结构如下：
                       * {
                            "resultStatus": true,
                            "resultData": {
                              "openId": "oIvAX0cnn6RyBV_BsH9_ApKuB-rk",
                              "nickName": "耀武",
                              "gender": 1,
                              "language": "zh_CN",
                              "city": "Shenzhen",
                              "province": "Guangdong",
                              "country": "CN",
                              "avatarUrl": "http://wx.qlogo.cn/mmopen/vi_32/PuSoyDUJ5bfsMfGkTtdmh9Kokg72lPgiaD5beXfiatJ8KNQ1iapdxe8jz1k6yPDicOLlLor6ba0WDQThzCTcPtoJ6g/0",
                              "watermark": {
                                "timestamp": 1482227502,
                                "appid": "wxdc4cb6cff2a638ef"
                              },
                              "accountId": 4
                            }
                          }
                       */

                      console.log('register success:', r3.data)
                      // 将用户信息存入缓存
                      wx.setStorage({
                        key: "userInfo",
                        data: r3.data.resultData
                      })

                    }
                  })

                }
              })
            }
            else {

              // 将用户信息存入缓存
              console.log('已经注册过了', r1.data.resultData);
              wx.setStorage({
                key: "userInfo",
                data: r1.data.resultData
              })

            }

          }
        })

      }
    })

    console.log('小程序启动完成了~~~');

  },
  getSystemInfo: function (cb) {
    var that = this
    // if (this.globalData.systemInfo) {
    //   typeof cb == "function" && cb(this.globalData.systemInfo)
    // } else {
    //调用登录接口
    wx.getSystemInfo({
      success: function () {
        wx.getSystemInfo({
          success: function (res) {
            that.globalData.systemInfo = res
            console.log('systemInfo', res)
            typeof cb == "function" && cb(that.globalData.systemInfo)
          }
        })
      }
    })
    // }
  },
  singleCommodityIcon: function (commodityList) {
    for (var i = 0; i < commodityList.length; i++) {
      if (commodityList[i].commodityIcon) {
        commodityList[i].commodityIcon = commodityList[i].commodityIcon.split(';')[0];
      }
    }
    return commodityList;
  },
  globalData: {
    userInfo: null,
    systemInfo: null,
    restServer: "https://xcxhn.30days-tech.com/mall_node/"
  }
})