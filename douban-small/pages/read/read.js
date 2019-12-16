var data=require('../../data/local');
var http=require('../../models/http')
Page({
  data: {
     banners:[],
     indicatorDots:"true",
     indicatorColor:"rgba(75,75,75,.5)",
     active:"#e2e2e2"
  },
  onLoad:async function (options) {
   var {bannerUrl,postList}=data;
   var res=await http(bannerUrl);
   var banners=res.data.banners.slice(0,3)
   this.setData({
    banners,
     postList
   })
  },
})
