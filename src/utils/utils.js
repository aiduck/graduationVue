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

let utils = {
    formatDate,
    randomId,
    getMapValue,
}
export default utils
