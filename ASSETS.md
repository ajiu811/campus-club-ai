# 团团 · 图片与素材槽位清单

> 这份文档专门解决「**后面可能要修改接入的图片或小细节**」。
> 所有图片都登记成一个**槽位**：模块里只写 `var(--img-xxx)`，不写死路径。
> 换图只动一处，任何并行任务生成的界面都不用改。

---

## 一、槽位总表

| 槽位变量 | 当前文件 | 用途 | 建议尺寸 / 比例 | 备注 |
|---|---|---|---|---|
| `--img-logo` | `assets/img/logo.svg` | 顶栏校徽 / 品牌标 | 64×64，1:1 | v1 参考稿用 CSS 渐变方块，可换真实校徽 |
| `--img-banner-1` | `assets/img/banner-1.svg` | 首页 Banner 第 1 帧 | 1200×210，约 5.7:1 | 主视觉：校园樱花 + 钟楼；**左侧约 20% 留白给手写标语** |
| `--img-banner-2` | `assets/img/banner-2.svg` | 首页 Banner 第 2 帧 | 同上 | 社团活动 / 招新主题 |
| `--img-banner-3` | `assets/img/banner-3.svg` | 首页 Banner 第 3 帧 | 同上 | 志愿服务 / 体育主题 |
| `--img-club-1` | `assets/img/club-1.svg` | 推荐社团封面 ① | 400×150，约 8:3 | 摄影协会；实际显示高 `--club-cover-h` = 126px，用 cover 裁切 |
| `--img-club-2` | `assets/img/club-2.svg` | 推荐社团封面 ② | 同上 | 原创音乐社 |
| `--img-club-3` | `assets/img/club-3.svg` | 推荐社团封面 ③ | 同上 | 排球社 |
| `--img-club-4` | `assets/img/club-4.svg` | 推荐社团封面 ④ | 同上 | 备用 / 第 4 列 |
| `--img-activity-1` ~ `3` | 复用 `club-2/3/4.svg` | 活动缩略图 | 300×200，3:2 | 想用独立图片时，新建 `activity-N.svg` 再改 `media.css` 对应三行 |
| `--img-avatar` | `assets/img/avatar-default.svg` | 默认用户头像 | 64×64，圆形裁切 | 关注者头像堆叠也用它占位 |
| `--img-placeholder` | `assets/img/placeholder.svg` | 未接入图片时的通用占位 | 400×240 | `.tt-media` 的默认底图 |

> 当前 `assets/img/` 里全是**带槽位名和尺寸标注的占位图**，直接打开 `style-guide.html` 就能看到每个槽位长什么样、放在哪。

---

## 二、换图的两种方式

**方式 A · 覆盖同名文件（最省事，零改动）**
把真实图片另存为**完全相同的文件名和扩展名**，覆盖 `assets/img/` 下的文件即可。
例如把 `banner-1.jpg` 转成 `banner-1.svg` 不合适 —— 若换成 `.jpg`，请改用方式 B。

**方式 B · 改一行路径（推荐用于换格式 / 换来源）**
打开 `assets/media.css`，只改对应那一行的 `url(...)`：

```css
--img-banner-1: url("./img/banner-real.jpg");
```

其他文件一律不动。改完刷新页面即生效，**不需要重新生成任何模块、也不需要新建会话**。

**统一用法**（模块里必须这样写，禁止 `<img src="硬编码路径">`）：

```html
<div class="tt-media tt-hero-banner" style="background-image:var(--img-banner-1)"></div>
```

更推荐把 `background-image` 写进模块自己的 CSS（选择器仍需以模块前缀开头）。

---

## 三、新增一个图片槽位

1. 把图片放进 `assets/img/`；
2. 在 `assets/media.css` 的 `:root` 里加一行 `--img-新槽位: url("./img/xxx.svg");`；
3. 在本文件的槽位总表补一行（用途 + 建议尺寸）；
4. 在模块里用 `var(--img-新槽位)` 引用。

⚠️ `media.css` 和 `tokens.css`、`base.css` 一样，属于**规范层文件**，只有「规范维护任务」能改；并行模块任务不要碰。

---

## 四、小细节修改对照表

| 想改的东西 | 改哪个文件 | 需要新建会话吗 | 谁可以改 |
|---|---|---|---|
| 换一张图片 / 换图片格式 | `assets/media.css` 或覆盖同名文件 | 不需要 | 规范维护任务 |
| 主色、圆角、字号、阴影、间距、卡片高度 | `assets/tokens.css` | 不需要 | 规范维护任务 |
| 新增/调整通用组件类（按钮、卡片、标签…） | `assets/base.css` | 不需要 | 规范维护任务 |
| Banner 标语文字、手写字体、轮播节奏 | `sections/02-hero.html` / `.css` | 不需要 | 02 号任务 |
| 某个模块自己的布局、文案、交互 | 该模块的 `sections/xx.html` / `.css` | 不需要 | 对应模块任务 |
| 新增一个界面模块 | `MODULES.md` 登记前缀 + 新建任务 | 需要（新任务本身就是新会话） | 你 |
| 项目指令 / `.codebuddy/rules` 里的规范文字 | 项目配置 / 规则文件 | **需要新建会话**（规则只在会话开头加载） | 规范维护任务 |

**判断口诀**：改「变量 / 图片路径 / 模块自己的前缀样式」＝ 刷新即生效；改「写进会话上下文的规则文字」＝ 必须新建任务。

---

## 五、验收

1. 打开 `style-guide.html`，确认色板、组件和所有图片槽位都正常显示；
2. 改完 `media.css` 后刷新，确认对应槽位换成新图；
3. 全局搜一遍 `sections/`，确认没有任何硬编码的图片路径或色值（见 `MODULES.md` 验收清单）。
