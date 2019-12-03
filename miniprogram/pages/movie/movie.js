import common from '../../scripts/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedHot: true,
    selectedNew: false,
    dataList: [],
    id: 'hot',
    type: 'movie'
  },
  ...common.methods,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
  },
  onTag({ currentTarget: {id} }) {
    if (this.data.id !== id || this.data.type == 'tv') {
      this.data.dataList = []
    }
    this.data.id = id
    this.loadData()
  },
  loadData() {
    let {id, type} = this.data
    this.setData({
      selectedHot: id === 'hot',
      selectedNew: id === 'new'
    })
    wx.showLoading({ title: '加载中' })
    wx.cloud.callFunction({
      name: 'douban',
      data: {
        $url: 'list',
        type,
        tag: id == 'hot' ? '热门' : '最新'
      }
    }).then(res => {
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