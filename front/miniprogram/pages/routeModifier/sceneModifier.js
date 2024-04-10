Page({
    data: {
        scene: {},
        ss: [],
        imgPrefix: getApp().globalData.currentServer + '/backend/images/routes/',
        newScene: {},
        dipPos: 'box'
    },
    onLoad: function (options) {
        let route = getApp().globalData.jumpData.man2modr
        let scenes = wx.getStorageSync('sceneData')
        let idrs = route.Route
        let rs = []
        idrs.forEach((idr) => {
            rs.push(scenes.find((scene) => {
                return scene.Id === idr
            }).Name)
        })
        route.RouteTrans = rs
        this.setData({
            scene: route,
            newScene: route
        })
        let that = this
        setInterval(()=>{
            that.setData({
                scene: wx.getStorageSync('routeData').find(scene => scene.Id == that.data.scene.Id)
            })
        }, 6000)
    },
    onShareAppMessage() {
        return {};
    },
    onButtonSave: function (e) {
        let ss = wx.getStorageSync('sceneData')
        let idrs = this.data.newScene.Route
        console.log(idrs)
        let rs = []
        let fault = false
        idrs.forEach((idr) => {
            let s = ss.find((scene) => { return scene.Id === idr })
            s?rs.push(s.Name):fault=true
        })
        if (fault) {
            return
        }
        this.setData({
            'newScene.RouteTrans': rs
        })
        let scenes = wx.getStorageSync('routeData')
        scenes[scenes.findIndex(scene => scene.Id == this.data.scene.Id)] = this.data.newScene
        wx.setStorageSync('routeData', scenes)
        wx.request({
            url: getApp().globalData.currentServer + ':5000/modifyRouteData',
            method: 'POST',
            data: scenes,
            success(res) {
                console.log(res)
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 1000
                })
                wx.navigateBack({
                    delta: 1
                })
            }
        })
    },
    onButtonRe: function (e) {
        this.setData({
            newScene: this.data.scene
        })
    },
    changeName: function (e) {
        this.setData({
            'newScene.Name': e.detail.value
        })
    },
    changeType: function (e) {
        this.setData({
            'newScene.Time': e.detail.value
        })
    },
    changeRole: function (e) {
        this.setData({
            'newScene.Distance': e.detail.value
        })
    },
    changeDescription: function (e) {
        this.setData({
            'newScene.Description': e.detail.value
        })
    },
    changeStreet: function (e){
        console.log(this.data.newScene.Route)
        let routeString = e.detail.value
        let ss = wx.getStorageSync('sceneData')
        let idrs = this.data.newScene.Route
        let rs = []
        let fault = false
        idrs.forEach((idr) => {
            let s = ss.find((scene) => { return scene.Id === idr })
            s?rs.push(s.Name):fault=true
        })
        this.setData({
            'newScene.RouteTrans': rs,
            'newScene.Route': routeString.split(',')
        })
    },
});