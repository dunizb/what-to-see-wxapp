// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var rp = require('request-promise');

// https://search.damai.cn/searchajax.html?keyword=&cty=%E4%B8%8A%E6%B5%B7&ctl=%E6%BC%94%E5%94%B1%E4%BC%9A&sctl=&tsg=0&st=&et=&order=1&pageSize=30&currPage=1&tn=
const baseUrl = 'https://search.damai.cn/searchajax.html?'
// 云函数入口函数
exports.main = async (event, context) => {
  const { city, category, currPage, pageSize } = event
  const options = {
    uri: `${baseUrl}keyword=&cty=${encodeURI(city)}&ctl=${encodeURI(category)}&sctl=&tsg=0&st=&et=&order=1&pageSize=${pageSize}&currPage=${currPage}&tn=`,
    headers: {
      'Host': 'search.damai.cn'
    },
    json: true
  }
  console.log('url ==>', options.uri)
  return rp(options)
    .then(function (res) {
      console.log('res==>', res)
      const result = {
        "ctl": res.ctl,
        "cty": res.cty,
        "totalPage": res.pageData.totalPage,
        "list": res.pageData.resultData
      }
      console.log('result==>', result)
      return result;
    })
    .catch(function (err) {
      console.log(err)
    });
}