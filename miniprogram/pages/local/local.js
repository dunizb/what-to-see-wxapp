import QQMapWX from '../../scripts/qqmap-wx-jssdk.min.js'

let qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedMusicConcert: true,
    selectedSings: false,
    selectedDisplay: false,
    dataList: null,
    showPagerLoaidng: false,
    city: '上海',
    category: '音乐会',
    cityNull: false,
    pager: {
      pageSize: 30,
      currPage: 1,
      totalPage: 0
    },
    gonep: false
  },

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
          wx.showToast({
            title: '获取城市失败',
            icon: 'none'
          })
        },
        complete() {

        }
      })
    })
    
    this.setBar()
   
  },

  setBar() {
    const city = wx.getStorage({
      key: 'loca_city',
      success: function (res) {
        console.log(res)
        wx.setNavigationBarTitle({ title: `本地好看·${res.data}` })
        wx.setTabBarItem({
          index: 2,
          text: `${res.data}好看`
        })
      },
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
          this.loadData()
        }
      }
    })
  },

  handleClick({ currentTarget: {id} }) {
    const category = this.data.category
    if (category !== id) {
      this.data.dataList = null
    }
    if (id === 'musicConcert') {
      this.data.category = '音乐会'
    } else if (id === 'sings') {
      this.data.category = '演唱会'
    } else {
      this.data.category = '展览休闲'
    }
    this.setData({
      selectedMusicConcert: id === 'musicConcert',
      selectedSings: id === 'sings',
      selectedDisplay: id === 'display'
    })
    
    this.loadData()
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
      this.data.pager.totalPage = result.totalPage
      let dataList = this.data.dataList || []
      dataList = dataList.concat(result.list)
      if (dataList.length > 0) {
        dataList = dataList.concat(result.list)
      } else {
        this.data.cityNull = true
      }
      this.setData({
        dataList,
        city: this.data.city,
        category: this.data.category,
        cityNull: this.data.cityNull
      }, () => {
        wx.hideLoading()
        wx.setStorage({
          key: 'datalist',
          data: dataList,
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
    pager.currPage = 1
    this.setData({
      showPagerLoaidng: true,
      dataList: null
    })
    wx.setStorage({
      key: 'datalist',
      data: null,
    })
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const { pager, dataList } = this.data
    if (pager.currPage < pager.totalPage) {
      pager.currPage++
      this.setData({ showPagerLoaidng: true })
      this.loadData()
    } else {
      this.setData({ gonep: true })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})