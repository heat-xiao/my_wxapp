Page({ 
	data: {
		isOpen: false,
		isOpenClock:false
	},

	onMyEvent() {
	},

	onMyEvent2() {
	},

	showCompomentDialog() {
		this.setData({
			isOpen: true
		});
	},
	
	clock(){
		this.setData({
			isOpenClock: true
		});
	}
});