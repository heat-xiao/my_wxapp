import api from '../../utils/api.js'
Page({
    data: {
        index: 0,
        identityId:''
    },

    onLoad: function (options) {
        var identityTypeArray = [
            { key: "IDCARD", value: "身份证" },
            { key: "MTP", value: "台胞证" },
            { key: "PASSPORT", value: "护照" },
            { key: "REENTRY_PERMIT", value: "回乡证" },
            { key: "OFFICIAL_CARD", value: "军官证" },
            { key: "RESIDENCE_PERMIT", value: "外国人居留证" },
            { key: "OTHER", value: "其他" },
        ];
        var that = this
        if (options.name) {
            for (var i = 0; i < identityTypeArray.length; i++) {
                if (identityTypeArray[i].key == options.identityType){
                    that.setData({
                        identityTypeArray: identityTypeArray,
                        identityId:options.identityId,
                        name: options.name,
                        identityNo: options.identityNo,
                        index: i                     
                    });
                    break;
                }
            }

        } else {
            this.setData({
                identityTypeArray: identityTypeArray
            });
        }
    },

    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
    submitIdentity: function (e) {
        var that = this
        if(e.detail.value && e.detail.value.name && e.detail.value.identityNo){          
            api.editIdentity({
                data: {
                    accountId: wx.getStorageSync('userInfo').accountId,
                    identityId:that.data.identityId,
                    name: e.detail.value.name,
                    identityNo: e.detail.value.identityNo,
                    identityType: that.data.identityTypeArray[that.data.index].key,
                },
                method: "POST",
                success: (res) => {
                    console.log(res)
                    if (res.data && res.data.resultStatus) {
                        wx.navigateBack();
                    }
                }
            });
        }else{
            wx.showToast({
                title: '请完整填写身份信息',
                icon: 'loading',
                duration: 1000
            })            
            return;
        }
        
    }
});
