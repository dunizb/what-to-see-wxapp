import common from '../../scripts/common.js'
import QQMapWX from '../../scripts/qqmap-wx-jssdk.min.js'

let qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedMusicConcert: true,
    selectedMusicFestival: false,
    selectedDisplay: false,
    dataList: [],
    showPagerLoaidng: false,
    city: '',
    category: '音乐会',
    pager: {
      pageSize: 30,
      currPage: 1,
      totalPage: 0
    },
    gonep: false
  },
  ...common.methods,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'OSNBZ-IRKC4-2P3UD-XSDOS-LHQ57-34FKF'
    });
    this.checkAuth((latitude, longitude) => {
      // https://lbs.qq.com/qqmap_wx_jssdk/method-reverseGeocoder.html
      qqmapsdk.reverseGeocoder({
        sig: 'bl8MP21e6Tqz2GuEf34i9TW6842f0cdg',
        location: {latitude, longitude},
        success: res => {
          let city = res.result.ad_info.city
          if (city.endsWith('市')) {
            city = city.substring(0, city.length - 1)
          }
          this.data.city = city
          wx.setStorageSync('loca_city', city)
          this.loadData()
        },
        fail(err) {
          console.log(err)
          wx.showToast('获取城市失败')
        },
        complete() {

        }
      })
    })
  },

  checkAuth(callback) {
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.getLocation({
                type: 'wgs84',  // wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
                success(res) {
                  callback(res.latitude, res.longitude)
                }
              })
            }
          })
        } else {
          this.loadLocaData()
        }
      }
    })
  },

  handleClick(event) {
    const { category, pager } = this.data
    if (event) {
      if (category !== event.currentTarget.id) {
        this.data.dataList = []
      }
      category = event.currentTarget.id
    }
    this.setData({
      selectedMusicConcert: category === 'musicConcert',
      selectedMusicFestival: category === 'musicFestival',
      selectedDisplay: category === 'display',
      category
    })
    this.loadData()
  },

  loadLocaData() {
    console.log('loadLocaData')
    this.setData({
      dataList: wx.getStorageSync('datalist')
    })
  },

  loadData() {
    wx.showLoading({ title: '加载中' })
    const { city, category, pager } = this.data
    wx.cloud.callFunction({
      name: 'damai',
      data: {
        city,
        category,
        pageSize: pager.pageSize,
        currPage: pager.currPage
      }
    }).then(res => {
      console.log('res', res)
      const result = res.result
      this.data.pager.totalPage = res.totalPage
      this.setData({
        dataList: result.list
      }, () => {
        wx.hideLoading()
        wx.setStorage({
          key: 'datalist',
          data: result.list,
        })
      })
      wx.hideLoading()
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
    pager.currPage = 0
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
    pager.currPage = dataList.length + 1
    this.setData({ showPagerLoaidng: true })
    this.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})