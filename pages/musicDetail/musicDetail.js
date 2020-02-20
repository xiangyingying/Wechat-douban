const HTTP=require('../../models/music')
Page({

  data: {
     musics:[],
     playId:"",
     isPlay:false
  },
  onShow(){
       var playState=wx.getStorageSync('playState');
       var playId=wx.getStorageSync('playId');
       if(playState){
         this.setData({
           isPlay:true
         })
       }
       this.setData({
         playId
       })
  },
  onLoad:async function (options) {
    var res=await HTTP.getDetail(options.id)
    var {playlist}=res.data;
    this.setData({
      musics:playlist
    })
  },
   handlePlay(event){
     var {title,id}=event.currentTarget.dataset;
     var pic=escape(event.currentTarget.dataset.pic)
     console.log(id)
     wx.navigateTo({
       url: `/pages/musicPlay/musicPlay?pic=${pic}&title=${title}&id=${id}`,
     })
   }
})