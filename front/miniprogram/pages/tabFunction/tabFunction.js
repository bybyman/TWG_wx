// pages/tab_function/tab_function.js
const app = getApp()
Page({
    data: {
        server: app.globalData.currentServer,
    },
    toSceneRec: function () {
        wx.navigateTo({
            url: '../sceneRec/sceneRec',
        })
    },
    toMap: function () {
        wx.navigateTo({
            url: '../map/map',
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
    toWeather: function () {
        wx.switchTab({
            url: '../tabSpace/tabSpace',
        })
    },
    toCustomisedFunc: function () {
        wx.navigateTo({
            url: '/pages/AIGen/index/index'
        })
    },
    toSceneList: function () {
        wx.navigateTo({
            url: '../sceneList/sceneList',
        })
    },
    toComment: function (){
        wx.navigateTo({
            url: '../BBS/BBS',
        })
    },
    toRouteList: function () {
        wx.navigateTo({
            url: '../routeList/sceneList',
        })
    },
    onLoad: function (options) {

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

    },
    toAbout: function () {
        wx.navigateTo({
            url: '../Aboutsystem/Aboutsystem',
        })
    },
    toIntro: function (){
        wx.navigateTo({
            url: '../Introduction/Introduction',
        })
    }
})