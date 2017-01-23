var browser = {
	versions: function () {
		var u = navigator.userAgent,
			app = navigator.appVersion;
		return { //移动终端浏览器版本信息 
			weixin: u.indexOf('MicroMessenger') > -1,
			trident: u.indexOf('Trident') > -1, //IE内核 
			presto: u.indexOf('Presto') > -1, //opera内核 
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核 
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核 
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端 
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端 
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器 
			iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器 
			iPad: u.indexOf('iPad') > -1, //是否iPad 
			webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部 
		};
	}(),
	language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

// Initialize your app
var myApp = new Framework7({
	modalTitle: "",
	modalButtonOk: "确定",
	modalButtonCancel: "取消",
	cache: false,
	animatePages: false,
	//	modalActionsCloseByOutside:false,

	onAjaxStart: function (xhr) {
		myApp.showIndicator();
	},
	onAjaxComplete: function (xhr) {
		myApp.hideIndicator();
	},
	onAjaxError: function (xhr) {
		setTimeout(function () {
			myApp.hideIndicator();
			myApp.alert('网络异常，请稍后再试！');
		}, 3000);

	}
});

// Add view
var mainView = myApp.addView('.view-main', {
	dynamicNavbar: true,
});

var $$ = Dom7;
var myCalendar = myApp.calendar({
		showContainer: '.year-month',
		input: '#calendar',
		dateFormat: 'yyyy.mm.dd',
		monthNames: ['元月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
		maxDate: Date(),
		onDayClick: function (p, dayContainer, year, month, day) {
			$$(".day").html(day < 10 ? '0' + day : day);
			$$(".year-month").html(year + '.' + (parseInt(month) + 1))
		}
	});

$$(document).on('pageBeforeInit', function (e) {
	var that = $$(this);

	var page = e.detail.page;
	console.log(page)
	//信息页面逻辑
	if (page.name === 'index') {
		$$(".toolbar-inner a").removeClass("active");
		$$("a.tab-index").addClass("active");

	}

	//信息页面逻辑
	if (page.name === 'user') {
		$$(".toolbar-inner a").removeClass("active");
		$$("a.tab-user").addClass("active")
	}

	//信息页面逻辑
	if (page.name === 'team') {
		$$(".toolbar-inner a").removeClass("active");
		$$("a.tab-team").addClass("active")
	}


	//医生详情页面逻辑
	if (page.name === 'doctor') {
		var doctorId = page.query.doctorId;

		$$.ajax({
			url: "/pro/doctor/info/detail",
			type: "POST",
			dataType: "json",
			data: {
				doctorId: doctorId
			},
			success: function (data) {

			},
			error: function (e) {
				if (e.status != 200) {
					myApp.alert('网络异常，请稍后再试！');
				}
			}
		});

	}
})