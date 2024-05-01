// pages/AIGenerate/AIText/AIText.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {"title": "AI风格转化"},
    imageUrl: "/images/routes/01.jpg",
    originUrl:"",
    content:"",
    show:true,
    result:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      imageUrl:options.url,
      originUrl:options.url
    })
  },
  getContent:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  startGen:function(){
    var that = this
    if(this.data.content == ""){
      wx.showToast({
        title: '请先输入文本',
        icon:"none"
      })
      return ;
    }
    wx.showLoading({
      title: '正在生成图片中',
    })
    wx.request({
      url: `${app.globalData.currentServer}:5000/styleTransfer`,
      method: 'POST',
      timeout: 1000000,
      data: {
        imgPath: wx.getFileSystemManager().readFileSync(that.data.originUrl, "base64"),
      },
      success(res) {
        console.log(res)
        that.setData({
          imageUrl: `${app.globalData.currentServer}:8081/`+ res.data.data,
          show: false
        })
        wx.hideLoading()
        wx.showToast({
            title: '转换成功',
            icon: 'success',
            duration: 1000
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