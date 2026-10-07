/*************************************

详情页增加真实姓名显示，生日显示，星座显示，注销账号显示

**************************************

[rewrite_local]
^https://www\.yaolaoss\.cn/Appapi/ApiMain/getUserInfo\.html url script-response-body https://raw.githubusercontent.com/ytywxw/quanx/main/JS/ylss/getUserInfo.js

[mitm]
hostname = *.yaolaoss.cn

*************************************/

var body = $response.body;
var json = JSON.parse(body);

var birthday = json.birthday || "";
var realname = json.realname || "";
var username = json.username || "";

// 生日 + 星座显示：hyzodiac 前拼接 "M月D日 | "
if (birthday && json.hyzodiac) {
  var parts = birthday.split("-");
  if (parts.length >= 3) {
    var birthdayText = parts[1] + "月" + parts[2] + "日 | " + json.hyzodiac;
    body = body.replace(/hyzodiac":"[^",]*/g, 'hyzodiac":"' + birthdayText);
  }
}

// 已注销账号：用户名前加标识，并强制 enable=1；正常账号则追加真实姓名
if (json.enable !== "1") {
  var nameText = "【已注销】" + username + (realname ? "（" + realname + "）" : "");
  body = body.replace(/username":"[^",]*/g, 'username":"' + nameText);
  body = body.replace(/enable":"[^",]*/g, 'enable":"1');
} else if (realname) {
  body = body.replace(/username":"[^",]*/g, 'username":"' + username + "（" + realname + "）");
}

$done(body);
