# 苏衡测控网站 — 链接与排版规范

> 本文档定义全站内部链接、CSS引用、页面结构的强制规则。
> 任何新增/修改页面必须遵守，违反规则会导致死链或排版错乱。

---

## 一、目录结构

```
deploy/
├── index.html              # 首页（一级页面）
├── about.html              # 关于我们（二级页面）
├── contact.html            # 联系我们（二级页面）
├── products.html           # 产品中心（二级页面）
├── product-dianzi.html     # 电子皮带秤（三级页面）
├── product-gaojingdu.html  # 高精度皮带秤（三级页面）
├── product-chuanganqi.html # 称重传感器（三级页面）
├── product-yibiao.html     # 智能仪表（三级页面）
├── product-geiliaoji.html  # 定量给料机（三级页面）
├── product-geimeiji.html   # 给煤机（三级页面）
├── product-custom.html     # 定制专题（三级页面）
├── product-comparison.html # 产品对比（三级页面）
├── industries.html         # 行业应用（二级页面）
├── knowledge.html          # 知识库（二级页面）
├── news.html               # 新闻动态（二级页面）
├── service.html            # 技术服务（二级页面）
├── faq.html                # 常见问题（二级页面）
├── search.html             # 搜索页（二级页面）
├── style.css               # 全站唯一CSS文件（根目录）
├── images/                 # 图片目录
└── seo/                    # SEO文章目录（三级页面）
    ├── index.html          # 文章列表页
    ├── belt-scale-xxx.html # 各类文章
    └── ...
```

## 二、内部链接规则（核心！）

### 规则1：产品页链接

| 源页面位置 | 正确写法 | 错误写法 |
|------------|----------|----------|
| 根目录页面 | `href="product-dianzi.html"` | ❌ `href="seo/product-dianzi.html"` |
| seo/目录文章 | `href="../product-dianzi.html"` | ❌ `href="product-dianzi.html"` |

**原因**：产品页在根目录，seo/目录下的文章用相对路径时必须加 `../` 前缀返回根目录。

### 规则2：CSS引用

| 源页面位置 | 正确写法 | 错误写法 |
|------------|----------|----------|
| 根目录页面 | `<link rel="stylesheet" href="style.css">` | ❌ `href="seo-style.css"` |
| seo/目录文章 | `<link rel="stylesheet" href="../style.css">` | ❌ `href="seo-style.css"` 或 `href="../seo/seo-style.css"` |

**原因**：全站只有一个CSS文件 `style.css`，在根目录。不存在 `seo-style.css`。

### 规则3：顶级页面链接

| 源页面位置 | 正确写法 | 错误写法 |
|------------|----------|----------|
| 根目录页面 | `href="knowledge.html"` | ❌ `href="articles.html"` |
| seo/目录文章 | `href="../knowledge.html"` | ❌ `href="../articles.html"` |
| seo/目录文章 | `href="../industries.html"` | ❌ `href="../cases.html"` 或 `href="../solutions.html"` |

**不存在的页面名（禁止使用）**：
- `articles.html` → 用 `knowledge.html`
- `cases.html` → 用 `industries.html`
- `solutions.html` → 用 `industries.html`
- `news-detail.html` → 用 `news.html`

### 规则4：SEO文章链接

| 源页面位置 | 正确写法 | 错误写法 |
|------------|----------|----------|
| 根目录页面 | `href="seo/belt-scale-xxx.html"` | ❌ `href="article-belt-scale-xxx.html"` |
| seo/目录文章 | `href="belt-scale-xxx.html"` | ❌ `href="../article-belt-scale-xxx.html"` |

**禁止使用的文章链接前缀**：`article-`（已废弃格式，所有文章在 `seo/` 目录下，文件名不含 `article-` 前缀）

### 规则5：产品页文件名（禁止拼写错误）

