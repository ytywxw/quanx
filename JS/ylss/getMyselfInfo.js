/*************************************

解锁会员

**************************************

[rewrite_local]
^https://www\.yaolaoss\.cn/Appapi/ApiMyself/getMyselfInfo\.html url script-response-body https://raw.githubusercontent.com/ytywxw/quanx/main/JS/ylss/getMyselfInfo.js

[mitm]
hostname = *.yaolaoss.cn

*************************************/

var body = $response.body;
var json = JSON.parse(body);

// 将用户等级强制设为 3（\d+ 兼容多位数字）
body = body.replace(/userrank":"\d+/g, 'userrank":"3');

// 会员到期日加 10 年：与原版一致，memberday 非空即处理
// （仅补充了 undefined 保护：原代码 memberday 缺失时会崩溃）
if (json.memberday) {
  var year = parseInt(json.memberday.split("-")[0], 10) + 10;
  body = body.replace(/memberday":"\d+/g, 'memberday":"' + year);
}

$done(body);
