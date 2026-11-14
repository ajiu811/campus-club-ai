# 团团 · 并行任务提示词卡  TASKS.md v1.0

> **用法**：在侧边栏「团团」空间分组上点「新建任务」（会自动归入这个空间），
> 创建时把「选择工作空间」指向 `团团` 目录，然后**整段复制**下面对应任务的代码块发出去。
> 7 个模块任务可以同时开、同时跑，你挨个看右侧结果区验收即可。
> 提示：建议每个模块任务开 **Plan 模式**先出方案再动手；任务标题统一命名 `团团-03 六大分类`，方便筛选和轮检。

---

## 00 · 规范维护任务（改风格 / 换图时才开，平时不用开）

```
你在「团团」空间工作，本次是「规范维护任务」。请先读 @DESIGN.md @MODULES.md @ASSETS.md @assets/tokens.css @assets/base.css @assets/media.css。
我要做的变更是：【在这里写清楚，例如：把主色从蓝改成青绿 / 换掉 banner-1 的图片 / 新增一个通用徽标类】。
要求：
1. 只修改规范层文件（tokens.css / base.css / media.css / DESIGN.md / ASSETS.md / MODULES.md），不要碰 index.html、sections/、app.html。
2. 能在 tokens.css 用变量解决的，就不要改 base.css；能改 media.css 一行解决的，不要动任何模块。
3. 改完在 DESIGN.md 的「变更记录」补一行（日期、版本、变更内容、影响范围）。
4. 输出：改了哪些文件、哪些变量、对已生成模块有没有影响、需要哪个模块任务重新生成。
5. 完成后提醒我打开 style-guide.html 刷新验收。
```

---

## 01 · 吸顶导航

```
你在「团团」空间工作。开工前必读 @DESIGN.md @MODULES.md @ASSETS.md @assets/tokens.css @assets/base.css @assets/media.css，并参考 @index.html（只读风格基准，禁止修改）。
硬约束：只输出 sections/01-nav.html 与 sections/01-nav.css；只准用 var(--xxx)，禁止硬编码色值/字号/圆角/图片路径；所有 CSS 选择器以 tt-nav- 或 #tt-nav 开头；禁止全局选择器、!important、<html>/<head>/<body>/<style>、外链 CDN；禁止改规范层文件和其他模块；禁止复用 index.html 里的 .topbar/.tab 等裸类名。
任务：实现吸顶导航。左侧校徽（用 var(--img-logo)）+「中国传媒大学 | 校园活动平台」；中间三个 Tab：社团广场 / 社团活动 / 个人中心，选中态主蓝 + 3px 底部条；右侧通知铃铛（带小红点）+ 头像 + 「团团同学」+ 下拉箭头。高 64px，白底 93% 透明 + 毛玻璃，底部 1px 描边，滚动时可加轻阴影。
根节点：<nav id="tt-nav" class="tt-nav" data-module="01-nav">，不要写 data-tab、不要加 hidden。
交互：点击 Tab 时 document.dispatchEvent(new CustomEvent('tt:tab-change',{detail:{tab:'plaza'|'events'|'profile'}}))。
状态：正常 / hover / 选中 / 窄屏（≤768 隐藏次要文字，用 .tt-hide-sm）。
交付说明列出：文件清单、用到的 token 变量、用到的图片槽位、发出的事件、五态自检结果。
```

---

## 02 · 搜索栏 + Banner 轮播

```
你在「团团」空间工作。开工前必读 @DESIGN.md @MODULES.md @ASSETS.md @assets/tokens.css @assets/base.css @assets/media.css，并参考 @index.html（只读风格基准，禁止修改）。
硬约束：只输出 sections/02-hero.html 与 sections/02-hero.css；只准用 var(--xxx)，禁止硬编码色值/字号/圆角/图片路径；所有 CSS 选择器以 tt-hero- 或 #tt-hero 开头；禁止全局选择器、!important、<html>/<head>/<body>/<style>、外链 CDN；禁止改规范层文件和其他模块；禁止复用 index.html 里的裸类名。
任务：实现首页顶部区。① 全宽胶囊搜索栏，用 base.css 的 .tt-search，占位符「搜索社团、活动、关键词...」；② 下方 Banner：高 210、圆角 14，背景用 var(--img-banner-1/2/3) 三帧轮播；左侧约 20% 起放白色手写体标语「加入热爱的社团 / 遇见更精彩的大学生活！」，用 --font-hand，带轻投影与一条手绘箭头装饰；底部居中轮播指示条，激活态主蓝。
根节点：<section id="tt-hero" class="tt-hero" data-module="02-hero" data-tab="plaza">，不要加 hidden。
交互：轮播切换时发出 tt:banner-change，detail {index:0..2}；标语文字与字体可以在本模块内调整。
状态：正常 / hover / 选中 / 图片未加载（回退到 var(--img-placeholder)）/ 加载中。
交付说明列出：文件清单、用到的 token 变量、用到的图片槽位、发出的事件、五态自检结果。
```

---

## 03 · 六大分类快捷入口

