import util from '../../utils/util.js'

Page({
  data: { 
  }, 

  decrease: function() {
    var that = this
    var newDate = new Date(that.data.date);   
    var date = newDate.setDate(newDate.getDate()-1);
   
    that.setData({
      date:date,
      showDate:util.formatTime(date)
    })
  },
  
  increase: function() {
    var that = this
    var newDate = new Date(that.data.date);   
    var date = newDate.setDate(newDate.getDate()+1);
    that.setData({
      date:date,
      showDate:util.formatTime(date)
    })
  },

   onLoad: function (options) {
    var that = this
    that.setData({
      setout: options.setout,
      destination: options.destination, 
      date:options.date,
      showDate:util.formatTime(options.date)
    })
  }
})
