/* const musicHttp=require('../../models/music')
Page({

  data: {
    musics:{}
  },
  onLoad:async function (options) {
    var storageData=wx.getStorageSync('musics')
    if(storageData){
      this.setData({
        musics:storageData
      })
    }else{
      var musics={};
      var hot=await musicHttp.getHot();
      var cat=await musicHttp.getCat();
      var program=await musicHttp.getProgram();
      musics.hot={};
      musics.hot.title="热门歌曲",
      musics.hot.data=hot.data.playlists.slice(0,3);
      musics.hot.subTitle="top/playlist?order=hot";

      musics.cat={};
      musics.cat.title="日本音乐",
      musics.cat.data=cat.data.playlists.slice(0,3)
      musics.cat.subTitle="top/playlist?cat=日语";

      musics.program={};
      musics.program.title="主播电台";
      musics.program.data=program.data.result.slice(0,3);
      musics.program.coverImgUrl=program.data.result[0].blurCoverUrl;
      musics.program.subTitle="personalized/djprogram";
      wx.setStorageSync('musics', musics)
      this.setData({
        musics
      })
    }
  },
  handleMore(event){
    var {subtitle,title}=event.currentTarget.dataset;
    console.log(title)
    wx.navigateTo({
      url: `/pages/musicMore/musicMore?subtitle=${subtitle}&title=${title}`
    })
  }
}) */
const musicHttp=require('../../models/music')
Page({
  data:{
    hotSongs:[],
    newSongs:[],
    djSongs:[]
  },
  onLoad:async function(){
    var hotSongs=await musicHttp.getHot();
    var newSongs=await musicHttp.getCat();
    var djSongs=await musicHttp.getProgram();
    var titleurl={};
    titleurl.hotSongs={};
    titleurl.newSongs={};
    titleurl.djSongs={};
    titleurl.hotSongs.subtitle="top/playlist?order=hot"
    titleurl.newSongs.subtitle="top/playlist?cat=日语"
    titleurl.djSongs.subtitle="personalized/djprogram"
    console.log(titleurl.djSongs.subtitle)
    var songs=[];
    djSongs.data.result.forEach(item=>{
      var obj={};
      obj.id=item.id;
      obj.name=item.name;
      obj.coverImgUrl=item.picUrl;
      obj.playCount=item.program.adjustedPlayCount;
      songs.push(obj)
    })
    this.setData({
      hotSongs:hotSongs.data.playlists.slice(0,3),
      newSongs:newSongs.data.playlists.slice(0,3),
      djSongs:songs.slice(0,3),
      titleurl
    })
  }/* ,
  handleTitle(event){
    var subtitle=escape(event.currentTarget.dataset.subtitle);
     console.log(subtitle)
     wx.navigateTo({
       url: `/pages/musicMore/musicMore?subtitle=${subtitle}`,
     })
  } */
})