Component({

  properties: {
    data:{
      type:Object
    }
  },
  data: {

  },


  methods: {
   handleClick(event){
     console.log(this.properties.data)
     wx.navigateTo({
       url: '/pages/readDetail/readDetail?id='+this.properties.data.postId,
     })
   },
   handleRead(e){
     wx.redirectTo({
       url: '/pages/readDetail/readDetail',

     })
   }
  }
})