```
你在「团团」空间工作。开工前必读 @DESIGN.md @MODULES.md @ASSETS.md @assets/tokens.css @assets/base.css @assets/media.css，并参考 @index.html（只读风格基准，禁止修改）。
硬约束：只输出 sections/03-cats.html 与 sections/03-cats.css；只准用 var(--xxx)，禁止硬编码色值/字号/圆角/图片路径；所有 CSS 选择器以 tt-cat- 或 #tt-cats 开头；禁止全局选择器、!important、<html>/<head>/<body>/<style>、外链 CDN；禁止改规范层文件和其他模块；禁止复用 index.html 里的 .cat 等裸类名。
任务：实现 2 行 × 3 列的六大分类卡，顺序与配色严格按 DESIGN.md 第 2 节（思想政治 / 学术科技 / 自律互助 / 创新创业 / 文化体育 / 志愿公益），背景与图标色用 --cat-N-bg / --cat-N-fg。每卡高 98、圆角 16，左侧 38px 线性 SVG 图标（旗 / 学士帽 / 多人 / 灯泡 / 音符 / 爱心），右侧 16px 粗体名称；hover 上浮 3px + 阴影加深。
根节点：<section id="tt-cats" class="tt-cat" data-module="03-cats" data-tab="plaza">，不要加 hidden。栅格用 base.css 的 .tt-grid-3。
交互：点击发出 tt:cat-select，detail {id, name}；选中态用 outline 主蓝。
状态：正常 / hover / 选中 / 空 / 加载中。
交付说明列出：文件清单、用到的 token 变量、发出的事件、五态自检结果。
```

---

## 04 · 推荐社团 / 社团卡片

```
你在「团团」空间工作。开工前必读 @DESIGN.md @MODULES.md @ASSETS.md @assets/tokens.css @assets/base.css @assets/media.css，并参考 @index.html（只读风格基准，禁止修改）。
硬约束：只输出 sections/04-clubs.html 与 sections/04-clubs.css；只准用 var(--xxx)，禁止硬编码色值/字号/圆角/图片路径；所有 CSS 选择器以 tt-club- 或 #tt-clubs 开头；禁止全局选择器、!important、<html>/<head>/<body>/<style>、外链 CDN；禁止改规范层文件和其他模块；禁止复用 index.html 里的 .club 等裸类名。
任务：实现「推荐社团」区块。顶部用 base.css 的 .tt-section-head（蓝色竖条标题 + 右侧「查看更多 >」）；下方 .tt-grid-4 社团卡片，每张：封面用 .tt-media + var(--img-club-1..4)、高 --club-cover-h、cover 裁切，左下角 32px 白色圆角分类徽标；卡内 15px 粗标题 + 12px 两行截断简介；底部分隔线 + 头像堆叠（用 var(--img-avatar)）+ 关注数 + 「+ 关注」胶囊按钮（.tt-pill，已关注用 .tt-pill-done）。
示例文案可用：中国传媒大学摄影协会 / 原创音乐社 / 排球社，简介与关注数照设计稿。
根节点：<section id="tt-clubs" class="tt-club" data-module="04-clubs" data-tab="plaza">，不要加 hidden。
交互：点击关注发出 tt:club-follow {id, followed}；点卡片发出 tt:club-open {id}。
状态：正常 / hover / 已关注 / 空（.tt-empty）/ 加载中。
交付说明列出：文件清单、用到的 token 变量、用到的图片槽位、发出的事件、五态自检结果。
```

---

## 05 · 社团活动页

```
你在「团团」空间工作。开工前必读 @DESIGN.md @MODULES.md @ASSETS.md @assets/tokens.css @assets/base.css @assets/media.css，并参考 @index.html（只读风格基准，禁止修改）。
硬约束：只输出 sections/05-events.html 与 sections/05-events.css；只准用 var(--xxx)，禁止硬编码色值/字号/圆角/图片路径；所有 CSS 选择器以 tt-ev- 或 #tt-events 开头；禁止全局选择器、!important、<html>/<head>/<body>/<style>、外链 CDN；禁止改规范层文件和其他模块；禁止复用 index.html 里的裸类名。
任务：实现「社团活动」Tab 页。顶部浅渐变 Hero（标题 + 说明 + 两三个统计数字）；下方分类 chip 横滑条、时间筛选胶囊、搜索框；主体为活动卡片列表（缩略图用 var(--img-activity-1..3)、标题、时间地点、状态标签「进行中/已结束」用 .tt-tag 语义色、报名按钮）；右侧可放热门排行面板。风格与社团广场完全同源：白卡片、大圆角、轻阴影、主蓝强调。
根节点：<section id="tt-events" class="tt-ev" data-module="05-events" data-tab="events">，不要加 hidden（由拼装层控制）。
交互：点活动发出 tt:event-open {id}。
状态：正常 / hover / 选中筛选 / 空 / 加载中。
交付说明列出：文件清单、用到的 token 变量、用到的图片槽位、发出的事件、五态自检结果。
```

---

## 06 · 个人中心页

