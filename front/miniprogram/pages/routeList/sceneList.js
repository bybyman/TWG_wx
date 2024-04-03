const app = getApp();
function getRouteByRange(routes, guide) {
    if(guide.name=='time'){
        let time = guide.value;
        return routes.filter((route) => {
            return route.Time > time[0] && route.Time <= time[1];
        })
    }
    else if(guide.name=='distance'){
        let distance = guide.value;
        return routes.filter((route) => {
            return route.Distance > distance[0] && route.Distance <= distance[1];
        })
    }
}
function getRouteByCata(routes, cata) {
    return routes.filter((route) => {
        return route.Theme == cata;
    })
}
Page({
    data: {
        routes: [],
        imagePrefix: `${app.globalData.currentServer}/backend/images/routes/`,
        cataRoutes: [],
        routeShow: [],
        currentShow:{
            name: 'time',
            value: [0, 30],
        }
    },
    onLoad: function (options) {
        let scenes = wx.getStorageSync('sceneData')
        let routes = wx.getStorageSync('routeData')
        routes.forEach((route) => {
            let idrs = route.Route
            let rs = []
            idrs.forEach((idr) => {
                rs.push(scenes.find((scene) => {
                    return scene.Id === idr
                }).Name)
            })
            route.RouteTrans = rs
        })
        this.setData({
            routes: routes,
            cataRoutes: getRouteByCata(routes, '学习'),
            routeShow: routes
        })
    },
    toRouteDetail: function (e) {
        app.globalData.jumpData.map2detailr = e.currentTarget.dataset.route;
        wx.navigateTo({
            url: '/pages/routeDetail/sceneDetail',
        })
    },
    onShareAppMessage() {
        return {};
    },
    switchCurShowName: function (e){
        let curshow = this.data.currentShow
        curshow.name = curshow.name === 'time' ? 'distance' : 'time'
        this.setData({
            currentShow: curshow
        })
    },
    switchRange: function (e){
        let curshow = this.data.currentShow
        curshow.value = [e.currentTarget.dataset.rval1, e.currentTarget.dataset.rval2]
        this.setData({
            currentShow: curshow,
            routeShow: getRouteByRange(this.data.routes, curshow)
        })
    },
    switchCata: function (e){
        let theme = e.currentTarget.dataset.theme
        switch (theme){
            case 'learn':
                this.setData({
                    cataRoutes: getRouteByCata(this.data.routes, '学习')
                })
                break
            case 'sport':
                this.setData({
                    cataRoutes: getRouteByCata(this.data.routes, '运动').concat(getRouteByCata(this.data.routes, '休闲'))
                })
                break
            case 'fun':
                this.setData({
                    cataRoutes: getRouteByCata(this.data.routes, '餐饮').concat(getRouteByCata(this.data.routes, '娱乐'))
                })
                break
        }
    }
});