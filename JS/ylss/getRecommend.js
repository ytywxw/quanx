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

// 字符串级替换（与原版一致），仅修复一处隐患：
// hyIncome 含 . + ( ) 等正则特殊字符时，动态构造的 RegExp 会解析错误
function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

for (var i = 0; i < json.length; i++) {
  var item = json[i];
  if (item.birthday == null || item.hyIncome == null) {
    continue;
  }
  var birthStr = item.birthday;
  var re = new RegExp('"hyIncome":"' + escapeRegExp(item.hyIncome) + '"', "g");
  body = body.replace(re, '"hyIncome":"' + item.hyIncome + " | " + birthStr + '"');
}

$done(body);
