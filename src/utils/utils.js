/**
 * 格式化时间
 * @returns ‘2018-09-10’
 */
function formatDate() {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
    let formatStr = year+ '-' + month + '-' + day;
    return formatStr;
}
/**
 * 随机id
 * @param {*额外定义字符} extreStr
 */
function randomId(extreStr) {
    let date = new Date();
    let dateSrr = date.valueOf();
    let selectChar = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
    let charLen = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < charLen; i ++) {
        let charIndex = Math.floor(Math.random() * 36);
        dateSrr = dateSrr + selectChar[charIndex];
    }
    if(extreStr === undefined){

    } else {
        dateSrr = dateSrr + extreStr;
    }
    return dateSrr;
}
/**
 * Map 转化为 Json字符串
 * @param {*map对象} map 
 */
function mapToJson(map) {
    return JSON.stringify([...map]);
}
/**
 * Json 转化为 Map
 * @param {*json字符串} jsonStr 
 */
function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
}

function getMapValue(jsonStr) {
    jsonToMap(jsonStr)
}

/**
 * 数组相减
 * @param {*原来数组} old 
 * @param {*要减去的数组} minus 
 */
function arrMinus(old,minus) {
    var oldArr = old;
    var minusArr = minus;
    var newArr = [];
    oldArr.map(Olditem => { 
        let isRepeat = minusArr.findIndex(minusItem => Olditem === minusItem);
        if(isRepeat > -1) delete minusArr[isRepeat];
        else newArr.push(Olditem)
    });
    return newArr;
}
/**
 * 清空对象
 * @param {*原对象} object 
 */
function resetObject(object) {
    let o = object;
    let r = {}
    for (var key in o) {
        console.log(key);
        r[key] = ''
    }
    console.log(r);
    return r
}

/** 筛选真正的路由对象 */
function recursionRouter(userRouter = [], allRouter = []) {
    var realRoutes = []
    allRouter.forEach((v, i) => {
        userRouter.forEach((item, index) => {
            if (item.path === v.path) {
                // 这边是处理侧边栏到child元素的 （递归处理）
                if (item.children && item.children.length > 0) {
                    v.children = recursionRouter(item.children, v.children)
                }
                realRoutes.push(v);
            }
        })
    })
    return realRoutes
}

/**
 *
 * @param {Array} routes 用户过滤后的路由
 *
 * 递归为所有有子路由的路由设置第一个children.path为默认路由
 */
function setDefaultRoute(routes) {
    routes.forEach((v, i) => {
        if (v.children && v.children.length > 0) {
            v.redirect = { name: v.children[0].name }
            setDefaultRoute(v.children)
        }
    })
}



let utils = {
    formatDate,
    randomId,
    getMapValue,
    arrMinus,
    resetObject,
    recursionRouter,
    setDefaultRoute,
}
export default utils
