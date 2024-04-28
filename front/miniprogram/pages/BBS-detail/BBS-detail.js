// pages/BBS-detail/BBS-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {"title": "评论详情"},
    comment:{},
    media:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this
    wx.request({
      url: 'http://47.99.147.35:8081/comment/getcommentbyid?commentId=' + options.commentId,
      method: 'get',
      success:function(res){
        console.log(res)
        that.setData({
          comment:res.data.data.comment,
          media:res.data.data.media
        })
      }
    })
  },

  previewImg: function (e) {
    let index = e.target.dataset.id;
    let _this = this;
    console.log(e)
    wx.previewImage({
      current: _this.data.media[index].url,
      urls: _this.data.media
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