import common from '../../scripts/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedHot: true,
    selectedZongYi: false,
    selectedJiLu: false,
    id: 'hot',
    tag: '热门',
    type: 'tv',
    isLoadMore: false,
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
    this.loadData()
  },
  onTag({ currentTarget: { id } }) {
    if (this.data.id !== id || this.data.type == 'movie') {
      this.data.dataList = []
      this.data.isLoadMore = false
    }
    this.data.id = id
    const { start, limit } = this.data.pager

    let tag = this.data.tag
    switch (id) {
      case 'hot':
        tag = '热门';
        break;
      case 'jilu':
        tag = '纪录片';
        break;
      case 'zongyi':
        tag = '综艺';
        break;
      default:
        console.log('why？')
        break;
    }
    this.data.tag = tag
    this.setData({
      selectedHot: id === 'hot',
      selectedJiLu: id === 'jilu',
      selectedZongYi: id === 'zongyi'
    })
    this.loadData()
  },

  loadData() {
    const { type, tag, isLoadMore, pager } = this.data
    if (!isLoadMore) {
      wx.showLoading({ title: '加载中' })
    }
    wx.cloud.callFunction({
      name: 'douban',
      data: { 
        $url: 'list',
        type,
        tag,
        start: pager.start, 
        limit: pager.limit 
      }
    }).then(res => {
      const result = res.result
      if (pager.start > 0 && result.subjects.length == 0) {
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
    this.data.isLoadMore = false
    this.setData({ 
      showPagerLoaidng: true,
      dataList: [] 
    })
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const { pager, dataList } = this.data
    pager.start = dataList.length + 1
    this.data.isLoadMore = true
    this.setData({ showPagerLoaidng: true })
    this.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})