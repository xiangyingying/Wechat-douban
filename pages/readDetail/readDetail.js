var data=require('../../data/local')
const audio=wx.getBackgroundAudioManager()
const app=getApp();
Page({

  data: {
       isCollected:false,
       item:"",
       id:"",
       isPlay:false
  },
  onLoad: function (options) {
     var {id}=options;
     var {postList}=data;
     this.setData({
       item:postList[id],
       id
     })
     var collection=wx.getStorageSync('collection');
     /* 有缓存，获取缓存 */
     if(collection){
       let collected=collection[id];
       this.setData({
         isCollected:collected
       })
     }else{
       var collection={};
       collection[id]=false;
       wx.setStorageSync('collection', collection)
     }
     audio.onPlay(()=>{
       this.setData({
         isPlay:true
       })
     })
     
     audio.onPause(()=>{
       this.setData({
         isPlay:false
       })
     })
    
     if(app.globalData.g_isPlay && app.globalData.g_playId==this.data.id){
       this.setData({
         isPlay:true
       })
     }else{
       this.setData({
         isPlay:false
       })
     }
  },
  handleCollect(){
    var collection=wx.getStorageSync('collection')
    var collected = !collection[this.data.id]
    collection[this.data.id]=collected;
    /* 更新缓存 */
     wx.setStorageSync('collection', collection)
    this.setData({
      isCollected:collected
    })
    this.showModal(collected,collection)
    
  },
  handleShare(){
    wx.showActionSheet({
      itemList: [
        '分享到朋友圈',
        '分享到微信'
      ],
      itemColor: '#000000',
      success: (res)=>{
        console.log(res.tapIndex)
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  showModal(collected,collection){
    wx.showModal({
      title: '提示',
      content: '弹窗',
      success: (res) => {
        if(res.confirm){
          if(collected){
            wx.setStorageSync('collection', collection)
            this.setData({
              isCollected:collected
            })
          }
        }else if(res.cancel){
          if(collected==false){
            wx.setStorageSync('collection', collection)
            this.setData({
              isCollected:collected
            })
          }
     }
      },
    });
  },
  handlePlay(){
    if(this.data.isPlay){
      audio.pause();
      this.setData({
        isPlay:false
      })
      app.globalData.g_isPlay=false;
    }else{
      audio.title=this.data.item.music.title;
      audio.src=this.data.item.music.url;
      this.setData({
        isPlay:true
      })
      app.globalData.g_playId=this.data.id
      app.globalData.g_isPlay=true;
    }
  }
})