// pages/page/button1/page.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    wx.request({
      url: getApp().globalData.currentServer+':5000/DIP',
      method: 'POST',
      data: {
        operation: 'compress'
      },
      success(res) {
        that.setData({
          imageUrl: `${getApp().globalData.currentServer}/backend/DIP/compress.jpg`

        })
      }
    })

  },

  convertToGray: function () {
    
  },
    
  saveImage: function() {
    var that = this;
    wx.downloadFile({
      url: that.data.imageUrl,
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function () {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
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