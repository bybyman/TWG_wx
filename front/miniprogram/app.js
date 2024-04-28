App({
  globalData: {
    weatherApiKey: '68f216a0793a449b9e4c8f857d4c5849',
    jumpBlock: '',
    ID: "4078338416",
    KEY: "XpRfpZibpJ0k1mW7FoX0dAo3pPBORKwv",
    server: "http://47.99.147.35",
    testServer: "http://127.0.0.1",
    otherServer: "http://192.168.43.121",
    currentServer: '',
    sceneData: [],
    navBarHeight: 0, // 导航栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuTop: 0, // 胶囊距底部间距（保持底部间距一致）
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    jumpData: {
      scene2map: null,
      map2detail: null,
    }
  },
  onLaunch: function () {
    this.globalData.currentServer = this.globalData.server
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
    }
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    this.globalData.myDevice = wx.getSystemInfoSync()
    let that = this
    this.queryScene()
    this.queryRoute()
    setInterval(() => that.queryScene(), 20000)
    setInterval(() => that.queryRoute(), 20000)

    //为自定义顶部导航栏做准备
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏高度 + 44
    that.globalData.navBarHeight = systemInfo.statusBarHeight + 44;
    that.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    that.globalData.menuTop=  menuButtonInfo.top;
    that.globalData.menuHeight = menuButtonInfo.height;
  },
  // 数据都是根据当前机型进行计算，这样的方式兼容大部分机器
    queryScene: function () {
    let that = this
      wx.request({
        url:  that.globalData.currentServer+':5000/getSceneData',
        method: 'GET',
        success: function (res) {
          console.log(res)
          that.globalData.sceneData = res.data.data
          wx.setStorageSync('sceneData', res.data.data)
        },
        fail(res) {
          console.log(res)
        }
      })
    },
  queryRoute: function () {
    let that = this
    wx.request({
      url:  that.globalData.currentServer+':5000/getRouteData',
      method: 'GET',
      success: function (res) {
        console.log(res)
        that.globalData.routeData = res.data.data
        wx.setStorageSync('routeData', res.data.data)
      }
  })
    },
  checkLogin: function () {
    if(wx.getStorageSync('userInfo')){
      return true
    }
    else{
        wx.showToast({
            title: '请先登录',
            icon: 'none',
            duration: 2000
        })
        return false
    }
  }
});
