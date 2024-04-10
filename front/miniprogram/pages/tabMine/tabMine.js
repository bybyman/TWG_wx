const db = wx.cloud.database();
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        defaultData: {"title": "个人中心","back": "none"},
        coverTransform: 'translateY(0)',
        coveTransition: '',
        userInfo: {},
        recentTestList: [], // 用户测试记录
        backgroundUrl: `${app.globalData.currentServer}/backend/images/carouselMap/R-C.jpg`
    },
    getUserInfo: function () {
        var that = this;
        wx.login({
            success: function (res) {
                if(res.code) {
                    wx.request({
                        url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxa61d3486bae23175&secret=6f5a' +
                            'e085d094c24dc76f78c2df52e89d&js_code=' + res.code + '&grant_type=authorization_code',
                        success(res) {
                            let openid = res.data.openid
                            wx.request({
                                url: `${getApp().globalData.server}:5000/login`,
                                method: 'POST',
                                data: {
                                    openid: openid
                                },
                                success(res) {
                                    let userInfo = res.data.data
                                    console.log(userInfo)
                                    that.setData({
                                        userInfo: userInfo
                                    })
                                    wx.setStorageSync('userInfo', userInfo)
                                    wx.showToast({
                                        title: '登录成功',
                                        icon: 'success',
                                        duration: 1000
                                    })
                                }
                            })

                        }
                    })
                }
            }
        })
    },
    toSceneManager: function () {
        if(!app.checkLogin()){
            return
        }
        let user = wx.getStorageSync('userInfo')
        if(user.role != 'admin'){
            wx.showToast({
                title: '您不是管理员!!!',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        wx.navigateTo({
            url: '../sceneManager/sceneManager',
        })
    },
    toLogout() {
        getApp().checkLogin()
        this.setData({
            userInfo: null
        })
        wx.setStorageSync('userInfo', null)
    },
    toMemorandum() {
        wx.navigateTo({
            url: '/pages/AIGen/index/index',
        })
    },
    tocustomerService: function (options) {
        wx.navigateTo({
            url: '/pages/customerService/customerService',
        })
    },
    toHealthReport() {
        wx.navigateTo({
            url: '/pages/healthReport/healthReport',
        })
    },
    toTestRecord() {
        wx.navigateTo({
            url: '/pages/testRecord/testRecord',
        })
    },
    toCenter(){
        wx.navigateTo({
            url: '/pages/BBS/BBS',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if(wx.getStorageSync('userInfo')) {
            this.setData({
                userInfo: wx.getStorageSync('userInfo')
            })
        }
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
        if(wx.getStorageSync('userInfo')) {
            this.setData({
                userInfo: wx.getStorageSync('userInfo')
            })
        }
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

    },
    checks(){
        if (app.checkLogin()) {
            wx.navigateTo({
                url: '/pages/personalDetail/personalDetail',
            })
        }
    }
})