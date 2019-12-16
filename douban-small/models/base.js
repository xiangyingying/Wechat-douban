var baseUrl="https://douban.uieee.com/v2/movie/"
function http({url}){
    return new Promise((resolve,reject)=>{
        wx.request({
            url:baseUrl+url,
            data: {},
            header: {'content-type':'json'},
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (res)=>{
                resolve(res)
            },
            fail: (err)=>{
                reject(err)
            },
        });
    })
}
module.exports={
    getTop250:()=>{
        return http({
            url:"top250"
        })
    },
    getInTheaters:()=>{
        return http({
            url:"in_theaters"
        })
    },
    getComingSoon:()=>{
        return http({
            url:"coming_soon"
        })
    },
    getMore:(subtitle)=>{
        return http({
            url:subtitle
        })
    },
    getDetail:(id)=>{
        return http({
            url:`subject/${id}`
        })
    }
}