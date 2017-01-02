import api from '../../utils/api.js'
Page({
    data: {
        identityTypeArray: {
            "IDCARD": "身份证", "MTP": "台胞证", "PASSPORT": "护照", "REENTRY_PERMIT": "回乡证", "OFFICIAL_CARD": "军官证", "RESIDENCE_PERMIT": "外国人居留证", "OTHER": "其他"
        },
    },
    checkboxChange: function (e) {
        var checkedIds = e.detail.value;
        this.selectIdentity(checkedIds);
    },
    onShow: function () {
        var that = this
        api.getIdentitys({
            data: {
                accountId: wx.getStorageSync('userInfo').accountId,
            },
            success: (res) => {
                if (res.data && res.data != {}) {
                    that.setData({
                        checkboxItems: res.data.resultData,
                    });
                    var checkedIds = new Array();
                    var selectIdentitys = wx.getStorageSync('selectIdentitys');
                    for(var i=0;i<selectIdentitys.length;i++){
                        checkedIds.push(selectIdentitys[i].identityId);
                    }
                    that.selectIdentity(checkedIds);
                }
            }
        });
        
    },

    selectIdentity: function(Ids){
        var that = this;
        var checkboxItems = that.data.checkboxItems, selectIdentitys = new Array();

         for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            checkboxItems[i].checked = false;
            for (var j = 0, lenJ = Ids.length; j < lenJ; ++j) {
                if (checkboxItems[i].identityId == Ids[j]) {
                    checkboxItems[i].checked = true;
                    selectIdentitys.push(checkboxItems[i]);
                    break;
                }
            }
        }

        this.setData({
            checkboxItems: checkboxItems
        });        
        wx.setStorageSync('selectIdentitys', selectIdentitys);
    }

});