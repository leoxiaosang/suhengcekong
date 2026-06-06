#!/bin/bash
# ============================================================
#  百度站长平台 URL 自动推送脚本 - 苏衡测控
#  用途: 从 .baidu-url-queue.txt 取 pending URL 批量提交
#  调用: bash .baidu-push.sh [数量]  (默认10条)
# ============================================================

set -euo pipefail

cd "$(dirname "$0")"

# 加载配置
source .baidu-push-config

BATCH_SIZE=${1:-$DAILY_QUOTA}
QUEUE_FILE=".baidu-url-queue.txt"
LOG_FILE=".baidu-push-log.txt"
DATE=$(date +%Y-%m-%d)

echo "=== 百度URL推送 $DATE ==="
echo "批次大小: $BATCH_SIZE"
echo ""

# 提取 pending URL（最多 BATCH_SIZE 条）
PENDING_URLS=$(grep "| pending |" "$QUEUE_FILE" | head -n "$BATCH_SIZE" | cut -d'|' -f1 | tr '\n' '\n')

if [ -z "$PENDING_URLS" ]; then
    echo "✅ 所有URL已提交完成，无需推送"
    exit 0
fi

URL_COUNT=$(echo "$PENDING_URLS" | wc -l | tr -d ' ')
echo "📤 准备推送 $URL_COUNT 条URL..."
echo ""

# 调用百度 API
RESPONSE=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: text/plain" \
    --noproxy '*' \
    --connect-timeout 15 \
    --max-time 30 \
    -d "$PENDING_URLS" 2>&1)

echo "API返回: $RESPONSE"
echo ""

# 解析结果
SUCCESS=$(echo "$RESPONSE" | grep -o '"success":[0-9]*' | head -1 | grep -o '[0-9]*' || echo "0")
REMAIN=$(echo "$RESPONSE" | grep -o '"remain":[0-9]*' | head -1 | grep -o '[0-9]*' || echo "0")

# 如果成功，更新队列状态为 submitted
if echo "$RESPONSE" | grep -q '"success":[1-9]'; then
    # 将本次提交的URL标记为 submitted (用Python替代sed，避免macOS兼容性问题)
    PENDING_LIST=$(grep "| pending |" "$QUEUE_FILE" | head -n "$URL_COUNT" | cut -d'|' -f1)
    if [ -n "$PENDING_LIST" ]; then
        /Users/xiaolei/.workbuddy/binaries/python/versions/3.13.12/bin/python3 -c "
import sys
queue_file = '$QUEUE_FILE'
date = '$DATE'
success = '$SUCCESS'
urls = '''$PENDING_LIST'''.strip().split('\n')
with open(queue_file, 'r', encoding='utf-8') as f:
    content = f.read()
for url in urls:
    url = url.strip()
    if url:
        old = url + ' | pending |'
        new = url + ' | submitted | ' + date + ' | success:' + success
        content = content.replace(old, new, 1)
with open(queue_file, 'w', encoding='utf-8') as f:
    f.write(content)
print(f'Marked {len([u for u in urls if u.strip()])} URLs as submitted')
"
    fi

    echo "✅ 成功推送 $SUCCESS 条，今日剩余配额: $REMAIN"
else
    # 检查是否 quota 耗尽
    if echo "$RESPONSE" | grep -q "over quota"; then
        echo "⚠️ 今日配额已用完，明日继续"
    elif echo "$RESPONSE" | grep -q "error"; then
        echo "❌ API错误: $RESPONSE"
    else
        echo "⚠️ 未知响应: $RESPONSE"
    fi
fi

# 记录日志
echo "[$DATE] batch=$URL_COUNT response=$RESPONSE" >> "$LOG_FILE"

# 输出剩余待提交数
REMAINING=$(grep -c "| pending |" "$QUEUE_FILE" 2>/dev/null || echo "0")
echo ""
echo "📊 剩余待提交: $REMAINING 条"
