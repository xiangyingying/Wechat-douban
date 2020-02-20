// pages/my/my.js
Page({

  data: {
    location:true,
    imageUrl:"/images/avatar/2.png",
    longitude:114.504216,
    latitude:30.552472,
    scale:18,
    showCompass:true,
    markers: [{
      iconPath: "/images/icon/location.png",
      id: 0,
      longitude:114.504216,
      latitude:30.552472,
      width: 30,
      height: 30
    }],
    polyline: [{
      points: [{
        longitude:114.504216,
        latitude:30.552472,
      }, {
        longitude: 114.433850,
        latitude: 30.461540
      }],
      color:"#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    circles:[{
      longitude:114.504216,
      latitude:30.552472,
      radius:50,
      fillColor:"#C20C0C66"
    }]
  },

  onLoad: function (options) {

  },

  handleImage() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const src = res.tempFilePaths[0]
        this.setData({
          imageUrl: src
        })
      }
    });
  }
})