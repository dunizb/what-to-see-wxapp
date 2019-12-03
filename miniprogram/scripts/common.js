module.exports = {
  methods: {
    getDetail(event) {
      console.log(event)
      const id = event.currentTarget.id
      const type = 'movie'
      const item = this.data.dataList.find(item => item.id === id)
      if(item) {
        wx.setStorageSync('cover', item.cover)
        wx.navigateTo({
          url: `../detail/detail?id=${item.id}&type=${type}`
        })
      }
    }
  }
}