```
你在「团团」空间工作。开工前必读 @DESIGN.md @MODULES.md @ASSETS.md @assets/tokens.css @assets/base.css @assets/media.css，并参考 @index.html（只读风格基准，禁止修改）。
硬约束：只输出 sections/06-profile.html 与 sections/06-profile.css；只准用 var(--xxx)，禁止硬编码色值/字号/圆角/图片路径；所有 CSS 选择器以 tt-me- 或 #tt-profile 开头；禁止全局选择器、!important、<html>/<head>/<body>/<style>、外链 CDN；禁止改规范层文件和其他模块；禁止复用 index.html 里的裸类名。
任务：实现「个人中心」Tab 页。顶部用户资料卡（头像 var(--img-avatar)、姓名、学院年级、角色标签）；下方三块统计（已加入社团 / 参与活动 / 待办）；再往下「我的社团」「我的活动」「待办提醒」列表，用 .tt-card / .tt-tag / .tt-empty 等通用类，浅黄虚线待办提示可用 --warning-bg。整体与其他页面保持同一套圆角、阴影、字体层级。
根节点：<section id="tt-profile" class="tt-me" data-module="06-profile" data-tab="profile">，不要加 hidden（由拼装层控制）。
状态：正常 / hover / 空 / 加载中。
交付说明列出：文件清单、用到的 token 变量、用到的图片槽位、五态自检结果。
```

---

## 07 · AI 助手「团团」悬浮球 + 抽屉

```
你在「团团」空间工作。开工前必读 @DESIGN.md @MODULES.md @ASSETS.md @assets/tokens.css @assets/base.css @assets/media.css，并参考 @index.html（只读风格基准，禁止修改）。
硬约束：只输出 sections/07-assistant.html 与 sections/07-assistant.css；只准用 var(--xxx)，禁止硬编码色值/字号/圆角/图片路径；所有 CSS 选择器以 tt-ai- 或 #tt-assistant 开头；禁止全局选择器、!important、<html>/<head>/<body>/<style>、外链 CDN；禁止改规范层文件和其他模块；禁止复用 index.html 里的裸类名。
任务：实现右下角 fixed 悬浮球（right/bottom 20、56px、白色圆底 + 蓝色机器人头像 + 「团团」小标签 + 右上小蓝点），点击展开 380px 宽对话抽屉：渐变头部（在线状态点）、消息气泡区、快捷提问卡、底部胶囊输入框。用 --z-float / --shadow-lg，展开动画用 --dur / --ease。
根节点：<section id="tt-assistant" class="tt-ai" data-module="07-assistant">，不要写 data-tab、不要加 hidden。
交互：开合时发出 tt:ai-open {open:true|false}；抽屉内不要写会覆盖全局的样式。
状态：收起 / 展开 / hover / 输入中 / 空会话。
交付说明列出：文件清单、用到的 token 变量、发出的事件、状态自检结果。
```

---

## 99 · 拼装任务（等 01~07 全部验收完再开）

```
你在「团团」空间工作，本次是「拼装任务」。先读 @MODULES.md @DESIGN.md，再读 sections/ 下全部 html 与 css，参考 @index.html（只读，禁止修改）。
前置：把当前 sections/ 与规范层文件复制一份到 versions/v1/ 作为快照。
要求：
1. 新建 app.html（不要改 index.html），按顺序外链 assets/tokens.css、base.css、media.css，把 sections/01~07 的 CSS 按顺序内联合并进一个 <style>，把各 HTML 片段按 01→02→03→04→05→06→07 顺序插入 body。
2. 只做引入与编排：禁止重写任何模块内部样式、禁止改模块 HTML 内容、禁止新增模块私有类名。
3. 默认显示 plaza：给 #tt-events、#tt-profile 加 hidden；#tt-nav、#tt-assistant 全局常驻。
4. 写一段极简脚本监听 MODULES.md 第五节的全部事件，实现 Tab 切换显隐；这是唯一允许写 JS 的地方，不要引入框架或外链。
5. 主体用 base.css 的 .tt-wrap 包住 02~06 的内容区。
6. 输出一份验收清单：类名前缀有无冲突、硬编码色值/图片路径是否为零、图片槽位是否都能解析、事件是否对齐、1024/768 断点有无溢出、各模块根节点 id 是否齐全。
7. 最后告诉我用右侧结果区「网页」页签打开 app.html 预览。
```

---

## 巡检任务（可选，风格大改后跑一遍）

```
你在「团团」空间工作，本次只做检查，不要修改任何文件。
请扫描 sections/ 下全部 css 与 html，对照 @DESIGN.md @MODULES.md，输出一份问题清单：
1. 有没有硬编码的颜色值、字号、圆角、阴影、图片路径（应全部为 var(--xxx)）；
2. 有没有越界的全局选择器、!important、<style> 标签、外链资源；
3. 各模块类名前缀是否与 MODULES.md 分工表一致，有无跨模块重名；
4. 根节点 id / data-module / data-tab 是否齐全，是否有模块自己加了 hidden；
5. 对外事件是否都在事件契约表里；
6. 图片槽位是否都在 assets/media.css 中登记且文件存在。
按「模块 / 问题 / 建议改法 / 严重程度」列表输出，不要动文件。
```
