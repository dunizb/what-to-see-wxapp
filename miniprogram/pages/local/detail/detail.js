// miniprogram/pages/local/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    name: '',
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ id, name }) {
    console.log(id, name)
    this.setData({ name })
    this.loadData(id, name)
  },

  loadData(id, name) {
    wx.showLoading({ title: '加载中' })
    wx.cloud.callFunction({
      name: 'damai',
      data: {
        $url: 'detail',
        id,
        name
      }
    }).then(res => {
      console.log('res', res)
      this.setData({
        detail: res,
        loading: false
      }, () => {
        wx.hideLoading()
      })
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '出错了',
        icon: 'none'
      })
      wx.hideLoading()
    })
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