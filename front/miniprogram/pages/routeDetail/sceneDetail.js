const app = getApp();

Page({
    data: {
        scene: {},
        dividorMargin: '70rpx',
        showBars: [1, 0, 0, 0],
        dividorMargins: ['70rpx', '250rpx', '430rpx', '590rpx'],
        image: '',
        photos: [],
        crossAxisCount: 4,
        crossAxisGap: 8,
        mainAxisGap: 4,
    },
    onLoad: function (options) {
        console.log(app.globalData.jumpData.map2detailr)
        let that = this

        if(app.globalData.jumpData.map2detailr) {
            this.setData({
                scene: app.globalData.jumpData.map2detailr
            })
            app.globalData.jumpData.map2detailr = null;
        }
        this.setData({
            image: `${app.globalData.currentServer}/backend/images/routes/${this.data.scene.Id}.jpg`
        })
        wx.request({
            url: `${app.globalData.currentServer}:5000/getRoutePhotos`,
            method: 'POST',
            data: {
                Id: this.data.scene.Id
            },
            success(res) {
                that.setData({
                    photos: res.data.data
                })
            }
        })
    },
    switchBars: function (e){
        console.log(e)
        let id = Number(e.currentTarget.id)
        let showBars = [0, 0, 0, 0]
        showBars[id] = 1
        this.setData({
            dividorMargin: this.data.dividorMargins[id],
            showBars: showBars
        })
    },
    seeInMap: function (e) {
        app.globalData.jumpData.routeD2map = this.data.scene
        wx.navigateTo({
            url: '../map/map',
        })
    },
    publishComment: function () {
        if(!app.checkLogin()) {
            return;
        }
        let that = this
        wx.showModal({
            title: '输入您的评论',
            content: '',
            editable: true,
            success: function (res) {
                if (res.confirm) {
                    let scene = that.data.scene
                    let scenes = wx.getStorageSync('routeData')
                    let sid = scenes.findIndex((item) => {
                        return item.Id == scene.Id
                    })
                    let comment = {
                        time: new Date().toLocaleString(),
                        user: wx.getStorageSync('userInfo'),
                        content: res.content
                    }
                    if(!scene.Comments){
                        scene.Comments = [comment]
                    }else {
                        scene.Comments.push(comment)
                    }
                    scenes[sid] = scene
                    wx.setStorageSync('routeData', scenes)
                    that.setData({
                        scene: scene
                    })
                    wx.request({
                        url: `${app.globalData.currentServer}:5000/modifyRouteData`,
                        method: 'POST',
                        data: scenes,
                        success(res) {
                            console.log(res)
                            wx.showToast({
                                title: '发表成功',
                                icon: 'success',
                                duration: 1000
                            })
                        }
                    })
                }
            }
        })
    }
});