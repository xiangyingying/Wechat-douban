const HTTP=require('../../models/music')
const audio=wx.getBackgroundAudioManager()
Page({

  data: {
      musics:[],
      isPlay:false
  },
  onLoad:async function (options) {
     var {title}=options;
     var pic=unescape(options.pic)
     var res=await HTTP.getUrl(options.id)
     var url=res.data.data[0].url;
     
     audio.title=title;  
     audio.src=url
     wx.setStorageSync('playState', true)
     wx.setStorageSync('playId',options.id)
      this.setData({
        title,
        pic
      })     
      audio.onPlay(()=>{
        this.setData({
          isPlay:true
        })
      })
      wx.setStorageSync('playState', true)
      audio.onPause(()=>{
        this.setData({
          isPlay:false
        })
      })
      wx.setStorageSync('playState', false)
  },
  handlePlay(event){
    if(this.data.isPlay){
      this.setData({
        isPlay:false
      })
      audio.pause()
      wx.setStorageSync('playState', false)
    }else{
      this.setData({
        isPlay:true
      })
      audio.play()
      wx.setStorageSync('playState',true )
    }
  }
})