Component({
  
  properties: {
        data:{
          type:Object
        }
  },
  data: {

  },

  methods: {
     handleDetail(event){
       var id=this.properties.data.id
       wx.navigateTo({
         url: '/pages/movie-detail/movie-detail?id='+id,
         
       })
     }
  }
})
