const app = getApp()

Page({
    data: {
        defaultData: {"title": "景点识别"},
        imgPath: '/images/recogDefault.png',
        nowImPath: '/images/recogDefault.png',
        scene: {},
        sceneName: '',
        sceneDesc: '',
        sceneRole: '教学区',
        sceneSName: '无',
        sceneComment: '暂无',
        sceneAcademy: '无',
        sceneMInfo: '暂无',
        displayMain: 'none',
        displaySub: 'flex',
        buttonName: '上传图片',
        buttonMethod: 'onChooseImg',
        scenes: [],

    },
    onLoad: function (options) {
        let that = this
        wx.setNavigationBarTitle({
            title: '校园场景识别'
        })
        this.setData({
            scenes: wx.getStorageSync('sceneData')
        })
        console.log(this.data.scenes)
        console.log(app.globalData.sceneData)

    },
    onRecognition: function () {
        let loadBar = setInterval(() => {
            wx.showLoading({
                'title': '正在识别中......',
                'mask': true,
                'duration': 1000
            })
        }, 1000);
        let that = this
        wx.request({
            url: app.globalData.currentServer+':5000/onRecognition',
            method: 'POST',
            timeout: 1000000,
            data: {
                imgPath: that.data.imgPath
            },
            success: function (res) {
                console.log(res.data)
                let Id = res.data.data
                let index = that.data.scenes.findIndex(item => item.Id == Id)
                console.log(index)
                that.setData({
                    scene: that.data.scenes[index],
                    sceneName: that.data.scenes[index].Name,
                    sceneDesc: that.data.scenes[index].Description,
                    sceneRole: that.data.scenes[index].Role,
                    sceneSName: that.data.scenes[index].ShortName,
                    sceneComment: that.data.scenes[index].Type,
                    sceneAcademy: that.data.scenes[index].Academy,
                    sceneMInfo: that.data.scenes[index].Street,
                    displayMain: 'flex',
                    displaySub: 'none',
                    imgPath: wx.getStorageSync('tempFilePaths')[0],
                    buttonName: '查看详情',
                    buttonMethod: 'showInMap',
                })
                clearInterval(loadBar)
                wx.showToast({
                    title: '识别成功',
                    duration: 2000
                })
            },
            fail(res) {
                console.log(res)
                clearInterval(loadBar)
                wx.showToast({
                    title: '识别失败',
                    duration: 2000
                })
            }
        })
    },
    onChooseImg: function () {
        let that = this
        wx.chooseImage({
            success (res) {
                const tempFilePaths = res.tempFilePaths
                //将选择到的图片缓存到本地storage中
                wx.setStorageSync('tempFilePaths', tempFilePaths)


                let team_image = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")

                that.setData({
                    imgPath: team_image,
                    nowImPath: tempFilePaths[0],
                })
                console.log(tempFilePaths[0])
                that.onRecognition()
            }
        })
    },
    onButton: function () {
        if (this.data.buttonMethod == 'onChooseImg') {
            this.onChooseImg()
        }
        else {
            this.showInMap()
        }
    },
    showInMap: function () {
        app.globalData.jumpData.map2detail = this.data.scene
        wx.navigateTo({
            url: '../sceneDetail/sceneDetail',
        })
    }
})