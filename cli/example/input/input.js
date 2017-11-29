const App = getApp();
Page({
	data: {
		showTopTips: false,
		errorTip: "",
		radioItems: [
			{name: "cell standard", value: "0"},
			{name: "cell standard", value: "1", checked: true}
		],
		checkboxItems: [
			{name: "standard is dealt for u.", value: "0", checked: true},
			{name: "standard is dealicient for u.", value: "1"}
		],

		date: "2016-09-01",
		time: "12:01",

		countryCodes: ["+86", "+80", "+84", "+87"],
		countryCodeIndex: 0,

		countries: ["中国", "美国", "英国"],
		countryIndex: 0,

		accounts: ["微信号", "QQ", "Email"],
		accountIndex: 0,

		isAgree: false
	},
	onLoad() {
		this.WxValidate = App.WxValidate({
			qq: {
				required: true, 
				minlength: 6, 
				maxlength: 12, 
			},
			phone: {
				required: true, 
				phone: true, 
			},
			pin:{
				required: true,
				minlength: 6, 
				maxlength: 8, 
			},
			content:{
				required: true,
			}
		}, {
			qq: {
				required: "请输入qq号码"
			},
			phone: {
				required: "请输入手机号码" 
			},
			pin:{
				required: "请输入验证码"
			},
			content:{
				required:"请输入文本"
			}
		});
	},
  
	submitForm(e) {

		if (!this.WxValidate.checkForm(e)) {
			const that = this;
			const error = this.WxValidate.errorList[0];	
			this.setData({
				showTopTips: true,
				errorTip: error.msg
			});
			setTimeout(function(){
				that.setData({
					showTopTips: false,
					errorTip: ""
				});
			}, 3000);
			return false;
		}
	},
  
	radioChange: function (e) {
		console.log("radio发生change事件，携带value值为：", e.detail.value);
		var radioItems = this.data.radioItems;
		for (var i = 0, len = radioItems.length; i < len; ++i) {
			radioItems[i].checked = radioItems[i].value == e.detail.value;
		}

		this.setData({
			radioItems: radioItems
		});
	},
	checkboxChange: function (e) {
		console.log("checkbox发生change事件，携带value值为：", e.detail.value);

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
	},
	bindDateChange: function (e) {
		this.setData({
			date: e.detail.value
		});
	},
	bindTimeChange: function (e) {
		this.setData({
			time: e.detail.value
		});
	},
	bindCountryCodeChange: function(e){
		console.log("picker country code 发生选择改变，携带值为", e.detail.value);

		this.setData({
			countryCodeIndex: e.detail.value
		});
	},
	bindCountryChange: function(e) {
		console.log("picker country 发生选择改变，携带值为", e.detail.value);

		this.setData({
			countryIndex: e.detail.value
		});
	},
	bindAccountChange: function(e) {
		console.log("picker account 发生选择改变，携带值为", e.detail.value);

		this.setData({
			accountIndex: e.detail.value
		});
	},
	bindAgreeChange: function (e) {
		this.setData({
			isAgree: !!e.detail.value.length
		});
	}
});