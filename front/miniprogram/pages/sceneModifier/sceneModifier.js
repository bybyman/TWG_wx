Page({
    data: {
        scene: {},
        imgPrefix: getApp().globalData.currentServer + '/backend/images/scenes/',
        newScene: {},
        dipPos: 'box'
    },
    onLoad: function (options) {
        this.setData({
            scene: getApp().globalData.jumpData.man2mods,
            newScene: getApp().globalData.jumpData.man2mods,
        })
        let that = this
        setInterval(()=>{
            that.setData({
                scene: wx.getStorageSync('sceneData').find(scene => scene.Id == that.data.scene.Id)
            })
        }, 6000)
    },
    onShareAppMessage() {
        return {};
    },
    onButtonSave: function (e) {
        let scenes = wx.getStorageSync('sceneData')
        scenes[scenes.findIndex(scene => scene.Id == this.data.scene.Id)] = this.data.newScene
        wx.setStorageSync('sceneData', scenes)
        wx.request({
            url: getApp().globalData.currentServer + ':5000/modifySceneData',
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
            'newScene.Type': e.detail.value
        })
    },
    changeRole: function (e) {
        this.setData({
            'newScene.Role': e.detail.value
        })
    },
    changeDescription: function (e) {
        this.setData({
            'newScene.Description': e.detail.value
        })
    },
    changePositionX1: function (e) {
        this.setData({
            'newScene.Position.x[0]': e.detail.value
        })
    },
    changePositionX2: function (e) {
        this.setData({
            'newScene.Position.x[1]': e.detail.value
        })
    },
    changePositionY1: function (e) {
        this.setData({
            'newScene.Position.y[0]': e.detail.value
        })
    },
    changePositionY2: function (e) {
        this.setData({
            'newScene.Position.y[1]': e.detail.value
        })
    },
    changeShortName: function (e) {
        this.setData({
            'newScene.ShortName': e.detail.value
        })
    },
    changeStreet: function (e){
        this.setData({
            'newScene.Street': e.detail.value
        })
    },
    changeAcademy: function (e){
        this.setData({
            'newScene.Academy': e.detail.value
        })
    },
    changePosDisplay: function (e) {
        let dipPos = this.data.dipPos
        if (dipPos == 'box') {
            dipPos = 'none'
        }
        else {
            dipPos = 'box'
        }
        this.setData({
            dipPos: dipPos
        })
    },
});