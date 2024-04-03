const app = getApp();

Page({
    data: {
        content: "",
        comment:{},
        comments: [],
        avatarUrl: "",
        imageUrl: ""
    },
    onLoad: function (options) {
        let that = this;
        wx.request({
            url: app.globalData.currentServer + ":5000/getComment",
            method: "GET",
            success: (res)=> {
                console.log(res.data);
                that.setData({
                    comments: res.data.data
                })
            }
        })
        if(wx.getStorageSync("userInfo")){
            that.setData({
                avatarUrl: wx.getStorageSync("userInfo").avatarUrl
            })
        }
        console.log(that.data.avatarUrl);
    },
    onContent: function (e) {
        this.setData({
            content: e.detail.value
        })
    },
    onCancel: function () {
        this.setData({
            content: ""
        })
    },
    onAddImage: function () {

        let that = this;
        wx.chooseImage({
            count: 1,
            success: (res)=> {
                console.log(res);
                let tempFilePath = res.tempFilePaths[0];
                let temimage = wx.getFileSystemManager().readFileSync(tempFilePath, "base64");
                wx.request({
                    url: app.globalData.currentServer + ":5000/publicCommentPhoto",
                    method: "POST",
                    data: {
                        imgPath: temimage
                    },
                    success(res) {
                        console.log(res.data);
                        that.setData({
                            imageUrl: app.globalData.currentServer+'/backend/'+res.data.innerPath
                        })
                        wx.showToast({
                            title: '上传成功',
                        })
                    }
                })
            }
        })


    },
    onConfirm: function () {
        if(!app.checkLogin()){
            return
        }
        let that = this;
        let comment = {
            content: that.data.content,
            time: new Date().toLocaleString(),
            user: wx.getStorageSync("userInfo")

        }
        if(this.data.imageUrl){
            comment.imageUrl = this.data.imageUrl;
            this.setData({
                imageUrl: ""
            })
        }
        let comments = that.data.comments;
        console.log(comments);
        comments.unshift(comment);
        that.setData({
            comments: comments
        })
        wx.request({
            url: app.globalData.currentServer + ":5000/postComment",
            method: "POST",
            data: comments,
            success: (res)=> {
                console.log(res.data);
                that.setData({
                    content: ""
                })
                wx.showToast({
                    title: '评论成功',
                    icon: 'success',
                    duration: 2000
                })
                wx.request({
                    url: app.globalData.currentServer + ":5000/getComment",
                    method: "GET",
                    success: (res)=> {
                        that.setData({
                            comments: res.data.data
                        })
                    }
                })
            }
        })
    }
});