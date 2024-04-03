const app = getApp()
Page({
  data: {
    tempCanvasWidth:0,
    tempCanvasHeight:0,
    imgViewHeight:0,
    page:'mainPage',
    imageNotChoosed:true,
    minScale: 0.5,
    maxScale: 2.5,
    doodleImageSrc:'',
    tempImageSrc:'',
    originImageSrc:'',
    imgWidth:0,
    imgHeight:0,
    imgTop:0,
    imgLeft:0,
  },
  /*
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var self = this
    // self.device = wx.getSystemInfoSync()
    self.device = app.globalData.myDevice
    self.deviceRatio = self.device.windowWidth / 750
    self.imgViewHeight = self.device.windowHeight - 10 * self.deviceRatio
    self.setData({
      imgViewHeight: self.imgViewHeight,
      // tempCanvasHeight: self.imgViewHeight,
      page: 'mainPage'
    })
    chooseImage(self)
  },
  chooseOneImage(){
    chooseImage(this)
  },
  toMainPage() {
    return new Promise((resolve, reject) => {
      this.setData({
        tempImageSrc: this.data.originImageSrc,
      }, () => {
        loadImgOnImage(this);
        this.setData({
          page: 'mainPage'
        });
        resolve();
      });
    });
  },
  toCropPage(){
    let transInterval = setInterval(()=>{
      wx.showLoading({
        title: '正在转换',
        duration: 1000
      })
    },1000)
    let that = this
    let teamimg = wx.getFileSystemManager().readFileSync(this.data.originImageSrc, "base64")
    wx.request({
      url: `${app.globalData.currentServer}:5000/styleTransfer`,
      method: 'POST',
      timeout: 1000000,
      data: {
        imgPath: teamimg,
      },
      success(res) {
        that.setData({
          doodleImageSrc: `${app.globalData.currentServer}/backend/`+ res.data.data,
            tempImageSrc:`${app.globalData.currentServer}/backend/`+ res.data.data,
        })
          var self=that
          loadImgOnImage(self)
          self.setData({
            page: 'cropPage',
          })

        clearInterval(transInterval)

        wx.showToast({
            title: '转换成功',
            icon: 'success',
            duration: 1000
        })
      }
    })

  },
  //保存照片
  saveImgToPhone(){
    wx.previewImage({
      urls: [this.data.tempImageSrc], // 需要预览的图片http链接列表
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
function chooseImage(self){
  wx.chooseImage({
    count: 1,
    // sizeType: ['original '], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      var tempFilePaths = res.tempFilePaths

      self.setData({
        imageNotChoosed: false,
        tempImageSrc: tempFilePaths[0],
        originImageSrc: tempFilePaths[0],
      })
      loadImgOnImage(self)
    },
    fail: function (res) {
      self.setData({
        imageNotChoosed: true
      })
    }
  })
}
function loadImgOnImage(self){
  wx.getImageInfo({
    src: self.data.tempImageSrc,
    success: function (res) {
      self.oldScale = 1
      self.initRatio = res.height / self.imgViewHeight  //转换为了px 图片原始大小/显示大小
      if (self.initRatio < res.width / (750 * self.deviceRatio)) {
        self.initRatio = res.width / (750 * self.deviceRatio)
      }
      //图片显示大小
      self.scaleWidth = (res.width / self.initRatio)
      self.scaleHeight = (res.height / self.initRatio)

      self.initScaleWidth = self.scaleWidth
      self.initScaleHeight = self.scaleHeight
      self.startX = 750 * self.deviceRatio / 2 - self.scaleWidth / 2;
      self.startY = self.imgViewHeight / 2 - self.scaleHeight / 2;
      self.setData({
        imgWidth: self.scaleWidth,
        imgHeight: self.scaleHeight,
        imgTop: self.startY,
        imgLeft: self.startX
      })
      wx.hideLoading();
    }
  })
}
