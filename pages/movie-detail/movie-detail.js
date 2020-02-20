const HTTP=require('../../models/base')
Page({
  data: {
    movies:{},
    x:true
  },
  onLoad:async function (options) {
    var {id}=options
    var res=await HTTP.getDetail(id);
    this.setData({
      movies:res.data
    })
  },
  handleImage(event){
    var url=event.currentTarget.dataset.url;
    var casts=this.data.movies.casts;
    var urls=casts.map(item=>{
      return item.avatars.small;
    })
    if(urls){
      this.setData({
        urls
      })
      wx.previewImage({
        current: url, // 当前显示图片的链接，不填则默认为 urls 的第一张
        urls
      })
    }
    
  }
})