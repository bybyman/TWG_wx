const app = getApp();
function getSceneByCata(routes, cata) {
    return routes.filter((route) => {
        return route.Role == cata;
    })
}
Page({
    data: {
        scenes: [],
        imagePrefix: `${app.globalData.currentServer}/backend/images/scenes/`,
        cataScenes: [],
        defaultData:{"title": "景点信息"},
    },

    onLoad: function (options) {
        let scenes = wx.getStorageSync('sceneData')
        scenes.forEach((scene)=>{
            if(scene.Academy) {
                scene.MAcademy = scene.Academy.split('、')[0]
            }
        })
        this.setData({
            scenes: scenes,
            cataScenes: getSceneByCata(scenes, '食堂').concat(getSceneByCata(scenes, '娱乐'))
        })
        console.log(this.data.cataScenes)
    },
    toSceneDetail: function (e) {
        app.globalData.jumpData.map2detail = e.currentTarget.dataset.scene;
        wx.navigateTo({
            url: '/pages/sceneDetail/sceneDetail',
        })
    },
    onShareAppMessage() {
        return {};
    },
    getMainAcademy: function (e) {
        console.log(e)
        let Academys = e.split('、')
        return Academys[0]
    },
    switchT: function (e) {

        switch (e.currentTarget.dataset.tc) {
            case '0':
                this.setData({
                    cataScenes: getSceneByCata(this.data.scenes, '食堂').concat(getSceneByCata(this.data.scenes, '娱乐'))
                })
                break;
            case '1':
                this.setData({
                    cataScenes: getSceneByCata(this.data.scenes, '休闲').concat(getSceneByCata(this.data.scenes, '运动'))
                })
                break;
            case '2':
                this.setData({
                    cataScenes: getSceneByCata(this.data.scenes, '学习')
                })
                break;
        }

    }
});