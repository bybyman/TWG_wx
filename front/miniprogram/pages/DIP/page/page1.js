// pages/page/page1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: ''
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    function setUrl() {
        that.setData({
            imageUrl: `${getApp().globalData.currentServer}/backend/DIP/origin.jpg`
        });
    }
    var imagePath = getApp().globalData.imagePath;
    console.log('读取到的全局变量：', imagePath);
    setTimeout(setUrl, 1000)
  },
  goToPage1: function() {
    wx.request({
        url: getApp().globalData.currentServer+':5000/DIP',
        method: 'POST',
        data: {
          operation: 'gray'
        },
        success(res) {
          wx.navigateTo({
            url: '/pages/DIP/page/button1/page'
          })
        }
    })

  },
  goToPage2: function() {

    wx.navigateTo({
      url: '/pages/DIP/page/button2/page'
    })
  },
  goToPage3: function() {

    wx.navigateTo({
      url: '/pages/DIP/page/button3/page'
    })
  },
  goToPage4: function() {

    wx.navigateTo({
      url: '/pages/DIP/page/button4/page'
    })
  },
  goToPage5: function() {
    wx.navigateTo({
      url: '/pages/DIP/page/button5/page'
    })
  },
  goToPage6: function() {
    wx.navigateTo({
      url: '/pages/DIP/page/button6/page'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})