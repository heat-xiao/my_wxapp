Component({
	properties: { 
		dialogOpen: {  
			type: Boolean,
			value: false
		},
		drawerTitle: {
			type: String,
			value: "提示",
		},
		confirmBtn: {
			type: String,
			value: "确定",
		},  
		cancleBtn: {
			type: Boolean,
			value: true,
		},  
	},
	data:{
		animationData: {}
	},
	// ready(){
	// 	const animation = wx.createAnimation({
	// 		duration: 1000,
	// 	});
	// 	this.animation = animation;
	// 	animation.opacity(0).rotateX(-100).step();
	// 	this.setData({
	// 		animationData: animation.export()
	// 	});
	// 	setTimeout(function() {
	// 		animation.opacity(1).rotateX(0).step();
	// 		this.setData({
	// 			animationData: animation
	// 		});
	// 	}.bind(this),3000);
	// },
	methods: {
		cancleBtn() {
			this.setData({ 
				dialogOpen: false
			});
		},
		confirmBtn() {
			const confirmValue = 666;
			this.triggerEvent("confirmevent", confirmValue);
			this.setData({ 
				dialogOpen: false,  
			});
		} 
	}
});
  
  