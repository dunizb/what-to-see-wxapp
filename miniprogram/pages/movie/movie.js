import common from '../common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedHot: true,
    selectedNew: false,
    dataList: []
  },
  ...common.methods,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  getList(event) {
    let callFunction = 'movielist'
    if(event) {
      callFunction = event.currentTarget.id
    }
    this.setData({
      selectedHot: callFunction === 'movielist',
      selectedNew: callFunction === 'movieNewList'
    })
    wx.showLoading({ title: '加载中' })
    wx.cloud.callFunction({
      name: callFunction
    }).then(res => {
      // console.log('res', res.result)
      const result = res.result
      this.setData({ 
        dataList: result.subjects 
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