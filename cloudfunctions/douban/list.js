const rp = require('request-promise')

exports.main = async (event, context) => {
  const type = event.type
  const tag = encodeURI(event.tag)
  const limit = event.limit || 50
  const start = event.start || 0

  const options = {
    uri: `https://movie.douban.com/j/search_subjects?type=${type}&tag=${tag}&page_limit=${limit}&page_start=${start}`,
    headers: {
      'Host': 'movie.douban.com',
      'Referer': 'https://movie.douban.com/'
    },
    json: true
  }
  console.log('options.uri', options.uri)
  return rp(options).then(res => res).catch(err => {
    console.log(err)
  })

}