| 正确文件名 | 产品名 | 禁止的错误拼写 |
|------------|--------|----------------|
| `product-dianzi.html` | 电子皮带秤 | ❌ `product-dianzibidaicheng.html` |
| `product-gaojingdu.html` | 高精度皮带秤 | — |
| `product-chuanganqi.html` | 称重传感器 | — |
| `product-yibiao.html` | 智能仪表 | ❌ `product-jingzhun.html` |
| `product-geiliaoji.html` | 定量给料机 | ❌ `product-jiliaoji.html` |
| `product-geimeiji.html` | 给煤机 | — |
| `product-custom.html` | 定制专题 | — |
| `product-comparison.html` | 产品对比 | — |

## 三、页面结构规则

### 规则6：每个页面必须包含的标签

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>...</title>
    <meta name="description" content="...">
    <link rel="stylesheet" href="CSS路径">  <!-- 见规则2 -->
</head>
<body>
    <header>...</header>     <!-- 导航栏 -->
    <main>...</main>          <!-- 主内容 -->
    <footer>...</footer>      <!-- 页脚（必须有！） -->
</body>
</html>
```

### 规则7：footer必须存在

每个正式页面（非验证文件）必须包含 `<footer>` 和 `</footer>`。

**seo/目录文章的标准footer**：
```html
<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-col">
      <div class="footer-logo">苏衡测控</div>
      <p class="footer-desc">专注工业计量设备研发与制造，成立于2012年，总部位于徐州市铜山区。</p>
    </div>
    <div class="footer-col">
      <h4>产品中心</h4>
      <ul>
        <li><a href="../product-dianzi.html">电子皮带秤</a></li>
        <li><a href="../product-gaojingdu.html">高精度皮带秤</a></li>
        <li><a href="../product-chuanganqi.html">称重传感器</a></li>
        <li><a href="../product-geiliaoji.html">给料机</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>联系我们</h4>
      <ul>
        <li>📞 188 1190 6890</li>
        <li>✉️ info@suhengcekong.cn</li>
        <li>📍 徐州市铜山区康平路</li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 苏衡测控 版权所有 | <a href="https://beian.miit.gov.cn/" target="_blank">苏ICP备2024107758号-1</a></p>
  </div>
</footer>
```

### 规则8：DIV标签必须平衡

每个HTML文件中 `<div>` 和 `</div>` 的数量必须相等。

**验证方法**：
```python
import re
html = open('file.html').read()
op = len(re.findall(r'<div\b', html))
cl = len(re.findall(r'</div>', html))
assert op == cl, f"DIV不平衡: {op} vs {cl}"
```

### 规则9：`<main>` 标签必须闭合

每个页面有且仅有一个 `<main>` 和 `</main>`。

## 四、批量操作检查清单

新增或批量修改页面后，必须执行以下检查：

1. **死链扫描**：运行 `/tmp/scan_site_links_and_layout.py`，死链数应为 0（favicon data URI 和 JS 模板字符串除外）
2. **DIV平衡**：所有文件 `<div>` 与 `</div>` 数量差为 0
3. **Footer存在**：所有正式页面包含 `<footer>`
4. **SECTION平衡**：`<section>` 与 `</section>` 数量差为 0
5. **MAIN平衡**：`<main>` 与 `</main>` 数量差为 0

## 五、常见错误模式总结

| 错误模式 | 根因 | 预防 |
|----------|------|------|
| `seo/product-*.html` 死链 | seo/目录下用了不带 `../` 的相对路径 | seo/目录下所有指向根目录的链接必须加 `../` |
| `seo-style.css` 死链 | 引用了不存在的CSS文件名 | 全站CSS只有 `style.css` |
| `articles.html` 死链 | 引用了不存在的页面 | 用 `knowledge.html` 替代 |
| `product-jiliaoji.html` 死链 | 产品页文件名拼写错误 | 使用规则5中的正确文件名 |
| 底部排版错乱 | DIV不平衡或缺少footer | 每次修改后运行DIV平衡检查 |
| footer缺失 | 新建页面忘记加footer | 复制标准footer模板 |
