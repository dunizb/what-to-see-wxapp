module.exports = {
  methods: {
    getDetail({ currentTarget: { id } }) {
      const item = this.data.dataList.find(item => item.id = id)
      wx.setStorageSync('cover', item.cover)
      wx.navigateTo({
        url: `../detail/detail?id=${item.id}`
      })
    }
  }
}