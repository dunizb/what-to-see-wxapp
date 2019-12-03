const rp = require('request-promise');

const baseUrl = 'https://search.damai.cn/searchajax.html?'

exports.main = async (event, context) => {
  const { city, category, currPage, pageSize } = event
  const options = {
    uri: `${baseUrl}keyword=&cty=${encodeURI(city)}&ctl=${encodeURI(category)}&sctl=&tsg=0&st=&et=&order=1&pageSize=${pageSize}&currPage=${currPage}&tn=`,
    headers: {
      'Host': 'search.damai.cn'
    },
    json: true
  }
  return rp(options).then(function (res) {
    return {
      "ctl": res.ctl,
      "cty": res.cty,
      "totalPage": res.pageData.totalPage,
      "list": res.pageData.resultData
    }
  }).catch(function (err) {
    console.log(err)
  });
}