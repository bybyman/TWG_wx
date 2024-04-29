// index.js
// 获取应用实例
const app = getApp()

Page({
    data: {
        sceneData:[
          {
            "img": "http://47.99.147.35:8081/images/taijisquare.jpg",
            "title": "太极广场",
            "content": "太极广场，击鼓纳福，挥挥手打卡吧~"
          },
          {
            "img": "http://47.99.147.35:8081/images/goodwind.jpg",
            "title": "好风徐来",
            "content": "好风徐来，水波不兴，心随风动，风随心舞,比个耶打卡吧~"
          },
          {
            "img": "http://47.99.147.35:8081/images/zhangjiang.jpg",
            "title": "章江晓渡",
            "content": "章江晓渡，一叶扁舟摇曳在晨曦的熹微之中，挥挥手打卡吧～"
          },
        ],
        province: '江西省',
        step: '0',
        city: '南昌市',
        strict: '南昌县',
        location: [0, 0],
        temperature: '',
        weatherIcon: '',
        weatherText: '',
        humidity: '',
        windDirection: '',
        windSpeed: '',
        pressure: '',
        dateFormat: '',
        timeFormat: '',
        wApiKey: '68f216a0793a449b9e4c8f857d4c5849',
        defaultData: {"title": "滕王阁景区智慧导览","back": "none"}
    },
    goDetail: function(e) {
      wx.navigateTo({
        url: '/pages/Space-detail/Space-detail?index=' + e.currentTarget.dataset.id,
      })
    },
    getCityLatLon: function (city) {
        const that = this;
        wx.request({
            url: `https://geoapi.qweather.com/v2/city/lookup?key=${this.data.wApiKey}&location=` + that.data.city,
            success: function (res) {
                const data = res.data;
                console.log(data);
                if (data.code === '200') {
                    const location = data.location[0];
                    that.setData({
                        location: [location.lon, location.lat]
                    });
                } else {
                    wx.showToast({
                        title: '获取城市信息失败',
                        icon: 'none'
                    });
                }
            }
        })
    }
    ,
    getWeatherData: function (location) {
        const that = this;

        wx.request({
            url: `https://devapi.qweather.com/v7/weather/now?key=${this.data.wApiKey}&location=${location}`,
            success: function (res) {
                const data = res.data;

                if (data.code === '200') {
                    const now = data.now;
                    console.log(now)
                    that.setData({
                        temperature: now.temp,
                        weatherIcon: `${app.globalData.currentServer}/backend/images/weathers/${now.icon}.svg`,
                        // weatherIcon: `/images/windy.png`,
                        // weatherIcon: `cloud://cloud1-7go4ua0t2f84cb40.636c-cloud1-7go4ua0t2f84cb40-1314166671/weathers/${now.icon}.svg`,
                        weatherText: now.text,
                        humidity: now.humidity,
                        windDirection: now.windDir,
                        windSpeed: now.windSpeed,
                        pressure: now.pressure
                    });
                } else {
                    wx.showToast({
                        title: '获取天气失败',
                        icon: 'none'
                    });
                }
            },
            fail: function () {
                wx.showToast({
                    title: '获取天气失败',
                    icon: 'none'
                });
            }
        });
    }
    ,
    // 事件处理函数
    bindViewTap() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad() {
        let that = this
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                console.log(res);
                let longitude = res.longitude;
                let latitude = res.latitude;
                if(longitude<116.025828||longitude>116.03823||latitude<28.6736||latitude>28.683916){
                    longitude=116.031509
                    latitude=28.679199
                }
                that.setData({
                    location: [longitude, latitude],
                });
                that.getWeatherData([longitude, latitude]);
            },
            fail(res) {
                console.log(res);
            }
        })

        setInterval(function () {
            var now = new Date();
            that.setData({
                dateFormat: now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日',
                timeFormat: now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ':' + now.getSeconds().toString().padStart(2, '0')
            });
        }, 1000);
    },
    toPerson: () => {
        wx.showToast({
            title: '该功能正在开发中',
            icon: 'none',
        })
    },
    toImageProcess: () => {
        wx.navigateTo({
            url: '/pages/DIP/index/index'
        })
    },
    toOtherTools: () => {
        wx.navigateTo({
            url: '/pages/AIGen/index/index'
        })
    },
    toAward: () => {
        wx.navigateTo({
            url: '/pages/award/award',
        })
    },
    onWRefresh: function () {
        this.getWeatherData(this.data.location);
        wx.showToast({
            title: '更新成功',
            icon: 'none'
        })
    }
})
