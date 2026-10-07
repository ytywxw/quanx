/*************************************

推荐页增加生日显示

**************************************

[rewrite_local]
^https://www\.yaolaoss\.cn/Appapi/ApiMain/getRecommend\.html url script-response-body https://raw.githubusercontent.com/ytywxw/quanx/main/JS/ylss/getRecommend.js

[mitm]
hostname = *.yaolaoss.cn

*************************************/

var body = $response.body;
var json = JSON.parse(body);

// 直接修改 JSON 对象再序列化，替代动态正则替换
// （原方案 hyIncome 含正则特殊字符时会导致匹配错误，且相同值的条目会相互干扰）
for (var i = 0; i < json.length; i++) {
  var item = json[i];
  if (item.birthday && item.hyIncome != null) {
    item.hyIncome = item.hyIncome + " | " + item.birthday;
  }
}

$done(JSON.stringify(json));
