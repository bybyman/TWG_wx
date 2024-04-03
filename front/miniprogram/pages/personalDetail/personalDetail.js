const app = getApp()

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'


Page({
    data: {
        avatarUrl: defaultAvatarUrl,
        theme: wx.getSystemInfoSync().theme,
        userInfo: {},
        nickName: '',
        birthday: '',
        region: '',
        gender: '',
        signature: '',
    },
    onLoad() {
        if(!app.checkLogin()){
            wx.navigateBack()
            return
        }
        wx.onThemeChange((result) => {
            this.setData({
                theme: result.theme
            })
        })
        let userInfo = wx.getStorageSync('userInfo')
        this.setData({
            userInfo: userInfo,
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName,
            birthday: userInfo.birthday,
            region: userInfo.region,
            gender: userInfo.gender,
            signature: userInfo.signature,
        })
    },
    onChooseAvatar(e) {
        const { avatarUrl } = e.detail
        this.setData({
            avatarUrl,
        })
    },
    saveDetail() {

        let userInfo = this.data.userInfo
        let avatar = ''
        if(userInfo.avatarUrl!=this.data.avatarUrl){
            avatar = wx.getFileSystemManager().readFileSync(this.data.avatarUrl, 'base64')
        }
        userInfo.nickName = this.data.nickName ? this.data.nickName : userInfo.nickName
        userInfo.birthday = this.data.birthday ? this.data.birthday : userInfo.birthday
        userInfo.region = this.data.region ? this.data.region : userInfo.region
        userInfo.signature = this.data.signature ? this.data.signature : userInfo.signature
        userInfo.gender = this.data.gender ? this.data.gender : userInfo.gender
        userInfo.avatarUrl = `${app.globalData.currentServer}/backend/images/avatars/${userInfo.openid}.jpg`
        wx.setStorageSync('userInfo', userInfo)
        console.log(userInfo)
        wx.request({
            url: app.globalData.currentServer+':5000/modifyUserData',
            method: 'POST',
            data: {
                userInfo: userInfo,
                avatar: avatar
            },
            success(res) {
                console.log(res)
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 1000,
                })
            }
        })

    },
    changeNickName(e) {
        console.log(e)
        this.setData({
            nickName: e.detail.value
        })
        console.log(this.data.nickName)
    },
    changeBirthday(e) {
        console.log(e)
        this.setData({
            birthday: e.detail.value
        })
    },
    changeRegion(e) {
        console.log(e)
        this.setData({
            region: e.detail.value
        })
    },
    changeGender(e) {
        console.log(e)
        this.setData({
            gender: ['男', '女', '其它'][e.detail.value]
        })
    },
    changeSignature(e) {
        this.setData({
            signature: e.detail.value
        })

    }
})
