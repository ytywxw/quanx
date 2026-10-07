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

// 仅当 memberday 是标准日期（YYYY-MM-DD）时才加 10 年，避免 "0"（非会员）被误改为 "10"
if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(json.memberday || "")) {
  var year = parseInt(json.memberday, 10) + 10;
  body = body.replace(/memberday":"\d{4}/g, 'memberday":"' + year);
}

$done(body);
