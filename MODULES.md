# 团团 · 并行分工与模块契约  MODULES.md v1.0

> 这份文档解决两件事：**几个任务能同时开工互不打架**，以及**产物最后能拼成一个页面**。
> 配套：`DESIGN.md`（长什么样）、`TASKS.md`（每个任务可直接复制的提示词）、`ASSETS.md`（换图）。

---

## 一、目录结构（谁写哪里）

```
团团/
├── index.html              ← v1 参考实现，只读，禁止修改
├── README.md               ← 总入口 / 操作手册
├── DESIGN.md               ← 设计契约（规范层）
├── MODULES.md              ← 本文件（规范层）
├── TASKS.md                ← 并行任务提示词卡（规范层）
├── ASSETS.md               ← 图片槽位清单（规范层）
├── style-guide.html        ← 可视化规范页，改完风格用它验收
├── assets/
│   ├── tokens.css          ← 设计变量唯一来源（规范层）
│   ├── base.css            ← 全局基础样式 / 通用类（规范层）
│   ├── media.css           ← 图片槽位注册表（规范层）
│   └── img/                ← 占位图与后续真实图片
├── sections/               ← 【并行任务区】一个任务只写自己那两个文件
│   ├── 01-nav.html / .css
│   ├── 02-hero.html / .css
│   └── ...
├── versions/               ← 拼装前的快照存档
└── app.html                ← 【拼装产物】最后生成的完整页面
```

**规范层文件只有「规范维护任务」能改；模块任务只能读。**

---

## 二、并行分工表

| # | 界面 / 模块 | 输出文件（只准这两个） | 类名前缀 | 根节点 `id` | 所属 Tab | 对外事件 |
|---|---|---|---|---|---|---|
| 01 | 吸顶导航：校徽、三 Tab、通知、用户 | `sections/01-nav.html` `.css` | `tt-nav-` | `#tt-nav` | 全局 | `tt:tab-change` |
| 02 | 搜索栏 + Banner 轮播 + 标语 | `sections/02-hero.html` `.css` | `tt-hero-` | `#tt-hero` | `plaza` | `tt:banner-change` |
| 03 | 六大分类快捷入口 | `sections/03-cats.html` `.css` | `tt-cat-` | `#tt-cats` | `plaza` | `tt:cat-select` |
| 04 | 推荐社团 / 社团卡片列表 | `sections/04-clubs.html` `.css` | `tt-club-` | `#tt-clubs` | `plaza` | `tt:club-follow`、`tt:club-open` |
| 05 | 社团活动页 | `sections/05-events.html` `.css` | `tt-ev-` | `#tt-events` | `events` | `tt:event-open` |
| 06 | 个人中心页 | `sections/06-profile.html` `.css` | `tt-me-` | `#tt-profile` | `profile` | — |
| 07 | AI 助手「团团」悬浮球 + 对话抽屉 | `sections/07-assistant.html` `.css` | `tt-ai-` | `#tt-assistant` | 全局浮层 | `tt:ai-open` |
| 99 | 拼装（等 01~07 全部验收完再开） | `app.html` | — | — | — | 监听以上全部事件 |
| 00 | 规范维护（改风格 / 换图 / 加通用类） | 规范层文件 | — | — | — | — |

> 想加新界面：先在表里登记一个**没被占用的前缀**和根节点 id，再复制 `TASKS.md` 的模板改一改开新任务。前缀冲突是拼装时最常见的事故，务必先登记。

---

## 三、命名空间隔离（能拼到一起的关键）

1. 每个模块**只准使用自己的前缀**（如 `tt-club-card`、`tt-club-name`），或 `base.css` 里已有的通用类（`tt-wrap`、`tt-card`、`tt-btn`、`tt-pill`、`tt-section-head`、`tt-search`、`tt-media`、`tt-grid-3/4` 等）。
2. 模块 CSS 里**每一个选择器**都必须以 `#tt-<模块>` 或 `.tt-<前缀>-` 开头：
   - ✅ `#tt-clubs .tt-club-card:hover { ... }`
   - ✅ `.tt-club-card .tt-club-name { ... }`
   - ❌ `.card { ... }` / `button { ... }` / `body { ... }` / `:root { ... }`
3. 禁止 `@import`、禁止外链、禁止 `<style>` 标签写进 HTML 片段（样式一律放同名 `.css`）。
4. 禁止 `!important`（拼装时优先级会乱；`base.css` 的 `.tt-hide-sm` 等规范层工具类除外，模块自己仍一律禁止）。
5. 模块根节点统一写成：
   ```html
   <section id="tt-clubs" class="tt-club" data-module="04-clubs" data-tab="plaza">
     ...
   </section>
   ```
   `data-tab` 只有 Tab 面板模块需要；浮层模块（01、07）不写。模块**不要自己加 `hidden`**，显隐由拼装层统一控制。

