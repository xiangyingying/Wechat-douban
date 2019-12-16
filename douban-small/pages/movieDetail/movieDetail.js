const HTTP=require('../../models/base')
Page({
  data: {
   
  },

  onLoad:async function (options) {
      var {subtitle,title}=options;
   /*    switch(subtitle){
        case "in_theaters":
            var res=await HTTP.getInTheaters()
            var {subjects}=res.data;
            this.setData({
              subjects
            })
            break;
        case "coming_soon":
            var res=await HTTP.getComingSoon();
            var {subjects}=res.data;
            this.setData({
              subjects
            })
            break;
        case "top250":
            var res=await HTTP.getTop250();
            var {subjects}=res.data;
            this.setData({
              subjects
            })
            break;

      } */
      wx.setNavigationBarTitle({
        title
      })
      wx.showLoading({
        title:"数据加载"
      })
      var res=await HTTP.getMore(subtitle);
      var {subjects}=res.data;
      wx.hideLoading()
      this.setData({
        subjects
      })    
  },
})