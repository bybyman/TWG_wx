
// pages/Space-detail/Space-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      comment:"",
      index: 0,
      img: "",
      title: "",
      content: "",
      locate: "",
      defaultData: {"title": "热门打卡点"}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.index = parseInt(options.index)
    let showData = [
      {
        "img": "http://47.99.147.35:8081/images/taijisquare.jpg",
        "title": "太极广场",
        "content": "太极广场，击鼓纳福，挥挥手打卡吧~",
        "locate": "太极广场面向滕王阁左侧"
      },
      {
        "img": "http://47.99.147.35:8081/images/goodwind.jpg",
        "title": "好风徐来",
        "content": "好风徐来，水波不兴，心随风动，风随心舞,比个耶打卡吧~",
        "locate": "滕王阁北侧"
      },
      {
        "img": "http://47.99.147.35:8081/images/zhangjiang.jpg",
            "title": "章江晓渡",
            "content": "章江晓渡，一叶扁舟摇曳在晨曦的熹微之中，挥挥手打卡吧～",
        "locate": "位于好风徐来北侧"
      },
    ]
    this.setData({
      img: showData[this.index].img,
      title: showData[this.index].title,
      content: showData[this.index].content,
      locate: showData[this.index].locate
    });
  },
  getContent:function(e){
    this.setData({
      comment:e.detail.value
    })
  },
  addComment:function(){
    if(wx.getStorageSync('openid') == ""){
      wx.showModal({
        title: '请先登录',
        content: '前往登录页面？',
        complete: (res) => {
          if (res.cancel) {
            return ;
          }
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/tabMine/tabMine',
            })
            return ;
          }
        }
      })
    }
   var that = this
   var commentId = util.uuid()
   this.setData({
     uuid: commentId
   })
   wx.showLoading({
     title: '评论发布中',
   })
   wx.request({
     url: 'http://47.99.147.35:8081/comment/addcomment',
     method: "post",
     data:{
       "commentId": commentId,
       "openId": wx.getStorageSync('openid'),
       "content": this.data.comment,
       "location": this.data.locate,
       "username":wx.getStorageSync('username'),
       "avatarUrl":wx.getStorageSync('avatarUrl')
     },
     success:function(res){
      that.setData({
        content:"",
      })
      wx.hideLoading()
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