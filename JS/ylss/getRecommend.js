/*************************************

推荐页增加生日显示

**************************************

[rewrite_local]
^https://www\.yaolaoss\.cn/Appapi/ApiHome/getRecommend\.html url script-response-body https://raw.githubusercontent.com/ytywxw/quanx/main/JS/ylss/getRecommend.js

[mitm]
hostname = *.yaolaoss.cn

*************************************/

var body = $response.body;
var json = JSON.parse(body);

// 与 getUserInfo 同款写法：正则字面量 + 函数式 replace。
// 匹配模式固定（任意 hyIncome 值），按响应顺序与 json 数组一一对应，
// 用函数返回每个条目的替换结果，无需动态构造 RegExp。
var idx = 0;
body = body.replace(/"hyIncome":"[^",]*"/g, function (match) {
  var item = json[idx];
  idx++;
  if (item && item.birthday != null && item.hyIncome != null) {
    // 注意用 "\\n"（字面 \n 两字符）：真实换行符在 JSON 字符串中非法
    return '"hyIncome":"' + item.hyIncome + "\\n" + item.birthday + '"';
  }
  return match;
});

$done(body);
