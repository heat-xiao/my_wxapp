Page({
    data: {

        checkboxItems: [
            {name: '曹妍', idcard:'4210394844848484848',value: '0', checked: true},
            {name: '张三', idcard:'4210394844848484848', value: '1'},
            {name: '李四', idcard:'4210394844848484848', value: '2'}
        ]
    },
    checkboxChange: function (e) {

        var checkboxItems = this.data.checkboxItems, values = e.detail.value;
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            checkboxItems[i].checked = false;

            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if(checkboxItems[i].value == values[j]){
                    checkboxItems[i].checked = true;
                    break;
                }
            }
        }

        this.setData({
            checkboxItems: checkboxItems
        });
    }
});