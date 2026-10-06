/*************************************

去水印

**************************************

[rewrite_local]
笔记详情接口
^https?://edith\.xiaohongshu\.com/api/sns/v2/note/info url script-response-body https://raw.githubusercontent.com/ytywxw/quanx/main/JS/xhs/noWatermark.js
信息流feed接口
^https?://edith\.xiaohongshu\.com/api/sns/v1/feed url script-response-body https://raw.githubusercontent.com/ytywxw/quanx/main/JS/xhs/noWatermark.js

[mitm]
hostname = edith.xiaohongshu.com

*************************************/

let body = $response.body;
if (!body) return $done();
let obj = JSON.parse(body);

// 处理视频
if(obj?.data?.items){
    obj.data.items.forEach(item=>{
        const card = item.note_card;
        if(card?.video?.media?.stream){
            card.video.media.stream.forEach(s=>{
                // 去除水印参数，拿到原始无水印地址
                s.url = s.url.split("?")[0];
            })
        }
        // 处理图片
        if(card?.image_list){
            card.image_list.forEach(img=>{
                img.url = img.url.split("?")[0];
            })
        }
    })
}

// 单条笔记详情
if(obj?.data?.note_card){
    const card = obj.data.note_card;
    if(card?.video?.media?.stream){
        card.video.media.stream.forEach(s=>{
            s.url = s.url.split("?")[0];
        })
    }
    if(card?.image_list){
        card.image_list.forEach(img=>{
            img.url = img.url.split("?")[0];
        })
    }
}
$done({body: JSON.stringify(obj)})