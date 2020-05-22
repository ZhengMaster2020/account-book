// 数字不四舍五入仅保留一位小数而且添加上千分位 例：10056422.5601 -> 100，564，22.5

  /**
   * return num.replace(/(?<!\.\d*)\B(?=(\d{3})+(?!\d))/g, ',') 火狐浏览器不支持这种正则前置断言的写法， 既可以为整数添加','，也可以为带有小数添加','
   * return num.replace(/(?=(?!\b)(\d{3})+$)/g, ',') 只支持整数添加','
   * return num.replace(/(\d)(?=(\d{3})+$)/g, '$1,') 只支持整数添加','
   */

  export const numberWithCommas = num => {
    // 如果是整数 补小数点以及两个零
    Number.isInteger(Number(num)) ? num = `${num}.00` : num = num + ''
    // 如果num为带有小数，则保留两位小数
    num = num.lastIndexOf('.') > 0 ? num.substring(0, num.lastIndexOf('.') + 3) : num 
    // 先获取整数部分，添加','，然后为小数部分添加','
    return num.replace(/\d+/, n => n.replace(/(\d)(?=(\d{3})+$)/g, $1 => $1 + ',')) 
  }
  