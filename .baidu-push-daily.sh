#!/bin/bash
# ============================================================
#  百度URL推送脚本 - 逐条推送版本
#  说明: 根据踩坑经验，批量推送(多URL一次POST)会触发
#        "over quota"错误，必须一条一条单独POST
#  配额: 每日20条 (2026-06-13 百度后台截图确认)
# ============================================================

set -uo pipefail

cd "/Users/xiaolei/WorkBuddy/2026-05-20-17-03-35/industrial-website/deploy"

QUEUE_FILE=".baidu-url-queue.txt"
LOG_FILE=".baidu-push-log.txt"
API_URL="http://data.zz.baidu.com/urls?site=www.suhengcekong.com&token=hysPuLuaxFUCI6OS"
DATE=$(date +%Y-%m-%d)
PUSH_LIMIT=20  # 百度后台确认每日配额 20

echo "=== 百度URL推送 $DATE (逐条模式) ==="
echo "目标推送: 最多 $PUSH_LIMIT 条"
echo ""

# 提取前N条pending URL
PENDING_URLS=$(grep "| pending |" "$QUEUE_FILE" | head -n "$PUSH_LIMIT" | cut -d'|' -f1 | sed 's/ *$//;s/^ *//')

if [ -z "$PENDING_URLS" ]; then
    echo "✅ 队列无pending URL"
    exit 0
fi

COUNT=0
PUSHED=0
FAILED=0
declare -a SUCCESS_URLS=()
declare -a FAILED_URLS=()

for url in $PENDING_URLS; do
    COUNT=$((COUNT+1))
    echo "[$COUNT] 推送: $url"

    # 单条POST (避免over quota)
    RESPONSE=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: text/plain" \
        --noproxy '*' \
        --connect-timeout 15 \
        --max-time 30 \
        -d "$url" 2>&1)

    echo "    返回: $RESPONSE"

    # 检查是否成功
    if echo "$RESPONSE" | grep -q '"success":1'; then
        PUSHED=$((PUSHED+1))
        SUCCESS_URLS+=("$url")
        echo "    ✅ 成功"
    elif echo "$RESPONSE" | grep -q "over quota"; then
        echo "    ⚠️ 配额耗尽，停止推送"
        FAILED_URLS+=("$url")
        FAILED=$((FAILED+1))
        break
    else
        FAILED=$((FAILED+1))
        FAILED_URLS+=("$url")
        echo "    ❌ 失败"
    fi

    # 检查remain
    REMAIN=$(echo "$RESPONSE" | grep -o '"remain":[0-9]*' | grep -o '[0-9]*' || echo "?")
    echo "    剩余配额: $REMAIN"
    echo ""

    # 防止触发频率限制
    sleep 1
done

echo ""
echo "=== 推送汇总 ==="
echo "✅ 成功: $PUSHED 条"
echo "❌ 失败: $FAILED 条"
echo ""

# 更新队列状态
if [ ${#SUCCESS_URLS[@]} -gt 0 ]; then
    /Users/xiaolei/.workbuddy/binaries/python/versions/3.13.12/bin/python3 << PYEOF
queue_file = '$QUEUE_FILE'
date = '$DATE'
success_urls = '''${SUCCESS_URLS[@]}'''.strip().split()
with open(queue_file, 'r', encoding='utf-8') as f:
    content = f.read()
count = 0
for url in success_urls:
    url = url.strip()
    if url:
        old = url + ' | pending |'
        new = url + ' | submitted | ' + date + ' | success:1'
        if old in content:
            content = content.replace(old, new, 1)
            count += 1
with open(queue_file, 'w', encoding='utf-8') as f:
    f.write(content)
print(f'已标记 {count} 条URL为submitted')
PYEOF
fi

# 记录日志
echo "[$DATE] pushed=$PUSHED failed=$FAILED" >> "$LOG_FILE"

# 输出剩余
REMAINING=$(grep -c "| pending |" "$QUEUE_FILE" 2>/dev/null || echo "0")
echo ""
echo "📊 队列剩余pending: $REMAINING 条"
