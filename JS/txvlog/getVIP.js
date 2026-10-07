/*************************************

解锁会员

**************************************

[rewrite_local]
^https?:\/\/((?:[a-z]+\.)?tx\w+\.com)\/(txapi\/(?:user\/info|system\/info|movie\/(?:detail|navBlock|navFilter|blockDetail|similarSearch))) url script-analyze-echo-response https://txscript.pages.dev/tx/qx.js

[mitm]
hostname = *.txxkl7s60j.com, *.tx6cyknm46.com, *.txui3fvxr2.com, *.tx3it6zzx8.com, *.txwnxvha73.com, *.txfdnb0xib.com, *.txqv37xp3c.com, *.txgwp6d7vl.com, *.txsvlcr8yl.com, *.txl83dbwq1.com, txxkl7s60j.com, tx6cyknm46.com, txui3fvxr2.com, tx3it6zzx8.com, txwnxvha73.com, txfdnb0xib.com, txqv37xp3c.com, txgwp6d7vl.com, txsvlcr8yl.com, txl83dbwq1.com

*************************************/

const StatusTexts = {
  200: "OK", 400: "Bad Request", 403: "Forbidden", 404: "Not Found",
  500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable",
};

const requestUrl = $request.url;
const requestHeaders = Object.assign({}, $request.headers || {});

// 移除逐跳头字段（大小写不敏感），避免干扰 Worker 转发
for (const key of Object.keys(requestHeaders)) {
  const lower = key.toLowerCase();
  if (lower === "host" || lower === "content-length") {
    delete requestHeaders[key];
  }
}

const requestMethod = $request.method || "GET";

// 原始 URL → Worker 路由
const match = requestUrl.match(/^https?:\/\/([^/?#]+)(\/[^?#]*)?(\?.*)?/);
const workerBase = "https://txscript.pages.dev/tx";
const targetUrl = match
  ? `${workerBase}/${match[1]}${match[2] || ""}${match[3] || ""}`
  : requestUrl;

const options = {
  url: targetUrl,
  method: requestMethod,
  headers: requestHeaders,
  timeout: 15000,
};

// QX 二进制请求体必须用 bodyBytes (ArrayBuffer)
if (typeof $request.bodyBytes !== "undefined" && $request.bodyBytes instanceof ArrayBuffer) {
  options.bodyBytes = $request.bodyBytes;
} else if ($request.body) {
  options.body = $request.body;
}

$task.fetch(options).then(
  (response) => {
    const code = response.statusCode || 200;
    const cleanHeaders = {};
    for (const k in response.headers || {}) {
      if (!["content-encoding", "content-length", "transfer-encoding"].includes(k.toLowerCase())) {
        cleanHeaders[k] = response.headers[k];
      }
    }
    const ct = (response.headers?.["Content-Type"] || response.headers?.["content-type"] || "").split(";")[0];
    const isBinary = ct === "application/octet-stream";
    const result = {
      status: `HTTP/1.1 ${code} ${StatusTexts[code] || "OK"}`,
      headers: cleanHeaders,
    };
    // QX 二进制响应通过 bodyBytes 返回
    if (isBinary && response.bodyBytes) {
      result.bodyBytes = response.bodyBytes;
    } else {
      result.body = response.body;
    }
    $done(result);
  },
  (reason) => {
    console.log("[TX] Worker fetch error:", reason);
    $done({
      status: "HTTP/1.1 500 Internal Server Error",
      headers: { "content-type": "text/plain" },
      body: "Worker request failed: " + String(reason),
    });
  }
);
