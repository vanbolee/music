/*
 * 获取URL中的指定参数
 * @param _this {Object} 上下文中的this
 * @param _key {String} 要查询的参数名
 * @return returnObj[_key] {Any} 查询结果
 */
export const urlSearchParam = function(_this, _key) {
  let searchString = _this.props.location.search;
  searchString = searchString.substring(1);
  let searchArr = searchString.split("&");
  let returnObj = {};
  for (let i = 0; i < searchArr.length; i++) {
    let item = searchArr[i].split("=");
    let key = item[0];
    let value = item[1];
    if (!returnObj[key]) {
      returnObj[key] = value;
    }
  }
  return returnObj[_key] || null;
};
