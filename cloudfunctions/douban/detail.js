const rp = require('request-promise')
const cheerio = require('cheerio')

exports.main = async (event, context) => {
  const subjectId = event.id
  const baseUrl = 'https://movie.douban.com/j'
  const options = {
    uri: `${baseUrl}/subject_abstract?subject_id=${subjectId}`,
    headers: {
      'Host': 'movie.douban.com',
      'Referer': 'https://movie.douban.com/'
    },
    json: true
  }
  return rp(options).then((res) => {
    return rp(`https://movie.douban.com/subject/${subjectId}/`)
      .then((html) => {
        const $ = cheerio.load(html)
        const plot = $('#link-report').find('span').text(); //.replace(/\s/g, '')
        res.subject.plot = plot
        return res
      }).catch((err) => {
        console.log(err)
      });
  }).catch((err) => {
    console.log(err)
  });

}