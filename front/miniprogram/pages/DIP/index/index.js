// index.js
const app = getApp();
Page({
  
  data: {
    imageSrc: ''
  },
  
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 可选择图片的数量
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let team_image = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
        wx.request({
            method: 'POST',
            url: app.globalData.currentServer+':5000/DIPUpload',
            data: {
                imgPath: team_image
            }
        })
        that.setData({
          imageSrc: res.tempFilePaths[0]
        });
        console.log('读取到的图片路径：', that.data.imageSrc);
        getApp().globalData.imagePath = that.data.imageSrc;
        wx.navigateTo({ url: '/pages/DIP/page/page1' });
      }
    });
  }
});

const pageConfig = {
  usingComponents: {},
  permission: {
    'scope.userLocation': {
      desc: '用于选择图片'
    }
  }
};

// Page(pageConfig); // 将 pageConfig 作为参数传递给 Page 函数