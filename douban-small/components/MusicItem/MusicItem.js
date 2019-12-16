Component({

  properties: {
     data:Array,
     title:String,
     titleurl:String
  },
  data: {

  },
  methods: {
   handleDetail(event){
     var id=event.currentTarget.dataset.id;
     wx.navigateTo({
       url: `/pages/musicDetail/musicDetail?id=${id}`,
     })
   },
   handleMore(event){
     var subtitle=escape(event.currentTarget.dataset.subtitle);
     wx.navigateTo({
       url: `/pages/musicMore/musicMore?subtitle=${subtitle}`,
     })
   }
  },
  options:{
    multipleSlots:true
  }

})
