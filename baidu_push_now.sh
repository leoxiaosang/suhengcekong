#!/bin/bash
TOKEN="hysPuLuaxFUCI6OS"
SITE="www.suhengcekong.com"
QUEUE="/Users/xiaolei/WorkBuddy/2026-05-20-17-03-35/industrial-website/deploy/.baidu-url-queue.txt"

count=0
fail=0
remain_quota=999

while IFS='|' read -r url status date result rest; do
    [[ "$url" =~ ^#.*$ ]] && continue
    [[ -z "$url" ]] && continue
    url=$(echo "$url" | xargs)

    [[ "$status" != *"pending"* ]] && continue

    response=$(curl -sk -X POST "https://data.zz.baidu.com/urls?site=$SITE&token=$TOKEN" -H "Content-Type: text/plain" -d "$url")
    echo "[$count] $url"
    echo "    → $response"

    if echo "$response" | grep -q '"success"'; then
        sed -i.bak "s|$url | pending | | |$url | submitted | 2026-07-03 | success | |" "$QUEUE"
        count=$((count+1))
        remain_quota=$(echo "$response" | python3 -c "import json,sys; print(json.loads(sys.stdin.read()).get('remain', 0))" 2>/dev/null || echo "?")
    else
        fail=$((fail+1))
    fi

    if [ "$remain_quota" = "0" ] || [ "$remain_quota" = "1" ]; then
        echo "配额将耗尽 (remain=$remain_quota),停止"
        break
    fi
    sleep 1
done < "$QUEUE"

rm -f "$QUEUE.bak"
echo ""
echo "=== 推送完成: 成功 $count / 失败 $fail, 剩余配额 $remain_quota ==="