---

## 四、HTML 片段模板

```html
<!-- 模块 04 · 推荐社团 | 前缀 tt-club- | 契约 v1.0 -->
<section id="tt-clubs" class="tt-club" data-module="04-clubs" data-tab="plaza">
  <div class="tt-section-head">
    <h2>推荐社团</h2>
    <a class="tt-more" href="#">查看更多 ›</a>
  </div>
  <div class="tt-grid-4">
    <!-- 卡片：封面用图片槽位，禁止硬编码路径 -->
    <article class="tt-card tt-card-hover tt-club-card">
      <div class="tt-media tt-club-cover"></div>
      <div class="tt-club-body">...</div>
    </article>
  </div>
</section>
```

`.tt-club-cover` 在模块 CSS 里写：`background-image: var(--img-club-1); height: var(--club-cover-h);`

---

## 五、事件契约（模块之间只通过事件通信，不直接互相引用 DOM）

统一用 `document.dispatchEvent(new CustomEvent('tt:xxx', { detail: {...} }))` 发出，拼装层统一监听。

| 事件 | detail | 由谁发 | 典型用途 |
|---|---|---|---|
| `tt:tab-change` | `{ tab: 'plaza' \| 'events' \| 'profile' }` | 01 | 切换显示的 Tab 面板 |
| `tt:banner-change` | `{ index: 0..2 }` | 02 | 轮播同步 |
| `tt:cat-select` | `{ id, name }` | 03 | 按分类筛选社团 |
| `tt:club-follow` | `{ id, followed: true\|false }` | 04 | 关注状态 |
| `tt:club-open` | `{ id }` | 04 | 打开社团详情 |
| `tt:event-open` | `{ id }` | 05 | 打开活动详情 |
| `tt:ai-open` | `{ open: true\|false }` | 07 | 展开/收起助手抽屉 |

新增事件必须先登记到这张表，事件名一律 `tt:` 开头。

---

## 六、拼装规则（99 号任务执行）

1. **前置**：01~07 全部完成并通过验收；把当前状态复制一份到 `versions/v1/`。
2. 生成 `app.html`（**新建文件，不改 `index.html`**），结构：
   ```html
   <!DOCTYPE html><html lang="zh-CN"><head>
     <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
     <title>社团一站通｜社团广场</title>
     <link rel="stylesheet" href="assets/tokens.css">
     <link rel="stylesheet" href="assets/base.css">
     <link rel="stylesheet" href="assets/media.css">
     <style>/* 按顺序内联合并 sections/01~07 的 CSS 内容 */</style>
   </head><body>
     <!-- 按 01 → 02 → 03 → 04 → 05 → 06 → 07 顺序插入各 HTML 片段 -->
     <script>/* Tab 显隐 + 事件监听，唯一允许写 JS 的地方 */</script>
   </body></html>
   ```
3. 默认显示 `plaza`：`events`、`profile` 两个面板加 `hidden`；01、07 全局常驻。
4. 拼装层**只做引入与编排**，禁止重写任何模块内部样式、禁止改模块 HTML 内容。
5. 输出 `app.html` 的同时，输出一份**验收清单**（见下）。

---

## 七、验收清单（每个模块交付 / 最终拼装都过一遍）

- [ ] 只产出了自己那两个 `sections/` 文件，规范层文件无改动
- [ ] 所有颜色 / 字号 / 圆角 / 阴影 / 间距都是 `var(--xxx)`，无硬编码色值
- [ ] 图片全部走 `var(--img-xxx)`，无 `<img src="硬编码">`
- [ ] 所有 CSS 选择器都以本模块前缀或根节点开头，无全局选择器、无 `!important`
- [ ] 根节点带 `id` / `data-module` / `data-tab`，未自行加 `hidden`
- [ ] 覆盖 正常 / hover / 选中 / 空 / 加载中 五态
- [ ] 对外事件与第五节表格一致，没有新增未登记事件
- [ ] 1024 / 768 两个断点下不溢出（用 `base.css` 的统一栅格类即可）
- [ ] 交付说明里列出：文件清单、用到的 token 变量、用到的图片槽位、发出的事件

**冲突处理**：两个模块都要同一个新组件 / 都要改全局变量时，**都不要自己改**，在交付说明里写明需求，由 00 号规范维护任务统一加进 `base.css` 或 `tokens.css`，再通知各模块使用。
