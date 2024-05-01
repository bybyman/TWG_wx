// pages/AIGenerate/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {"title": "AI生成"},
    src:"",
    show:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  addImg:function(){
    var that = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],        
      success: function (res) {
        wx.showToast({
          title: '正在上传...',
          icon: "loading",
          mask: true,
          duration: 1000
        })
        var imgUrl = res.tempFilePaths[0]
        that.setData({
          src: imgUrl,
          show: true
        })
      },
      fail: function () {
        wx.showToast({
          title: '图片上传取消',
          icon: 'none'
        })
        return;
      }
    })
  },
  goToText:function(){
    if(this.data.src == ""){
      wx.showToast({
        title: '请先上传图片',
        icon:"none"
      })
      return ;
    }
    wx.navigateTo({
      url: '/pages/AIGenerate/AIText/AIText?url=' + this.data.src,
    })
  },
  goToTranslate:function(){
    if(this.data.src == ""){
      wx.showToast({
        title: '请先上传图片',
        icon:"none"
      })
      return ;
    }
    wx.navigateTo({
      url: '/pages/AIGenerate/AITranslate/AITranslate?url=' + this.data.src,
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