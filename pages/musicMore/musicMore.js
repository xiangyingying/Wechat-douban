const HTTP=require('../../models/music')
Page({
  data: {
     musics:[]
  },

  onLoad:async function (options) {    
     var subtitle=unescape(options.subtitle)
     /* wx.setNavigationBarTitle({
       title
     }) */
     wx.showLoading({
       title:"数据加载"
     })
     var res=await HTTP.getMore(subtitle);
     var {playlists}=res.data;
     wx.hideLoading()
     this.setData({
       playlists
     })
  },

})