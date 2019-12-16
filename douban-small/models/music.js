var baseUrl="http://192.168.14.15:5000/"
function http({url,data}){
   return new Promise((resolve,reject)=>{
     wx.request({
         url: baseUrl+url,
         data,
         header: {'content-type':'application/json'},
         method: 'GET',
         dataType: 'json',
         responseType: 'text',
         success: (res)=>{
             resolve(res)
         },
         fail: (err)=>{
             reject(err)
         }
     });
   })
}
module.exports={
    getHot:(hot)=>{
       return http({
           url:"top/playlist",
           data:{
               order:hot
           }
       })
    },
    getCat:()=>{
        return http({
            url:"top/playlist?cat=日语"
        })
    },
    getProgram:()=>{
        return http({
            url:"personalized/djprogram"
        })
    },
    getDetail:(id)=>{
        return http({
            url:"playlist/detail",
            data:{
                id
            }
        })
    },
    getUrl:(id)=>{
        return http({
            url:"song/url",
            data:{
                id
            }
        })
    },
    getMore:(subtitle)=>{
        return http({
            url:subtitle
        })
    }
}