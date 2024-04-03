// pages/about_update/about_update.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentVersion: null,
        latestVersion: null
    },

    getCurrentVersion: function () {
        // 获取当前版本，此处模拟
        var currentVersion = "1.0.0"
        return currentVersion
    },

    getLatestVersion: function () {
        // 获取最新版本，此处模拟
        var latestVersion = "1.0.0"
        return latestVersion
    },

    doUpdate: function () {
        // 执行更新,此处省略
        // ...
        var targetVersion = this.getLatestVersion()
        this.setData({
            currentVersion: targetVersion,
            latestVersion: targetVersion,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
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
        wx.setNavigationBarTitle({
            title: '版本更新',
        })
        var currentVersion = this.getCurrentVersion()
        var latestVersion = this.getLatestVersion()
        this.setData({
            currentVersion: currentVersion,
            latestVersion: latestVersion
        })
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