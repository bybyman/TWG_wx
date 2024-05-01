// pages/AIGenerate/AIText/AIText.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {"title": "AI文本生成"},
    imageUrl: "/images/routes/01.jpg",
    content:"",
    show:true,
    result:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      imageUrl:options.url
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
      title: '正在生成文本中',
    })
    wx.request({
      url: `${app.globalData.currentServer}:5000/imageToText`,
      method: 'POST',
      data: {
        imgPath: wx.getFileSystemManager().readFileSync(this.data.imageUrl, "base64"),
      },
      success(res) {
        console.log(res.data)
        that.setData({
          result: res.data.data,
          show: false
        })
        wx.hideLoading()
        wx.showToast({
            title: '文本生成成功',
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