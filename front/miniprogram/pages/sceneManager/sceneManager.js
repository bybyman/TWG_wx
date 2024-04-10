const app = getApp();
Page({
    data: {
        scenes: [],
        routes: [],
        imagePrefix: `${app.globalData.currentServer}/backend/images/scenes/`,
        imagePrefixr: `${app.globalData.currentServer}/backend/images/routes/`,
        manplay: ['block', 'none', 'none'],
    },
    onLoad: function (options) {

        setInterval(() => {
            this.setData({
                scenes: wx.getStorageSync('sceneData'),
                routes: wx.getStorageSync('routeData'),
            })
        }, 1000)
    },
    toSceneModifier: function (e) {
        app.globalData.jumpData.man2mod = 'scene'
        app.globalData.jumpData.man2mods = e.currentTarget.dataset.scene;
        wx.navigateTo({
            url: '/pages/sceneModifier/sceneModifier',
        })
    },
    toRouteModifier: function (e) {
        app.globalData.jumpData.man2mod = 'route'
        app.globalData.jumpData.man2modr = e.currentTarget.dataset.route;

        wx.navigateTo({
            url: '/pages/routeModifier/sceneModifier',
        })
    },
    onShareAppMessage() {
        return {};
    },
    switchManplay: function (e) {
        console.log(e)
        let index = Number(e.currentTarget.dataset.mindex);
        let manplay = ['none', 'none', 'none'];
        manplay[index] = 'block';
        this.setData({
            manplay: manplay,
        })
    }
});