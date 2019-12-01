// miniprogram/pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    cover: '',
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options
    this.getDetail(id)
    this.setData({ 
      cover: wx.getStorageSync('cover')
    })
  },
  getDetail(id) {
    wx.showLoading({ title: '加载中' })
    wx.cloud.callFunction({
      name: 'detail',
      data: { id }
    }).then(res => {
      console.log('res', res.result)
      const result = res.result
      this.setData({
        info: result.subject,
        loading: false
      }, () => {
        this.updateNavigationBar(result.subject.title)
        wx.hideLoading()
      })
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '出错了',
      })
      wx.hideLoading()
    })
  }, 
  updateNavigationBar(title) {
    wx.setNavigationBarTitle({ title })
  },

  onBack() {
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})