Component({
	properties: { 
		inputPlaceHalder: {
			type: String,
			value: " ",
		},  
		inputHidden: {  
			type: Boolean, 
			value: true  
		},
		dialogHidden: {  
			type: Boolean,
			value: true
		},
		titleText: {
			type: String,
			value: "提示",
		},
		titleMsg: {
			type: String,
			value: " ",
		},
		inputMsg: {
			type: String,
			value: "请输入你他妈想干嘛",
		},
  
		//确定
		determineBtn: {
			type: String,
			value: "default value",
		},
  
		//取消  
		cancleBtn: {
			type: Boolean,
			value: true,
		},  
	},
  
	data: {
		inputValue: "",
		onCancleClick: false,
	},
	methods: {
		bindKeyInput: function (e) {
			this.setData({
				inputValue: e.detail.value  
			});
		},
		// 这里是一个自定义方法,取消
		cancleBtn: function () {
			this.setData({ 
				dialogHidden: true,  
			});
		},
  
		determineBtn: function () {
			var determineDetail = this.data.inputValue; // detail对象，提供给事件监听函数
			this.triggerEvent("determineevent", determineDetail);
			this.setData({
				inputValue: ""
			});
		} 
	}
});
  
  