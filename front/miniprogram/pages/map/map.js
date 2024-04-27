const app = getApp();
let QMWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk = new QMWX({
    key: 'B4YBZ-3LG3Q-KDA54-4LQIQ-7QUUH-FIFSP'
});
function isPointInPolygon(point, polygon) {
    let x = point[0], y = point[1]
    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][0], yi = polygon[i][1];
        let xj = polygon[j][0], yj = polygon[j][1];

        let intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径，单位为千米
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000;
    return distance;
}
function getRouteRecursive(polypoints, sfpolypoints, i, that) {
    if (i < polypoints.length - 1) {
        let spp = []
        qqmapsdk.direction({
            mode: 'walking',
            from: polypoints[i],
            to: polypoints[i + 1],
            success: function (res) {
                console.log(res)
                let coors = res.result.routes[0].polyline
                for (let j = 2; j < coors.length; j++) {
                    coors[j] = coors[j - 2] + coors[j] / 1000000
                }
                for (let j = 0; j < coors.length; j += 2) {
                    sfpolypoints.push({
                        latitude: coors[j],
                        longitude: coors[j + 1]
                    })
                    spp.push({
                        latitude: coors[j],
                        longitude: coors[j + 1]
                    })
                }
                console.log(sfpolypoints)
                that.setData({
                    polyline: [{
                        points: sfpolypoints,
                        color: '#009DFF',
                        width: 8,
                        dottedLine: false,
                        arrowLine: true,
                    }],
                })
                that.mapCtx.moveAlong({
                    markerId: 11,
                    path: spp,
                    duration: 2000,
                    autoRotate: true,
                    success(res) {
                        console.log(res)
                        getRouteRecursive(polypoints, sfpolypoints, i + 1, that)
                    },
                    fail(res) {
                        console.log(res)
                    }
                })

            },
            fail: function (res) {
                console.log(res)
            }
        })
    }
}
function buildRouteMarker(lon, lat, id, name) {
    return {
        id: id,
        longitude: lon,
        latitude: lat,
        width: 15,
        height: 25,
        callout: {
            content: name,
            color: '#000000',
            fontSize: 10,
            borderRadius: 10,
            bgColor: '#ffffff',
            padding: 1,
            display: 'ALWAYS',
        }
    }
}
Page({
    data: {
        defaultData: {"title": "地图检索"},
        longitude: 115.88108357697297,
        latitude: 28.681423286549734,
        scale: 18,
        markers: [],
        showDetailCard: false,
        cardName: '',
        cardPhoto: '',
        destDist: 0,
        scenes: [],
        showDropdown: false,
        dropdownOptions: [],
        searchValue: '',
        scene: {},
        polyline: [],
        clickPos: [116.031509, 28.679199],
        mPoints: [],
        lm: 'l'
    },

    onLoad: function (options) {
        this.mapCtx = wx.createMapContext('map');
        this.setData({
            scenes: wx.getStorageSync('sceneData')
        })
        function showOutRangeInfo() {
            wx.showToast({
                title: '检测到您的不在景区周边，已为您切换到景区位置',
                icon: 'none',
                duration: 500,
            })
        }
        let that = this;
        let markers = this.data.markers;
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                console.log(res);
                let longitude = res.longitude;
                let latitude = res.latitude;
                if(longitude<115.87702635135315||longitude>115.88420788735982||latitude<28.677756335938636||latitude>28.685748932064527){
                    showOutRangeInfo()
                }else {
                    that.setData({
                        longitude: longitude,
                        latitude: latitude,
                    });
                }
                that.setData({
                    markers: markers,
                });
            },
            fail(res) {
                console.log(res);
            }
        })
        if(app.globalData.jumpData.scene2map!=null){
            this.setData({
                clickPos: app.globalData.jumpData.scene2map.Center
            })
            this.dispSpecifcScene(app.globalData.jumpData.scene2map)
            this.goClick()
            app.globalData.jumpData.scene2map=null
        }
        if(app.globalData.jumpData.routeD2map){
            let mid = 50;
            let route=app.globalData.jumpData.routeD2map
            let passScenes = []
            let polypoints = []
            let sfpolypoints = []
            let firstScene = that.data.scenes.find((scene) => scene.Id == route.Route[0])
            markers.push({
                id: 11,
                longitude: firstScene.Center[0],
                latitude: firstScene.Center[1],
                width: 15,
                height: 25,
                iconPath: '/images/MOUNTAIN.png',
            })
            route.Route.forEach((sceneId) => {
                let fscene = that.data.scenes.find((scene) => scene.Id == sceneId)
                console.log(fscene)
                passScenes.push(fscene)
                polypoints.push({
                    longitude: fscene.Center[0],
                    latitude: fscene.Center[1]
                })
                markers.push(buildRouteMarker(fscene.Center[0], fscene.Center[1], mid++, fscene.Name))
            })
            getRouteRecursive(polypoints, sfpolypoints, 0, that)
            this.setData({
                cardName: route.Name,
                cardPhoto: `${app.globalData.currentServer}/backend/routes/${route.Id}.jpg`,
                destDist: route.Time + ' 分钟' + route.Distance,
                markers: markers
            })
            app.globalData.jumpData.routeD2map=null
        }


    },
    onShow: function () {
        let markers = this.data.markers;
        let that = this;

    },
    handleMapTap(e) {
        let lon = e.detail.longitude;
        let lat = e.detail.latitude;
        console.log(lon, lat)
        let markers = this.data.markers;
        let m3 = markers.findIndex((marker) => marker.id == 3)
        if (m3 != -1) {
            markers[m3] = {
                id: 3,
                longitude: lon,
                latitude: lat,
                width: 15,
                height: 25,
                iconPath: '/images/WATERFALL.png',
            }
        }else {
            markers.push({
                id: 3,
                longitude: lon,
                latitude: lat,
                width: 15,
                height: 25,
                iconPath: '/images/WATERFALL.png',
            })
        }
        this.setData({
            clickPos: [lon, lat],
            markers: markers,
        })
        let scene = this.Pos2Arch(lon, lat);
        this.setCard(scene);
    },
    Pos2Arch: function (x, y){
        for (let i = 0; i < this.data.scenes.length; i++) {
            let scene = this.data.scenes[i];
            if (isPointInPolygon([x, y], scene.Position)) {
                return scene;
            }
        }
        return null;
    },
    setCard: function (scene) {
        this.setData({
            cardName: scene.Name,
            cardPhoto: `${app.globalData.currentServer}/backend/images/scenes/${scene.Id}.jpg`,
            destDist: getDistance(this.data.latitude, this.data.longitude, scene.Position.y[0], scene.Position.x[0]).toFixed(2)
        })
        this.setData({
            showDetailCard: true,
            scene: scene
        })
    },
    handleSearchInput: function (e) {
        let value = e.detail.value;
        console.log(value);
        if(value==''){
            return
        }
        let options = [];
        for (let i = 0; i < this.data.scenes.length; i++) {
            let scene = this.data.scenes[i];
            if (scene.Name.includes(value)) {
                options.push(scene.Name);
            }
        }
        console.log(options);
        this.setData({
            dropdownOptions: options,
            showDropdown: true,
        })
    },
    dispSearch: function (event){
        let name = event.currentTarget.id;
        console.log(event)
        console.log(name);
        let scene = this.data.scenes.find((scene) => scene.Name == name);
        console.log(scene);
        this.dispSpecifcScene(scene);
    },
    dispSpecifcScene: function (scene){
        this.setCard(scene);
        let markers = this.data.markers;
        let newMarker = {
            id: markers.length,
            longitude: scene.Center[0],
            latitude: scene.Center[1],
            width: 15,
            height: 25,
            callout: {
                content: scene.Name,
                color: '#000000',
                fontSize: 14,
                borderRadius: 10,
                bgColor: '#ffffff',
                padding: 10,
                display: 'ALWAYS',
            }
        }
        markers[0]=newMarker;
        this.setData({
            markers: markers,
        })
    },
    toSceneDetail: function () {
        app.globalData.jumpData.map2detail = this.data.scene;
        wx.navigateTo({
            url: '../sceneDetail/sceneDetail',
        })
    },
    onUnload: function () {
        this.setData({
            markers: [],
            polyline: []
        })
    },
    goClick: function () {
        let that = this;
        let markers = this.data.markers;
        let polypoints = [
            {
            longitude: this.data.longitude,
            latitude: this.data.latitude
        },
            {
                longitude: this.data.clickPos[0],
                latitude: this.data.clickPos[1]
            }]
        markers.push({
            id: 102,
            longitude: this.data.longitude,
            latitude: this.data.latitude,
            width: 15,
            height: 25,
            iconPath: `/images/MOUNTAIN.png`,
        })
        this.setData({
            markers: markers,

        })
        let sfpolypoints = []
        sfpolypoints.push({
            longitude: this.data.longitude,
            latitude: this.data.latitude
        })
        qqmapsdk.direction({
            mode: 'walking',
            from: polypoints[0],
            to: polypoints[1],
            success: function (res) {
                console.log(res)
                let coors = res.result.routes[0].polyline
                for (let i = 2; i < coors.length; i++) {
                    coors[i] = coors[i - 2] + coors[i] / 1000000
                }
                for (let i = 0; i < coors.length; i += 2) {
                    sfpolypoints.push({
                        latitude: coors[i],
                        longitude: coors[i + 1]
                    })
                }
                console.log(sfpolypoints)
                that.setData({
                    polyline: [{
                        points: sfpolypoints,
                        color: '#009DFF',
                        width: 8,
                        dottedLine: false,
                        arrowLine: true,
                    }],
                })
                that.mapCtx.moveAlong({
                    markerId: 102,
                    path: sfpolypoints,
                    duration: 5000,
                    autoRotate: true,
                    success(res) {
                        console.log(res)
                    },
                    fail(res) {
                        console.log(res)
                    }
                })

            }
        })
    },
    handleMapTapm: function (e) {
        console.log(e)
        let lon = e.detail.longitude;
        let lat = e.detail.latitude;
        let mPoints = this.data.mPoints;
        let markers = this.data.markers;
        let polyline = this.data.polyline;
        mPoints.push({
            longitude: lon,
            latitude: lat
        })
        markers.push({
            id: markers.length,
            longitude: lon,
            latitude: lat,
            width: 15,
            height: 25,
            iconPath: '/images/FOREST.png',
        })
        this.setData({
            mPoints: mPoints,
            markers: markers
        })
        if(mPoints.length>1){

            polyline.push({
                points: [mPoints[mPoints.length-2],mPoints[mPoints.length-1]],
                color: "rgb(0,157,255)",
                width: 4,
                dottedLine: false,
                arrowLine: false,
            })
            markers.push({
                id: markers.length,
                longitude: (mPoints[mPoints.length-2].longitude+mPoints[mPoints.length-1].longitude)/2,
                latitude: (mPoints[mPoints.length-2].latitude+mPoints[mPoints.length-1].latitude)/2,
                width: 0,
                height: 0,
                iconPath: '',
                callout: {
                    content: getDistance(mPoints[mPoints.length-2].latitude,mPoints[mPoints.length-2].longitude,mPoints[mPoints.length-1].latitude,mPoints[mPoints.length-1].longitude).toFixed(2)+'m',
                    color: '#000000',
                    fontSize: 10,
                    borderRadius: 10,
                    bgColor: '#ffffff',
                    padding: 1,
                    display: 'ALWAYS',
                }
            })
            this.setData({
                polyline: polyline,
                markers: markers
            })
        }
    },
    handleMapTapMain: function (e) {
        if(this.data.lm=='l'){
            this.handleMapTap(e)
        }else{
            this.handleMapTapm(e)
        }
    },
    mclick: function () {
        this.setData({
            lm: 'm',
            mPoints: [],
            polyline: [],
            markers: []
        })
    },
    lclick: function () {
        this.setData({
            lm: 'l',
            mPoints: [],
            polyline: [],
            markers: []
        })
    }

});