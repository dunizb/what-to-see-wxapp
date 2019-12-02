import common from '../../scripts/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedHot: true,
    selectedZongYi: false,
    selectedJiLu: false,
    currentFunction: 'tvHotList',
    dataList: [],
    showPagerLoaidng: false,
    pager: {
      start: 0,
      limit: 50
    },
    gonep: false
  },
  ...common.methods,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  getList(event) {
    let currentFunction = this.data.currentFunction
    const { start, limit } = this.data.pager
    if(event) {
      if (currentFunction !== event.currentTarget.id) {
        this.data.dataList = []
      }
      currentFunction = event.currentTarget.id
    }
    this.setData({
      selectedHot: currentFunction === 'tvHotList',
      selectedJiLu: currentFunction === 'tvJiLuList',
      selectedZongYi: currentFunction === 'tvZongYiList',
      currentFunction
    })
    this.loadData(currentFunction, start, limit)
  },
  loadData(currentFunction, start, limit) {
    wx.showLoading({ title: '加载中' })
    wx.cloud.callFunction({
      name: currentFunction,
      data: { start, limit }
    }).then(res => {
      const result = res.result
      if (start > 0 && result.subjects.length == 0) {
        this.setData({ gonep: true })
        wx.hideLoading()
      } else {
        this.data.dataList = this.data.dataList.concat(result.subjects)
        this.setData({
          dataList: this.data.dataList,
          showPagerLoaidng: false
        }, () => {
          wx.hideLoading()
          wx.stopPullDownRefresh()
        })
      }
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
    const { pager, dataList } = this.data
    pager.start = 0
    this.setData({ 
      showPagerLoaidng: true,
      dataList: [] 
    })
    this.getList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const { pager, dataList } = this.data
    pager.start = dataList.length + 1
    this.setData({ showPagerLoaidng: true })
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})